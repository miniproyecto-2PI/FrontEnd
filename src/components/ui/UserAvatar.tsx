import { useState } from 'react'
import { initialsOf } from '../../utils/profileForm'

export interface UserAvatarProps {
  /** URL de una foto, data URL de vista previa o vacío. Los IDs del catálogo (avatar-01…) se muestran como iniciales. */
  avatar?: string | null
  firstName?: string | null
  lastName?: string | null
  /** Clases de tamaño y tipografía, p. ej. "w-10 h-10 text-sm". */
  className?: string
  /** Texto alternativo; por defecto decorativo (el nombre ya está escrito al lado). */
  alt?: string
}

/**
 * Avatar único para toda la app (encabezado, perfil, panel). Sin foto propia (o de
 * Google), o si la imagen falla, muestra las iniciales sobre el azul de la guía visual.
 * Decisión UX Sprint 2: se retiraron los avatares ilustrados; la API aún exige un ID
 * del catálogo al registrarse, que aquí equivale a "sin foto".
 */
export function UserAvatar({ avatar, firstName, lastName, className = 'w-10 h-10 text-sm', alt = '' }: UserAvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const isImage = Boolean(avatar && (avatar.startsWith('http') || avatar.startsWith('data:') || avatar.startsWith('blob:')))
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
