import { useEffect, useRef, useState } from 'react'
import type { FormEvent, RefObject } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PRESET_AVATARS } from '../constants/avatars'
import { AuthError, checkUsernameAvailability } from '../services/authService'
import type { FormErrors, RegisterFormData, UserProfile } from '../types/auth'
import {
  getUniversityName,
  validateRegisterForm,
  validateUsername,
} from '../utils/validators'

export interface GeneralAlertState {
  variant: 'error' | 'warning' | 'info'
  title?: string
  message: string
  action?: 'retry' | 'login'
}

export type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken'

export interface UseRegisterFormReturn {
  formData: RegisterFormData
  errors: FormErrors
  generalAlert: GeneralAlertState | null
  isLoading: boolean
  successUser: UserProfile | null
  usernameStatus: UsernameStatus
  detectedUniversity: string | null
  step: 1 | 2
  refs: {
    nombres: RefObject<HTMLInputElement | null>
    apellidos: RefObject<HTMLInputElement | null>
    username: RefObject<HTMLInputElement | null>
    email: RefObject<HTMLInputElement | null>
    password: RefObject<HTMLInputElement | null>
    confirmPassword: RefObject<HTMLInputElement | null>
  }
  handleChange: (field: keyof RegisterFormData, value: string) => void
  handleUsernameBlur: () => Promise<void>
  handleNextStep: () => Promise<void>
  handlePrevStep: () => void
  handleSubmit: (e?: FormEvent) => Promise<void>
  setGeneralAlert: (alert: GeneralAlertState | null) => void
  dismissAlert: () => void
}

