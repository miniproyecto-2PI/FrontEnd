import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRoomChat } from '../../hooks/useRoomChat'
import { useRoomRealtime } from '../../hooks/useRoomRealtime'
import { ApiError } from '../../services/apiErrors'
import { getRoom } from '../../services/roomService'
import type { Room, Participant } from '../../services/roomService'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'
import { UserAvatar } from '../ui/UserAvatar'
import { CopyRoomIdButton } from './CopyRoomIdButton'
import { ManageRoomDialog, RoomManagementButtons } from './ManageRoomDialog'
import type { ManageRoomAction } from './ManageRoomDialog'
import { HostBadge } from './RoomCard'
import { RoomChat } from './RoomChat'

const desktopQuery = '(min-width: 768px)'

function subscribeToLayout(callback: () => void) {
  const media = window.matchMedia(desktopQuery)
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}

export function StudyRoom({ initialRoom, viewer, justCreated, onMissing }: {
  initialRoom: Room
  viewer: Participant
  justCreated: boolean
  onMissing: () => void
}) {
  const navigate = useNavigate()
  const [room, setRoom] = useState(initialRoom)
  const [action, setAction] = useState<ManageRoomAction>()
  const [notice, setNotice] = useState(justCreated ? '¡Tu sala está lista para estudiar!' : '')
  const [removed, setRemoved] = useState(false)
  const [tab, setTab] = useState<'chat' | 'participants'>('chat')
  const heading = useRef<HTMLHeadingElement>(null)
  const mobileHeading = useRef<HTMLHeadingElement>(null)
  const actionTrigger = useRef<HTMLElement>(null)
  const chatTab = useRef<HTMLButtonElement>(null)
  const peopleTab = useRef<HTMLButtonElement>(null)
  const desktop = useSyncExternalStore(subscribeToLayout, () => window.matchMedia(desktopQuery).matches)
  const owner = viewer.uid === room.ownerId
  const ownDeletion = useRef(false)
  const chat = useRoomChat(room.id)
  const loadHistory = useRef(chat.loadHistory)

  function returnToPanel(roomNotice: string) {
    navigate('/panel', { replace: true, state: { roomNotice, roomNoticeName: room.name } })
  }

  const realtime = useRoomRealtime(room.id, {
    onMessage: chat.receive,
    onRename: (name) => {
      if (name !== room.name) {
        setRoom((current) => ({ ...current, name }))
        setNotice('Sala actualizada')
      }
    },
    onDelete: (duringJoin) => {
      if (ownDeletion.current) return
      if (duringJoin && !realtime.generation) onMissing()
      else {
        setAction(undefined)
        setRemoved(true)
      }
    },
  })

  useEffect(() => { (desktop ? heading : mobileHeading).current?.focus() }, [])
  useEffect(() => { document.title = `Sala ${room.name} | Estudiemos` }, [room.name])
  useEffect(() => { loadHistory.current = chat.loadHistory }, [chat.loadHistory])
  const canLoadHistory = realtime.generation > 0 || realtime.connection === 'error' || realtime.connection === 'reconnecting'
  useEffect(() => {
    if (canLoadHistory) void loadHistory.current()
  }, [realtime.generation, canLoadHistory])
  useEffect(() => {
    if (!removed) return
    const timer = window.setTimeout(() => returnToPanel('El anfitrión eliminó la sala'), 6500)
    return () => window.clearTimeout(timer)
  }, [removed, navigate])

  const connected = realtime.connection === 'connected' && !removed
  const verifyWhileOffline = realtime.connection === 'error' || realtime.connection === 'reconnecting'

  useEffect(() => {
    if (!verifyWhileOffline || removed) return
    const controller = new AbortController()
    let timer: number | undefined
    async function verifyRoom() {
      try {
        await getRoom(room.id, controller.signal)
      } catch (error) {
        if (!controller.signal.aborted && !ownDeletion.current && error instanceof ApiError
          && (error.status === 404 || error.code === 'ROOM_NOT_FOUND')) {
          setAction(undefined)
          setRemoved(true)
          return
        }
      }
      if (!controller.signal.aborted) timer = window.setTimeout(() => void verifyRoom(), 15_000)
    }
    void verifyRoom()
    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [room.id, verifyWhileOffline, removed])
  const connectionLabel = {
    joining: 'Entrando…',
    connected: 'Conectado',
    reconnecting: 'Reconectando…',
    error: 'Sin conexión',
  }[realtime.connection]

  const joining = realtime.connection === 'joining'
  const exit = <Link className="study-exit gap-2" to="/panel">
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h4m5-4 5-5-5-5m5 5H8" />
    </svg>
    Salir de la sala
  </Link>

  return (
    <>
      {notice && <Alert variant="success" title={notice} onDismiss={() => setNotice('')}>
        {notice === 'Sala actualizada' ? `Ahora se llama «${room.name}».` : 'Comparte el ID con tu grupo para que se unan.'}
      </Alert>}
      {realtime.connection === 'reconnecting' && <Alert variant="warning" role="alert" className="flex-wrap items-center font-semibold"
        action={<Button variant="outline" size="sm" onClick={realtime.retry}>Reintentar ahora</Button>}>
        Se perdió la conexión. Reconectando…
      </Alert>}
      {realtime.connection === 'error' && <Alert title="No pudimos conectar con la sala"
        action={<Button variant="outline" onClick={realtime.retry}>Reintentar</Button>}>
        {realtime.failure || 'El servicio en tiempo real no está disponible. Inténtalo de nuevo.'}
      </Alert>}
      <div className="study-room-mobile-bar">
        <h1 ref={mobileHeading} tabIndex={-1}>{room.name}</h1>
        {exit}
      </div>
      <section aria-label="Información y acciones de la sala" className="study-room-card study-room-info">
        <h1 ref={heading} tabIndex={-1}>{room.name}</h1>
        <div className="study-room-badges flex flex-wrap items-center gap-2">
          {owner ? <HostBadge /> : <span className="study-chip">Participante</span>}
          <span role="status" className="study-chip" data-connected={connected}>{connectionLabel}</span>
        </div>
        <div className="study-room-code">
          <p>ID de la sala: <code>{room.id}</code></p>
          <CopyRoomIdButton roomId={room.id} roomName={room.name} />
        </div>
        <div className="study-room-actions">
          {owner && !joining && <RoomManagementButtons room={room} onAction={(next, trigger) => {
            actionTrigger.current = trigger
            setAction(next)
          }} />}
        </div>
        {exit}
      </section>
      <div className="study-room-tabs" role="tablist" aria-label="Zonas de la sala"
        onKeyDown={(event) => {
          const keyboardTab = { ArrowLeft: tab === 'chat' ? 'participants' : 'chat',
            ArrowRight: tab === 'chat' ? 'participants' : 'chat', Home: 'chat', End: 'participants' } as const
          const next = keyboardTab[event.key as keyof typeof keyboardTab]
          if (!next) return
          event.preventDefault()
          setTab(next)
          const nextTab = next === 'chat' ? chatTab : peopleTab
          nextTab.current?.focus()
        }}>
        <button ref={chatTab} type="button" id="room-chat-tab" role="tab" aria-controls="room-chat-panel"
          aria-selected={tab === 'chat'} tabIndex={tab === 'chat' ? 0 : -1} onClick={() => setTab('chat')}>Chat</button>
        <button ref={peopleTab} type="button" id="room-people-tab" role="tab" aria-controls="room-people-panel"
          aria-selected={tab === 'participants'} tabIndex={tab === 'participants' ? 0 : -1}
          onClick={() => setTab('participants')}>Participantes{connected ? ` (${realtime.participants.length})` : ''}</button>
      </div>
      <div className="study-room-workspace">
        <div className="study-room-people" id="room-people-panel" data-visible={tab === 'participants'}
          role={desktop ? undefined : 'tabpanel'} aria-labelledby={desktop ? undefined : 'room-people-tab'}>
          <section className="study-room-card study-participants" aria-labelledby="room-people-heading">
            <h2 id="room-people-heading">Participantes {connected && <span className="study-chip">{realtime.participants.length}</span>}</h2>
            {joining && <div role="status">
              <span className="sr-only">Cargando participantes…</span>
              <div className="study-people-list" aria-hidden="true">
                {[0, 1].map((item) => <div key={item} className="study-person-skeleton rounded-xl bg-[#dbe7f0] motion-safe:animate-pulse" />)}
              </div>
            </div>}
            {!joining && !connected && <p className="text-sm text-[#424753]">La lista se actualizará cuando vuelva la conexión.</p>}
            {connected && realtime.participants.length === 1 && realtime.participants[0].uid === viewer.uid && <p>Solo tú en la sala</p>}
            <ul className="study-people-list">
              {realtime.participants.map((person) => <li key={person.uid} className="study-person">
                <UserAvatar avatar={person.avatar} firstName={person.name} className="size-10 text-sm md:size-16 md:text-xl" />
                <div className="min-w-0 [overflow-wrap:anywhere]">
                  <p className="font-semibold">{person.name}{person.uid === viewer.uid ? ' (tú)' : ''}</p>
                  {person.uid === room.ownerId && <HostBadge />}
                </div>
              </li>)}
              {connected && realtime.participants.length % 2 === 1 && <li className="study-person study-person-empty">
                <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="9" cy="7" r="3" /><path d="M3 20v-2a6 6 0 0 1 12 0v2m4-12v8m-4-4h8" />
                </svg>
                Espacio disponible
              </li>}
            </ul>
            <p className="study-room-media">Muy pronto: audio y video en esta zona.</p>
          </section>
        </div>
        <div className="study-room-chat" id="room-chat-panel" data-visible={tab === 'chat'}
          role={desktop ? undefined : 'tabpanel'} aria-labelledby={desktop ? undefined : 'room-chat-tab'}>
          <RoomChat chat={chat} author={viewer} connected={connected} send={realtime.send} visible={desktop || tab === 'chat'} />
        </div>
      </div>
      {action && <ManageRoomDialog action={action} returnFocusRef={actionTrigger.current?.isConnected ? actionTrigger : heading}
        onClose={() => setAction(undefined)} onSaved={(updated) => { setRoom(updated); setNotice('Sala actualizada') }}
        onDeleteStart={() => { ownDeletion.current = true }}
        onDeleteFailure={() => { ownDeletion.current = false }}
        onDeleted={() => returnToPanel('Sala eliminada')} />}
      <Dialog open={removed} title="El anfitrión eliminó la sala" role="alertdialog"
        hideClose icon={<span className="grid size-12 place-items-center rounded-full bg-amber-50 text-amber-700">
          <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          </svg>
        </span>}
        description={`«${room.name}» y su chat ya no existen. Te llevaremos a tu panel.`} onClose={() => returnToPanel('El anfitrión eliminó la sala')}>
        <Button fullWidth onClick={() => returnToPanel('El anfitrión eliminó la sala')}>Ir al panel</Button>
      </Dialog>
    </>
  )
}
