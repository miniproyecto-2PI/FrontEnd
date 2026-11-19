import { auth, isFirebaseConfigured } from '../config/firebase'
import { ApiError, NETWORK_ERROR_MESSAGE, TIMEOUT_MESSAGE, parseApiError } from './apiErrors'
import {
  clearSessionTokens,
  getAccessToken,
  getRefreshToken,
  notifySessionExpired,
  saveSessionTokens,
} from './session'

/**
 * Cliente HTTP único para la API REST (Sprint 2+).
 * - Agrega `Authorization: Bearer <ID token>`.
 * - Si la API responde 401, intenta renovar la sesión una vez y repite la petición.
 * - Traduce cualquier fallo al contrato TS-05 (ApiError con code, message y fields).
 */

const REQUEST_TIMEOUT_MS = 30_000

/** VITE_API_URL apunta a un endpoint completo (TS-00); de ahí se toma solo el origen. */
export function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_URL as string | undefined
  if (!envUrl) return 'http://localhost:3000'
  try {
    const parsed = new URL(envUrl)
    return `${parsed.protocol}//${parsed.host}`
  } catch {
    return 'http://localhost:3000'
  }
}

export interface ApiSuccess<T> {
  data: T
  message: string
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  body?: unknown
  formData?: FormData
  signal?: AbortSignal
  /** false para endpoints públicos. Por defecto envía el token. */
  auth?: boolean
}

let refreshInFlight: Promise<string | null> | null = null

async function requestNewToken(): Promise<string | null> {
  // Sesiones iniciadas con el SDK de Firebase (Google por ventana emergente)
  if (isFirebaseConfigured && auth?.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken(true)
      saveSessionTokens({ idToken: token })
      return token
    } catch {
      return null
    }
  }

  const refreshToken = getRefreshToken()
  if (!refreshToken) return null

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    if (!response.ok) return null
    const json = (await response.json()) as { data?: { idToken?: string; refreshToken?: string } }
    const idToken = json.data?.idToken
    if (!idToken) return null
    saveSessionTokens({ idToken, refreshToken: json.data?.refreshToken ?? refreshToken })
    return idToken
  } catch {
    return null
  }
}

/** Una sola renovación a la vez aunque varias peticiones reciban 401 en paralelo. */
function refreshAccessToken(): Promise<string | null> {
  refreshInFlight ??= requestNewToken().finally(() => {
    refreshInFlight = null
  })
  return refreshInFlight
}

async function currentToken(): Promise<string | null> {
  if (isFirebaseConfigured && auth?.currentUser) {
    try {
      return await auth.currentUser.getIdToken()
    } catch {
      // Se usa el token guardado
    }
  }
  return getAccessToken()
}

async function send(path: string, options: ApiRequestOptions, token: string | null): Promise<Response> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort('timeout'), REQUEST_TIMEOUT_MS)
  const onExternalAbort = () => controller.abort(options.signal?.reason)
  options.signal?.addEventListener('abort', onExternalAbort)

  try {
    return await fetch(`${getApiBaseUrl()}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.formData ?? (options.body !== undefined ? JSON.stringify(options.body) : undefined),
      signal: controller.signal,
    })
  } catch (error) {
    if (options.signal?.aborted) throw error
    if (controller.signal.aborted) throw new ApiError(0, 'TIMEOUT', TIMEOUT_MESSAGE)
    throw new ApiError(0, 'NETWORK_ERROR', NETWORK_ERROR_MESSAGE)
  } finally {
    clearTimeout(timeout)
    options.signal?.removeEventListener('abort', onExternalAbort)
  }
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<ApiSuccess<T>> {
  const useAuth = options.auth !== false
  let token = useAuth ? await currentToken() : null

  if (useAuth && !token) {
    notifySessionExpired()
    throw parseApiError(401, null)
  }

  let response = await send(path, options, token)

  if (response.status === 401 && useAuth) {
    token = await refreshAccessToken()
    if (token) response = await send(path, options, token)
    if (response.status === 401) {
      clearSessionTokens()
      notifySessionExpired()
    }
  }

  const body: unknown = await response.json().catch(() => null)

  if (!response.ok) throw parseApiError(response.status, body)

  const envelope = body as { data?: T; message?: unknown } | null
  return {
    data: envelope?.data as T,
    message: typeof envelope?.message === 'string' ? envelope.message : '',
  }
}

export { ApiError }
