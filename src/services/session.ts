/**
 * Almacenamiento de la sesión emitida por la API (POST /api/auth/login, /refresh).
 * El ID token de Firebase dura 1 h; el refresh token permite pedir uno nuevo sin
 * volver a escribir la contraseña.
 */

export const ACCESS_TOKEN_KEY = 'estudiemos_auth_token'
export const REFRESH_TOKEN_KEY = 'estudiemos_refresh_token'

/** Evento global que el AuthContext escucha para cerrar la sesión cuando vence. */
export const SESSION_EXPIRED_EVENT = 'estudiemos:session-expired'

function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string | null) {
  try {
    if (value) localStorage.setItem(key, value)
    else localStorage.removeItem(key)
  } catch {
    // Almacenamiento no disponible (modo privado o cuota llena)
  }
}

export function getAccessToken(): string | null {
  return read(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return read(REFRESH_TOKEN_KEY)
}

export function saveSessionTokens(tokens: { idToken: string; refreshToken?: string | null }) {
  write(ACCESS_TOKEN_KEY, tokens.idToken)
  if (tokens.refreshToken !== undefined) write(REFRESH_TOKEN_KEY, tokens.refreshToken)
}

export function clearSessionTokens() {
  write(ACCESS_TOKEN_KEY, null)
  write(REFRESH_TOKEN_KEY, null)
}

export function notifySessionExpired() {
  window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT))
}
