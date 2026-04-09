'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Expense } from '@/types/supabase'

export function useExpenses(familyId: string | undefined) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!familyId) {
      setExpenses([])
      setLoading(false)
      return
    }

    fetchExpenses()
  }, [familyId])

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('family_id', familyId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setExpenses(data || [])
    } catch (error) {
      console.error('Error fetching expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  const createExpense = async (expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('expenses')
      .insert(expense)
      .select()
      .single()

    if (error) {
      console.error('Error creating expense:', error)
      return null
    }

    await fetchExpenses()
    return data
  }

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    const { data, error } = await supabase
      .from('expenses')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating expense:', error)
      return null
    }

    await fetchExpenses()
    return data
  }

  const deleteExpense = async (id: string) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id)

    if (error) {
      console.error('Error deleting expense:', error)
      return false
    }

    await fetchExpenses()
    return true
  }

  const getMonthlyStats = () => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const monthlyExpenses = expenses.filter((e) => {
      const date = new Date(e.created_at)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })

    const total = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0)
    const byCategory = monthlyExpenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount
      return acc
    }, {} as Record<string, number>)

    return { total, byCategory, count: monthlyExpenses.length }
  }

  return {
    expenses,
    loading,
    createExpense,
    updateExpense,
    deleteExpense,
    refresh: fetchExpenses,
    getMonthlyStats,
  }
}
