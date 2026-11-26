import { useRef, useState } from 'react'
import type { FormEvent, RefObject } from 'react'
import { deleteRoom, renameRoom } from '../../services/roomService'
import type { Room } from '../../services/roomService'
import { ROOM_NAME_MAX, validateRoomName } from '../../utils/rooms'
import { ApiError } from '../../services/apiErrors'
import { Button } from '../ui/Button'
import { Alert } from '../ui/Alert'
import { Dialog } from '../ui/Dialog'
import { Input } from '../ui/Input'

export interface ManageRoomAction {
  kind: 'edit' | 'delete'
  room: Room
}

const editIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h4L19 9a2.8 2.8 0 00-4-4L4 16v4zM13.5 6.5l4 4" />
</svg>
const deleteIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  <path strokeLinecap="round" strokeLinejoin="round" d="M5 7h14M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
</svg>

export function RoomManagementButtons({ room, onAction }: {
  room: Room
  onAction: (action: ManageRoomAction, trigger: HTMLButtonElement) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button variant="outline" icon={editIcon} aria-haspopup="dialog" aria-label={`Editar la sala ${room.name}`}
        onClick={(event) => onAction({ kind: 'edit', room }, event.currentTarget)}>Editar</Button>
      <Button variant="danger-outline" icon={deleteIcon} aria-haspopup="dialog" aria-label={`Eliminar la sala ${room.name}`}
        onClick={(event) => onAction({ kind: 'delete', room }, event.currentTarget)}>Eliminar</Button>
    </div>
  )
}

export function ManageRoomDialog({ action, onClose, onSaved, onDeleted, returnFocusRef, onDeleteStart, onDeleteFailure }: {
  action: ManageRoomAction
  onClose: () => void
  onSaved: (room: Room) => void
  onDeleted: (room: Room) => void
  onDeleteStart?: () => void
  onDeleteFailure?: () => void
  returnFocusRef: RefObject<HTMLElement | null>
}) {
  const input = useRef<HTMLInputElement>(null)
  const cancel = useRef<HTMLButtonElement>(null)
  const [name, setName] = useState(action.room.name)
  const [fieldError, setFieldError] = useState<string>()
  const [failure, setFailure] = useState<string>()
  const [busy, setBusy] = useState(false)
  const deleting = action.kind === 'delete'
  const busyText = deleting ? 'Eliminando sala…' : 'Guardando…'

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (busy) return
    const invalid = deleting ? null : validateRoomName(name)
    if (invalid) {
      setFieldError(invalid)
      input.current?.focus()
      return
    }
    setFailure(undefined)
    setBusy(true)
    try {
      if (deleting) {
        onDeleteStart?.()
        await deleteRoom(action.room.id)
        onDeleted(action.room)
      } else {
        onSaved(await renameRoom(action.room.id, name))
      }
      onClose()
    } catch (error) {
      if (deleting) onDeleteFailure?.()
      setBusy(false)
      if (!deleting && error instanceof ApiError && error.fields.name) {
        setFieldError(error.fields.name)
        input.current?.focus()
      } else {
        setFailure(error instanceof ApiError ? error.message : 'Inténtalo de nuevo.')
      }
    }
  }

  return (
    <Dialog open onClose={onClose} dismissible={!busy} role={deleting ? 'alertdialog' : 'dialog'}
      returnFocusRef={returnFocusRef} initialFocusRef={deleting ? cancel : input}
      title={deleting ? `¿Eliminar «${action.room.name}»?` : 'Editar sala'}
      size={deleting ? 'lg' : 'md'}
      icon={deleting && <span className="grid size-12 place-items-center rounded-full bg-red-50 text-red-700">{deleteIcon}</span>}
      description={deleting ? 'Se eliminarán la sala y todo su chat. Esta acción no se puede deshacer.' :
        <>Cambia el nombre. El ID <code className="font-semibold">{action.room.id}</code> no cambia.</>}>
      <form noValidate onSubmit={submit} className="flex flex-col gap-5">
        {deleting && <p className="text-sm text-[#424753]">Si hay participantes conectados, recibirán un aviso y volverán a su panel.</p>}
        {failure && <Alert title={deleting ? 'No pudimos eliminar la sala' : 'No pudimos actualizar la sala'}>{failure}</Alert>}
        {!deleting && <Input label="Nombre de la sala" ref={input} value={name} readOnly={busy} required
          badge={<span className={`font-mono ${name.trim().length > ROOM_NAME_MAX ? 'text-red-700' : 'text-[#424753]'}`}>
            {name.trim().length} / {ROOM_NAME_MAX} caracteres</span>}
          autoComplete="off" error={fieldError} helperText="De 3 a 60 caracteres."
          onChange={(event) => { setName(event.target.value); setFieldError(undefined) }} />}
        <div className="flex flex-col-reverse gap-3 border-t border-[#DEF0FF] pt-5 sm:flex-row sm:justify-between">
          <Button ref={cancel} variant="ghost" disabled={busy} onClick={onClose}>Cancelar</Button>
          <Button variant={deleting ? 'danger' : 'primary'} type="submit" isLoading={busy} loadingText={busyText}>
            {failure ? 'Reintentar' : deleting ? 'Eliminar sala' : 'Guardar cambios'}
          </Button>
        </div>
        <span className="sr-only" role="status">{busy ? busyText : ''}</span>
      </form>
    </Dialog>
  )
}
