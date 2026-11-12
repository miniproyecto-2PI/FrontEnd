export interface RegisterHeaderProps {
  isLoading: boolean
  step: 1 | 2
  onGoogleClick?: () => void
}

export function RegisterHeader({ isLoading, step, onGoogleClick }: RegisterHeaderProps) {
  // Circunferencia del círculo con r=13 -> 2 * PI * 13 ≈ 81.68
  const circumference = 81.68
  const strokeDashoffset = step === 1 ? circumference * 0.5 : 0

  return (
    <div className="relative flex flex-col items-center text-center pb-5 border-b border-[#edf2f7]">
      {/* RUEDITA DE PROGRESO "1/2" MINIMALISTA SIN FONDO ARRIBA A LA DERECHA */}
      <div
        className="absolute top-0 right-0 sm:top-0.5 sm:right-0.5 flex items-center justify-center"
        aria-label={`Paso ${step} de 2`}
        title={`Paso ${step} de 2`}
      >
        <div className="relative w-8 h-8 flex items-center justify-center">
          <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32" aria-hidden="true">
            {/* Círculo base */}
            <circle
              cx="16"
              cy="16"
              r="13"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="2.5"
            />
            {/* Círculo de progreso animado */}
            <circle
              cx="16"
              cy="16"
              r="13"
              fill="none"
              stroke="#1f4e79"
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300 ease-out"
            />
          </svg>
          <span className="absolute font-mono text-[11px] font-bold text-[#1f4e79]">
            {step}/2
          </span>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-[#102c40] tracking-tight">
        {step === 1 ? 'Crea tu cuenta' : 'Define tus credenciales'}
      </h1>
      <p className="mt-1.5 text-xs sm:text-sm text-[#526679]">
        {step === 1
          ? 'Personaliza cómo te verán tus compañeros en las salas de estudio'
          : 'Ingresa tu correo y contraseña para proteger tu biblioteca personal'}
      </p>

      {/* GOOGLE SIGN-UP BUTTON (Visible solo en el paso 1) */}
      {step === 1 && onGoogleClick && (
        <div className="w-full mt-5">
          <button
            type="button"
            disabled={isLoading}
            onClick={onGoogleClick}
            className="w-full min-h-[48px] px-4 py-2.5 bg-white border border-[#cbd5e1] hover:border-slate-400 hover:bg-[#f8fafc] text-[#102c40] font-semibold text-sm rounded-lg flex items-center justify-center gap-3 transition-colors shadow-xs disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4e79]"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.86c2.26-2.09 3.685-5.17 3.685-9.09z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.26v3.09C3.26 21.36 7.36 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.61H1.26C.46 8.23 0 10.06 0 12s.46 3.77 1.26 5.39l4.01-3.1z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.26 6.61l4.01 3.1c.95-2.85 3.6-4.96 6.73-4.96z"
              />
            </svg>
            <span>Continuar con Google</span>
          </button>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-[#e2e8f0]" />
            </div>
            <span className="relative bg-white px-3 text-[11px] font-medium uppercase tracking-wider text-slate-400">
              o con registro manual
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
