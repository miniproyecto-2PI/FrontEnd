import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { CopyRoomIdButton } from '../components/rooms/CopyRoomIdButton'
import { HostBadge } from '../components/rooms/RoomCard'
import { ApiError } from '../services/apiErrors'
import { getRoom } from '../services/roomService'
import type { Room } from '../services/roomService'
import { formatRoomDate } from '../utils/rooms'

type RoomState =
  | { status: 'loading' }
  | { status: 'not-found' }
  | { status: 'error'; message: string }
  | { status: 'ready'; room: Room }

const backLinkClass =
  'inline-flex min-h-11 items-center gap-2 rounded-lg px-1 text-sm font-semibold text-[#1f4e79]! hover:underline underline-offset-4'

/**
 * US-06 · /salas/:id — interior mínimo de la sala (nombre, ID y rol). El chat, la
 * presencia y la videollamada se agregan en los Sprints 3 y 4.
 */
export function RoomPage() {
  const { id = '' } = useParams()
  const roomId = id.trim().toUpperCase()
  const location = useLocation()
  const { user } = useAuth()
  const navState = location.state as { created?: boolean; room?: Room } | null
  const justCreated = Boolean(navState?.created)
  const headingRef = useRef<HTMLHeadingElement>(null)

  const [state, setState] = useState<RoomState>(() =>
    navState?.room?.id === roomId ? { status: 'ready', room: navState.room } : { status: 'loading' }
  )
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (attempt === 0 && navState?.room?.id === roomId) return // recién creada: ya la tenemos
    const controller = new AbortController()
    setState({ status: 'loading' })
    getRoom(roomId, controller.signal)
      .then((room) => setState({ status: 'ready', room }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        if (error instanceof ApiError && (error.code === 'NOT_FOUND' || error.code === 'ROOM_NOT_FOUND' || error.status === 404)) {
          setState({ status: 'not-found' })
          return
        }
        setState({ status: 'error', message: error instanceof ApiError ? error.message : 'Ocurrió un error inesperado.' })
      })
    return () => controller.abort()
    // navState solo cuenta en la primera carga
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, attempt])

  const roomName = state.status === 'ready' ? state.room.name : null
  useEffect(() => {
    if (roomName) {
      document.title = `Sala ${roomName} | Estudiemos`
      headingRef.current?.focus()
    } else {
      document.title = `${state.status === 'not-found' ? 'Sala no encontrada' : 'Sala'} | Estudiemos`
    }
  }, [roomName, state.status])

  return (
    <main id="main-content" tabIndex={-1} className="min-h-[calc(100vh-140px)] bg-[#F5FAFF] px-4 py-10 sm:px-6 lg:px-12 focus:outline-none">
      <div className="mx-auto flex max-w-[1000px] flex-col gap-6">
        <Link to="/panel" className={backLinkClass}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m6 6l-6-6 6-6" />
          </svg>
          Volver al panel
        </Link>

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
              El ID <strong className="font-mono tracking-wider text-[#001E2D]">{roomId}</strong> no corresponde a ninguna sala.
              Revísalo o pide a tu grupo que te lo comparta de nuevo.
            </p>
            <Link
              to="/panel"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#1f4e79] px-6 text-sm font-semibold text-white! hover:bg-[#163A5A]"
            >
              Ir al panel
            </Link>
          </section>
        )}

        {state.status === 'error' && (
          <Alert
            variant="error"
            title="No pudimos abrir la sala"
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
          <>
            {justCreated && (
              <Alert variant="success" role="status" title="¡Tu sala está lista para estudiar!">
                Comparte el ID con tu grupo para que se unan. Entraste como anfitrión.
              </Alert>
            )}

            <section aria-labelledby="room-title" className="rounded-2xl border border-[#C2C6D5] bg-white p-6 sm:p-8 shadow-[0_2px_8px_-2px_rgba(11,37,64,0.05)]">
              <div className="flex flex-wrap items-center gap-2">
                {state.room.ownerId === user?.uid ? (
                  <HostBadge />
                ) : (
                  <span className="rounded-full bg-[#D6E3F2] px-2.5 py-1 text-xs font-semibold text-[#0B2540]">Participante</span>
                )}
                {formatRoomDate(state.room.createdAt) && (
                  <span className="text-sm text-[#424753]">Creada el {formatRoomDate(state.room.createdAt)}</span>
                )}
              </div>

              <h1
                id="room-title"
                ref={headingRef}
                tabIndex={-1}
                className="mt-4 text-[28px] leading-9 sm:text-4xl sm:leading-[44px] font-bold tracking-[-0.015em] text-[#001E2D] [overflow-wrap:anywhere] font-['Plus_Jakarta_Sans',sans-serif] focus:outline-none"
              >
                {state.room.name}
              </h1>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[#EAF5FF] p-4 sm:p-5">
                <p>
                  <span className="block text-xs font-bold uppercase tracking-[0.08em] text-[#424753]">ID de la sala</span>
                  <span className="font-mono text-2xl font-bold tracking-[0.14em] text-[#00375e]">{state.room.id}</span>
                </p>
                <CopyRoomIdButton roomId={state.room.id} roomName={state.room.name} />
              </div>
            </section>

            <section aria-labelledby="next-title" className="rounded-2xl border border-dashed border-[#C2C6D5] bg-white/70 p-6 sm:p-8">
              <h2 id="next-title" className="text-lg font-semibold text-[#001E2D]">
                Así funcionará tu sala
              </h2>
              <ul className="mt-3 grid gap-3 text-sm text-[#424753] sm:grid-cols-3">
                <li className="rounded-xl bg-[#F5FAFF] p-4">
                  <strong className="block text-[#001E2D]">Comparte el ID</strong>
                  Tus compañeros entran desde su panel escribiendo el ID.
                </li>
                <li className="rounded-xl bg-[#F5FAFF] p-4">
                  <strong className="block text-[#001E2D]">Conversa por chat</strong>
                  Muy pronto podrán escribirse aquí, con historial.
                </li>
                <li className="rounded-xl bg-[#F5FAFF] p-4">
                  <strong className="block text-[#001E2D]">Estudien en video</strong>
                  Luego llegarán el audio, el video y la pantalla compartida.
                </li>
              </ul>
            </section>
          </>
        )}
      </div>
    </main>
  )
}
