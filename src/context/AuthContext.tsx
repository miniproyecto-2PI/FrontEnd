import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { GoogleAuthResult, RegisterFormData, RegisterResponse, UserProfile } from '../types/auth'
import {
  completeGoogleUsernameService,
  registerUser,
  signInWithGoogleService,
} from '../services/authService'

interface AuthContextType {
  user: UserProfile | null
  isAuthenticated: boolean
  profileComplete: boolean
  isLoading: boolean
  register: (data: RegisterFormData) => Promise<RegisterResponse>
  loginWithGoogle: () => Promise<GoogleAuthResult>
  completeUsername: (username: string) => Promise<UserProfile>
  cancelGoogleAuth: () => void
  logout: () => void
  setUserDirectly: (user: UserProfile | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_USER_KEY = 'estudiemos_active_session'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY)
      if (stored) {
        setUser(JSON.parse(stored) as UserProfile)
      }
    } catch {
      // Storage unavailable
    } finally {
      setIsLoading(false)
    }
  }, [])

  const persistUser = (newUser: UserProfile | null) => {
    setUser(newUser)
    try {
      if (newUser) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser))
      } else {
        localStorage.removeItem(AUTH_USER_KEY)
      }
    } catch {
      // Storage quota or error
    }
  }

  const register = async (data: RegisterFormData): Promise<RegisterResponse> => {
    const response = await registerUser(data)
    persistUser(response.user)
    return response
  }

  const loginWithGoogle = async (): Promise<GoogleAuthResult> => {
    const result = await signInWithGoogleService()
    persistUser(result.user)
    return result
  }

  const completeUsername = async (username: string): Promise<UserProfile> => {
    if (!user) throw new Error('No hay una sesión activa para completar el nombre de usuario.')
    const updated = await completeGoogleUsernameService(username, user)
    persistUser(updated)
    return updated
  }

  const cancelGoogleAuth = () => {
    persistUser(null)
  }

  const logout = () => {
    persistUser(null)
  }

  const setUserDirectly = (newUser: UserProfile | null) => {
    persistUser(newUser)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        profileComplete: Boolean(user?.profileComplete),
        isLoading,
        register,
        loginWithGoogle,
        completeUsername,
        cancelGoogleAuth,
        logout,
        setUserDirectly,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider')
  }
  return context
}
