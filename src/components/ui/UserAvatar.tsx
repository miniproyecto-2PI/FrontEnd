import { useState } from 'react'
import { PRESET_AVATARS } from '../../constants/avatars'
import { initialsOf } from '../../utils/profileForm'

export interface UserAvatarProps {
  /** ID del catálogo (avatar-01…), URL de una foto, data URL de vista previa o vacío. */
  avatar?: string | null
  firstName?: string | null
  lastName?: string | null
  /** Clases de tamaño y tipografía, p. ej. "w-10 h-10 text-sm". */
  className?: string
  /** Texto alternativo; por defecto decorativo (el nombre ya está escrito al lado). */
  alt?: string
}

/**
 * Avatar único para toda la app (encabezado, perfil, panel). Si no hay avatar o la
 * imagen falla, muestra las iniciales sobre el azul de la guía visual (US-04).
 */
export function UserAvatar({ avatar, firstName, lastName, className = 'w-10 h-10 text-sm', alt = '' }: UserAvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const isImage = Boolean(avatar && (avatar.startsWith('http') || avatar.startsWith('data:') || avatar.startsWith('blob:')))
  const preset = !isImage ? PRESET_AVATARS.find((a) => a.id === avatar) : undefined
  const base = `rounded-full shrink-0 overflow-hidden flex items-center justify-center select-none ${className}`

  if (isImage && avatar && failedSrc !== avatar) {
    return (
      <span className={`${base} bg-[#D6E3F2]`}>
        <img
          src={avatar}
          alt={alt}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          onError={() => setFailedSrc(avatar)}
        />
      </span>
    )
  }

  if (preset) {
    return (
      <span
        className={`${base} border border-[#dbe7f0] [&>svg]:w-[60%] [&>svg]:h-[60%]`}
        style={{ backgroundColor: preset.bgColor, color: preset.textColor }}
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
      >
        {preset.icon}
      </span>
    )
  }

  return (
    <span
      className={`${base} bg-[#1f4e79] text-white font-bold font-['Plus_Jakarta_Sans',sans-serif]`}
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    >
      {initialsOf(firstName ?? '', lastName ?? '')}
    </span>
  )
}
