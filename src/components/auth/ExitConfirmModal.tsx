import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

export interface ExitConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirmExit: () => void
}

export function ExitConfirmModal({ isOpen, onClose, onConfirmExit }: ExitConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="¿Salir sin elegir nombre?"
      icon={
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      }
    >
      <p className="text-slate-600 mb-6">
        Tu cuenta de Estudiemos no se creará y deberás volver a ingresar con Google la próxima vez.
      </p>

      <div className="flex items-center justify-center gap-3 w-full">
        <Button variant="outline" size="md" className="flex-1" onClick={onConfirmExit}>
          Salir
        </Button>
        <Button variant="primary" size="md" className="flex-1" onClick={onClose}>
          Seguir aquí
        </Button>
      </div>
    </Modal>
  )
}

