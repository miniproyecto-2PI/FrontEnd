import { useEffect, useRef, useState } from 'react'
import { getRoomHistory } from '../services/roomService'
import type { ChatMessage, Participant } from '../services/roomService'

export interface PendingMessage extends ChatMessage {
  delivery: 'sending' | 'failed'
}

function merge(current: ChatMessage[], incoming: ChatMessage[]) {
  const byId = new Map(current.map((message) => [message.id, message]))
  incoming.forEach((message) => byId.set(message.id, message))
  return [...byId.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt)
    || (a.id < b.id ? -1 : Number(a.id > b.id)))
}

export function useRoomChat(roomId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [pending, setPending] = useState<PendingMessage[]>([])
  const [history, setHistory] = useState<'loading' | 'ready' | 'error'>('loading')
  const [cursor, setCursor] = useState<string | null>(null)
  const [loadingOlder, setLoadingOlder] = useState(false)
  const [olderError, setOlderError] = useState(false)
  const [olderVersion, setOlderVersion] = useState(0)
  const request = useRef<AbortController | null>(null)
  const sending = useRef(new Set<string>())
  const knownIds = useRef(new Set<string>())
  const cursorRef = useRef<string | null>(null)
  const historyLoaded = useRef(false)

  useEffect(() => () => request.current?.abort(), [])

  function receive(message: ChatMessage) {
    knownIds.current.add(message.id)
    setMessages((current) => merge(current, [message]))
  }

  async function loadHistory(older = false) {
    const before = older ? cursorRef.current : null
    if (older && (!before || request.current)) return
    request.current?.abort()
    const controller = new AbortController()
    request.current = controller
    setOlderError(false)
    setLoadingOlder(older)
    if (!older) setHistory('loading')
    const known = new Set(knownIds.current)
    try {
      const page = await getRoomHistory(roomId, controller.signal, before ?? undefined)
      const batch = [...page.messages]
      let next = page.hasMore ? page.nextBefore : null
      let overlaps = batch.some(({ id }) => known.has(id))
      // Al reconectar, recuperar todo lo que falta entre el último mensaje conocido y el presente.
      const visited = new Set<string>()
      while (!older && known.size > 0 && !overlaps && next && !visited.has(next) && !controller.signal.aborted) {
        visited.add(next)
        const previous = await getRoomHistory(roomId, controller.signal, next)
        batch.push(...previous.messages)
        overlaps = previous.messages.some(({ id }) => known.has(id))
        next = previous.hasMore ? previous.nextBefore : null
      }
      if (controller.signal.aborted) return
      batch.forEach(({ id }) => knownIds.current.add(id))
      setMessages((current) => merge(current, batch))
      // Si ya habíamos paginado y alcanzamos un mensaje conocido, conservar aquel cursor.
      if (older || !overlaps || !historyLoaded.current) {
        cursorRef.current = next
        setCursor(next)
      }
      historyLoaded.current = true
      if (older) setOlderVersion((value) => value + 1)
      setHistory('ready')
    } catch {
      if (controller.signal.aborted) return
      if (older) setOlderError(true)
      else setHistory('error')
    } finally {
      if (request.current === controller) {
        request.current = null
        if (!controller.signal.aborted) setLoadingOlder(false)
      }
    }
  }

  async function deliver(message: PendingMessage, send: (text: string, clientId: string) => Promise<string>) {
    if (sending.current.has(message.id)) return
    sending.current.add(message.id)
    setPending((current) => [...current.filter(({ id }) => id !== message.id), { ...message, delivery: 'sending' }])
    try {
      const id = await send(message.text, message.id)
      if (!knownIds.current.has(id)) {
        const confirmed = { id, roomId, text: message.text, author: message.author, createdAt: message.createdAt }
        setMessages((current) => merge([confirmed], current))
        if (!request.current) void loadHistory()
      }
      setPending((current) => current.filter((item) => item.id !== message.id))
    } catch {
      setPending((current) => current.map((item) => item.id === message.id ? { ...item, delivery: 'failed' } : item))
    } finally {
      sending.current.delete(message.id)
    }
  }

  function draft(text: string, author: Participant): PendingMessage {
    return { id: crypto.randomUUID(), roomId, text, author, delivery: 'sending', createdAt: new Date().toISOString() }
  }

  return { messages, pending, history, cursor, loadingOlder, olderError, olderVersion, receive, loadHistory, deliver, draft }
}
