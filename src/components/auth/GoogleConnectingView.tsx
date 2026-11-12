import { Button } from '../ui/Button'

export interface GoogleConnectingViewProps {
  onCancel: () => void
}

export function GoogleConnectingView({ onCancel }: GoogleConnectingViewProps) {
  return (
    <section
      aria-labelledby="connecting-title"
      className="w-full max-w-[480px] bg-white border border-[#dfe9f1] rounded-2xl shadow-sm p-6 sm:p-9 text-center animate-in fade-in duration-200"
    >
      {/* GOOGLE ANIMATED RING */}
      <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
        <div className="absolute inset-0 rounded-full border-4 border-[#4285F4] border-t-transparent animate-spin" />
        <div className="w-12 h-12 rounded-full bg-[#f8fafc] flex items-center justify-center shadow-xs">
          <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
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
        </div>
      </div>

      <h1 id="connecting-title" className="text-xl sm:text-2xl font-bold text-[#102c40] tracking-tight">
        Conectando con Google…
      </h1>
      <p className="mt-2 text-xs sm:text-sm text-[#526679] leading-relaxed max-w-sm mx-auto">
        Estamos verificando tus credenciales académicas para configurar tu acceso seguro a Estudiemos.
      </p>

      {/* STEP PROGRESS BAR */}
      <div className="mt-6 mb-6">
        <div className="flex items-center justify-between text-xs text-[#526679] mb-1.5 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Validando protocolo OAuth 2.0
          </span>
          <span className="font-semibold text-[#1f4e79]">Paso 1 de 2</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="w-1/2 h-full bg-[#1f4e79] rounded-full animate-pulse" />
        </div>
      </div>

      <Button variant="outline" size="md" fullWidth onClick={onCancel}>
        Cancelar
      </Button>

      <div className="mt-6 pt-4 border-t border-[#edf2f7] flex items-center justify-center gap-2 text-[11px] text-slate-400">
        <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span>Cifrado institucional TLS 1.3 • No compartiremos tus contraseñas</span>
      </div>
    </section>
  )
}

