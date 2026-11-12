import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Alert } from '../ui/Alert'
import type { UseLoginFormReturn } from '../../hooks/useLoginForm'

export interface LoginFormProps {
  form: UseLoginFormReturn
  onForgotPassword?: () => void
}

export function LoginForm({ form, onForgotPassword }: LoginFormProps) {
  const {
    formData,
    errors,
    generalAlert,
    isLoading,
    refs,
    handleChange,
    handleSubmit,
    handleGoogleSignIn,
  } = form

  return (
    <div className="w-full max-w-[460px] flex flex-col gap-4">
      {/* GENERAL ALERT BANNER */}
      {generalAlert && (
        <Alert
          variant={generalAlert.variant}
          title={generalAlert.title}
          action={
            generalAlert.action === 'retry' ? (
              <Button variant="outline" size="sm" onClick={() => void handleSubmit()}>
                Reintentar
              </Button>
            ) : undefined
          }
        >
          {generalAlert.message}
        </Alert>
      )}

      <div className="bg-white border border-[#dfe9f1] rounded-2xl shadow-sm p-6 sm:p-9 transition-all">
        {/* CARD HEADER (Sin icono genérico de LucidChart) */}
        <div className="text-left mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1f4e79] mb-1.5 inline-block">
            Portal Académico
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102c40]">
            Bienvenido de nuevo
          </h1>
          <p className="text-xs sm:text-sm text-[#526679] mt-1.5 leading-relaxed">
            Ingresa a tus salas de estudio colaborativas en tiempo real
          </p>
        </div>

        {/* GOOGLE OAUTH BUTTON */}
        <div>
          <button
            type="button"
            onClick={() => void handleGoogleSignIn()}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-[#cbd5e1] bg-white text-xs sm:text-sm font-semibold text-[#1e293b] hover:bg-slate-50 active:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4e79] focus-visible:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed min-h-[48px]"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.665-5.17 3.665-9.09z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.1C3.29 21.43 7.37 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.1z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.29 2.57 1.25 6.58l4.03 3.1c.95-2.83 3.6-4.93 6.72-4.93z"
              />
            </svg>
            <span>Continuar con Google</span>
          </button>
        </div>

        {/* DIVIDER */}
        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-[#e2e8f0]" />
          </div>
          <span className="relative bg-white px-3 text-[11px] font-medium uppercase tracking-wider text-slate-400">
            o con tu correo
          </span>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {/* EMAIL */}
          <Input
            ref={refs.email}
            label="Correo electrónico (institucional o personal)"
            id="login-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="ejemplo@universidad.edu.co"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            disabled={isLoading}
            required
          />

          {/* PASSWORD */}
          <Input
            ref={refs.password}
            label="Contraseña"
            id="login-password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••••••"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={errors.password}
            disabled={isLoading}
            required
            isPassword
            badge={
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-[11px] font-semibold text-[#1f4e79] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1f4e79] rounded"
              >
                ¿Olvidaste tu contraseña?
              </button>
            }
          />

          {/* REMEMBER ME CHECKBOX */}
          <div className="flex items-center gap-2 pt-0.5">
            <input
              id="login-remember"
              name="remember"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => handleChange('rememberMe', e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-[#1f4e79] focus:ring-[#1f4e79] focus:ring-offset-0 cursor-pointer"
            />
            <label
              htmlFor="login-remember"
              className="text-xs text-[#526679] cursor-pointer select-none"
            >
              Mantener sesión activa en este equipo
            </label>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="mt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              loadingText="Ingresando…"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              }
            >
              Ingresar
            </Button>

            {isLoading && (
              <p className="text-xs text-center text-[#526679] mt-2 animate-pulse" role="status">
                Verificando credenciales y conectando con tu espacio de estudio…
              </p>
            )}
          </div>

          {/* FOOTER LINK */}
          <div className="mt-2 pt-4 border-t border-[#edf2f7] text-center text-xs text-[#526679]">
            <span>¿No tienes cuenta? </span>
            <Link
              to="/registro"
              className="font-bold text-[#1f4e79] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1f4e79] rounded px-1"
            >
              Regístrate
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
