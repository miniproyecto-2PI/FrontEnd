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
