import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent, MouseEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { CreateRoomDialog } from '../components/rooms/CreateRoomDialog'
import { RoomCard } from '../components/rooms/RoomCard'
import { ManageRoomDialog, RoomManagementButtons } from '../components/rooms/ManageRoomDialog'
import type { ManageRoomAction } from '../components/rooms/ManageRoomDialog'
import { ApiError } from '../services/apiErrors'
import { getRoom, listMyRooms } from '../services/roomService'
import type { Room } from '../services/roomService'
import { normalizeRoomCode, sortRoomsByNewest } from '../utils/rooms'

type RoomsState = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; rooms: Room[] }

export interface DashboardPageProps {
  /** /salas/nueva abre directamente el formulario de crear sala. */
  openCreate?: boolean
  /** /salas/unirse lleva el foco al campo del código. */
  focusJoin?: boolean
}

const PlusIcon = (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" d="M12 5v14M5 12h14" />
  </svg>
)

function RoomsSkeleton() {
  return (
    <div role="status" className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <span className="sr-only">Cargando tus salas…</span>
      {[0, 1].map((i) => (
        <div key={i} aria-hidden="true" className="flex flex-col gap-5 rounded-2xl border border-[#C2C6D5] bg-white p-6">
          <div className="flex justify-between">
            <div className="h-6 w-40 rounded-full bg-[#dbe7f0] motion-safe:animate-pulse" />
            <div className="h-6 w-24 rounded-full bg-[#dbe7f0] motion-safe:animate-pulse" />
          </div>
          <div className="h-7 w-3/4 rounded-md bg-[#dbe7f0] motion-safe:animate-pulse" />
          <div className="h-16 rounded-xl bg-[#EAF5FF] motion-safe:animate-pulse" />
          <div className="h-12 rounded-lg bg-[#dbe7f0] motion-safe:animate-pulse" />
        </div>
      ))}
    </div>
  )
}

