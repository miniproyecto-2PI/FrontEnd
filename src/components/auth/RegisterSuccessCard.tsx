import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { PRESET_AVATARS } from '../../constants/avatars'
import type { UserProfile } from '../../types/auth'

export interface RegisterSuccessCardProps {
  user: UserProfile
  onContinue?: () => void
}

export function RegisterSuccessCard({ user, onContinue }: RegisterSuccessCardProps) {
  const navigate = useNavigate()
  const avatar = PRESET_AVATARS.find((a) => a.id === user.avatarUrl) || PRESET_AVATARS[0]

  const handleContinue = () => {
    if (onContinue) {
      onContinue()
    } else {
      navigate('/panel')
    }
  }

  return (
    <section
      aria-labelledby="success-title"
      className="w-full max-w-[540px] bg-white border border-[#dfe9f1] rounded-2xl shadow-sm p-6 sm:p-10 text-center animate-in fade-in duration-200"
    >
      <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#e8f5ef] text-[#1e654d] flex items-center justify-center border border-[#c5e8d9]">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 id="success-title" className="text-2xl sm:text-3xl font-bold text-[#102c40] tracking-tight">
        ¡Cuenta creada!
      </h1>
      <p className="mt-2.5 text-sm text-[#526679] leading-relaxed max-w-md mx-auto">
        Bienvenido a Estudiemos, <strong className="text-[#102c40]">{user.nombres}</strong>. Tu espacio de estudio colaborativo está listo. Ya puedes crear o unirte a tu primera sala de estudio.
      </p>

      {/* Student Identity Card */}
      <div className="mt-6 p-4 sm:p-5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-left flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-xs border border-white/60"
          style={{ backgroundColor: avatar.bgColor, color: avatar.textColor }}
        >
          {avatar.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-bold text-[#102c40] truncate">
              {user.nombres} {user.apellidos}
            </p>
            <Badge variant="success" dot>
              Cuenta activa
            </Badge>
          </div>
          <p className="text-xs text-[#1f4e79] font-semibold">@{user.username}</p>
          <p className="text-xs text-[#627482] truncate mt-0.5">{user.email}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleContinue}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          }
        >
          Continuar a mi panel
        </Button>
        <p className="text-xs text-[#718292] flex items-center justify-center gap-1.5">
          <span aria-hidden="true">⇄</span> Serás redirigido a tu Panel de estudio.
        </p>
      </div>
    </section>
  )
}
