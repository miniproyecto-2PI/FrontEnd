import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Room } from '../../services/roomService'
import { formatRoomDate } from '../../utils/rooms'
import { CopyRoomIdButton } from './CopyRoomIdButton'

export function HostBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#aef0df] px-2.5 py-1 text-xs font-semibold text-[#00201a]">
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
      </svg>
      Anfitrión
    </span>
  )
}

/** Tarjeta de sala del panel (US-06): nombre, rol, ID con "Copiar ID" y "Entrar a la sala". */
export function RoomCard({ room, actions }: { room: Room; actions?: ReactNode }) {
  const created = formatRoomDate(room.createdAt)
  const headingId = `room-${room.id}-name`

  return (
    <article
      aria-labelledby={headingId}
      className="flex flex-col gap-5 rounded-2xl border border-[#C2C6D5] bg-white p-6 shadow-[0_2px_8px_-2px_rgba(11,37,64,0.05)] transition-[border-color,box-shadow] hover:border-[#1f4e79] hover:shadow-[0_8px_24px_-4px_rgba(31,78,121,0.08)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        {created ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF5FF] px-2.5 py-1 text-xs font-medium text-[#424753]">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path strokeLinecap="round" d="M3 10h18M8 3v4M16 3v4" />
            </svg>
            Creada el {created}
          </span>
        ) : (
          <span />
        )}
        <HostBadge />
      </div>

      <h3 id={headingId} className="text-xl font-semibold text-[#001E2D] [overflow-wrap:anywhere] font-['Plus_Jakarta_Sans',sans-serif]">
        {room.name}
      </h3>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#EAF5FF] p-3 pl-4">
        <p className="min-w-0">
          <span className="block text-xs font-medium text-[#424753]">ID de la sala</span>
          <span className="font-mono text-base font-bold tracking-[0.12em] text-[#00375e]">{room.id}</span>
        </p>
        <CopyRoomIdButton roomId={room.id} roomName={room.name} />
      </div>

      <Link
        to={`/salas/${encodeURIComponent(room.id)}`}
        aria-label={`Entrar a la sala ${room.name}`}
        className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#00375e] px-6 text-sm font-semibold text-white! transition-colors hover:bg-[#163A5A] active:bg-[#0B2540]"
      >
        Entrar a la sala
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
        </svg>
      </Link>
      {actions && <div className="border-t border-[#DEF0FF] pt-4">{actions}</div>}
    </article>
  )
}
