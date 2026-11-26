import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { StudyRoom } from '../components/rooms/StudyRoom'
import { ApiError } from '../services/apiErrors'
import { getRoom } from '../services/roomService'
import type { Room } from '../services/roomService'
import './RoomPage.css'

type RoomState =
  | { status: 'loading' }
  | { status: 'not-found' }
  | { status: 'error' }
  | { status: 'ready'; room: Room }

const backLinkClass =
  'inline-flex min-h-11 items-center gap-2 rounded-lg px-1 text-sm font-semibold text-[#1f4e79]! hover:underline underline-offset-4'

export function RoomPage() {
  const { id = '' } = useParams()
  const roomId = id.trim().toUpperCase()
  return <RoomPageContent key={roomId} roomId={roomId} />
}

function RoomPageContent({ roomId }: { roomId: string }) {
  const location = useLocation()
  const { user } = useAuth()
  const navState = location.state as { created?: boolean; room?: Room } | null
  const justCreated = Boolean(navState?.created)
  const main = useRef<HTMLElement>(null)

  const [state, setState] = useState<RoomState>(() =>
    navState?.room?.id === roomId ? { status: 'ready', room: navState.room } : { status: 'loading' }
  )
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (attempt === 0 && navState?.room?.id === roomId) return // recién creada: ya la tenemos
    const controller = new AbortController()
    setState({ status: 'loading' })
    getRoom(roomId, controller.signal)
      .then((room) => {
        if (!controller.signal.aborted) setState({ status: 'ready', room })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        if (error instanceof ApiError && (error.code === 'NOT_FOUND' || error.code === 'ROOM_NOT_FOUND' || error.status === 404)) {
          setState({ status: 'not-found' })
          return
        }
        setState({ status: 'error' })
      })
    return () => controller.abort()
    // navState solo cuenta en la primera carga
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, attempt])

  useEffect(() => {
    if (state.status === 'ready') return
    document.title = `${state.status === 'not-found' ? 'Sala no encontrada' : 'Sala'} | Estudiemos`
    if (state.status !== 'loading') main.current?.focus()
  }, [state.status])

  return (
    <main ref={main} id="main-content" tabIndex={-1} className="min-h-[calc(100vh-140px)] bg-[#F5FAFF] px-4 py-6 sm:px-6 lg:px-12 focus:outline-none">
      <div className="mx-auto flex max-w-[1160px] flex-col gap-4">
        {state.status === 'loading' && <Link to="/panel" className={backLinkClass}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m6 6l-6-6 6-6" />
          </svg>
          Volver al panel
        </Link>}

        {state.status === 'loading' && (
          <div role="status" className="rounded-2xl border border-[#C2C6D5] bg-white p-8">
            <span className="sr-only">Cargando la sala…</span>
            <div aria-hidden="true" className="flex flex-col gap-4">
              <div className="h-6 w-28 rounded-full bg-[#dbe7f0] motion-safe:animate-pulse" />
              <div className="h-9 w-2/3 rounded-md bg-[#dbe7f0] motion-safe:animate-pulse" />
              <div className="h-20 rounded-xl bg-[#EAF5FF] motion-safe:animate-pulse" />
            </div>
          </div>
        )}

        {state.status === 'not-found' && (
          <section aria-labelledby="not-found-title" className="rounded-2xl border border-[#C2C6D5] bg-white px-6 py-12 text-center">
            <h1 id="not-found-title" className="text-2xl sm:text-3xl font-bold text-[#001E2D] font-['Plus_Jakarta_Sans',sans-serif]">
              No encontramos esta sala
            </h1>
            <p className="mx-auto mt-3 max-w-md text-base text-[#424753]">
              No encontramos una sala con el ID <strong className="font-mono tracking-wider text-[#001E2D]">{roomId}</strong>.
              Revisa que esté bien escrito o pide a tu grupo que te lo comparta de nuevo.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/panel" className="button">Ir al panel</Link>
              <Link to="/salas/nueva" className="study-exit">Crear una sala</Link>
            </div>
          </section>
        )}

        {state.status === 'error' && (
          <section role="alert" aria-labelledby="room-error-title" className="rounded-2xl border border-[#C2C6D5] bg-white px-6 py-12 text-center">
            <span aria-hidden="true" className="mx-auto grid size-12 place-items-center rounded-full bg-[#ffdad6] text-[#BA1A1A]">
              <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
              </svg>
            </span>
            <h1 id="room-error-title" className="mt-4 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold text-[#001E2D] sm:text-3xl">No pudimos abrir la sala</h1>
            <p className="mx-auto mt-3 max-w-md text-[#424753]">Revisa tu conexión e inténtalo de nuevo. La sala y sus mensajes siguen guardados.</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button onClick={() => setAttempt((n) => n + 1)}>Reintentar</Button>
              <Link to="/panel" className="study-exit">Ir al panel</Link>
            </div>
          </section>
        )}

        {state.status === 'ready' && user && <StudyRoom initialRoom={state.room} justCreated={justCreated}
          viewer={{ uid: user.uid, name: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || 'Tú',
            avatar: user.avatarUrl ?? user.avatar }}
          onMissing={() => setState({ status: 'not-found' })} />}
      </div>
    </main>
  )
}
