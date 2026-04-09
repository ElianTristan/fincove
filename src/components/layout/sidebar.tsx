'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Receipt,
  Users,
  Wallet,
  Settings,
  FolderArchive,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Gastos', href: '/dashboard/expenses', icon: Receipt },
  { name: 'Tandas', href: '/dashboard/tandas', icon: Users },
  { name: 'Bóveda', href: '/dashboard/vault', icon: FolderArchive },
  { name: 'Grupo', href: '/dashboard/groups', icon: Wallet },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 h-[calc(100vh-64px)] sticky top-16">
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive ? 'text-primary-600' : 'text-gray-400')} />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-dark-700">
        <Link
          href="/dashboard/settings"
          className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-400" />
          <span className="font-medium">Configuración</span>
        </Link>
      </div>
    </aside>
  )
}
