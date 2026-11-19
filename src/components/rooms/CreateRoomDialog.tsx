import { useRef, useState } from 'react'
import type { FormEvent, RefObject } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '../../services/apiErrors'
import { createRoom } from '../../services/roomService'
import { ROOM_NAME_MAX, validateRoomName } from '../../utils/rooms'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'
import { Input } from '../ui/Input'

export interface CreateRoomDialogProps {
  open: boolean
  onClose: () => void
  returnFocusRef?: RefObject<HTMLElement | null>
}

/** US-06: formulario "Crear sala" con validación; al crearla entra a /salas/:id como anfitrión. */
export function CreateRoomDialog({ open, onClose, returnFocusRef }: CreateRoomDialogProps) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | undefined>()
  const [failure, setFailure] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const length = name.trim().length
  // El error aparece al intentar crear o, en vivo, apenas se supera el máximo
  const clientError = submitted || length > ROOM_NAME_MAX ? validateRoomName(name) : null
  const fieldError = serverError ?? clientError ?? undefined

  const reset = () => {
    setName('')
    setSubmitted(false)
    setServerError(undefined)
    setFailure(null)
  }

  const handleClose = () => {
    if (isCreating) return
    reset()
    onClose()
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (isCreating) return
    setSubmitted(true)
    setFailure(null)
    if (validateRoomName(name)) {
      inputRef.current?.focus()
      return
    }

    setIsCreating(true)
    try {
      const room = await createRoom(name)
      reset()
      setIsCreating(false)
      onClose()
      navigate(`/salas/${encodeURIComponent(room.id)}`, { state: { created: true, room } })
    } catch (error) {
      setIsCreating(false)
      if (error instanceof ApiError && error.code === 'UNAUTHENTICATED') return
      if (error instanceof ApiError && error.fields.name) {
        setServerError(error.fields.name)
        inputRef.current?.focus()
        return
      }
      setFailure(error instanceof ApiError ? error.message : 'Ocurrió un error inesperado.')
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Crear una sala de estudio"
      description="Ponle un nombre para que tus compañeros identifiquen la sesión de estudio."
      dismissible={!isCreating}
      initialFocusRef={inputRef}
      returnFocusRef={returnFocusRef}
    >
      <form noValidate onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-5">
        {failure && (
          <Alert variant="error" title="No pudimos crear la sala">
            {failure} Intenta de nuevo.
          </Alert>
        )}

        <Input
          ref={inputRef}
          id="room-name"
          label="Nombre de la sala"
          required
          autoComplete="off"
          placeholder="Por ejemplo: Parcial de Cálculo Vectorial"
          value={name}
          readOnly={isCreating}
          error={fieldError}
          helperText={`De 3 a ${ROOM_NAME_MAX} caracteres.`}
          badge={
            <span className={`font-mono ${length > ROOM_NAME_MAX ? 'font-semibold text-red-700' : 'text-[#424753]'}`}>
              {length} / {ROOM_NAME_MAX} caracteres
            </span>
          }
          onChange={(e) => {
            setName(e.target.value)
            if (serverError) setServerError(undefined)
          }}
        />

        <div className="flex flex-col-reverse gap-3 border-t border-[#DEF0FF] pt-5 sm:flex-row sm:justify-between">
          <Button variant="ghost" onClick={handleClose} disabled={isCreating}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isCreating} loadingText="Creando sala…">
            Crear sala e ingresar <span aria-hidden="true">→</span>
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
