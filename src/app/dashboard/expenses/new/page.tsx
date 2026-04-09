'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useFamily } from '@/hooks/useFamily'
import { useExpenses } from '@/hooks/useExpenses'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'
import { EXPENSE_CATEGORIES, PAYMENT_METHODS, EXPENSE_TYPES } from '@/lib/constants'
import { ArrowLeft, Receipt, CreditCard, Calendar, Repeat, Layers } from 'lucide-react'

const typeIcons = {
  expense: Receipt,
  income: Receipt,
  fixed: Repeat,
  msi: Layers,
}

export default function NewExpensePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { currentFamily } = useFamily(user?.id)
  const { createExpense } = useExpenses(currentFamily?.id)

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'other',
    type: 'expense',
    payment_method: 'cash',
    installments: '1',
    due_date: '',
    notes: '',
    is_recurring: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!currentFamily || !user) {
      setError('Debes estar en un grupo para guardar gastos')
      setLoading(false)
      return
    }

    try {
      const expense = await createExpense({
        family_id: currentFamily.id,
        created_by: user.id,
        title: formData.title,
        amount: parseFloat(formData.amount),
        category: formData.category,
        type: formData.type,
        payment_method: formData.payment_method,
        installments: parseInt(formData.installments),
        current_installment: 1,
        due_date: formData.due_date || null,
        receipt_url: null,
        notes: formData.notes,
        is_recurring: formData.is_recurring,
      })

      if (expense) {
        router.push('/dashboard/expenses')
      } else {
        setError('Error al guardar el gasto')
      }
    } catch (err) {
      setError('Error al guardar el gasto')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/dashboard/expenses"
        className="inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a gastos
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card title="Nuevo gasto" description="Registra una nueva transacción">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <Alert variant="error">{error}</Alert>}

            {/* Tipo de transacción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de transacción
              </label>
              <div className="grid grid-cols-2 gap-3">
                {EXPENSE_TYPES.map((type) => {
                  const Icon = typeIcons[type.id as keyof typeof typeIcons] || Receipt
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleChange('type', type.id)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.type === type.id
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-dark-600 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{type.name}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Título y monto */}
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Título / Concepto"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Ej: Compra en Walmart"
                required
              />
              <Input
                label="Monto"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            {/* Categoría y método de pago */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Método de pago
                </label>
                <select
                  value={formData.payment_method}
                  onChange={(e) => handleChange('payment_method', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method.id} value={method.id}>{method.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* MSI */}
            {formData.type === 'msi' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Número de meses sin intereses
                </label>
                <select
                  value={formData.installments}
                  onChange={(e) => handleChange('installments', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800"
                >
                  {[3, 6, 9, 12, 18, 24].map((n) => (
                    <option key={n} value={n}>{n} meses</option>
                  ))}
                </select>
              </div>
            )}

            {/* Pago fijo */}
            {formData.type === 'fixed' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha de vencimiento
                </label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => handleChange('due_date', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800"
                />
              </div>
            )}

            {/* Notas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notas (opcional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 resize-none"
                placeholder="Notas adicionales..."
              />
            </div>

            {/* Recurrente */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="recurring"
                checked={formData.is_recurring}
                onChange={(e) => handleChange('is_recurring', e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label
                htmlFor="recurring"
                className="ml-2 text-sm text-gray-700 dark:text-gray-300"
              >
                Este es un gasto recurrente mensual
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Link href="/dashboard/expenses" className="flex-1">
                <Button variant="outline" className="w-full">Cancelar</Button>
              </Link>
              <Button type="submit" isLoading={loading} className="flex-1">
                Guardar gasto
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
