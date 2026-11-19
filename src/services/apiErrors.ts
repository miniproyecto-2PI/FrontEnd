/**
 * Contrato de errores TS-05: { error: { code, message, fields } }.
 * Funciones puras (sin fetch ni import.meta) para poder probarlas con node --test.
 */

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'PROFILE_INCOMPLETE'
  | 'NOT_FOUND'
  | 'ROOM_NOT_FOUND'
  | 'USERNAME_TAKEN'
  | 'EMAIL_IN_USE'
  | 'TOO_MANY_REQUESTS'
  | 'INTERNAL'
  | 'DATABASE_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | (string & {})

export class ApiError extends Error {
  readonly status: number
  readonly code: ApiErrorCode
  readonly fields: Record<string, string>

  constructor(status: number, code: ApiErrorCode, message: string, fields?: Record<string, string> | null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.fields = fields ?? {}
  }
}

const DEFAULT_MESSAGES: Record<number, string> = {
  400: 'Revisa los datos enviados e intenta de nuevo.',
  401: 'Tu sesión venció. Inicia sesión de nuevo para continuar.',
  403: 'No tienes permiso para hacer esta acción.',
  404: 'No encontramos lo que buscas.',
  409: 'Ese dato ya lo usa otra persona.',
  429: 'Hiciste demasiados intentos. Espera unos minutos e intenta de nuevo.',
  500: 'Algo salió mal en el servidor. Intenta de nuevo en unos minutos.',
  503: 'El servicio no está disponible en este momento. Intenta de nuevo en unos minutos.',
}

const DEFAULT_CODES: Record<number, ApiErrorCode> = {
  400: 'VALIDATION_ERROR',
  401: 'UNAUTHENTICATED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'VALIDATION_ERROR',
  429: 'TOO_MANY_REQUESTS',
  500: 'INTERNAL',
  503: 'SERVICE_UNAVAILABLE',
}

function defaultMessage(status: number): string {
  return DEFAULT_MESSAGES[status] ?? (status >= 500 ? DEFAULT_MESSAGES[500] : 'No pudimos completar la acción. Intenta de nuevo.')
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every((v) => typeof v === 'string')
  )
}

/** Convierte la respuesta de error de la API en un ApiError con mensaje en español. */
export function parseApiError(status: number, body: unknown): ApiError {
  const payload = (body as { error?: unknown } | null)?.error as
    | { code?: unknown; message?: unknown; fields?: unknown }
    | undefined

  const code =
    typeof payload?.code === 'string' && payload.code
      ? payload.code
      : DEFAULT_CODES[status] ?? (status >= 500 ? 'INTERNAL' : 'VALIDATION_ERROR')
  const message =
    typeof payload?.message === 'string' && payload.message.trim() ? payload.message : defaultMessage(status)
  const fields = isStringRecord(payload?.fields) ? payload.fields : {}

  return new ApiError(status, code, message, fields)
}

export const NETWORK_ERROR_MESSAGE = 'No pudimos conectar con el servidor. Revisa tu conexión e intenta de nuevo.'
export const TIMEOUT_MESSAGE = 'El servidor está tardando en responder. Intenta de nuevo en unos segundos.'
