import { useRegisterForm } from '../hooks/useRegisterForm'
import { RegisterSuccessCard } from '../components/auth/RegisterSuccessCard'
import { RegisterForm } from '../components/auth/RegisterForm'
import { GoogleConnectingView } from '../components/auth/GoogleConnectingView'

export function RegisterPage() {
  const form = useRegisterForm()

  return (
    <main
      id="main-content"
      className="min-h-[calc(100vh-140px)] bg-[#f5faff] py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center"
    >
      {form.isGoogleConnecting ? (
        <GoogleConnectingView onCancel={form.handleCancelGoogle} />
      ) : form.successUser ? (
        <RegisterSuccessCard user={form.successUser} />
      ) : (
        <div className="w-full max-w-[560px] flex flex-col gap-4">
          <RegisterForm form={form} />

          {/* SECURITY & TRUST BADGES */}
          <div className="flex items-center justify-center gap-2 text-xs text-[#526679] py-1 text-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
            <span>Espacio de concentración académica sin anuncios ni distracciones</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 pb-4">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              Conexión cifrada TLS 1.3
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Validez universitaria
            </span>
          </div>
        </div>
      )}
    </main>
  )
}
