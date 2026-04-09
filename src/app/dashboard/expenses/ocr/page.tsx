'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { processReceiptImage, extractAmountFromText } from '@/lib/ocr'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'
import { useAuth } from '@/hooks/useAuth'
import { useFamily } from '@/hooks/useFamily'
import { useExpenses } from '@/hooks/useExpenses'
import { Camera, Upload, X, Check, Loader2, Receipt, Edit } from 'lucide-react'
import { EXPENSE_CATEGORIES } from '@/lib/constants'

export default function OCRPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { currentFamily } = useFamily(user?.id)
  const { createExpense } = useExpenses(currentFamily?.id)

  const [image, setImage] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<{
    text: string
    amount: number | null
    date: string | null
    merchant: string | null
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('other')
  const [notes, setNotes] = useState('')

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setResult(null)

    // Show preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Process with OCR
    setProcessing(true)
    try {
      const ocrResult = await processReceiptImage(file)
      setResult(ocrResult)

      // Pre-fill form
      setTitle(ocrResult.merchant || 'Gasto sin identificar')
      setAmount(ocrResult.amount?.toString() || '')
      setNotes(`Texto extraído:\n${ocrResult.text.slice(0, 200)}...`)
    } catch (err) {
      setError('Error al procesar la imagen. Intenta de nuevo.')
    } finally {
      setProcessing(false)
    }
  }, [])

  const handleSave = async () => {
    if (!currentFamily || !user) {
      setError('Debes estar en un grupo para guardar gastos')
      return
    }

    if (!title || !amount) {
      setError('Título y monto son obligatorios')
      return
    }

    setSaving(true)
    try {
      const expense = await createExpense({
        family_id: currentFamily.id,
        created_by: user.id,
        title,
        amount: parseFloat(amount),
        category,
        type: 'expense',
        payment_method: 'cash',
        installments: 1,
        current_installment: 1,
        due_date: null,
        receipt_url: image || null,
        notes,
        is_recurring: false,
      })

      if (expense) {
        router.push('/dashboard/expenses')
      } else {
        setError('Error al guardar el gasto')
      }
    } catch (err) {
      setError('Error al guardar el gasto')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setImage(null)
    setResult(null)
    setTitle('')
    setAmount('')
    setCategory('other')
    setNotes('')
    setError(null)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Escanear ticket</h1>
          <p className="text-gray-500">Sube una foto de tu ticket y extrae los datos automáticamente</p>
        </div>
        {image && (
          <Button variant="ghost" onClick={handleReset}>
            <X className="w-4 h-4 mr-2" />
            Limpiar
          </Button>
        )}
      </div>

      {!image ? (
        <Card className="p-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-10 h-10 text-primary-600" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Sube una foto del ticket o toma una foto con tu cámara
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Subir imagen
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Image Preview */}
          <Card className="overflow-hidden">
            <img
              src={image}
              alt="Ticket preview"
              className="w-full max-h-64 object-contain bg-gray-100 dark:bg-dark-700"
            />
            {processing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p>Procesando imagen...</p>
                </div>
              </div>
            )}
          </Card>

          {error && <Alert variant="error">{error}</Alert>}

          {/* OCR Result */}
          {result && (
            <Card
              title="Datos extraídos"
              description="Revisa y completa la información"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Título / Comercio</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800"
                    placeholder="Nombre del comercio"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Monto</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Categoría</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800"
                    >
                      {EXPENSE_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Notas</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 resize-none"
                    placeholder="Notas adicionales..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={handleReset} className="flex-1">
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} isLoading={saving} className="flex-1">
                    <Check className="w-4 h-4 mr-2" />
                    Guardar gasto
                  </Button>
                </div>
              </div>

              {/* Raw OCR Text (collapsible) */}
              {result.text && (
                <details className="mt-4">
                  <summary className="text-sm text-gray-500 cursor-pointer">Ver texto extraído</summary>
                  <pre className="mt-2 p-3 bg-gray-100 dark:bg-dark-700 rounded-lg text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-40">
                    {result.text}
                  </pre>
                </details>
              )}
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
