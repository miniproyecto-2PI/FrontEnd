import { useCallback, useEffect, useState } from 'react'
import type { UserProfile } from '../types/auth'
import { useAuth } from '../context/AuthContext'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { ProfileEditor } from '../components/profile/ProfileEditor'
import { ProfileSkeleton } from '../components/profile/ProfileSkeleton'
import { ApiError } from '../services/apiErrors'
import { getMyProfile } from '../services/userService'

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; profile: UserProfile }

/** US-04 · /perfil: ver y editar los datos del estudiante (GET y PATCH /api/users/me). */
export function ProfilePage() {
  const { setUserDirectly } = useAuth()
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setState({ status: 'loading' })
    getMyProfile(controller.signal)
      .then((profile) => {
        setState({ status: 'ready', profile })
        setUserDirectly(profile)
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        const message = error instanceof ApiError ? error.message : 'Ocurrió un error inesperado.'
        setState({ status: 'error', message })
      })
    return () => controller.abort()
    // setUserDirectly cambia en cada render del AuthProvider; solo se recarga al reintentar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt])

  const handleSaved = useCallback((profile: UserProfile) => setUserDirectly(profile), [setUserDirectly])

  return (
    <main id="main-content" tabIndex={-1} className="min-h-[calc(100vh-140px)] bg-[#F5FAFF] px-4 py-10 sm:px-6 lg:px-12 focus:outline-none">
      <div className="mx-auto max-w-[1200px]">
        <header className="mb-8">
          <h1 className="text-[28px] leading-9 sm:text-4xl sm:leading-[44px] font-bold tracking-[-0.015em] text-[#00375e] font-['Plus_Jakarta_Sans',sans-serif]">
            Mi Perfil
          </h1>
          <p className="mt-2 text-base sm:text-lg text-[#424753]">
            Consulta y actualiza tu información personal en Estudiemos.
          </p>
        </header>

        {state.status === 'loading' && <ProfileSkeleton />}

        {state.status === 'error' && (
          <Alert
            variant="error"
            title="No pudimos cargar tu perfil"
            action={
              <Button size="sm" variant="outline" onClick={() => setAttempt((n) => n + 1)}>
                Reintentar
              </Button>
            }
          >
            {state.message}
          </Alert>
        )}

        {state.status === 'ready' && (
          <ProfileEditor key={state.profile.uid} profile={state.profile} onSaved={handleSaved} />
        )}
      </div>
    </main>
  )
}
