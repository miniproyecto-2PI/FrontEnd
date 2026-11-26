import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import { currentToken, refreshAccessToken } from '../services/apiClient'
import type { ChatMessage, Participant } from '../services/roomService'

type Ack<T> = { ok: true; data: T } | { ok: false; error: { code: string } }
type RoomEvent = { roomId: string }
type PresenceEvent = RoomEvent & { participant: Participant }
type Connection = 'joining' | 'connected' | 'reconnecting' | 'error'

interface RoomEvents {
  'room:participants': (event: RoomEvent & { participants: Participant[] }) => void
  'room:user-joined': (event: PresenceEvent) => void
  'room:user-left': (event: PresenceEvent) => void
  'room:updated': (event: RoomEvent & { name: string }) => void
  'room:deleted': (event: RoomEvent) => void
  'room:error': (event: RoomEvent) => void
  'chat:message': (message: ChatMessage) => void
}

interface ClientEvents {
  'room:join': (event: RoomEvent, acknowledge: (response: Ack<{ roomId: string }>) => void) => void
  'chat:send': (event: RoomEvent & { text: string; clientMessageId: string }, acknowledge: (response: Ack<{ id: string }>) => void) => void
}

export function useRoomRealtime(roomId: string, handlers: {
  onMessage: (message: ChatMessage) => void
  onRename: (name: string) => void
  onDelete: (duringJoin: boolean) => void
}) {
  const callbacks = useRef(handlers)
  useEffect(() => { callbacks.current = handlers }, [handlers])
  const socketRef = useRef<Socket<RoomEvents, ClientEvents> | null>(null)
  const joined = useRef(false)
  const [connection, setConnection] = useState<Connection>('joining')
  const [participants, setParticipants] = useState<Participant[]>([])
  const [generation, setGeneration] = useState(0)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    let refreshing = false
    let refreshed = false
    const url = import.meta.env.VITE_REALTIME_URL || (import.meta.env.DEV ? 'http://localhost:4000' : '')
    if (!url) {
      setConnection('error')
      return
    }
    setConnection('joining')
    const socket: Socket<RoomEvents, ClientEvents> = io(url, {
      autoConnect: false,
      timeout: 12_000,
      auth: (done: (payload: { token: string | null }) => void) => { void currentToken().then(
        (token) => { if (active) done({ token }) },
        () => { if (active) done({ token: null }) },
      ) },
    })
    socketRef.current = socket

    socket.on('connect', () => {
      socket.timeout(12_000).emit('room:join', { roomId }, (timeout, ack) => {
        if (!active || !socket.connected) return
        if (timeout || !ack?.ok) {
          setConnection('error')
          if (!timeout && ack && !ack.ok && ack.error.code === 'ROOM_NOT_FOUND') callbacks.current.onDelete(true)
          return
        }
        joined.current = true
        refreshed = false
        setGeneration((value) => value + 1)
        setConnection('connected')
      })
    })
    socket.on('disconnect', () => {
      joined.current = false
      if (active) setConnection(socket.active ? 'reconnecting' : 'error')
    })
    socket.on('connect_error', (error: Error & { data?: { code?: string } }) => {
      if (!active) return
      if (socket.active) {
        setConnection('reconnecting')
      } else if (error.data?.code === 'UNAUTHENTICATED' && !refreshed && !refreshing) {
        refreshing = true
        refreshed = true
        void refreshAccessToken().then((token) => {
          refreshing = false
          if (!active) return
          if (token) socket.connect()
          else setConnection('error')
        })
      } else {
        setConnection('error')
      }
    })
    socket.on('room:participants', (event) => {
      if (event.roomId === roomId) setParticipants(event.participants)
    })
    socket.on('room:user-joined', ({ roomId: id, participant }) => {
      if (id === roomId) setParticipants((people) => [...people.filter((person) => person.uid !== participant.uid), participant])
    })
    socket.on('room:user-left', ({ roomId: id, participant }) => {
      if (id === roomId) setParticipants((people) => people.filter((person) => person.uid !== participant.uid))
    })
    socket.on('room:updated', (event) => {
      if (event.roomId === roomId) callbacks.current.onRename(event.name)
    })
    socket.on('room:deleted', (event) => {
      if (event.roomId === roomId) callbacks.current.onDelete(false)
    })
    socket.on('room:error', (event) => {
      if (event.roomId === roomId) {
        joined.current = false
        setConnection('error')
      }
    })
    socket.on('chat:message', (message) => {
      if (message.roomId === roomId) callbacks.current.onMessage(message)
    })
    socket.connect()

    return () => {
      active = false
      joined.current = false
      socketRef.current = null
      socket.removeAllListeners()
      socket.disconnect()
    }
  }, [roomId, attempt])

  async function send(text: string, clientMessageId: string): Promise<string> {
    const socket = socketRef.current
    if (!socket?.connected || !joined.current) throw new Error('Falta conexión con la sala.')
    const ack = await socket.timeout(8_000).emitWithAck('chat:send', { roomId, text, clientMessageId })
    if (!ack.ok) throw new Error(ack.error.code)
    return ack.data.id
  }

  return { connection, participants, generation, send, retry: () => setAttempt((value) => value + 1) }
}
