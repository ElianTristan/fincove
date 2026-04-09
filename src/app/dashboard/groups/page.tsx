'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useFamily } from '@/hooks/useFamily'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { formatDate, getInitials } from '@/lib/utils'
import {
  Users,
  Plus,
  Copy,
  Check,
  Crown,
  User,
  ArrowRight,
  LogOut,
} from 'lucide-react'

export default function GroupsPage() {
  const { user } = useAuth()
  const { families, currentFamily, setCurrentFamily, createFamily, joinFamily, loading } = useFamily(user?.id)
  const [newFamilyName, setNewFamilyName] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [creating, setCreating] = useState(false)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFamilyName.trim()) return

    setCreating(true)
    setError(null)

    const result = await createFamily(newFamilyName)
    if (!result) {
      setError('Error al crear el grupo')
    }

    setCreating(false)
    setNewFamilyName('')
  }

  const handleJoinFamily = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteCode.trim()) return

    setJoining(true)
    setError(null)

    const result = await joinFamily(inviteCode)
    if (result?.error) {
      setError(result.error)
    }

    setJoining(false)
    setInviteCode('')
  }

  const copyInviteCode = () => {
    if (currentFamily?.invite_code) {
      navigator.clipboard.writeText(currentFamily.invite_code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">Tu grupo familiar</h1>
          <p className="text-gray-500">Gestiona tu familia y miembros</p>
        </div>
      </motion.div>

      {families.length === 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Create Family */}
          <Card title="Crear nuevo grupo" description="Crea un grupo para tu familia">
            <form onSubmit={handleCreateFamily} className="space-y-4">
              <Input
                label="Nombre del grupo"
                value={newFamilyName}
                onChange={(e) => setNewFamilyName(e.target.value)}
                placeholder="Ej: Familia Hernández"
                required
              />
              <Button type="submit" isLoading={creating} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Crear grupo
              </Button>
            </form>
          </Card>

          {/* Join Family */}
          <Card title="Unirse a un grupo" description="Únete con un código de invitación">
            <form onSubmit={handleJoinFamily} className="space-y-4">
              <Input
                label="Código de invitación"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                maxLength={6}
                required
              />
              {error && <Alert variant="error">{error}</Alert>}
              <Button type="submit" isLoading={joining} variant="outline" className="w-full">
                <ArrowRight className="w-4 h-4 mr-2" />
                Unirse al grupo
              </Button>
            </form>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Current Family Info */}
          <Card
            title={currentFamily?.name}
            description={`Código de invitación: ${currentFamily?.invite_code}`}
            action={
              <Button variant="outline" size="sm" onClick={copyInviteCode}>
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copiar
                  </>
                )}
              </Button>
            }
          >
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Comparte este código con tus familiares para que se unan al grupo.
              </p>

              <h3 className="font-medium text-gray-900 dark:text-white">Miembros</h3>
              <div className="space-y-3">
                {currentFamily?.members?.map((member: any) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">
                          {getInitials(member.user?.user_metadata?.full_name || member.user?.email || '')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {member.user?.user_metadata?.full_name || member.user?.email?.split('@')[0]}
                        </p>
                        <p className="text-sm text-gray-500">{member.user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {member.role === 'admin' && (
                        <Badge variant="warning">
                          <Crown className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                      <span className="text-sm text-gray-500">
                        {formatDate(member.joined_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Other Families */}
          {families.length > 1 && (
            <Card title="Tus grupos">
              <div className="space-y-3">
                {families.map((family) => (
                  <button
                    key={family.id}
                    onClick={() => setCurrentFamily(family)}
                    className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                      currentFamily?.id === family.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-dark-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{family.name}</p>
                        <p className="text-sm text-gray-500">
                          {family.members?.length || 1} miembros
                        </p>
                      </div>
                    </div>
                    {currentFamily?.id === family.id && (
                      <Badge variant="success">Actual</Badge>
                    )}
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Join Another */}
          <Card title="Unirse a otro grupo">
            <form onSubmit={handleJoinFamily} className="flex gap-3">
              <Input
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="Código de invitación (6 caracteres)"
                maxLength={6}
                className="flex-1"
              />
              <Button type="submit" isLoading={joining}>
                Unirse
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
