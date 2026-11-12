import { useState } from 'react'
import { useLoginForm } from '../hooks/useLoginForm'
import { LoginForm } from '../components/auth/LoginForm'
import { GoogleConnectingView } from '../components/auth/GoogleConnectingView'
import { RateLimitAlert } from '../components/auth/RateLimitAlert'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { NotionStudyScene } from '../components/auth/NotionStudyScene'

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

        {/* COLUMNA DERECHA: ESCENA DE ESTUDIO ESTILO NOTION (DESKTOP) */}
        <NotionStudyScene />
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
