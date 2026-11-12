import type { FormEvent } from 'react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Alert } from '../ui/Alert'
import type { UserProfile } from '../../types/auth'

export interface UsernameSelectionFormProps {
  user: UserProfile
  username: string
  onChange: (value: string) => void
  onSubmit: (e: FormEvent) => void
  onBack: () => void
  onSelectSuggestion: (suggestion: string) => void
  suggestions: string[]
  status: 'idle' | 'checking' | 'available' | 'taken'
  error?: string
  isLoading: boolean
}

export function UsernameSelectionForm({
  user,
  username,
  onChange,
  onSubmit,
  onBack,
  onSelectSuggestion,
  suggestions,
  status,
  error,
  isLoading,
}: UsernameSelectionFormProps) {
  const charCount = username.length
  const initials = `${user.firstName[0] || 'U'}${user.lastName[0] || ''}`.toUpperCase()

  return (
    <div className="w-full max-w-[540px] flex flex-col gap-4 animate-in fade-in duration-200">
      {/* CARD MAIN */}
      <div className="bg-white border border-[#dfe9f1] rounded-2xl shadow-sm p-6 sm:p-9">
        {/* STEP PROGRESS */}
        <div className="flex items-center justify-between pb-4 border-b border-[#edf2f7] mb-5 text-xs">
          <span className="font-semibold text-slate-500 uppercase tracking-wider">
            Paso 2 de 2 • Configuración de perfil
          </span>
          <div className="flex items-center gap-1">
            <span className="w-3.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="w-3.5 h-1.5 rounded-full bg-[#1f4e79]" />
          </div>
        </div>

        {/* GOOGLE ACCOUNT BANNER */}
        <div className="p-3.5 sm:p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl flex items-center gap-3.5 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#1f4e79] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <p className="text-xs sm:text-sm font-bold text-[#102c40] truncate">
                Hola, {user.firstName} {user.lastName}
              </p>
              <Badge variant="institutional" icon="✓">
                Cuenta de Google verificada
              </Badge>
            </div>
            <p className="text-xs text-[#627482] truncate mt-0.5">{user.email}</p>
          </div>
        </div>

        {/* HEADINGS */}
        <div className="text-left mb-5">
          <h1 className="text-2xl font-bold text-[#102c40] tracking-tight">
            Elige tu nombre de usuario
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#526679]">
            Este identificador único te representará en salas de estudio, foros y grupos colaborativos.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="google-username" className="text-xs font-semibold tracking-wide text-[#102c40]">
                Nombre de usuario <span className="text-red-600 font-bold">*</span>
              </label>
              <span className={`text-[11px] font-mono ${charCount > 20 ? 'text-red-600 font-bold' : 'text-slate-400'}`}>
                {charCount}/20
              </span>
            </div>

            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-xs font-bold text-slate-400 select-none">@</span>
              <input
                id="google-username"
                type="text"
                autoComplete="username"
                value={username}
                disabled={isLoading}
                onChange={(e) => onChange(e.target.value.toLowerCase().replace(/\s/g, ''))}
                placeholder="tu_usuario"
                className={`w-full min-h-[48px] pl-8 pr-10 py-2.5 text-sm rounded-lg bg-white text-[#102c40] placeholder:text-slate-400 border transition-colors
                  ${
                    error
                      ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500'
                      : status === 'available'
                      ? 'border-emerald-500 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500'
                      : 'border-[#cbd5e1] hover:border-slate-400 focus:border-[#1f4e79] focus:ring-1 focus:ring-[#1f4e79]'
                  }
                  focus:outline-none disabled:bg-slate-50 disabled:text-slate-400`}
              />

              <div className="absolute right-3 flex items-center pointer-events-none">
                {status === 'checking' ? (
                  <span className="inline-block w-4 h-4 border-2 border-[#1f4e79] border-t-transparent rounded-full animate-spin" />
                ) : status === 'available' ? (
                  <span className="text-emerald-600 font-bold text-sm">✓</span>
                ) : error ? (
                  <span className="text-red-600 font-bold text-sm">✕</span>
                ) : null}
              </div>
            </div>

            {/* STATUS BADGE OR ERROR */}
            {error ? (
              <Alert variant="error" className="mt-2 text-xs">
                {error}
              </Alert>
            ) : status === 'available' ? (
              <p className="text-xs font-medium text-emerald-700 flex items-center gap-1.5 mt-0.5">
                <span>✓</span> Este nombre está libre
              </p>
            ) : (
              <p className="text-[11px] text-slate-500 mt-0.5">
                3 a 20 caracteres: letras minúsculas, números y guion bajo. Otros estudiantes podrán verlo.
              </p>
            )}
          </div>

          {/* SUGGESTIONS PILLS */}
          {suggestions.length > 0 && (
            <div className="p-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl flex flex-col gap-2">
              <span className="text-[11px] font-semibold text-slate-600">
                Alternativas sugeridas basadas en tu nombre:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {suggestions.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => onSelectSuggestion(sug)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#cbd5e1] hover:border-[#1f4e79] hover:bg-[#e7f1fb] text-[#1f4e79] font-medium text-xs rounded-full transition-all"
                  >
                    <span>@{sug}</span>
                    <span className="text-[10px] text-slate-400 font-bold">⊕</span>
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-slate-400">
                Haz clic para seleccionar una alternativa disponible al instante.
              </span>
            </div>
          )}

          {/* ACTIONS */}
          <div className="mt-3 flex flex-col gap-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              loadingText="Guardando tu nombre…"
              disabled={isLoading || !username || charCount < 3 || charCount > 20 || !!error}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              }
            >
              Guardar y continuar
            </Button>

            <button
              type="button"
              onClick={onBack}
              disabled={isLoading}
              className="text-xs font-semibold text-slate-500 hover:text-[#102c40] flex items-center justify-center gap-1.5 py-2 transition-colors disabled:opacity-50"
            >
              <span>←</span> Volver
            </button>
          </div>
        </form>
      </div>

      {/* PRIVACY FOOTER */}
      <div className="flex items-center justify-center gap-2 text-xs text-[#526679] py-1 text-center">
        <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        <span>Tus datos institucionales están protegidos bajo estándares de privacidad universitaria.</span>
      </div>
    </div>
  )
}
