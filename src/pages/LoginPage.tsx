import { useState } from 'react'
import { useLoginForm } from '../hooks/useLoginForm'
import { LoginForm } from '../components/auth/LoginForm'
import { GoogleConnectingView } from '../components/auth/GoogleConnectingView'
import { RateLimitAlert } from '../components/auth/RateLimitAlert'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { PRESET_AVATARS } from '../constants/avatars'

export function LoginPage() {
  const form = useLoginForm()
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const handleForgotPassword = () => {
    setShowForgotModal(true)
    setResetSent(false)
  }

  const handleSendReset = () => {
    setResetSent(true)
  }

  return (
    <main
      id="main-content"
      className="min-h-[calc(100vh-140px)] bg-[#f5faff] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center"
    >
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* COLUMNA IZQUIERDA: FORMULARIO DE ACCESO */}
        <div className="w-full lg:col-span-6 flex justify-center">
          {form.isGoogleConnecting ? (
            <GoogleConnectingView onCancel={form.handleCancelGoogle} />
          ) : form.lockoutUntil ? (
            <div className="w-full max-w-[460px]">
              <RateLimitAlert
                lockoutUntil={form.lockoutUntil}
                email={form.formData.email}
                onUnlock={form.handleUnlock}
                onRecoverPassword={handleForgotPassword}
              />
            </div>
          ) : (
            <LoginForm form={form} onForgotPassword={handleForgotPassword} />
          )}
        </div>

        {/* COLUMNA DERECHA: PANEL LATERAL REACTIVO CON AMBIENTE DE SALAS (DESKTOP) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-between p-8 sm:p-10 rounded-3xl bg-linear-to-br from-[#102c40] via-[#163a5a] to-[#1f4e79] text-white shadow-xl relative overflow-hidden min-h-[560px]">
          {/* SUTILES ELEMENTOS GEOMÉTRICOS DE FONDO */}
          <div
            className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-cyan-400/5 blur-2xl pointer-events-none"
            aria-hidden="true"
          />

          {/* TOP TAG & ESTADO EN VIVO */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-xs border border-white/15">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              Red Universitaria Activa
            </span>
            <span className="text-xs text-white/70 font-mono">
              128 estudiantes en vivo
            </span>
          </div>

          {/* TARJETA INTERACTIVA DE PREVISUALIZACIÓN DE SALA EN TIEMPO REAL */}
          <div className="relative z-10 my-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col gap-4 shadow-lg hover:border-white/30 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono tracking-wider uppercase text-cyan-200 font-semibold">
                  Sala de concentración #04
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Cálculo Vectorial & Ecuaciones
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[11px] font-medium shrink-0">
                ● En sesión
              </span>
            </div>

            {/* AVATARES DE ESTUDIANTES ACTIVOS EN LA SALA */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="flex items-center -space-x-2 overflow-hidden">
                {PRESET_AVATARS.slice(0, 4).map((av) => (
                  <div
                    key={av.id}
                    title={av.label}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-[#163a5a] flex items-center justify-center text-xs shadow-xs"
                    style={{ backgroundColor: av.bgColor, color: av.textColor }}
                  >
                    {av.icon}
                  </div>
                ))}
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-[11px] font-bold text-white ring-2 ring-[#163a5a]">
                  +3
                </span>
              </div>

              {/* TEMPORIZADOR POMODORO EN VIVO */}
              <div className="flex items-center gap-2 bg-black/20 rounded-lg px-2.5 py-1 text-xs font-mono text-cyan-100 border border-white/10">
                <svg className="w-3.5 h-3.5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <path strokeLinecap="round" d="M12 6v6l4 2" />
                </svg>
                <span>24:15 min</span>
              </div>
            </div>

            {/* CHIPS DE MATERIAS & APUNTES */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-white/80">
              <span className="px-2 py-0.5 rounded bg-white/10 border border-white/10">#integrales-dobles</span>
              <span className="px-2 py-0.5 rounded bg-white/10 border border-white/10">#teorema-de-green</span>
              <span className="text-white/50 text-[10px] ml-auto">Pizarra sincronizada</span>
            </div>
          </div>

          {/* CITA ACADÉMICA / DECLARACIÓN DE PROPÓSITO */}
          <div className="relative z-10 pt-4 border-t border-white/15">
            <p className="text-xs sm:text-sm text-white/90 italic leading-relaxed">
              «El estudio colaborativo transforma la complejidad de las materias en entendimiento compartido y proyectos concluidos.»
            </p>
            <p className="text-[11px] font-semibold text-cyan-200 mt-2">
              Plataforma académica diseñada para estudiantes universitarios
            </p>
          </div>
        </div>
      </div>

      {/* MODAL RECUPERAR CONTRASEÑA */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Recuperar contraseña"
      >
        <p className="text-xs text-[#526679] leading-relaxed mb-4">
          Te enviaremos un enlace seguro a tu correo para restablecer tu acceso a Estudiemos.
        </p>
        {resetSent ? (
          <div className="flex flex-col gap-4 text-center py-2">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
              ✓
            </div>
            <p className="text-xs sm:text-sm text-[#102c40]">
              Si la cuenta existe en nuestra plataforma, hemos enviado las instrucciones a tu correo institucional.
            </p>
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => setShowForgotModal(false)}
            >
              Entendido
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 pt-1">
            <p className="text-xs text-[#526679]">
              Ingresa el correo con el que te registraste para recibir el enlace de recuperación:
            </p>
            <input
              type="email"
              placeholder="ejemplo@universidad.edu.co"
              defaultValue={form.formData.email}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#1f4e79]"
            />
            <div className="flex gap-2 justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowForgotModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSendReset}
              >
                Enviar enlace
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  )
}
