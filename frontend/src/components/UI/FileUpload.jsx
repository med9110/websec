import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { cn } from '../../utils/helpers'
import toast from 'react-hot-toast'

const FileUpload = ({
  onFileSelect,
  currentFile,
  onRemove,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB
  className
}) => {
  const [preview, setPreview] = useState(currentFile || null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (file) => {
    if (!file) return

    if (file.size > maxSize) {
      toast.error(`Le fichier est trop volumineux. Maximum ${maxSize / 1024 / 1024}MB`)
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)

    onFileSelect(file)
  }

  const handleInputChange = (e) => {
    const file = e.target.files?.[0]
    handleFileChange(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    handleFileChange(file)
  }

  const handleRemove = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onRemove?.()
  }

  return (
    <div className={cn('relative', className)}>
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
          <img
            src={preview}
            alt="Prévisualisation"
            className="w-full h-48 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
            isDragging
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400'
          )}
        >
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 text-gray-400 mb-3">
              {isDragging ? (
                <Upload className="h-full w-full" />
              ) : (
                <ImageIcon className="h-full w-full" />
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium text-primary-600">Cliquez pour uploader</span>
              {' '}ou glissez-déposez
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF jusqu'à {maxSize / 1024 / 1024}MB
            </p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  )
}

export default FileUpload
