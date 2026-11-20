import { useRef, useState } from 'react'
import type { FormEvent, ReactNode, RefObject } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ApiError } from '../../services/apiErrors'
import { deleteMyAccount } from '../../services/userService'
import { setFlash } from '../../services/flash'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'
import { Input } from '../ui/Input'

export interface DeleteAccountDialogProps {
  open: boolean
  onClose: () => void
  username: string
  /** Botón que abrió el modal: recupera el foco al cerrar. */
  triggerRef?: RefObject<HTMLElement | null>
}

/** Mensaje que la pantalla de inicio de sesión muestra tras la eliminación. */
export const ACCOUNT_DELETED_FLASH = 'Tu cuenta fue eliminada. Esperamos verte pronto de regreso.'

interface PolicyItem {
  title: string
  text: ReactNode
  icon: ReactNode
}

const iconClass = 'w-5 h-5'

export function DeleteAccountDialog({ open, onClose, username, triggerRef }: DeleteAccountDialogProps) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const confirmRef = useRef<HTMLInputElement>(null)
  const [confirmation, setConfirmation] = useState('')
  const [confirmError, setConfirmError] = useState<string | undefined>()
  const [isDeleting, setIsDeleting] = useState(false)
  const [failure, setFailure] = useState<string | null>(null)

  const policies: PolicyItem[] = [
    {
      title: 'Tus salas de estudio',
      text: 'Se cerrarán para siempre y quienes estén dentro recibirán un aviso.',
      icon: (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 21h16M6 21V4a1 1 0 011-1h10a1 1 0 011 1v17M14 12h.01" />
        </svg>
      ),
    },
    {
      title: 'Tus mensajes',
      text: (
        <>
          Los que enviaste en salas ajenas quedan como <strong>"Usuario eliminado"</strong>, sin tu nombre ni tu foto.
        </>
      ),
      icon: (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5M21 12a8 8 0 01-11.6 7.1L4 20l1-4.3A8 8 0 1121 12z" />
        </svg>
      ),
    },
    {
      title: 'Tu nombre de usuario',
      text: (
        <>
          <strong>@{username}</strong> quedará libre de inmediato para otra persona.
        </>
      ),
      icon: (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M16 12v1.5a2.5 2.5 0 005 0V12a9 9 0 10-3.5 7.1" />
        </svg>
      ),
    },
    {
      title: 'Tus datos personales',
      text: 'Se borran tu perfil y tu cuenta de acceso; no podrás volver a entrar con ella.',
      icon: (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 7h14M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
        </svg>
      ),
    },
  ]

  const reset = () => {
    setConfirmation('')
    setConfirmError(undefined)
    setFailure(null)
  }

  const handleClose = () => {
    if (isDeleting) return
    reset()
    onClose()
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (isDeleting) return

    if (confirmation.trim().toLowerCase() !== username.toLowerCase()) {
      setConfirmError(`Escribe ${username} exactamente como aparece para confirmar.`)
      confirmRef.current?.focus()
      return
    }

    setIsDeleting(true)
    setFailure(null)
    try {
      await deleteMyAccount()
      setFlash(ACCOUNT_DELETED_FLASH)
      logout()
      navigate('/ingresar', { replace: true })
    } catch (error) {
      setIsDeleting(false)
      if (error instanceof ApiError && error.code === 'UNAUTHENTICATED') return
      const detail = error instanceof ApiError ? error.message : 'Ocurrió un error inesperado.'
      setFailure(`${detail} Tu sesión sigue activa y no se eliminó nada.`)
    }
  }

  const warningIcon = (
    <span className="grid size-12 place-items-center rounded-full bg-[#ffdad6] text-[#BA1A1A]">
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
      </svg>
    </span>
  )

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      role="alertdialog"
      title="¿Eliminar tu cuenta?"
      description="Esta acción es permanente y no se puede deshacer."
      dismissible={!isDeleting}
      icon={warningIcon}
      initialFocusRef={confirmRef}
      returnFocusRef={triggerRef}
      size="lg"
    >
      <form noValidate onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-5">
        {failure && (
          <Alert variant="error" title="No pudimos eliminar tu cuenta. Intenta de nuevo.">
            {failure}
          </Alert>
        )}

        <section aria-labelledby="delete-policy-heading">
          <h3 id="delete-policy-heading" className="text-xs font-bold uppercase tracking-[0.08em] text-[#424753]">
            Qué pasará con tu información
          </h3>
          <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {policies.map((item) => (
              <li key={item.title} className="flex gap-2.5 rounded-xl border border-[#DEF0FF] bg-[#F5FAFF] p-3">
                <span className="mt-0.5 shrink-0 text-[#BA1A1A]" aria-hidden="true">
                  {item.icon}
                </span>
                <p className="text-[13px] leading-snug text-[#424753]">
                  <strong className="block text-[#001E2D]">{item.title}</strong>
                  {item.text}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <Input
          ref={confirmRef}
          id="delete-confirmation"
          label={`Escribe ${username} para confirmar`}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          value={confirmation}
          readOnly={isDeleting}
          error={confirmError}
          onChange={(e) => {
            setConfirmation(e.target.value)
            if (confirmError) setConfirmError(undefined)
          }}
        />

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={handleClose} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button type="submit" variant="danger" isLoading={isDeleting} loadingText="Eliminando tu cuenta…">
            Eliminar mi cuenta definitivamente
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
