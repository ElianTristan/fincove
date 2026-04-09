'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Family, FamilyMember } from '@/types/supabase'

interface FamilyWithMembers extends Family {
  members: (FamilyMember & { user: { email: string; user_metadata: { full_name?: string; avatar_url?: string } } })[]
}

export function useFamily(userId: string | undefined) {
  const [families, setFamilies] = useState<FamilyWithMembers[]>([])
  const [currentFamily, setCurrentFamily] = useState<FamilyWithMembers | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    fetchFamilies()
  }, [userId])

  const fetchFamilies = async () => {
    try {
      const { data, error } = await supabase
        .from('family_members')
        .select(`
          family_id,
          families (
            *,
            members:family_members (
              *,
              user:user_id (
                email,
                user_metadata
              )
            )
          )
        `)
        .eq('user_id', userId)

      if (error) throw error

      const familiesData = data?.map((item: any) => ({
        ...item.families,
        members: item.families.members || []
      })) || []

      setFamilies(familiesData)
      if (familiesData.length > 0 && !currentFamily) {
        setCurrentFamily(familiesData[0])
      }
    } catch (error) {
      console.error('Error fetching families:', error)
    } finally {
      setLoading(false)
    }
  }

  const createFamily = async (name: string) => {
    if (!userId) return null

    const { data, error } = await supabase
      .from('families')
      .insert({ name, created_by: userId })
      .select()
      .single()

    if (error) {
      console.error('Error creating family:', error)
      return null
    }

    // Add creator as admin
    await supabase.from('family_members').insert({
      family_id: data.id,
      user_id: userId,
      role: 'admin',
    })

    await fetchFamilies()
    return data
  }

  const joinFamily = async (inviteCode: string) => {
    if (!userId) return null

    // Find family by invite code
    const { data: family, error: familyError } = await supabase
      .from('families')
      .select('id')
      .eq('invite_code', inviteCode.toUpperCase())
      .single()

    if (familyError || !family) {
      return { error: 'Código de invitación inválido' }
    }

    // Check if already member
    const { data: existingMember } = await supabase
      .from('family_members')
      .select('id')
      .eq('family_id', family.id)
      .eq('user_id', userId)
      .single()

    if (existingMember) {
      return { error: 'Ya eres miembro de este grupo' }
    }

    // Join family
    const { error } = await supabase.from('family_members').insert({
      family_id: family.id,
      user_id: userId,
      role: 'member',
    })

    if (error) {
      return { error: 'Error al unirse al grupo' }
    }

    await fetchFamilies()
    return { success: true }
  }

  return {
    families,
    currentFamily,
    setCurrentFamily,
    loading,
    createFamily,
    joinFamily,
    refresh: fetchFamilies,
  }
}
