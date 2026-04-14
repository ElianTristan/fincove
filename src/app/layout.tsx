import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/layout/navbar'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FinCove - Gestión Financiera Familiar',
  description: 'Controla tus gastos, administra tandas y organiza tu economía familiar con FinCove',
  keywords: 'finanzas, familias, gastos, presupuesto, tandas, ahorro',
  manifest: '/manifest.json',
  icons: {
    apple: '/icons/icon-192x192.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-white antialiased`}>
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  )
}
// Vercel sync fix: 1776154142
