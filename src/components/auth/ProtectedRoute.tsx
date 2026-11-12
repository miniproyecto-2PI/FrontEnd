import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../../context/AuthContext'

export interface ProtectedRouteProps {
  children: ReactNode
}

/**
 * Guard de rutas privadas (S1-C04, US-02):
 * 1. Si no hay sesión -> redirige a /ingresar
 * 2. Si hay sesión pero profileComplete === false -> redirige a /elegir-usuario
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isAuthenticated, profileComplete, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <main id="main-content" className="page-shell">
        <div className="flex flex-col items-center justify-center p-12 text-center" role="status">
          <div className="w-8 h-8 border-3 border-[#1f4e79] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm font-medium text-[#526679]">Verificando estado de la sesión…</p>
        </div>
      </main>
    )
  }

  // Si no está autenticado, no puede abrir pantallas privadas
  if (!isAuthenticated || !user) {
    return <Navigate to="/ingresar" state={{ from: location }} replace />
  }

  // Criterio US-02: Bloquea toda ruta privada mientras profileComplete sea false
  if (!profileComplete) {
    return <Navigate to="/elegir-usuario" replace />
  }

  return <>{children}</>
}
