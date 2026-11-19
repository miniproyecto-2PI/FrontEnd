import { validateEmail, validateUsername } from './validators.ts'

/**
 * Lógica pura del formulario "Mi Perfil" (US-04): detección de cambios, validación
 * con las reglas de US-01 y armado del PATCH con solo los campos modificados.
 */

export interface ProfileDraft {
  firstName: string
  lastName: string
  username: string
  email: string
  /** ID del catálogo (avatar-01…08), URL de una foto propia o cadena vacía. */
  avatar: string
}

export type ProfileField = keyof ProfileDraft
export type ProfileErrors = Partial<Record<ProfileField, string>>
export type ProfilePatch = Partial<ProfileDraft>

/** Orden visual de los campos: sirve para enfocar el primero con error. */
export const PROFILE_FIELD_ORDER: ProfileField[] = ['firstName', 'lastName', 'username', 'email']

export const NAME_MAX_LENGTH = 50
export const USERNAME_MAX_LENGTH = 20

const PRESET_AVATAR_ID = /^avatar-\d{2}$/

export function isPresetAvatar(avatar: string | null | undefined): boolean {
  return typeof avatar === 'string' && PRESET_AVATAR_ID.test(avatar)
}

export function draftFromProfile(profile: {
  firstName?: string | null
  lastName?: string | null
  username?: string | null
  email?: string | null
  avatar?: string | null
}): ProfileDraft {
  return {
    firstName: profile.firstName ?? '',
    lastName: profile.lastName ?? '',
    username: profile.username ?? '',
    email: profile.email ?? '',
    avatar: profile.avatar ?? '',
  }
}

function normalized(field: ProfileField, value: string): string {
  const trimmed = value.trim()
  return field === 'email' ? trimmed.toLowerCase() : trimmed
}

/**
 * Campos que cambiaron respecto a lo guardado. El correo solo se envía si la cuenta
 * lo permite (cuentas de Google lo tienen de solo lectura) y el avatar solo si es del
 * catálogo: las fotos propias se suben aparte (POST /api/users/me/avatar).
 */
export function buildProfilePatch(
  saved: ProfileDraft,
  draft: ProfileDraft,
  options: { canEditEmail: boolean }
): ProfilePatch {
  const patch: ProfilePatch = {}

  for (const field of ['firstName', 'lastName', 'username'] as const) {
    const next = normalized(field, draft[field])
    if (next !== normalized(field, saved[field])) patch[field] = next
  }

  if (options.canEditEmail) {
    const nextEmail = normalized('email', draft.email)
    if (nextEmail !== normalized('email', saved.email)) patch.email = nextEmail
  }

  if (draft.avatar !== saved.avatar && isPresetAvatar(draft.avatar)) patch.avatar = draft.avatar

  return patch
}

function validateName(value: string, label: 'nombres' | 'apellidos'): string | null {
  const trimmed = value.trim()
  if (!trimmed) return `Escribe tus ${label}.`
  if (trimmed.length > NAME_MAX_LENGTH) return `Tus ${label} pueden tener máximo ${NAME_MAX_LENGTH} caracteres.`
  return null
}

/** Mismas reglas de US-01; la API vuelve a validar (fuente de verdad). */
export function validateProfileDraft(draft: ProfileDraft, options: { canEditEmail: boolean }): ProfileErrors {
  const errors: ProfileErrors = {}
  const firstName = validateName(draft.firstName, 'nombres')
  const lastName = validateName(draft.lastName, 'apellidos')
  const username = validateUsername(draft.username)
  const email = options.canEditEmail ? validateEmail(draft.email) : null

  if (firstName) errors.firstName = firstName
  if (lastName) errors.lastName = lastName
  if (username) errors.username = username
  if (email) errors.email = email
  return errors
}

export function firstErrorField(errors: ProfileErrors): ProfileField | null {
  return PROFILE_FIELD_ORDER.find((field) => errors[field]) ?? null
}

/** Mensajes de disponibilidad de la API (409) llevados al campo correspondiente. */
export function errorsFromApi(code: string, fields: Record<string, string>): ProfileErrors {
  const errors: ProfileErrors = {}
  for (const field of PROFILE_FIELD_ORDER) {
    if (fields[field]) errors[field] = fields[field]
  }
  if (code === 'USERNAME_TAKEN') errors.username = 'Ese nombre de usuario ya lo usa otra persona. Prueba con otro.'
  if (code === 'EMAIL_IN_USE') errors.email = 'Ese correo ya está registrado en otra cuenta. Usa uno diferente.'
  return errors
}

/** Iniciales para el avatar por defecto ("Mateo Cardona" → "MC"). */
export function initialsOf(firstName: string, lastName: string): string {
  const first = firstName.trim().charAt(0)
  const last = lastName.trim().charAt(0)
  return `${first}${last}`.toUpperCase() || 'E'
}
