import { useEffect } from 'react'
import type { ReactNode } from 'react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  icon?: ReactNode
}

export function Modal({ isOpen, onClose, title, children, icon }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102c40]/50 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="w-full max-w-md bg-white border border-[#cbd5e1] rounded-2xl p-6 sm:p-7 shadow-xl animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          {icon && <div className="mb-4">{icon}</div>}
          {title && (
            <h2 id="modal-title" className="text-lg font-bold text-[#102c40]">
              {title}
            </h2>
          )}
          <div className="mt-2 text-xs sm:text-sm text-[#526679] leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  )
}
