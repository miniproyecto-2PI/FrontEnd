import { useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { DeleteAccountDialog } from './DeleteAccountDialog'

/** US-05: zona separada del perfil con la acción peligrosa "Eliminar cuenta". */
export function DangerZone() {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  // Se lee de la sesión para usar el @usuario vigente aunque se acabe de editar
  const username = useAuth().user?.username ?? ''

  return (
    <section
      aria-labelledby="danger-heading"
      className="bg-white border border-[#C2C6D5] rounded-2xl shadow-[0_2px_8px_-2px_rgba(11,37,64,0.05)] p-6 sm:p-8"
    >
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#ffdad6] text-[#BA1A1A]" aria-hidden="true">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
          </svg>
        </span>
        <div>
          <h2 id="danger-heading" className="text-2xl font-semibold text-[#BA1A1A] font-['Plus_Jakarta_Sans',sans-serif]">
            Zona de riesgo
          </h2>
          <p className="mt-1 text-sm text-[#424753]">Acciones irreversibles sobre tu cuenta.</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-xl border border-[#ffdad6] bg-[#fff8f7] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <h3 className="text-base font-semibold text-[#001E2D]">Eliminar cuenta</h3>
          <p className="mt-1 text-sm leading-relaxed text-[#424753]">
            Al eliminar tu cuenta perderás de forma definitiva el acceso a Estudiemos y se cerrarán las salas que creaste.
          </p>
        </div>
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="dialog"
          onClick={() => setIsOpen(true)}
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#BA1A1A] bg-white px-5 text-sm font-semibold text-[#BA1A1A] transition-colors hover:bg-[#ffdad6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4e79]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM17 8l5 5M22 8l-5 5" />
          </svg>
          Eliminar mi cuenta…
        </button>
      </div>

      <DeleteAccountDialog open={isOpen} onClose={() => setIsOpen(false)} username={username} triggerRef={triggerRef} />
    </section>
  )
}
