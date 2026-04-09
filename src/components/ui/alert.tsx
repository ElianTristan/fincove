import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react'

interface AlertProps {
  children: React.ReactNode
  variant?: 'info' | 'success' | 'warning' | 'error'
  className?: string
}

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
}

export function Alert({ children, variant = 'info', className }: AlertProps) {
  const Icon = icons[variant]

  return (
    <div
      className={cn(
        'rounded-lg p-4 flex items-start gap-3',
        {
          'bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400':
            variant === 'info',
          'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400':
            variant === 'success',
          'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400':
            variant === 'warning',
          'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400':
            variant === 'error',
        },
        className
      )}
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">{children}</div>
    </div>
  )
}
