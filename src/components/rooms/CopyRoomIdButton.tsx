import { useEffect, useRef, useState } from 'react'
import { useAnnouncer } from '../ui/LiveAnnouncer'

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Se intenta el método alterno
  }
  try {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    return ok
  } catch {
    return false
  }
}

export interface CopyRoomIdButtonProps {
  roomId: string
  roomName: string
  className?: string
}

/**
 * "Copiar ID" (US-06): copia al portapapeles y confirma de forma visible ("ID copiado")
 * y por el anunciador central para lectores de pantalla.
 */
export function CopyRoomIdButton({ roomId, roomName, className = '' }: CopyRoomIdButtonProps) {
  const announce = useAnnouncer()
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const handleCopy = async () => {
    const ok = await copyText(roomId)
    setState(ok ? 'copied' : 'failed')
    announce(
      ok ? `ID copiado: ${roomId.split('').join(' ')}` : 'No pudimos copiar el ID. Selecciónalo y cópialo manualmente.',
      ok ? 'polite' : 'assertive'
    )
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), 2500)
  }

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      aria-label={`Copiar ID de la sala ${roomName}`}
      className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg border px-3 text-sm font-semibold transition-colors ${
        state === 'copied'
          ? 'border-[#005044] bg-[#e8f5ef] text-[#005044]'
          : state === 'failed'
            ? 'border-[#BA1A1A] bg-white text-[#BA1A1A]'
            : 'border-[#C2C6D5] bg-white text-[#1f4e79] hover:border-[#1f4e79] hover:bg-[#D6E3F2]'
      } ${className}`}
    >
      {state === 'copied' ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path strokeLinecap="round" d="M5 15V5a1 1 0 011-1h10" />
        </svg>
      )}
      <span>{state === 'copied' ? 'ID copiado' : state === 'failed' ? 'No se copió' : 'Copiar ID'}</span>
    </button>
  )
}
