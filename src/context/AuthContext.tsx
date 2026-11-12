import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { RegisterFormData, RegisterResponse, UserProfile } from '../types/auth'
import { registerUser } from '../services/authService'

interface AuthContextType {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  register: (data: RegisterFormData) => Promise<RegisterResponse>
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
      // Ignore parse errors
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = async (data: RegisterFormData): Promise<RegisterResponse> => {
    const response = await registerUser(data)
    setUser(response.user)
    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user))
    } catch {
      // Storage unavailable
    }
    return response
  }

  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem(AUTH_USER_KEY)
    } catch {
      // Ignore
    }
  }

  const setUserDirectly = (newUser: UserProfile | null) => {
    setUser(newUser)
    if (newUser) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser))
    } else {
      localStorage.removeItem(AUTH_USER_KEY)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        register,
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

