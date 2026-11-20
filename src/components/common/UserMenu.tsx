import { useEffect, useId, useRef, useState } from 'react'
import type { FocusEvent, KeyboardEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { UserProfile } from '../../types/auth'
import { UserAvatar } from '../ui/UserAvatar'

export interface UserMenuProps {
  user: UserProfile
  onSwitchAccount: () => void
  /** Abre la confirmación de cierre de sesión. */
  onRequestLogout: () => void
}

const itemClass =
  // ! porque la regla global button{font:inherit} de styles.css no está en una capa y ganaría
  'flex w-full min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-left text-sm! font-medium! leading-5! transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#1f4e79]'

/**
 * Menú de la cuenta en el encabezado: Mi perfil, Cambiar de cuenta y Cerrar sesión
 * (en rojo, acción de riesgo). Patrón de "disclosure": botón con aria-expanded que
 * muestra una lista de enlaces y botones; Esc cierra y devuelve el foco al botón.
 */
export function UserMenu({ user, onSwitchAccount, onRequestLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const location = useLocation()

  const firstName = (user.firstName || user.nombres || 'Estudiante').split(' ')[0]
  const fullName = `${user.firstName || user.nombres || ''} ${user.lastName || user.apellidos || ''}`.trim()

  useEffect(() => setOpen(false), [location.pathname])

  // Clic fuera del menú lo cierra
  useEffect(() => {
    if (!open) return
    const handlePointer = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointer)
    return () => document.removeEventListener('pointerdown', handlePointer)
  }, [open])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && open) {
      event.stopPropagation()
      setOpen(false)
      triggerRef.current?.focus()
    }
  }

  // Al salir con Tab del menú, se cierra
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (open && !containerRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false)
  }

  const choose = (action: () => void) => {
    setOpen(false)
    // El foco vuelve al botón del menú: así la confirmación lo devuelve ahí al cerrarse
    triggerRef.current?.focus()
    action()
  }

  return (
    <div ref={containerRef} className="relative" onKeyDown={handleKeyDown} onBlur={handleBlur}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Menú de la cuenta: ${firstName}${user.username ? `, @${user.username}` : ''}`}
        onClick={() => setOpen((value) => !value)}
        className={`flex min-h-11 items-center gap-2 rounded-full border p-1 pr-3 transition-colors ${
          open ? 'border-[#1f4e79] bg-[#e7f1fb]' : 'border-[#dbe7f0] bg-[#f0f5f9] hover:border-[#1f4e79]'
        }`}
      >
        <UserAvatar
          avatar={user.avatarUrl ?? user.avatar}
          firstName={user.firstName || user.nombres}
          lastName={user.lastName || user.apellidos}
          className="w-8 h-8 text-xs"
        />
        <span className="flex flex-col text-left leading-tight">
          <span className="text-xs font-bold text-[#102c40]">{firstName}</span>
          {user.username && <span className="text-[11px] text-[#424753]">@{user.username}</span>}
        </span>
        <svg
          className={`ml-1 h-4 w-4 text-[#424753] transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="z-30 mt-2 w-full min-w-64 rounded-xl border border-[#C2C6D5] bg-white p-2 shadow-[0_20px_40px_-8px_rgba(11,37,64,0.14)] min-[961px]:absolute min-[961px]:right-0 min-[961px]:top-full min-[961px]:w-72"
      >
        <div className="flex items-center gap-3 border-b border-[#DEF0FF] px-3 pb-3 pt-2">
          <UserAvatar
            avatar={user.avatarUrl ?? user.avatar}
            firstName={user.firstName || user.nombres}
            lastName={user.lastName || user.apellidos}
            className="w-10 h-10 text-sm"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#001E2D]">{fullName || firstName}</p>
            <p className="truncate text-xs text-[#424753]">{user.email}</p>
          </div>
        </div>

        <ul className="flex flex-col gap-0.5 pt-2">
          <li>
            <Link
              to={user.profileComplete ? '/perfil' : '/elegir-usuario'}
              onClick={() => setOpen(false)}
              className={`${itemClass} text-[#001E2D]! hover:bg-[#EAF5FF]`}
            >
              <svg className="h-5 w-5 text-[#1f4e79]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path strokeLinecap="round" d="M4 21a8 8 0 0116 0" />
              </svg>
              Mi perfil
            </Link>
          </li>
          <li>
            <button type="button" onClick={() => choose(onSwitchAccount)} className={`${itemClass} text-[#001E2D] hover:bg-[#EAF5FF]`}>
              <svg className="h-5 w-5 text-[#1f4e79]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 3l4 4-4 4M20 7H9M8 21l-4-4 4-4M4 17h11" />
              </svg>
              <span className="flex flex-col">
                Cambiar de cuenta
                <span className="text-xs font-normal text-[#424753]">Sales de esta y entras con otra</span>
              </span>
            </button>
          </li>
          <li className="mt-1 border-t border-[#DEF0FF] pt-1">
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => choose(onRequestLogout)}
              className={`${itemClass} text-[#BA1A1A] hover:bg-[#ffdad6]`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l-5-5 5-5M5 12h12" />
              </svg>
              Cerrar sesión
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}
