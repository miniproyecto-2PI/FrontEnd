import { useEffect, useState } from 'react'
import { Button } from '../ui/Button'

export interface RateLimitAlertProps {
  lockoutUntil: number
  email?: string
  onUnlock: () => void
  onRecoverPassword?: () => void
}

export function RateLimitAlert({
  lockoutUntil,
  email,
  onUnlock,
  onRecoverPassword,
}: RateLimitAlertProps) {
  const calculateRemaining = () => Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000))
  const [secondsLeft, setSecondsLeft] = useState(calculateRemaining)

  useEffect(() => {
    const interval = setInterval(() => {
      const rem = calculateRemaining()
      setSecondsLeft(rem)
      if (rem <= 0) {
        clearInterval(interval)
        onUnlock()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [lockoutUntil, onUnlock])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return (
    <div
      role="alert"
      aria-live="polite"
      className="bg-white border border-[#f3c8c8] rounded-2xl shadow-sm p-6 sm:p-8 flex flex-col gap-5 text-[#102c40]"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-bold text-[#102c40]">
            Cuenta bloqueada temporalmente por seguridad
          </h2>
          <p className="text-xs text-[#526679] leading-relaxed">
            Has superado el límite de intentos permitidos. Por protección de tus datos académicos, tu acceso ha sido suspendido temporalmente.
          </p>
        </div>
      </div>

      {/* TIEMPO RESTANTE DE ENFRIAMIENTO */}
      <div className="flex items-center justify-between bg-[#fbfcfd] border border-[#e2e8f0] rounded-xl px-4 py-3">
        <span className="text-xs font-medium text-[#526679] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
          Tiempo restante de espera:
        </span>
        <span className="font-mono text-sm font-bold text-[#102c40] bg-white border border-[#cbd5e1] rounded px-2.5 py-0.5 shadow-2xs">
          {formattedTime} min
        </span>
      </div>

      {email && (
        <div className="text-xs text-[#526679] bg-slate-50 border border-slate-200 rounded-lg p-3">
          <span className="font-medium text-[#102c40]">Identificador:</span>{' '}
          <span className="font-mono">{email}</span>
        </div>
      )}

      {/* ACCIONES */}
      <div className="flex flex-col gap-2.5 pt-1">
        <Button
          variant="outline"
          size="md"
          fullWidth
          disabled={secondsLeft > 0}
          onClick={onUnlock}
        >
          {secondsLeft > 0 ? `Espera ${formattedTime} para reintentar` : 'Reintentar inicio de sesión'}
        </Button>

        {onRecoverPassword && (
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={onRecoverPassword}
          >
            Recuperar contraseña ahora
          </Button>
        )}
      </div>
    </div>
  )
}
