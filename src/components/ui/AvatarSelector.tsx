import { useRef, useState } from 'react'
import { PRESET_AVATARS, type PresetAvatar } from '../../constants/avatars'

export { PRESET_AVATARS, type PresetAvatar }

export interface AvatarSelectorProps {
  selectedId: string
  onSelect: (id: string) => void
  error?: string
  customPreview?: string | null
  onCustomFileSelect?: (file: File, previewUrl: string) => void
  onClearCustomFile?: () => void
}

export function AvatarSelector({
  selectedId,
  onSelect,
  error,
  customPreview,
  onCustomFileSelect,
  onClearCustomFile,
}: AvatarSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  const isCustomSelected =
    Boolean(customPreview) &&
    (selectedId === 'custom' || selectedId.startsWith('http') || selectedId.startsWith('data:'))

  const selectedAvatar = isCustomSelected
    ? null
    : PRESET_AVATARS.find((a) => a.id === selectedId) || PRESET_AVATARS[0]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileError(null)

    // Validar tipo de imagen (JPG, PNG, WebP alineado con Cloudinary / uploadAvatar middleware)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setFileError('Formato no permitido. Usa una imagen JPG, PNG o WebP.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    // Validar peso máximo (2 MB)
    const maxBytes = 2 * 1024 * 1024
    if (file.size > maxBytes) {
      setFileError('La imagen debe pesar máximo 2 MB.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    const previewUrl = URL.createObjectURL(file)
    onCustomFileSelect?.(file, previewUrl)
    onSelect('custom')
  }

  const handleRemoveCustom = () => {
    if (fileInputRef.current) fileInputRef.current.value = ''
    onClearCustomFile?.()
    onSelect(PRESET_AVATARS[0].id)
    setFileError(null)
  }

  const activeError = fileError || error

  return (
    <div className="w-full flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold tracking-wide text-[#102c40]">
          Foto de perfil o avatar <span className="text-red-600 font-bold" aria-hidden="true">*</span>
        </label>
        <span className="text-[11px] text-slate-500 font-medium">
          {isCustomSelected ? 'Foto personalizada (Cloudinary)' : selectedAvatar?.label}
        </span>
      </div>

      {/* SELECTOR DE AVATARES PREESTABLECIDOS */}
      <div
        role="radiogroup"
        aria-label="Selecciona un avatar predeterminado"
        className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl"
      >
        {PRESET_AVATARS.map((avatar) => {
          const isSelected = !isCustomSelected && avatar.id === selectedId
          return (
            <button
              key={avatar.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={avatar.label}
              onClick={() => {
                onSelect(avatar.id)
                setFileError(null)
              }}
              className={`relative flex items-center justify-center p-2 rounded-lg transition-all duration-150 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4e79]
                ${
                  isSelected
                    ? 'ring-2 ring-[#1f4e79] shadow-sm transform scale-105'
                    : 'hover:bg-white hover:border-[#cbd5e1] border border-transparent'
                }`}
              style={{
                backgroundColor: avatar.bgColor,
                color: avatar.textColor,
              }}
            >
              <div className="relative">
                {avatar.icon}
                {isSelected && (
                  <span
                    className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-[#1f4e79] text-white rounded-full flex items-center justify-center text-[9px] font-bold"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* SECCIÓN DE SUBIDA DE IMAGEN PERSONALIZADA (CLOUDINARY) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        id="avatar-file-upload"
        tabIndex={-1}
      />

      {isCustomSelected && customPreview ? (
        <div className="flex items-center justify-between gap-3 p-3 bg-blue-50/60 border border-[#b9d5ec] rounded-xl animate-in fade-in duration-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-11 h-11 shrink-0">
              <img
                src={customPreview}
                alt="Vista previa de foto personalizada"
                className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
              />
              <span
                className="absolute -top-1 -right-1 w-4 h-4 bg-[#1f4e79] text-white rounded-full flex items-center justify-center text-[10px] font-bold"
                aria-hidden="true"
              >
                ✓
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[#102c40] truncate">
                Foto personalizada seleccionada
              </span>
              <span className="text-[11px] text-[#475569]">
                Se subirá a Cloudinary al registrar la cuenta
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 text-xs font-semibold text-[#1f4e79] bg-white border border-[#b9d5ec] rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
            >
              Cambiar
            </button>
            <button
              type="button"
              onClick={handleRemoveCustom}
              className="px-2 py-1 text-xs font-medium text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              title="Quitar foto y usar avatar predeterminado"
            >
              Quitar
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 bg-[#f8fafc] border border-dashed border-[#cbd5e1] rounded-xl hover:border-[#1f4e79] transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1f4e79] flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#102c40]">¿Prefieres subir tu propia foto?</span>
              <span className="text-[11px] text-slate-500">JPG, PNG o WebP (máximo 2 MB)</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1f4e79] bg-white border border-[#cbd5e1] rounded-lg hover:bg-slate-50 hover:border-[#1f4e79] transition-all cursor-pointer shadow-2xs shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Subir imagen</span>
          </button>
        </div>
      )}

      {activeError && (
        <p role="alert" className="text-xs font-medium text-red-700 flex items-center gap-1.5 px-1">
          <span aria-hidden="true">⚠</span>
          <span>{activeError}</span>
        </p>
      )}
    </div>
  )
}
