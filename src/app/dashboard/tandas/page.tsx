'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useFamily } from '@/hooks/useFamily'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert } from '@/components/ui/alert'
import { formatCurrency, formatDate, generateRandomCode } from '@/lib/utils'
import {
  Users,
  Plus,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  ChevronRight,
} from 'lucide-react'

interface Tanda {
  id: string
  name: string
  amount: number
  participants: number
  frequency: string
  status: string
  start_date: string
  created_by: string
}

interface TandaParticipant {
  id: string
  user_id: string
  turn_number: number
  status: string
}

export default function TandasPage() {
  const { user } = useAuth()
  const { currentFamily } = useFamily(user?.id)
  const [tandas, setTandas] = useState<Tanda[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTanda, setNewTanda] = useState({
    name: '',
    amount: '',
    participants: '',
    frequency: 'monthly',
    start_date: new Date().toISOString().split('T')[0],
  })
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (currentFamily?.id) {
      fetchTandas()
    }
  }, [currentFamily])

  const fetchTandas = async () => {
    try {
      if (!currentFamily?.id) {
        setLoading(false)
        return
      }
      const { data, error } = await supabase
        .from('tandas')
        .select('*')
        .eq('family_id', currentFamily.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTandas(data || [])
    } catch (err) {
      console.error('Error fetching tandas:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTanda = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentFamily || !user) {
      setError('Debes estar en un grupo para crear una tanda')
      return
    }

    setCreating(true)
    setError(null)

    try {
      const { data, error: insertError } = await supabase
        .from('tandas')
        .insert([{
          family_id: currentFamily.id,
          name: newTanda.name,
          amount: parseFloat(newTanda.amount),
          participants: parseInt(newTanda.participants),
          frequency: newTanda.frequency,
          start_date: newTanda.start_date,
          created_by: user.id,
        }])
        .select()
        .single()

      if (insertError) throw insertError

      // Add creator as first participant
      await supabase.from('tanda_participants').insert([{
        tanda_id: data.id,
        user_id: user.id,
        turn_number: 1,
        status: 'pending',
      }])

      setShowCreateForm(false)
      setNewTanda({
        name: '',
        amount: '',
        participants: '',
        frequency: 'monthly',
        start_date: new Date().toISOString().split('T')[0],
      })
      await fetchTandas()
    } catch (err) {
      setError('Error al crear la tanda')
    } finally {
      setCreating(false)
    }
  }

  const getFrequencyLabel = (freq: string) => {
    const labels: Record<string, string> = {
      weekly: 'Semanal',
      biweekly: 'Quincenal',
      monthly: 'Mensual',
    }
    return labels[freq] || freq
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Activa</Badge>
      case 'completed':
        return <Badge variant="info">Completada</Badge>
      case 'cancelled':
        return <Badge variant="error">Cancelada</Badge>
      default:
        return <Badge>{status}</Badge>
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
          <h1 className="text-2xl font-bold">Tandas</h1>
          <p className="text-gray-500">Organiza y participa en tandas familiares</p>
        </div>
        {currentFamily && (
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva tanda
          </Button>
        )}
      </motion.div>

      {!currentFamily ? (
        <Card>
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">
              Únete o crea un grupo familiar para ver y crear tandas
            </p>
            <Link href="/dashboard/groups">
              <Button className="mt-4">Ir a grupos</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <>
          {/* Create Form */}
          {showCreateForm && (
            <Card title="Nueva tanda" description="Configura los detalles de la tanda">
              <form onSubmit={handleCreateTanda} className="space-y-4">
                {error && <Alert variant="error">{error}</Alert>}

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Nombre de la tanda"
                    value={newTanda.name}
                    onChange={(e) => setNewTanda({ ...newTanda, name: e.target.value })}
                    placeholder="Ej: Tanda de Navidad"
                    required
                  />
                  <Input
                    label="Monto por participante"
                    type="number"
                    value={newTanda.amount}
                    onChange={(e) => setNewTanda({ ...newTanda, amount: e.target.value })}
                    placeholder="1000"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Número de participantes"
                    type="number"
                    value={newTanda.participants}
                    onChange={(e) => setNewTanda({ ...newTanda, participants: e.target.value })}
                    placeholder="10"
                    min="2"
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium mb-1">Frecuencia</label>
                    <select
                      value={newTanda.frequency}
                      onChange={(e) => setNewTanda({ ...newTanda, frequency: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800"
                    >
                      <option value="weekly">Semanal</option>
                      <option value="biweekly">Quincenal</option>
                      <option value="monthly">Mensual</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Fecha de inicio</label>
                  <input
                    type="date"
                    value={newTanda.start_date}
                    onChange={(e) => setNewTanda({ ...newTanda, start_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" isLoading={creating} className="flex-1">
                    Crear tanda
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Tandas List */}
          {tandas.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400">
                  No hay tandas activas. ¡Crea la primera!
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {tandas.map((tanda) => (
                <Card key={tanda.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{tanda.name}</h3>
                          {getStatusBadge(tanda.status)}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {formatCurrency(tanda.amount)}
                          </span>
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {tanda.participants} participantes
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {getFrequencyLabel(tanda.frequency)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link href={`/dashboard/tandas/${tanda.id}`}>
                      <Button variant="outline">
                        Ver detalles
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
