import { useId, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { ImageCropModal } from './ImageCropModal'

export const PHOTO_MAX_BYTES = 2 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export interface PhotoUploadControlsProps {
  /** Hay una foto elegida o guardada: muestra "Cambiar foto" y "Quitar foto". */
  hasPhoto: boolean
  onSelectFile: (file: File, previewUrl: string) => void
  onRemove?: () => void
  disabled?: boolean
  /** stacked: botones a todo el ancho (tarjeta de perfil); inline: en fila (registro). */
  layout?: 'stacked' | 'inline'
  /** Texto del botón principal cuando aún no hay foto. */
  uploadLabel?: string
}

/**
 * Subir foto de perfil (opcional): valida tipo y peso, abre el recorte cuadrado y
 * entrega el archivo final. Si no hay foto, la app muestra las iniciales.
 */
export function PhotoUploadControls({
  hasPhoto,
  onSelectFile,
  onRemove,
  disabled = false,
  layout = 'stacked',
  uploadLabel = 'Subir foto',
}: PhotoUploadControlsProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const errorId = useId()
  const [error, setError] = useState<string | null>(null)
  const [toCrop, setToCrop] = useState<string | null>(null)

  const resetInput = () => {
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setError(null)
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Formato no permitido. Usa una imagen JPG, PNG o WebP.')
      resetInput()
      return
    }
    if (file.size > PHOTO_MAX_BYTES) {
      setError('La imagen debe pesar máximo 2 MB.')
      resetInput()
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') setToCrop(reader.result)
    }
    reader.onerror = () => setError('No pudimos leer la imagen. Intenta con otra.')
    reader.readAsDataURL(file)
  }

  const base =
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60'
  const primary = `${base} border-[#C2C6D5] bg-white text-[#1f4e79] hover:border-[#1f4e79] hover:bg-[#D6E3F2]`
  const danger = `${base} border-transparent bg-transparent text-[#BA1A1A] hover:bg-[#ffdad6]`
  const width = layout === 'stacked' ? 'w-full' : ''

  return (
    <div className={layout === 'stacked' ? 'flex flex-col gap-2' : 'flex flex-col gap-1.5'}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={handleFile}
      />
      <div className={layout === 'stacked' ? 'flex flex-col gap-2' : 'flex flex-wrap items-center gap-2'}>
        <button
          type="button"
          className={`${primary} ${width}`}
          disabled={disabled}
          aria-describedby={error ? errorId : undefined}
          onClick={() => inputRef.current?.click()}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h1.6a2 2 0 001.7-.9l.8-1.2A2 2 0 0110.8 4h2.4a2 2 0 011.7.9l.8 1.2a2 2 0 001.7.9H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <circle cx="12" cy="13" r="3.5" />
          </svg>
          {hasPhoto ? 'Cambiar foto' : uploadLabel}
        </button>
        {hasPhoto && onRemove && (
          <button
            type="button"
            className={`${danger} ${width}`}
            disabled={disabled}
            onClick={() => {
              setError(null)
              onRemove()
            }}
          >
            Quitar foto
          </button>
        )}
      </div>
      {error && (
        <p id={errorId} role="alert" className="flex items-start gap-1.5 text-xs font-medium text-red-700">
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}

      <ImageCropModal
        isOpen={toCrop !== null}
        imageSrc={toCrop}
        onCropComplete={(file, previewUrl) => {
          onSelectFile(file, previewUrl)
          setToCrop(null)
          resetInput()
        }}
        onCancel={() => {
          setToCrop(null)
          resetInput()
        }}
      />
    </div>
  )
}