/** US-06 · /panel: salas propias (GET /api/rooms), crear sala y unirse con un código. */
export function DashboardPage({ openCreate = false, focusJoin = false }: DashboardPageProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const navigationNotice = location.state as { roomNotice?: string; roomNoticeName?: string } | null
  const [feedback, setFeedback] = useState<{ title: string; name?: string }>()
  const [action, setAction] = useState<ManageRoomAction>()
  const actionTrigger = useRef<HTMLElement | null>(null)
  const roomsHeading = useRef<HTMLHeadingElement>(null)
  const joinRequest = useRef<AbortController | null>(null)
  const [joining, setJoining] = useState(false)

  useEffect(() => () => joinRequest.current?.abort(), [])
  useEffect(() => {
    if (navigationNotice?.roomNotice) {
      setFeedback({ title: navigationNotice.roomNotice, name: navigationNotice.roomNoticeName })
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [navigationNotice, navigate, location.pathname])
  const joinInputId = useId()
  const joinErrorId = useId()
  const joinInputRef = useRef<HTMLInputElement>(null)
  const createTriggerRef = useRef<HTMLElement | null>(null)

  const [state, setState] = useState<RoomsState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const [isCreateOpen, setIsCreateOpen] = useState(openCreate)
  const [joinCode, setJoinCode] = useState('')
  const [joinError, setJoinError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setState({ status: 'loading' })
    listMyRooms(controller.signal)
      .then((rooms) => {
        if (!controller.signal.aborted) setState({ status: 'ready', rooms: sortRoomsByNewest(rooms) })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setState({ status: 'error', message: error instanceof ApiError ? error.message : 'Ocurrió un error inesperado.' })
      })
    return () => controller.abort()
  }, [attempt])

  useEffect(() => {
    if (focusJoin) joinInputRef.current?.focus()
  }, [focusJoin])

  const openCreateDialog = (event: MouseEvent<HTMLElement>) => {
    createTriggerRef.current = event.currentTarget
    setIsCreateOpen(true)
  }

  const handleJoin = async (event: FormEvent) => {
    event.preventDefault()
    if (joinRequest.current) return
    const code = normalizeRoomCode(joinCode)
    if (!code) {
      setJoinError(joinCode.trim() ? 'Revisa el ID. Usa un código de 8 caracteres, por ejemplo 8K4M9Q2T.'
        : 'Escribe el ID de la sala, por ejemplo 8K4M9Q2T.')
      joinInputRef.current?.focus()
      return
    }
    const controller = new AbortController()
    joinRequest.current = controller
    setJoinError(null)
    setJoining(true)
    try {
      const room = await getRoom(code, controller.signal)
      if (!controller.signal.aborted) navigate(`/salas/${encodeURIComponent(room.id)}`, { state: { room } })
    } catch (error) {
      if (controller.signal.aborted) return
      setJoinError(error instanceof ApiError && (error.status === 404 || error.code === 'ROOM_NOT_FOUND')
        ? 'No encontramos una sala con ese ID. Revisa que esté bien escrito o pide a tu grupo que te lo comparta de nuevo.'
        : error instanceof ApiError ? (error.fields.id ?? error.message) : 'No pudimos buscar la sala. Inténtalo de nuevo.')
      joinInputRef.current?.focus()
    } finally {
      joinRequest.current = null
      if (!controller.signal.aborted) setJoining(false)
    }
  }

  const firstName = (user?.firstName || user?.nombres || '').split(' ')[0]
  const roomCount = state.status === 'ready' ? state.rooms.length : null

  return (
    <main id="main-content" tabIndex={-1} className="min-h-[calc(100vh-140px)] bg-[#F5FAFF] px-4 pb-16 pt-10 sm:px-6 lg:px-12 focus:outline-none">
      <div className="mx-auto max-w-[1200px]">
        {feedback && <Alert variant={feedback.title === 'El anfitrión eliminó la sala' ? 'warning' : 'success'}
          role={feedback.title === 'El anfitrión eliminó la sala' ? 'alert' : 'status'} title={feedback.title}
          onDismiss={() => setFeedback(undefined)} className="mx-auto mb-6 max-w-[1000px]">
          {feedback.name && (feedback.title === 'Sala actualizada' ? `Ahora se llama «${feedback.name}».`
            : feedback.title === 'Sala eliminada' ? `«${feedback.name}» y todo su chat se eliminaron.`
              : `«${feedback.name}» y su chat ya no existen. Te trajimos de vuelta a tu panel.`)}
        </Alert>}
        <section aria-labelledby="dashboard-title" className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {firstName && (
            <p className="inline-flex items-center gap-2 rounded-full bg-[#DEF0FF] px-4 py-1.5 text-sm font-medium text-[#424753]">
              <span className="h-2 w-2 rounded-full bg-[#005044]" aria-hidden="true" />
              Hola, {firstName}
            </p>
          )}
          <h1
            id="dashboard-title"
            className="mt-5 text-[32px] leading-10 sm:text-5xl sm:leading-[56px] font-bold tracking-[-0.02em] text-[#001E2D] font-['Plus_Jakarta_Sans',sans-serif]"
          >
            Salas de estudio colaborativo
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[#424753]">Crea una sala o únete con el ID que te compartió tu grupo.</p>

          <div className="mt-8 flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-start sm:justify-center">
            <Button size="lg" className="sm:min-h-[62px] sm:min-w-52" onClick={openCreateDialog} aria-haspopup="dialog" icon={PlusIcon}>
              Nueva sala
            </Button>

            <form noValidate onSubmit={handleJoin} className="flex w-full flex-col gap-1.5 text-left sm:max-w-md">
              <div className={`flex gap-2 rounded-xl border bg-white p-1.5 shadow-[0_2px_8px_-2px_rgba(11,37,64,0.05)] focus-within:ring-2 focus-within:ring-[#1f4e79] ${joinError ? 'border-[#BA1A1A]' : 'border-[#72777f]'}`}>
                <label htmlFor={joinInputId} className="sr-only">
                  ID de la sala para unirte
                </label>
                <input
                  ref={joinInputRef}
                  id={joinInputId}
                  value={joinCode}
                  readOnly={joining}
                  onChange={(e) => {
                    setJoinCode(e.target.value)
                    if (joinError) setJoinError(null)
                  }}
                  placeholder="ID de la sala, p. ej. 8K4M9Q2T"
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  aria-invalid={Boolean(joinError)}
                  aria-describedby={joinError ? joinErrorId : undefined}
                  className="min-h-11 min-w-0 flex-1 rounded-lg bg-transparent px-3 font-mono text-base tracking-wider text-[#001E2D] placeholder:font-sans placeholder:tracking-normal placeholder:text-[#5b6170] focus:outline-none"
                />
                <Button type="submit" variant="secondary" className="shrink-0" isLoading={joining} loadingText="Buscando…">
                  Unirme
                </Button>
              </div>
              {joining && <p role="status" className="px-1 text-sm text-[#424753]">Buscando la sala…</p>}
              {joinError && (
                <p id={joinErrorId} role="alert" className="flex items-start gap-1.5 px-1 text-sm font-medium text-red-700">
                  <span aria-hidden="true">⚠</span>
                  {joinError}
                </p>
              )}
            </form>
          </div>
        </section>

        {/* LISTA DE SALAS PROPIAS */}
        <section aria-labelledby="rooms-heading" className="mx-auto mt-14 max-w-[1000px]">
          <div className="mb-6 flex items-center gap-3 border-b border-[#C2C6D5] pb-4">
            <h2 ref={roomsHeading} tabIndex={-1} id="rooms-heading" className="text-2xl font-semibold text-[#001E2D] font-['Plus_Jakarta_Sans',sans-serif]">
              Tus salas
            </h2>
            {roomCount !== null && (
              <span className="rounded-full bg-[#D6E3F2] px-2.5 py-0.5 text-sm font-semibold text-[#0B2540]">
                {roomCount}
                <span className="sr-only">{roomCount === 1 ? ' sala' : ' salas'}</span>
              </span>
            )}
          </div>

          {state.status === 'loading' && <RoomsSkeleton />}

          {state.status === 'error' && (
            <Alert
              variant="error"
              title="No pudimos cargar tus salas"
              action={
                <Button size="sm" variant="outline" onClick={() => setAttempt((n) => n + 1)}>
                  Reintentar
                </Button>
              }
            >
              {state.message}
            </Alert>
          )}

          {state.status === 'ready' && state.rooms.length === 0 && (
            <div className="flex flex-col items-center rounded-2xl border border-[#C2C6D5] bg-white px-6 py-12 text-center">
              <span className="grid size-24 place-items-center rounded-full bg-[#EAF5FF] text-[#00375e]" aria-hidden="true">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 21h16M6 21V5a1 1 0 011-1h7v17M14 8h3a1 1 0 011 1v12M9 8h2M9 12h2M9 16h2" />
                </svg>
              </span>
              <h3 className="mt-6 text-2xl font-semibold text-[#001E2D] font-['Plus_Jakarta_Sans',sans-serif]">Aún no has creado salas</h3>
              <p className="mt-2 max-w-md text-base text-[#424753]">
                Crea la primera para estudiar con tu grupo: resolver ejercicios, preparar parciales o repasar en tiempo real.
              </p>
              <Button className="mt-6" onClick={openCreateDialog} aria-haspopup="dialog" icon={PlusIcon}>
                Crear sala
              </Button>
              <p className="mt-6 max-w-md rounded-xl bg-[#EAF5FF] px-4 py-3 text-left text-sm text-[#424753]">
                <strong className="text-[#001E2D]">Consejo:</strong> Al crear una sala obtienes un ID corto y fácil de dictar
                para compartirlo con tus compañeros.
              </p>
            </div>
          )}

          {state.status === 'ready' && state.rooms.length > 0 && (
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2" aria-labelledby="rooms-heading">
              {state.rooms.map((room) => (
                <li key={room.id} className="flex">
                  <div className="flex w-full [&>article]:w-full">
                    <RoomCard room={room} actions={room.ownerId === user?.uid && <RoomManagementButtons room={room}
                      onAction={(next, trigger) => { actionTrigger.current = trigger; setAction(next) }} />} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {action && <ManageRoomDialog action={action} returnFocusRef={actionTrigger} onClose={() => setAction(undefined)}
        onSaved={(room) => {
          setState((current) => current.status === 'ready'
            ? { ...current, rooms: current.rooms.map((item) => item.id === room.id ? room : item) } : current)
          setFeedback({ title: 'Sala actualizada', name: room.name })
        }}
        onDeleted={(room) => {
          actionTrigger.current = null
          setState((current) => current.status === 'ready'
            ? { ...current, rooms: current.rooms.filter((item) => item.id !== room.id) } : current)
          setFeedback({ title: 'Sala eliminada', name: room.name })
          requestAnimationFrame(() => roomsHeading.current?.focus())
        }} />}
      <CreateRoomDialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)} returnFocusRef={createTriggerRef} />
    </main>
  )
}
