'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useFamily } from '@/hooks/useFamily'
import { useExpenses } from '@/hooks/useExpenses'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExpensesChart } from '@/components/charts/expenses-chart'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  Plus,
  Search,
  Filter,
  Receipt,
  Edit,
  Trash2,
  CreditCard,
  Repeat,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  Camera,
} from 'lucide-react'

const expenseTypeIcons = {
  expense: ArrowDownLeft,
  income: ArrowUpRight,
  fixed: Repeat,
  msi: Layers,
}

const expenseTypeColors = {
  expense: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  income: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  fixed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  msi: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
}

const expenseTypeLabels = {
  expense: 'Gasto',
  income: 'Ingreso',
  fixed: 'Fijo',
  msi: 'MSI',
}

export default function ExpensesPage() {
  const { user } = useAuth()
  const { currentFamily } = useFamily(user?.id)
  const { expenses, loading, deleteExpense } = useExpenses(currentFamily?.id)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType ? expense.type === filterType : true
    return matchesSearch && matchesType
  })

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este gasto?')) return
    setDeleting(id)
    await deleteExpense(id)
    setDeleting(null)
  }

  // Group by category for chart
  const categoryData = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(categoryData).map(([name, amount]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    amount,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gastos</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Gestiona tus transacciones y registros financieros
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/expenses/ocr">
            <Button variant="outline">
              <Camera className="w-4 h-4 mr-2" />
              Escanear ticket
            </Button>
          </Link>
          <Link href="/dashboard/expenses/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo gasto
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total gastos</p>
              <p className="text-2xl font-bold">
                {formatCurrency(expenses.reduce((sum, e) => sum + (e.type === 'expense' ? e.amount : 0), 0))}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <ArrowDownLeft className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total ingresos</p>
              <p className="text-2xl font-bold">
                {formatCurrency(expenses.reduce((sum, e) => sum + (e.type === 'income' ? e.amount : 0), 0))}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Transacciones</p>
              <p className="text-2xl font-bold">{expenses.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Receipt className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card title="Distribución por categoría">
          <ExpensesChart data={chartData} type="pie" />
        </Card>
      )}

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar gastos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'expense', 'income', 'fixed', 'msi'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type === 'all' ? null : type)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  (type === 'all' && !filterType) || filterType === type
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-dark-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {type === 'all' ? 'Todos' : expenseTypeLabels[type]}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8">Cargando...</div>
          ) : filteredExpenses.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay transacciones registradas</p>
              <Link href="/dashboard/expenses/new">
                <Button variant="outline" className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Registrar primera transacción
                </Button>
              </Link>
            </div>
          ) : (
            filteredExpenses.map((expense) => {
              const TypeIcon = expenseTypeIcons[expense.type as keyof typeof expenseTypeIcons] || Receipt

              return (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${expenseTypeColors[expense.type as keyof typeof expenseTypeColors]}`}>
                      <TypeIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {expense.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{expense.category}</span>
                        <Badge variant="default" className="text-xs">
                          {expenseTypeLabels[expense.type as keyof typeof expenseTypeLabels]}
                        </Badge>
                        {expense.installments > 1 && (
                          <span className="text-xs text-gray-500">
                            {expense.current_installment}/{expense.installments} MSI
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`font-semibold ${
                        expense.type === 'income' ? 'text-green-600' : 'text-gray-900 dark:text-white'
                      }`}>
                        {expense.type === 'income' ? '+' : '-'}
                        {formatCurrency(expense.amount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(expense.created_at)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Link href={`/dashboard/expenses/${expense.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(expense.id)}
                        disabled={deleting === expense.id}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </Card>
    </div>
  )
}
