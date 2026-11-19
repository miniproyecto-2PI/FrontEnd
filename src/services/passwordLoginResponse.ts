import type { LoginResponse, UserProfile } from '../types/auth'

export function parsePasswordLoginResponse(body: unknown): LoginResponse | null {
  const response = body as {
    data?: { profile?: UserProfile; session?: { idToken?: string } }
    message?: unknown
  } | null
  const profile = response?.data?.profile
  const token = response?.data?.session?.idToken

  if (
    !profile ||
    typeof profile.uid !== 'string' || !profile.uid ||
    typeof profile.profileComplete !== 'boolean' ||
    typeof token !== 'string' || !token.trim()
  ) {
    return null
  }

  return {
    user: {
      ...profile,
      id: profile.uid,
      nombres: profile.firstName,
      apellidos: profile.lastName,
      avatarUrl: profile.avatar || profile.avatarUrl || 'avatar-01',
    },
    token,
    message: typeof response?.message === 'string' ? response.message : '¡Bienvenido de nuevo!',
  }
}

/** Refresh token de la sesión (POST /api/auth/login) para renovar el ID token sin volver a ingresar. */
export function extractRefreshToken(body: unknown): string | null {
  const token = (body as { data?: { session?: { refreshToken?: unknown } } } | null)?.data?.session?.refreshToken
  return typeof token === 'string' && token.trim() ? token : null
}
