import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent, ReactNode, RefObject } from 'react'
import type { UserProfile } from '../../types/auth'
import { Alert } from '../ui/Alert'
import { AvatarSelector } from '../ui/AvatarSelector'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { UserAvatar } from '../ui/UserAvatar'
import { useAnnouncer } from '../ui/LiveAnnouncer'
import { ApiError } from '../../services/apiErrors'
import { updateMyProfile, uploadMyAvatar } from '../../services/userService'
import {
  USERNAME_MAX_LENGTH,
  buildProfilePatch,
  draftFromProfile,
  errorsFromApi,
  firstErrorField,
  validateProfileDraft,
} from '../../utils/profileForm'
import type { ProfileDraft, ProfileErrors, ProfileField } from '../../utils/profileForm'

export interface ProfileEditorProps {
  profile: UserProfile
  /** Perfil actualizado por la API: el padre refresca la sesión y el encabezado. */
  onSaved: (profile: UserProfile) => void
  /** Contenido extra al final de la columna derecha (zona de riesgo, US-05). */
  footer?: ReactNode
}

type SaveStatus = 'idle' | 'saving' | 'success' | 'error'
type FocusTarget = Exclude<ProfileField, 'avatar'> | 'success' | 'banner'

interface Banner {
  title: string
  message: string
  canRetry: boolean
}

const cardClass = 'bg-white border border-[#C2C6D5] rounded-2xl shadow-[0_2px_8px_-2px_rgba(11,37,64,0.05)]'

const SaveIcon = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 4h11l3 3v12a1 1 0 01-1 1H6a1 1 0 01-1-1V4zm3 0v5h7V4M8 20v-6h8v6" />
  </svg>
)
const UndoIcon = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14L4 9l5-5M4 9h10.5a5.5 5.5 0 010 11H11" />
  </svg>
)
const CameraIcon = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h1.6a2 2 0 001.7-.9l.8-1.2A2 2 0 0110.8 4h2.4a2 2 0 011.7.9l.8 1.2a2 2 0 001.7.9H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
)
const LockIcon = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path strokeLinecap="round" d="M8 11V7a4 4 0 018 0v4" />
  </svg>
)

