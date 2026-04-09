export const APP_NAME = 'FinCove'
export const APP_DESCRIPTION = 'Gestión financiera familiar inteligente'
export const APP_VERSION = '1.0.0'

export const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Alimentación', icon: 'UtensilsCrossed', color: '#22c55e' },
  { id: 'transport', name: 'Transporte', icon: 'Car', color: '#3b82f6' },
  { id: 'entertainment', name: 'Entretenimiento', icon: 'Film', color: '#8b5cf6' },
  { id: 'health', name: 'Salud', icon: 'Heart', color: '#ef4444' },
  { id: 'shopping', name: 'Compras', icon: 'ShoppingBag', color: '#f59e0b' },
  { id: 'utilities', name: 'Servicios', icon: 'Zap', color: '#06b6d4' },
  { id: 'education', name: 'Educación', icon: 'BookOpen', color: '#6366f1' },
  { id: 'other', name: 'Otros', icon: 'MoreHorizontal', color: '#6b7280' },
] as const

export const PAYMENT_METHODS = [
  { id: 'cash', name: 'Efectivo', icon: 'Banknote' },
  { id: 'credit', name: 'Tarjeta de Crédito', icon: 'CreditCard' },
  { id: 'debit', name: 'Tarjeta de Débito', icon: 'CreditCard' },
  { id: 'transfer', name: 'Transferencia', icon: 'ArrowLeftRight' },
] as const

export const EXPENSE_TYPES = [
  { id: 'expense', name: 'Gasto', icon: 'ArrowDownLeft' },
  { id: 'income', name: 'Ingreso', icon: 'ArrowUpRight' },
  { id: 'fixed', name: 'Pago Fijo', icon: 'Repeat' },
  { id: 'msi', name: 'MSI', icon: 'Layers' },
] as const

export const TANDA_FREQUENCIES = [
  { id: 'weekly', name: 'Semanal' },
  { id: 'biweekly', name: 'Quincenal' },
  { id: 'monthly', name: 'Mensual' },
] as const

export const NOTIFICATION_TYPES = [
  { id: 'payment_due', name: 'Pago próximo' },
  { id: 'tanda_turn', name: 'Tu turno en tanda' },
  { id: 'invite', name: 'Invitación' },
  { id: 'system', name: 'Sistema' },
] as const
