import { useEffect, useId, useRef } from 'react'
import type { KeyboardEvent, ReactNode, RefObject } from 'react'

export interface DialogProps {
  open: boolean
  /** Se llama con Esc, con la X o al pulsar fuera (si closeOnBackdrop). */
  onClose: () => void
  title: string
  /** Texto que el lector de pantalla lee junto al título (aria-describedby). */
  description?: ReactNode
  /** alertdialog para confirmaciones críticas (US-05). */
  role?: 'dialog' | 'alertdialog'
  /** false mientras hay una operación en curso: Esc y la X no cierran. */
  dismissible?: boolean
  closeOnBackdrop?: boolean
  icon?: ReactNode
  /** Elemento que recibe el foco al abrir; si no, el primer elemento enfocable. */
  initialFocusRef?: RefObject<HTMLElement | null>
  /** Elemento que recupera el foco al cerrar (p. ej. el botón que abrió el modal). */
  returnFocusRef?: RefObject<HTMLElement | null>
  size?: 'md' | 'lg'
  children: ReactNode
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Modal accesible base (TS-06) sobre <dialog> nativo:
 * - showModal() vuelve inerte el resto de la página; además el foco se atrapa con Tab.
 * - Esc cierra (salvo dismissible=false) y el foco vuelve al elemento que abrió el modal.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  role = 'dialog',
  dismissible = true,
  closeOnBackdrop = false,
  icon,
  initialFocusRef,
  returnFocusRef: explicitReturnRef,
  size = 'md',
  children,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      // Safari no enfoca los botones al hacer clic: se prefiere el elemento indicado
      returnFocusRef.current =
        explicitReturnRef?.current ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null)
      dialog.showModal()
      document.body.style.overflow = 'hidden'
      const target = initialFocusRef?.current ?? dialog.querySelector<HTMLElement>(FOCUSABLE)
      target?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open, initialFocusRef, explicitReturnRef])

  // Al cerrarse (o desmontarse) se devuelve el foco y se libera el scroll
  useEffect(() => {
    if (open) return
    document.body.style.overflow = ''
    const target = returnFocusRef.current
    returnFocusRef.current = null
    if (target?.isConnected) target.focus()
  }, [open])

  useEffect(
    () => () => {
      document.body.style.overflow = ''
    },
    []
  )

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Tab') return
    const focusables = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
      (el) => el.offsetParent !== null || el === document.activeElement
    )
    if (focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const widthClass = size === 'lg' ? 'max-w-xl' : 'max-w-md'

  return (
    <dialog
      ref={dialogRef}
      role={role}
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        // Esc: el cierre lo decide React (estado open), no el navegador
        event.preventDefault()
        if (dismissible) onClose()
      }}
      onClick={(event) => {
        if (closeOnBackdrop && dismissible && event.target === dialogRef.current) onClose()
      }}
      onKeyDown={handleKeyDown}
      className={`m-auto w-[calc(100%-2rem)] ${widthClass} max-h-[calc(100dvh-2rem)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-2xl border border-[#C2C6D5] bg-white p-0 text-[#001E2D] shadow-[0_20px_40px_-8px_rgba(11,37,64,0.14)] backdrop:bg-[#0B2540]/55 backdrop:backdrop-blur-[2px]`}
    >
      {open && (
        <div className="p-6 sm:p-7">
          <div className="flex items-start gap-4">
            {icon && <div className="shrink-0" aria-hidden="true">{icon}</div>}
            <div className="min-w-0 flex-1">
              <h2 id={titleId} className="text-xl sm:text-2xl font-bold tracking-[-0.01em] text-[#001E2D] font-['Plus_Jakarta_Sans',sans-serif]">
                {title}
              </h2>
              {description && (
                <div id={descriptionId} className="mt-1 text-sm text-[#424753]">
                  {description}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissible && onClose()}
              disabled={!dismissible}
              aria-label="Cerrar"
              className="-mr-2 -mt-2 grid size-11 shrink-0 place-items-center rounded-lg text-[#424753] hover:bg-[#EAF5FF] hover:text-[#001E2D] disabled:opacity-40"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <div className="mt-5">{children}</div>
        </div>
      )}
    </dialog>
  )
}
