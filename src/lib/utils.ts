import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'MXN') {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string | Date) {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

export function formatDateShort(date: string | Date) {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-MX', {
    month: 'short',
    day: 'numeric',
  }).format(d)
}

export function generateRandomCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function calculateMonthlyInstallment(amount: number, months: number) {
  return amount / months
}

export function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    food: '#22c55e',
    transport: '#3b82f6',
    entertainment: '#8b5cf6',
    health: '#ef4444',
    shopping: '#f59e0b',
    utilities: '#06b6d4',
    education: '#6366f1',
    other: '#6b7280',
  }
  return colors[category.toLowerCase()] || colors.other
}

export function getCategoryIcon(category: string) {
  const icons: Record<string, string> = {
    food: 'UtensilsCrossed',
    transport: 'Car',
    entertainment: 'Film',
    health: 'Heart',
    shopping: 'ShoppingBag',
    utilities: 'Zap',
    education: 'BookOpen',
    other: 'MoreHorizontal',
  }
  return icons[category.toLowerCase()] || icons.other
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
) {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
