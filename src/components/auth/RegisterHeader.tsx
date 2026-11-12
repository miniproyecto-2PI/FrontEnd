import { Badge } from '../ui/Badge'

export interface RegisterHeaderProps {
  isLoading: boolean
  onGoogleClick: () => void
}

export function RegisterHeader({ isLoading, onGoogleClick }: RegisterHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center pb-5 border-b border-[#edf2f7]">
      <Badge variant="institutional" className="mb-2.5">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
        Registro Institucional
      </Badge>

      <h1 className="text-2xl sm:text-3xl font-bold text-[#102c40] tracking-tight">
        Crea tu cuenta
      </h1>
      <p className="mt-1.5 text-xs sm:text-sm text-[#526679]">
        Únete a las salas de estudio colaborativas en tiempo real
      </p>

      {/* GOOGLE SIGN-UP BUTTON */}
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
      </div>

      {/* DIVIDER */}
      <div className="relative w-full flex items-center justify-center mt-5">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-[#e2e8f0]" />
        </div>
        <span className="relative px-3 bg-white text-xs text-slate-400 font-medium uppercase tracking-wider">
          o
        </span>
      </div>
    </div>
  )
}
