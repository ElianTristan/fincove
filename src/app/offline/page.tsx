'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { WifiOff, RefreshCcw } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-gray-100 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-10 h-10 text-gray-500" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Sin conexión</h1>
        <p className="text-gray-500 mb-6 max-w-sm">
          Parece que no tienes conexión a internet. Algunas funciones pueden no estar disponibles.
        </p>

        <div className="flex gap-3 justify-center">
          <Button onClick={() => window.location.reload()}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
          <Link href="/">
            <Button variant="outline">Ir al inicio</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
