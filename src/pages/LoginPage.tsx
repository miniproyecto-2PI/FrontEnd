import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLoginForm } from '../hooks/useLoginForm'
import { LoginForm } from '../components/auth/LoginForm'
import { GoogleConnectingView } from '../components/auth/GoogleConnectingView'
import { RateLimitAlert } from '../components/auth/RateLimitAlert'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { NotionStudyScene } from '../components/auth/NotionStudyScene'

export function LoginPage() {
  const form = useLoginForm()
  const navigate = useNavigate()
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [isNavigatingToRegister, setIsNavigatingToRegister] = useState(false)

  const isCentering = form.isGoogleConnecting || isNavigatingToRegister || !!form.lockoutUntil

  const handleForgotPassword = () => {
    setShowForgotModal(true)
    setResetSent(false)
  }

  const handleSendReset = () => {
    setResetSent(true)
  }

  const handleNavigateRegister = () => {
    setIsNavigatingToRegister(true)
    setTimeout(() => {
      navigate('/registro')
    }, 280)
  }

  return (
    <main
      id="main-content"
      className="min-h-[calc(100vh-140px)] bg-[#f5faff] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center transition-all duration-500"
    >
      <div
        className={`w-full max-w-5xl transition-all duration-500 ease-out ${
          isCentering
            ? 'flex justify-center items-center'
            : 'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center'
        }`}
      >
        {/* COLUMNA IZQUIERDA: FORMULARIO DE ACCESO (SE DESLIZA HACIA EL CENTRO SUAVEMENTE) */}
        <div
          className={`w-full transition-all duration-500 ease-out flex justify-center ${
            isCentering
              ? 'max-w-[460px] mx-auto'
              : 'lg:col-span-6'
          }`}
        >
          {form.isGoogleConnecting ? (
            <div className="w-full animate-fade-in">
              <GoogleConnectingView onCancel={form.handleCancelGoogle} />
            </div>
          ) : form.lockoutUntil ? (
            <div className="w-full max-w-[460px] animate-fade-in">
              <RateLimitAlert
                lockoutUntil={form.lockoutUntil}
                email={form.formData.email}
                onUnlock={form.handleUnlock}
                onRecoverPassword={handleForgotPassword}
              />
            </div>
          ) : (
            <div className={`w-full transition-all duration-300 ease-out ${isNavigatingToRegister ? 'opacity-80 scale-98' : 'opacity-100'}`}>
              <LoginForm
                form={form}
                onForgotPassword={handleForgotPassword}
                onNavigateRegister={handleNavigateRegister}
              />
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: ESCENA ESTILO NOTION QUE SE DESVANECE SUAVEMENTE */}
        <div
          className={`hidden lg:block transition-all duration-500 ease-out ${
            isCentering
              ? 'lg:col-span-0 w-0 opacity-0 translate-x-12 scale-95 pointer-events-none overflow-hidden m-0 p-0'
              : 'lg:col-span-6 w-full opacity-100 translate-x-0 scale-100'
          }`}
        >
          <NotionStudyScene isFadingOut={isCentering} />
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