export function useRegisterForm(): UseRegisterFormReturn {
  const navigate = useNavigate()
  const { register, isAuthenticated } = useAuth()

  // Form Data State
  const [formData, setFormData] = useState<RegisterFormData>({
    nombres: '',
    apellidos: '',
    username: '',
    email: '',
    avatar: PRESET_AVATARS[0].id,
    password: '',
    confirmPassword: '',
  })

  // Status & Feedback States
  const [errors, setErrors] = useState<FormErrors>({})
  const [generalAlert, setGeneralAlert] = useState<GeneralAlertState | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [successUser, setSuccessUser] = useState<UserProfile | null>(null)
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle')
  const [detectedUniversity, setDetectedUniversity] = useState<string | null>(null)
  const [step, setStep] = useState<1 | 2>(1)

  // Focusable Field References
  const nombresRef = useRef<HTMLInputElement>(null)
  const apellidosRef = useRef<HTMLInputElement>(null)
  const usernameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef = useRef<HTMLInputElement>(null)

  // If already authenticated and not in success view, redirect to panel
  useEffect(() => {
    if (isAuthenticated && !successUser) {
      navigate('/panel', { replace: true })
    }
  }, [isAuthenticated, successUser, navigate])

  // Real-time University Detection
  useEffect(() => {
    const uni = getUniversityName(formData.email)
    setDetectedUniversity(uni)
  }, [formData.email])

  const focusFirstErrorField = (field: keyof RegisterFormData) => {
    const refMap: Partial<Record<keyof RegisterFormData, RefObject<HTMLInputElement | null>>> = {
      nombres: nombresRef,
      apellidos: apellidosRef,
      username: usernameRef,
      email: emailRef,
      password: passwordRef,
      confirmPassword: confirmPasswordRef,
    }
    const targetRef = refMap[field]
    if (targetRef?.current) {
      targetRef.current.focus()
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  // Real-time Username Availability Check on Blur
  const handleUsernameBlur = async () => {
    const error = validateUsername(formData.username)
    if (error) {
      setErrors((prev) => ({ ...prev, username: error }))
      setUsernameStatus('idle')
      return
    }

    setUsernameStatus('checking')
    try {
      const isAvailable = await checkUsernameAvailability(formData.username)
      if (isAvailable) {
        setUsernameStatus('available')
        setErrors((prev) => {
          const next = { ...prev }
          delete next.username
          return next
        })
      } else {
        setUsernameStatus('taken')
        setErrors((prev) => ({
          ...prev,
          username: 'Este nombre de usuario ya está en uso, prueba con otro.',
        }))
      }
    } catch {
      setUsernameStatus('idle')
    }
  }

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear specific field error as user types
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
    if (generalAlert?.action !== 'retry') {
      setGeneralAlert(null)
    }
  }

  const dismissAlert = () => setGeneralAlert(null)

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault()
    setGeneralAlert(null)

    // 1. Client-Side Validation
    const { isValid, errors: validationErrors, firstErrorField } = validateRegisterForm(formData)

    if (!isValid) {
      setErrors(validationErrors)
      const count = Object.keys(validationErrors).length
      setGeneralAlert({
        variant: 'error',
        title: `Por favor corrige ${count} ${count === 1 ? 'campo' : 'campos'} para continuar`,
        message: 'Revisa los campos señalados a continuación. Conservamos tu información para que solo corrijas los datos con observaciones.',
      })
      if (firstErrorField) {
        focusFirstErrorField(firstErrorField)
      }
      return
    }

    // 2. Submit Execution (Loading State)
    setIsLoading(true)

    try {
      const response = await register(formData)
      // 3. Success State
      setSuccessUser(response.user)
      setIsLoading(false)
    } catch (err: unknown) {
      setIsLoading(false)

      if (err instanceof AuthError) {
        if (err.code === 'USERNAME_TAKEN') {
          setErrors((prev) => ({
            ...prev,
            username: 'Este nombre de usuario ya está en uso, prueba con otro.',
          }))
          setGeneralAlert({
            variant: 'error',
            title: 'Nombre de usuario no disponible',
            message: 'El nombre de usuario ingresado ya pertenece a otra cuenta. Por favor elige uno diferente.',
          })
          focusFirstErrorField('username')
          return
        }

        if (err.code === 'EMAIL_ALREADY_IN_USE') {
          setErrors((prev) => ({
            ...prev,
            email: 'Este correo ya tiene una cuenta. ¿Quieres iniciar sesión?',
          }))
          setGeneralAlert({
            variant: 'warning',
            title: 'Conflicto de autenticación',
            message: 'Este correo institucional ya tiene una cuenta activa en Estudiemos.',
            action: 'login',
          })
          focusFirstErrorField('email')
          return
        }

        if (err.code === 'NETWORK_ERROR') {
          setGeneralAlert({
            variant: 'error',
            title: 'Error de conexión',
            message: 'No pudimos conectarnos con el servidor. Revisa tu conexión a internet e inténtalo nuevamente.',
            action: 'retry',
          })
          return
        }

        setGeneralAlert({
          variant: 'error',
          title: 'Error en el registro',
          message: err.message,
        })
      } else {
        setGeneralAlert({
          variant: 'error',
          title: 'Error de conexión',
          message: 'No pudimos conectarnos con el servidor. Revisa tu conexión a internet e inténtalo nuevamente.',
          action: 'retry',
        })
      }
    }
  }

  const handleNextStep = async () => {
    const stepErrors: FormErrors = {}
    if (!formData.nombres.trim()) stepErrors.nombres = 'Ingresa tus nombres.'
    if (!formData.apellidos.trim()) stepErrors.apellidos = 'Ingresa tus apellidos.'
    const userErr = validateUsername(formData.username)
    if (userErr) stepErrors.username = userErr
    if (!formData.avatar) stepErrors.avatar = 'Selecciona un avatar.'

    if (Object.keys(stepErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...stepErrors }))
      if (stepErrors.nombres) nombresRef.current?.focus()
      else if (stepErrors.apellidos) apellidosRef.current?.focus()
      else if (stepErrors.username) usernameRef.current?.focus()
      return
    }

    setUsernameStatus('checking')
    try {
      const isFree = await checkUsernameAvailability(formData.username)
      if (!isFree) {
        setUsernameStatus('taken')
        setErrors((prev) => ({
          ...prev,
          username: 'Este nombre de usuario ya está en uso, prueba con otro.',
        }))
        usernameRef.current?.focus()
        return
      }
      setUsernameStatus('available')
      setErrors({})
      setGeneralAlert(null)
      setStep(2)
      setTimeout(() => emailRef.current?.focus(), 50)
    } catch {
      setUsernameStatus('idle')
      setStep(2)
    }
  }

  const handlePrevStep = () => {
    setStep(1)
    setGeneralAlert(null)
  }

  return {
    formData,
    errors,
    generalAlert,
    isLoading,
    successUser,
    usernameStatus,
    detectedUniversity,
    step,
    refs: {
      nombres: nombresRef,
      apellidos: apellidosRef,
      username: usernameRef,
      email: emailRef,
      password: passwordRef,
      confirmPassword: confirmPasswordRef,
    },
    handleChange,
    handleUsernameBlur,
    handleNextStep,
    handlePrevStep,
    handleSubmit,
    setGeneralAlert,
    dismissAlert,
  }
}
