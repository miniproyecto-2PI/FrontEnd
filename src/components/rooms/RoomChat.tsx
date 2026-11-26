import { useId, useLayoutEffect, useRef, useState } from 'react'
import { Button } from '../ui/Button'
import { Alert } from '../ui/Alert'
import { UserAvatar } from '../ui/UserAvatar'
import type { PendingMessage, useRoomChat } from '../../hooks/useRoomChat'
import type { ChatMessage, Participant } from '../../services/roomService'

const MESSAGE_LIMIT = 1000
const sendIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  <path strokeLinecap="round" strokeLinejoin="round" d="m4 12 16-8-6 16-3-7-7-1Zm7 1 9-9" />
</svg>
const chatIcon = <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
  strokeLinecap="round" strokeLinejoin="round" className="size-5">
  <path d="M8 10h8m-8 4h5m8-2a8 8 0 0 1-11.6 7.1L4 20l1-4.3A8 8 0 1 1 21 12Z" />
</svg>
const downIcon = <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-6-6 6 6 6-6" />
</svg>
const time = new Intl.DateTimeFormat('es-CO', { hour: 'numeric', minute: '2-digit' })

export function RoomChat({ chat, author, connected, send, visible }: {
  chat: ReturnType<typeof useRoomChat>
  author: Participant
  connected: boolean
  send: (text: string, clientMessageId: string) => Promise<string>
  visible: boolean
}) {
  const [text, setText] = useState('')
  const [newCount, setNewCount] = useState(0)
  const list = useRef<HTMLDivElement>(null)
  const atBottom = useRef(true)
  const seenIds = useRef(new Set<string>())
  const previousOlderVersion = useRef(0)
  const scrollSnapshot = useRef<{ top: number; height: number } | null>(null)
  const inputId = useId()
  const length = Array.from(text.trim()).length
  const tooLong = length > MESSAGE_LIMIT
  const canSend = connected && length > 0 && !tooLong
  const items: (ChatMessage | PendingMessage)[] = [...chat.messages, ...chat.pending]

  function scrollToEnd() {
    if (list.current) list.current.scrollTop = list.current.scrollHeight
    atBottom.current = true
    setNewCount(0)
  }

  useLayoutEffect(() => {
    if (!visible || !list.current) return
    const element = list.current
    const previous = seenIds.current
    const additions = chat.messages.filter((message) => !previous.has(message.id) && message.author.uid !== author.uid)
    seenIds.current = new Set(chat.messages.map(({ id }) => id))
    if (chat.olderVersion !== previousOlderVersion.current && scrollSnapshot.current) {
      const { height, top } = scrollSnapshot.current
      element.scrollTop = top + element.scrollHeight - height
      scrollSnapshot.current = null
    } else if (atBottom.current) {
      scrollToEnd()
    } else if (additions.length) {
      setNewCount((count) => count + additions.length)
    }
    previousOlderVersion.current = chat.olderVersion
  }, [chat.messages, chat.pending, chat.olderVersion, author.uid, visible])

  function loadOlder() {
    if (!list.current) return
    scrollSnapshot.current = { top: list.current.scrollTop, height: list.current.scrollHeight }
    void chat.loadHistory(true)
  }

  function submit() {
    if (!canSend) return
    const draft = chat.draft(text.trim(), author)
    setText('')
    scrollToEnd()
    void chat.deliver(draft, send)
  }

  return (
    <section aria-labelledby="chat-mobile-title" className="study-room-card overflow-hidden">
      <h2 id="chat-title" className="hidden items-center gap-2 border-b border-[#C2C6D5] px-6 py-4 font-['Plus_Jakarta_Sans',sans-serif] text-lg font-semibold md:flex">{chatIcon} Chat de la sala</h2>
      <span className="sr-only" id="chat-mobile-title">Chat de la sala</span>
      <div className="relative">
        <div ref={list} tabIndex={0} aria-label="Historial de mensajes" className="study-chat-scroll"
          onScroll={(event) => {
            if (!visible) return
            const element = event.currentTarget
            atBottom.current = element.scrollHeight - element.scrollTop - element.clientHeight < 48
            if (atBottom.current) setNewCount(0)
          }}>
          {chat.cursor && <div className="text-center">
            <Button variant="ghost" isLoading={chat.loadingOlder} loadingText="Cargando mensajes anteriores…"
              onClick={loadOlder}>{chat.olderError ? 'Reintentar mensajes anteriores' : 'Cargar mensajes anteriores'}</Button>
          </div>}
          {chat.history === 'loading' && chat.messages.length === 0 && <div role="status" className="flex flex-1 flex-col gap-5">
            <p className="text-sm text-[#424753]">Cargando mensajes…</p>
            <div className="flex flex-col gap-5" aria-hidden="true">
              <div className="flex items-start gap-2.5"><span className="size-8 shrink-0 rounded-full bg-[#dbe7f0] motion-safe:animate-pulse" />
                <span className="h-16 w-3/5 rounded-2xl bg-[#dbe7f0] motion-safe:animate-pulse" /></div>
              <div className="h-16 w-1/2 self-end rounded-2xl bg-[#dbe7f0] motion-safe:animate-pulse" />
              <div className="flex items-start gap-2.5"><span className="size-8 shrink-0 rounded-full bg-[#dbe7f0] motion-safe:animate-pulse" />
                <span className="h-16 w-2/3 rounded-2xl bg-[#dbe7f0] motion-safe:animate-pulse" /></div>
              <div className="h-16 w-2/5 self-end rounded-2xl bg-[#dbe7f0] motion-safe:animate-pulse" />
            </div>
          </div>}
          {chat.history === 'error' && <Alert title="No pudimos cargar el historial"
            action={<Button variant="outline" onClick={() => void chat.loadHistory()}>Reintentar</Button>}>
            {connected ? 'El chat en vivo sigue funcionando.' : 'Puedes volver a intentarlo.'}
          </Alert>}
          {chat.olderError && <Alert>No pudimos cargar los mensajes anteriores.</Alert>}
          <p role="status" className="sr-only">{chat.olderVersion > 0 &&
            <span key={chat.olderVersion}>Se cargaron mensajes anteriores.</span>}</p>
          {chat.history === 'ready' && !chat.messages.length && !chat.pending.length && <div className="study-chat-empty">
            <span className="mx-auto mb-3 grid size-14 place-items-center rounded-full bg-[#EAF5FF] text-[#00375e]">{chatIcon}</span>
            <strong className="font-['Plus_Jakarta_Sans',sans-serif] text-lg">Aún no hay mensajes</strong><p>¡Saluda a tu grupo!</p>
          </div>}
          <div role="log" aria-live="polite" aria-relevant="additions" aria-label="Mensajes de la sala">
            <ol className="flex flex-col gap-4">
              {items.map((message) => {
                const mine = message.author.uid === author.uid
                return <li key={message.id} className={`study-message ${mine ? 'study-message-own' : ''}`}>
                  {!mine && <UserAvatar avatar={message.author.avatar} firstName={message.author.name} className="size-8 text-xs" />}
                  <div className="min-w-0">
                    <p className="study-message-meta"><strong>{mine ? 'Tú' : message.author.name}</strong>
                      <time dateTime={message.createdAt}>{time.format(new Date(message.createdAt))}</time>
                    </p>
                    <p className="study-message-text">{message.text}</p>
                    {'delivery' in message && (message.delivery === 'sending'
                      ? <p role="status" className="text-sm text-[#424753]">Enviando…</p>
                      : <p role="alert" className="mt-1 text-right text-sm text-[#BA1A1A]">No enviado ·{' '}
                        <button type="button" className="min-h-6 font-semibold underline underline-offset-2 disabled:opacity-60"
                          disabled={!connected} onClick={() => void chat.deliver(message, send)}>Reintentar</button>
                      </p>)}
                  </div>
                </li>
              })}
            </ol>
          </div>
        </div>
        {newCount > 0 && <div className="study-new-messages">
          <button type="button" onClick={scrollToEnd} className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full border border-[#1f4e79] bg-white px-5 text-sm font-semibold text-[#1f4e79] shadow-lg">
            {downIcon}{newCount === 1 ? '1 mensaje nuevo' : `${newCount} mensajes nuevos`}
          </button>
        </div>}
      </div>
      <form className="study-chat-form" onSubmit={(event) => { event.preventDefault(); submit() }}>
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <label className="font-semibold" htmlFor={inputId}>Escribe un mensaje</label>
          <span className={tooLong ? 'font-semibold text-red-800' : 'text-[#424753]'}>{length} / {MESSAGE_LIMIT}</span>
        </div>
        <textarea id={inputId} rows={2} value={text} onChange={(event) => setText(event.target.value)}
          placeholder="Comparte una idea o pregunta con la sala…"
          aria-invalid={tooLong} aria-describedby={tooLong ? `${inputId}-error` : undefined}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault()
              if (!event.repeat) submit()
            }
          }} />
        {tooLong && <p id={`${inputId}-error`} role="alert" className="flex items-start gap-1.5 text-sm font-medium text-red-700">
          <span aria-hidden="true">⚠</span> Tu mensaje supera los 1000 caracteres. Acórtalo para poder enviarlo.
        </p>}
        <div className="study-chat-send">
          <span className="hidden text-sm text-[#424753] md:inline">Enter para enviar · Shift + Enter para una nueva línea</span>
          <Button type="submit" disabled={!canSend} icon={sendIcon}>Enviar</Button>
        </div>
      </form>
    </section>
  )
}
