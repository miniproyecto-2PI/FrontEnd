import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLoginForm } from '../hooks/useLoginForm'
import { LoginForm } from '../components/auth/LoginForm'
import { GoogleConnectingView } from '../components/auth/GoogleConnectingView'
import { RateLimitAlert } from '../components/auth/RateLimitAlert'
import { NotionStudyScene } from '../components/auth/NotionStudyScene'

export function LoginPage() {
  const form = useLoginForm()
  const navigate = useNavigate()
  const [isNavigatingToRegister, setIsNavigatingToRegister] = useState(false)

  const isCentering = form.isGoogleConnecting || isNavigatingToRegister || !!form.lockoutUntil

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
        className={`w-full max-w-6xl transition-all duration-500 ease-out ${
          isCentering
            ? 'flex justify-center items-center'
            : 'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center'
        }`}
      >
        {/* COLUMNA IZQUIERDA: FORMULARIO DE ACCESO (SE DESLIZA HACIA EL CENTRO SUAVEMENTE) */}
        <div
          className={`w-full transition-all duration-500 ease-out flex justify-center ${
            isCentering
              ? 'max-w-[460px] mx-auto'
              : 'lg:col-span-5'
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
                onSwitchAccount={form.handleSwitchAccount}
              />
            </div>
          ) : (
            <div className={`w-full transition-all duration-300 ease-out ${isNavigatingToRegister ? 'opacity-80 scale-98' : 'opacity-100'}`}>
              <LoginForm
                form={form}
                onNavigateRegister={handleNavigateRegister}
              />
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: ESCENA ESTILO NOTION INTEGRADA CON EL FONDO */}
        <div
          className={`hidden lg:block transition-all duration-500 ease-out ${
            isCentering
              ? 'lg:col-span-0 w-0 opacity-0 translate-x-12 scale-95 pointer-events-none overflow-hidden m-0 p-0'
              : 'lg:col-span-7 w-full opacity-100 translate-x-0 scale-100'
          }`}
        >
          <NotionStudyScene isFadingOut={isCentering} />
        </div>
      </div>

    </main>
  )
}
