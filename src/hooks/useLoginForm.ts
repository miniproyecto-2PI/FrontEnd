import { useRef, useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  AuthError,
  getFailedAttempts,
  resetFailedAttempts,
} from '../services/authService'
import { validateEmail } from '../utils/validators'

export interface LoginFormState {
  email: string
  password: string
  rememberMe: boolean
}

export interface UseLoginFormReturn {
  formData: LoginFormState
  errors: {
    email?: string
    password?: string
  }
  generalAlert: {
    variant: 'error' | 'warning' | 'info' | 'success'
    title?: string
    message: string
    action?: 'retry'
  } | null
  isLoading: boolean
  isGoogleConnecting: boolean
  lockoutUntil: number | null
  refs: {
    email: React.RefObject<HTMLInputElement | null>
    password: React.RefObject<HTMLInputElement | null>
  }
  handleChange: (field: keyof LoginFormState, value: string | boolean) => void
  handleSubmit: (e?: FormEvent) => Promise<void>
  handleGoogleSignIn: () => Promise<void>
  handleCancelGoogle: () => void
  handleUnlock: () => void
  handleSwitchAccount: () => void
  setGeneralAlert: React.Dispatch<
    React.SetStateAction<{
      variant: 'error' | 'warning' | 'info' | 'success'
      title?: string
      message: string
      action?: 'retry'
    } | null>
  >
}

export function useLoginForm(): UseLoginFormReturn {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loginWithGoogle, isAuthenticated, profileComplete } = useAuth()

  const [formData, setFormData] = useState<LoginFormState>({
    email: '',
    password: '',
    rememberMe: true,
  })

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [generalAlert, setGeneralAlert] = useState<{
    variant: 'error' | 'warning' | 'info' | 'success'
    title?: string
    message: string
    action?: 'retry'
  } | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleConnecting, setIsGoogleConnecting] = useState(false)
  const [isSwitchingAccount, setIsSwitchingAccount] = useState(false)
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(() => {
    const failed = getFailedAttempts()
    return failed.lockoutUntil && Date.now() < failed.lockoutUntil ? failed.lockoutUntil : null
  })

  const refs = {
    email: useRef<HTMLInputElement | null>(null),
    password: useRef<HTMLInputElement | null>(null),
  }

  // Si ya está autenticado al cargar la página, redirigir adecuadamente
  useEffect(() => {
    if (isAuthenticated) {
      if (profileComplete) {
        navigate('/panel', { replace: true })
      } else {
        navigate('/elegir-usuario', { replace: true })
      }
    }
  }, [isAuthenticated, profileComplete, navigate])

  // Desbloqueo rápido mediante parámetro de URL (?reset=true o ?unlock=true) para pruebas
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('reset') === 'true' || params.get('unlock') === 'true') {
      handleUnlock()
    }
  }, [location.search])

  const handleChange = (field: keyof LoginFormState, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
    if (generalAlert) {
      setGeneralAlert(null)
    }
  }

  const getRedirectPath = (): string => {
    const state = location.state as { from?: { pathname?: string } } | undefined
    return state?.from?.pathname || '/panel'
  }

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault()

    // Validar campos vacíos en cliente
    const nextErrors: { email?: string; password?: string } = {}
    if (!formData.email.trim()) {
      nextErrors.email = 'Escribe tu correo electrónico.'
    } else {
      const emailFormatErr = validateEmail(formData.email)
      if (emailFormatErr) nextErrors.email = emailFormatErr
    }

    if (!formData.password) {
      nextErrors.password = 'Ingresa tu contraseña.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setGeneralAlert({
        variant: 'error',
        title: 'Por favor corrige los campos señalados para continuar',
        message: 'Revisa los datos marcados a continuación para acceder a tu cuenta.',
      })
      if (nextErrors.email) refs.email.current?.focus()
      else if (nextErrors.password) refs.password.current?.focus()
      return
    }

    setErrors({})
    setGeneralAlert(null)
    setIsLoading(true)

    try {
      const user = await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      })

      setIsLoading(false)

      // Criterio US-02/US-03: Redirección al panel o a la ruta solicitada
      const target = getRedirectPath()
      if (user.profileComplete) {
        navigate(target, { replace: true })
      } else {
        navigate('/elegir-usuario', { replace: true })
      }
    } catch (err) {
      setIsLoading(false)
      if (err instanceof AuthError) {
        if (err.code === 'TOO_MANY_ATTEMPTS') {
          const failed = getFailedAttempts()
          setIsSwitchingAccount(false)
          setLockoutUntil(failed.lockoutUntil || Date.now() + 15 * 60 * 1000)
          setGeneralAlert({
            variant: 'error',
            title: 'Acceso suspendido temporalmente',
            message: 'Demasiados intentos. Espera un momento e intenta de nuevo.',
          })
          return
        }

        if (err.code === 'INVALID_CREDENTIALS') {
          setGeneralAlert({
            variant: 'error',
            message: 'El correo o la contraseña no coinciden. Revisá ambos datos e intentá de nuevo.',
          })
          return
        }

        if (err.code === 'NETWORK_ERROR') {
          setGeneralAlert({
            variant: 'error',
            title: 'Error de conexión',
            message: 'No pudimos conectar. Revisa tu conexión.',
            action: 'retry',
          })
          return
        }

        setGeneralAlert({
          variant: 'error',
          message: err.message,
        })
      } else {
        setGeneralAlert({
          variant: 'error',
          title: 'Error de conexión',
          message: 'No pudimos conectar. Revisa tu conexión.',
          action: 'retry',
        })
      }
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleConnecting(true)
    setGeneralAlert(null)

    try {
      const result = await loginWithGoogle()
      setIsGoogleConnecting(false)

      const target = getRedirectPath()
      // Criterio US-03: Login con Google recurrente lleva directo al dashboard
      if (result.user.profileComplete && !result.isNewUser) {
        navigate(target, { replace: true })
      } else {
        // Criterio US-02: Si no tiene username, redirige a /elegir-usuario
        navigate('/elegir-usuario', { replace: true })
      }
    } catch (err) {
      setIsGoogleConnecting(false)
      if (err instanceof AuthError) {
        setGeneralAlert({
          variant: 'error',
          message: err.message,
          action: 'retry',
        })
      } else {
        setGeneralAlert({
          variant: 'error',
          message: 'No pudimos conectar con Google. Intenta de nuevo.',
        })
      }
    }
  }

  const handleCancelGoogle = () => {
    setIsGoogleConnecting(false)
  }

  const handleUnlock = () => {
    resetFailedAttempts()
    setIsSwitchingAccount(false)
    setLockoutUntil(null)
    setGeneralAlert(null)
  }

  const handleSwitchAccount = () => {
    setFormData({ email: '', password: '', rememberMe: true })
    setErrors({})
    setGeneralAlert(null)
    setIsSwitchingAccount(true)
  }

  return {
    formData,
    errors,
    generalAlert,
    isLoading,
    isGoogleConnecting,
    lockoutUntil: isSwitchingAccount ? null : lockoutUntil,
    refs,
    handleChange,
    handleSubmit,
    handleGoogleSignIn,
    handleCancelGoogle,
    handleUnlock,
    handleSwitchAccount,
    setGeneralAlert,
  }
}

