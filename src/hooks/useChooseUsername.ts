import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  AuthError,
  checkUsernameAvailability,
  generateUsernameSuggestions,
} from '../services/authService'
import { validateUsername } from '../utils/validators'
import type { UserProfile } from '../types/auth'

export function useChooseUsername() {
  const navigate = useNavigate()
  const { user, completeUsername, cancelGoogleAuth, isAuthenticated, profileComplete } = useAuth()

  const [username, setUsername] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [error, setError] = useState<string | undefined>(undefined)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)
  const [successUser, setSuccessUser] = useState<UserProfile | null>(null)

  // Redirigir si no está autenticado o si el perfil ya está completo
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/ingresar', { replace: true })
      return
    }
    if (profileComplete && !successUser) {
      navigate('/panel', { replace: true })
    }
  }, [isAuthenticated, profileComplete, user, successUser, navigate])

  // Cargar sugerencias inteligentes al montar
  useEffect(() => {
    if (!user) return
    let isMounted = true
    void generateUsernameSuggestions(`${user.firstName} ${user.lastName}`, user.email).then((sugs) => {
      if (isMounted) setSuggestions(sugs)
    })
    return () => {
      isMounted = false
    }
  }, [user])

  // Validación de disponibilidad con debounce al escribir
  useEffect(() => {
    if (!username.trim()) {
      setStatus('idle')
      setError(undefined)
      return
    }

    const formatError = validateUsername(username)
    if (formatError) {
      setError(formatError)
      setStatus('idle')
      return
    }

    setError(undefined)
    setStatus('checking')

    const timer = setTimeout(async () => {
      try {
        const isFree = await checkUsernameAvailability(username)
        if (isFree) {
          setStatus('available')
          setError(undefined)
        } else {
          setStatus('taken')
          setError('El nombre @' + username + ' ya está en uso. Elige uno diferente o prueba una sugerencia.')
        }
      } catch {
        setStatus('idle')
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [username])

  const handleSelectSuggestion = (suggestion: string) => {
    setUsername(suggestion)
    setError(undefined)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const validationError = validateUsername(username)
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)
    setError(undefined)

    try {
      const updatedUser = await completeUsername(username)
      setSuccessUser(updatedUser)
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      if (err instanceof AuthError) {
        if (err.code === 'USERNAME_TAKEN') {
          setStatus('taken')
          setError('El nombre @' + username + ' ya está en uso. Elige uno diferente o prueba una sugerencia.')
          return
        }
        setError(err.message)
      } else {
        setError('No pudimos conectar con el servidor para verificar tu nombre. Intenta de nuevo.')
      }
    }
  }

  const handleConfirmExit = () => {
    cancelGoogleAuth()
    setShowExitModal(false)
    navigate('/ingresar', { replace: true })
  }

  return {
    user,
    username,
    setUsername,
    status,
    error,
    suggestions,
    isLoading,
    showExitModal,
    setShowExitModal,
    successUser,
    handleSelectSuggestion,
    handleSubmit,
    handleConfirmExit,
  }
}

