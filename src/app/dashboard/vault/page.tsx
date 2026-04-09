'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useFamily } from '@/hooks/useFamily'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { formatDate } from '@/lib/utils'
import {
  Vault,
  Upload,
  FileText,
  Image as ImageIcon,
  X,
  Download,
  Trash2,
  Eye,
} from 'lucide-react'

interface VaultItem {
  id: string
  file_name: string
  file_url: string
  file_type: string
  extracted_text: string | null
  created_at: string
}

export default function VaultPage() {
  const { user } = useAuth()
  const { currentFamily } = useFamily(user?.id)
  const [items, setItems] = useState<VaultItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (currentFamily?.id) {
      fetchVaultItems()
    }
  }, [currentFamily])

  const fetchVaultItems = async () => {
    try {
      const { data, error } = await supabase
        .from('vault_items')
        .select('*')
        .eq('family_id', currentFamily?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (err) {
      console.error('Error fetching vault items:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setError(null)
  }

  const handleUpload = async () => {
    if (!selectedFile || !currentFamily || !user) {
      setError('Selecciona un archivo y asegúrate de estar en un grupo')
      return
    }

    setUploading(true)
    setError(null)

    try {
      // Upload to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `vault/${currentFamily.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('vault')
        .upload(filePath, selectedFile)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('vault')
        .getPublicUrl(filePath)

      // Save reference in database
      const { error: dbError } = await supabase.from('vault_items').insert({
        family_id: currentFamily.id,
        uploaded_by: user.id,
        file_name: selectedFile.name,
        file_url: publicUrl,
        file_type: selectedFile.type,
      })

      if (dbError) throw dbError

      // Reset
      setSelectedFile(null)
      setPreviewUrl(null)
      await fetchVaultItems()
    } catch (err) {
      console.error('Upload error:', err)
      setError('Error al subir el archivo')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este archivo?')) return

    try {
      await supabase.from('vault_items').delete().eq('id', id)
      await fetchVaultItems()
    } catch (err) {
      setError('Error al eliminar el archivo')
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType?.startsWith('image/')) return ImageIcon
    return FileText
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">Bóveda</h1>
          <p className="text-gray-500">Almacena y gestiona tus tickets y comprobantes</p>
        </div>
      </motion.div>

      {!currentFamily ? (
        <Card>
          <div className="text-center py-12">
            <Vault className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">
              Únete a un grupo familiar para usar la bóveda
            </p>
          </div>
        </Card>
      ) : (
        <>
          {/* Upload Section */}
          <Card title="Subir archivo" description="Guarda tickets y comprobantes">
            <div className="space-y-4">
              {!selectedFile ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Arrastra archivos aquí o haz clic para seleccionar
                  </p>
                  <p className="text-sm text-gray-500">Imágenes, PDFs hasta 10MB</p>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="mt-4" as="span">
                      Seleccionar archivo
                    </Button>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  {previewUrl && selectedFile.type.startsWith('image/') && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                  )}
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <span className="font-medium">{selectedFile.name}</span>
                    <button
                      onClick={() => {
                        setSelectedFile(null)
                        setPreviewUrl(null)
                      }}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedFile(null)
                        setPreviewUrl(null)
                      }}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleUpload}
                      isLoading={uploading}
                      className="flex-1"
                    >
                      Subir archivo
                    </Button>
                  </div>
                </div>
              )}

              {error && <Alert variant="error">{error}</Alert>}
            </div>
          </Card>

          {/* Vault Items */}
          <Card title="Archivos guardados">
            {loading ? (
              <div className="text-center py-8">Cargando...</div>
            ) : items.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Vault className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No hay archivos en la bóveda</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {items.map((item) => {
                  const Icon = getFileIcon(item.file_type)
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium truncate max-w-[200px]">
                            {item.file_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(item.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <a
                          href={item.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  )
}
