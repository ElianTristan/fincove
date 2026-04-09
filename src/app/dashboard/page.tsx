'use client'

import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useFamily } from '@/hooks/useFamily'
import { useExpenses } from '@/hooks/useExpenses'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExpensesChart } from '@/components/charts/expenses-chart'
import { TrendChart } from '@/components/charts/trend-chart'
import { formatCurrency } from '@/lib/utils'
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Users,
  Receipt,
  ArrowRight,
  Plus,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth()
  const { currentFamily, families, loading: familyLoading } = useFamily(user?.id)
  const { expenses, getMonthlyStats, loading: expensesLoading } = useExpenses(currentFamily?.id)

  const stats = getMonthlyStats()

  // Sample trend data
  const trendData = [
    { month: 'Ene', income: 25000, expenses: 18000 },
    { month: 'Feb', income: 28000, expenses: 22000 },
    { month: 'Mar', income: 26000, expenses: 19500 },
    { month: 'Abr', income: 30000, expenses: 21000 },
    { month: 'May', income: 32000, expenses: 24000 },
    { month: 'Jun', income: 35000, expenses: 22800 },
  ]

  // Category data for pie chart
  const categoryData = Object.entries(stats.byCategory || {}).map(([name, amount]) => ({
    name,
    amount,
  }))

  const kpiCards = [
    {
      title: 'Gastos del mes',
      value: formatCurrency(stats.total),
      change: '+12%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Balance',
      value: formatCurrency(15420),
      change: '+5%',
      trend: 'up',
      icon: Wallet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Transacciones',
      value: stats.count.toString(),
      change: '3 nuevas',
      trend: 'neutral',
      icon: Receipt,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Miembros',
      value: (currentFamily?.members?.length || 1).toString(),
      change: 'activos',
      trend: 'neutral',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            ¡Hola, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {currentFamily
              ? `${currentFamily.name} - Resumen financiero`
              : 'Selecciona o crea un grupo familiar para comenzar'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/expenses/new">
            <Button className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo gasto
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Onboarding Alert - No Family */}
      {!currentFamily && !familyLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Configura tu grupo familiar</h3>
                <p className="text-primary-100">
                  Crea un grupo o únete con un código de invitación para comenzar
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard/groups/join">
                <Button variant="secondary">Unirse a grupo</Button>
              </Link>
              <Link href="/dashboard/groups/new">
                <Button className="bg-white text-primary-600 hover:bg-gray-100">
                  Crear grupo
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {kpi.value}
                  </p>
                  <p className={`text-sm mt-1 ${kpi.trend === 'up' ? 'text-green-600' : 'text-gray-500'}`}>
                    {kpi.change}
                  </p>
                </div>
                <div className={`w-10 h-10 ${kpi.bgColor} rounded-lg flex items-center justify-center`}>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card
            title="Tendencia mensual"
            description="Ingresos vs Gastos"
            action={
              <Link href="/dashboard/expenses">
                <Button variant="ghost" size="sm">
                  Ver todo
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            }
          >
            <TrendChart data={trendData} showArea />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card
            title="Gastos por categoría"
            description="Distribución del mes actual"
            action={
              <Link href="/dashboard/expenses">
                <Button variant="ghost" size="sm">
                  Ver todo
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            }
          >
            <ExpensesChart
              data={categoryData.length > 0 ? categoryData : [
                { name: 'Alimentación', amount: 5000 },
                { name: 'Transporte', amount: 3000 },
                { name: 'Entretenimiento', amount: 2000 },
                { name: 'Otros', amount: 1500 },
              ]}
              type="pie"
            />
          </Card>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card
          title="Transacciones recientes"
          action={
            <Link href="/dashboard/expenses">
              <Button variant="ghost" size="sm">Ver todas</Button>
            </Link>
          }
        >
          {expenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay transacciones registradas</p>
              <Link href="/dashboard/expenses/new">
                <Button variant="outline" className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Registrar gasto
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {expenses.slice(0, 5).map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {expense.title}
                      </p>
                      <p className="text-sm text-gray-500">{expense.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(expense.amount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(expense.created_at).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