function formatDate(iso: string | undefined): string | null {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function ProfileEditor({ profile, onSaved, footer }: ProfileEditorProps) {
  const announce = useAnnouncer()
  const pickerId = useId()
  const canEditEmail = profile.provider !== 'google'

  const [saved, setSaved] = useState<ProfileDraft>(() => draftFromProfile(profile))
  const [draft, setDraft] = useState<ProfileDraft>(saved)
  const [errors, setErrors] = useState<ProfileErrors>({})
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [banner, setBanner] = useState<Banner | null>(null)

  const fieldRefs: Record<Exclude<ProfileField, 'avatar'>, RefObject<HTMLInputElement | null>> = {
    firstName: useRef<HTMLInputElement>(null),
    lastName: useRef<HTMLInputElement>(null),
    username: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
  }
  const successRef = useRef<HTMLDivElement>(null)
  const bannerRef = useRef<HTMLDivElement>(null)

  const patch = buildProfilePatch(saved, draft, { canEditEmail })
  const isDirty = Object.keys(patch).length > 0 || avatarFile !== null
  const isSaving = status === 'saving'
  const errorCount = Object.values(errors).filter(Boolean).length
  const shownAvatar = avatarPreview ?? (draft.avatar || null)

  // El foco se mueve después del render: así el elemento ya existe y no está bloqueado.
  const [focusRequest, setFocusRequest] = useState<{ target: FocusTarget; seq: number } | null>(null)
  const requestFocus = (target: FocusTarget) => setFocusRequest((prev) => ({ target, seq: (prev?.seq ?? 0) + 1 }))
  useEffect(() => {
    if (!focusRequest) return
    const { target } = focusRequest
    if (target === 'success') successRef.current?.focus()
    else if (target === 'banner') bannerRef.current?.focus()
    else fieldRefs[target].current?.focus()
    // fieldRefs son refs estables
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusRequest])

  const updateField = (field: Exclude<ProfileField, 'avatar'>, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
    if (status === 'success') setStatus('idle')
  }

  const handleSelectAvatar = (id: string) => {
    if (id === 'custom') return // la foto propia llega por handleCustomFile
    setAvatarFile(null)
    setAvatarPreview(null)
    setDraft((current) => ({ ...current, avatar: id }))
    if (status === 'success') setStatus('idle')
  }

  const handleCustomFile = (file: File, previewUrl: string) => {
    setAvatarFile(file)
    setAvatarPreview(previewUrl)
    if (status === 'success') setStatus('idle')
  }

  const handleCancel = () => {
    setDraft(saved)
    setErrors({})
    setAvatarFile(null)
    setAvatarPreview(null)
    setBanner(null)
    setStatus('idle')
    setIsPickerOpen(false)
    announce('Se descartaron los cambios. Tus datos guardados siguen igual.')
  }

  const applySavedProfile = (next: UserProfile) => {
    const nextDraft = draftFromProfile(next)
    setSaved(nextDraft)
    setDraft((current) => ({ ...current, avatar: nextDraft.avatar }))
    onSaved(next)
    return nextDraft
  }

  const handleSubmit = async (event?: FormEvent) => {
    event?.preventDefault()
    if (!isDirty || isSaving) return

    // Solo se validan los campos que cambian: un perfil de Google puede venir sin apellidos.
    const allErrors = validateProfileDraft(draft, { canEditEmail })
    const clientErrors: ProfileErrors = {}
    for (const field of Object.keys(patch) as ProfileField[]) {
      if (allErrors[field]) clientErrors[field] = allErrors[field]
    }
    const firstInvalid = firstErrorField(clientErrors)
    if (firstInvalid) {
      setErrors(clientErrors)
      setStatus('error')
      setBanner({
        title: 'Revisa los campos señalados',
        message: 'Corrige los datos marcados en rojo y vuelve a guardar.',
        canRetry: false,
      })
      if (firstInvalid !== 'avatar') requestFocus(firstInvalid)
      return
    }

    setStatus('saving')
    setBanner(null)
    setErrors({})

    try {
      if (avatarFile) {
        const withPhoto = await uploadMyAvatar(avatarFile)
        setAvatarFile(null)
        setAvatarPreview(null)
        applySavedProfile(withPhoto)
      }

      // Con foto propia el avatar ya quedó guardado por la subida: no se envía en el PATCH.
      const pendingPatch = { ...patch }
      if (avatarFile) delete pendingPatch.avatar
      if (Object.keys(pendingPatch).length > 0) {
        const { profile: updated } = await updateMyProfile(pendingPatch)
        const nextDraft = applySavedProfile(updated)
        setDraft(nextDraft)
      }

      setStatus('success')
      setIsPickerOpen(false)
      requestFocus('success')
    } catch (error) {
      setStatus('error')
      const apiError = error instanceof ApiError ? error : null
      if (apiError?.code === 'UNAUTHENTICATED') return // ProtectedRoute lleva al login

      if (apiError && (apiError.status === 400 || apiError.status === 409)) {
        const fieldErrors = errorsFromApi(apiError.code, apiError.fields)
        const firstField = firstErrorField(fieldErrors)
        if (firstField) {
          setErrors(fieldErrors)
          setBanner({
            title: 'No se pudieron guardar los cambios',
            message: 'Corrige los campos señalados y vuelve a intentarlo. Lo que editaste sigue aquí.',
            canRetry: false,
          })
          if (firstField !== 'avatar') requestFocus(firstField)
          return
        }
      }

      setBanner({
        title: 'No pudimos guardar tus cambios',
        message: `${apiError?.message ?? 'Ocurrió un error inesperado.'} Lo que editaste sigue aquí.`,
        canRetry: true,
      })
      requestFocus('banner')
    }
  }

  const fullName = `${saved.firstName} ${saved.lastName}`.trim()
  const memberSince = formatDate(profile.createdAt)

  return (
    <div className="flex flex-col gap-6">
      {banner && (
        <div ref={bannerRef} tabIndex={-1} className="focus:outline-none">
          <Alert
            variant="error"
            title={banner.title}
            action={
              banner.canRetry ? (
                <Button size="sm" variant="outline" onClick={() => void handleSubmit()} isLoading={isSaving} loadingText="Reintentando…">
                  Reintentar
                </Button>
              ) : errorCount > 0 ? (
                <Badge variant="error" dot>
                  {errorCount === 1 ? '1 campo por corregir' : `${errorCount} campos por corregir`}
                </Badge>
              ) : undefined
            }
          >
            {banner.message}
          </Alert>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLUMNA IZQUIERDA: FOTO Y DATOS DE LA CUENTA */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <section aria-labelledby="photo-heading" className={`${cardClass} p-6 bg-linear-to-b from-[#EAF5FF] to-white`}>
            <h2 id="photo-heading" className="text-lg font-semibold text-[#001E2D] font-['Plus_Jakarta_Sans',sans-serif]">
              Foto de perfil
            </h2>
            <div className="mt-5 flex flex-col items-center text-center">
              <UserAvatar
                avatar={shownAvatar}
                firstName={saved.firstName}
                lastName={saved.lastName}
                className="w-32 h-32 text-4xl ring-4 ring-white shadow-md"
              />
              <p className="mt-4 text-xl font-semibold text-[#001E2D] [overflow-wrap:anywhere]">{fullName || 'Estudiante'}</p>
              {saved.username && <p className="text-sm text-[#424753]">@{saved.username}</p>}
              <Badge variant="institutional" className="mt-3">
                {canEditEmail ? 'Cuenta con correo y contraseña' : 'Cuenta de Google'}
              </Badge>
            </div>

            <Button
              variant="outline"
              fullWidth
              className="mt-6"
              icon={CameraIcon}
              aria-expanded={isPickerOpen}
              aria-controls={pickerId}
              onClick={() => setIsPickerOpen((open) => !open)}
            >
              {isPickerOpen ? 'Ocultar opciones de imagen' : 'Cambiar imagen'}
            </Button>
            <p className="mt-2 text-center text-xs text-[#424753]">JPG, PNG o WebP. Máximo 2 MB.</p>

            <div id={pickerId} hidden={!isPickerOpen} className="mt-4 lg:[&_[role=radiogroup]]:grid-cols-4">
              {isPickerOpen && (
                <>
                  <AvatarSelector
                    selectedId={avatarFile ? 'custom' : draft.avatar}
                    onSelect={handleSelectAvatar}
                    customPreview={avatarPreview}
                    onCustomFileSelect={handleCustomFile}
                    onClearCustomFile={() => {
                      setAvatarFile(null)
                      setAvatarPreview(null)
                    }}
                  />
                  <p className="mt-2 text-xs text-[#424753]">
                    La imagen se aplica cuando seleccionas <strong>Guardar cambios</strong>.
                  </p>
                </>
              )}
            </div>
          </section>

          <section aria-labelledby="account-heading" className={`${cardClass} p-6`}>
            <h2 id="account-heading" className="text-xs font-bold uppercase tracking-[0.08em] text-[#001E2D]">
              Tu cuenta
            </h2>
            <dl className="mt-4 flex flex-col gap-3 text-sm">
              <div className="flex flex-wrap justify-between gap-2">
                <dt className="text-[#424753]">Forma de ingreso</dt>
                <dd className="font-semibold text-[#001E2D]">{canEditEmail ? 'Correo y contraseña' : 'Google'}</dd>
              </div>
              {memberSince && (
                <div className="flex flex-wrap justify-between gap-2">
                  <dt className="text-[#424753]">Miembro desde</dt>
                  <dd className="font-semibold text-[#001E2D]">{memberSince}</dd>
                </div>
              )}
            </dl>
          </section>
        </div>

        {/* COLUMNA DERECHA: INFORMACIÓN PERSONAL */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <section aria-labelledby="info-heading" className={`${cardClass} p-6 sm:p-8`}>
            <h2 id="info-heading" className="text-2xl font-semibold text-[#001E2D] font-['Plus_Jakarta_Sans',sans-serif]">
              Información personal
            </h2>
            <p className="mt-1 text-sm text-[#424753]">
              Modifica tus datos y la forma en que apareces ante tus grupos de estudio.
            </p>

            <form noValidate onSubmit={(e) => void handleSubmit(e)} className="mt-6 pt-6 border-t border-[#DEF0FF] flex flex-col gap-5" aria-describedby="required-note">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  ref={fieldRefs.firstName}
                  id="profile-firstName"
                  label="Nombres"
                  required
                  autoComplete="given-name"
                  value={draft.firstName}
                  error={errors.firstName}
                  readOnly={isSaving}
                  onChange={(e) => updateField('firstName', e.target.value)}
                />
                <Input
                  ref={fieldRefs.lastName}
                  id="profile-lastName"
                  label="Apellidos"
                  required
                  autoComplete="family-name"
                  value={draft.lastName}
                  error={errors.lastName}
                  readOnly={isSaving}
                  onChange={(e) => updateField('lastName', e.target.value)}
                />
              </div>

              <Input
                ref={fieldRefs.username}
                id="profile-username"
                label="Nombre de usuario"
                required
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                value={draft.username}
                error={errors.username}
                readOnly={isSaving}
                startIcon={<span className="text-sm font-semibold text-[#424753]">@</span>}
                helperText="Visible para tus compañeros de sala. De 3 a 20 caracteres: letras, números, punto o guion bajo."
                badge={
                  <span className={draft.username.trim().length > USERNAME_MAX_LENGTH ? 'font-semibold text-red-700' : 'text-[#424753]'}>
                    {draft.username.trim().length}/{USERNAME_MAX_LENGTH} caracteres
                  </span>
                }
                onChange={(e) => updateField('username', e.target.value)}
              />

              {canEditEmail ? (
                <Input
                  ref={fieldRefs.email}
                  id="profile-email"
                  type="email"
                  label="Correo electrónico"
                  required
                  autoComplete="email"
                  value={draft.email}
                  error={errors.email}
                  readOnly={isSaving}
                  badge={<Badge variant="institutional">Cuenta manual</Badge>}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              ) : (
                <Input
                  ref={fieldRefs.email}
                  id="profile-email"
                  type="email"
                  label="Correo electrónico"
                  readOnly
                  value={draft.email}
                  endIcon={LockIcon}
                  className="[&_input]:bg-[#EAF5FF] [&_input]:cursor-default"
                  badge={<Badge variant="institutional">Cuenta vinculada con Google</Badge>}
                  helperText="Tu correo lo administra Google y aquí es de solo lectura. Para cambiarlo, hazlo desde la configuración de tu cuenta de Google."
                />
              )}

              {status === 'success' && (
                <div ref={successRef} tabIndex={-1} className="focus:outline-none">
                  <Alert variant="success" role="status" title="Tus cambios se guardaron">
                    Tu perfil quedó actualizado, también en el encabezado.
                  </Alert>
                </div>
              )}

              <div className="pt-5 border-t border-[#DEF0FF] flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
                <p id="required-note" className="text-xs text-[#424753]">
                  Los campos marcados con <span aria-hidden="true">*</span>
                  <span className="sr-only">asterisco</span> son obligatorios.
                </p>
                <div className="flex flex-col-reverse sm:flex-row gap-3">
                  <Button variant="outline" icon={UndoIcon} onClick={handleCancel} disabled={!isDirty || isSaving}>
                    Cancelar
                  </Button>
                  <Button type="submit" icon={SaveIcon} disabled={!isDirty} isLoading={isSaving} loadingText="Guardando cambios…">
                    Guardar cambios
                  </Button>
                </div>
              </div>
            </form>
          </section>
          {footer}
        </div>
      </div>
    </div>
  )
}
