import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider, isFirebaseConfigured } from '../config/firebase'
import type { GoogleAuthResult, RegisterFormData, RegisterResponse, UserProfile } from '../types/auth'
import { PRESET_AVATARS } from '../constants/avatars'

// Registros preexistentes para pruebas de unicidad y simulación offline
const INITIAL_USERS: Array<{ username: string; email: string; name: string }> = [
  { username: 'ana_01', email: 'ana.martinez@univalle.edu.co', name: 'Ana Martínez' },
  { username: 'mateocardona', email: 'mateo.cardona@udea.edu.co', name: 'Mateo Cardona' },
  { username: 'mateo', email: 'mateo.test@udea.edu.co', name: 'Mateo Test' },
  { username: 'camilarestrepo', email: 'camila.restrepo@unal.edu.co', name: 'Camila Restrepo' },
]

const STORAGE_USERS_KEY = 'estudiemos_registered_users'
const STORAGE_TOKEN_KEY = 'estudiemos_auth_token'

function getStoredUsers(): Array<{ username: string; email: string; name: string }> {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_USERS))
      return INITIAL_USERS
    }
    return JSON.parse(raw) as Array<{ username: string; email: string; name: string }>
  } catch {
    return INITIAL_USERS
  }
}

function saveStoredUser(user: { username: string; email: string; name: string }) {
  try {
    const users = getStoredUsers()
    users.push(user)
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users))
  } catch {
    // Ignore storage quota
  }
}

function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_URL as string | undefined
  if (!envUrl) return 'http://localhost:3000'
  try {
    const parsed = new URL(envUrl)
    return `${parsed.protocol}//${parsed.host}`
  } catch {
    return 'http://localhost:3000'
  }
}

export class AuthError extends Error {
  code: 'USERNAME_TAKEN' | 'EMAIL_ALREADY_IN_USE' | 'VALIDATION_ERROR' | 'NETWORK_ERROR' | 'UNKNOWN'
  field?: 'username' | 'email' | 'password' | 'nombres' | 'apellidos' | 'general'

  constructor(message: string, code: AuthError['code'], field?: AuthError['field']) {
    super(message)
    this.name = 'AuthError'
    this.code = code
    this.field = field
  }
}

export async function checkUsernameAvailability(username: string): Promise<boolean> {
  const clean = username.trim().toLowerCase()
  if (!clean || clean.length < 3) return true

  const users = getStoredUsers()
  return !users.some((u) => u.username.toLowerCase() === clean)
}

export async function checkEmailAvailability(email: string): Promise<boolean> {
  const clean = email.trim().toLowerCase()
  if (!clean || !clean.includes('@')) return true

  const users = getStoredUsers()
  return !users.some((u) => u.email.toLowerCase() === clean)
}

export async function generateUsernameSuggestions(name: string, email: string): Promise<string[]> {
  const emailPart = email.split('@')[0]?.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'estudiante'
  const domainPart = email.split('@')[1]?.split('.')[0]?.toLowerCase() || 'estudio'
  const nameParts = name.trim().toLowerCase().split(/\s+/).filter(Boolean)
  const firstName = nameParts[0] || 'user'
  const lastName = nameParts[1] || ''

  const candidates: string[] = [
    `${firstName}_${domainPart}`,
    lastName ? `${firstName}_${lastName}2` : `${firstName}_${Math.floor(Math.random() * 90 + 10)}`,
    lastName ? `${firstName[0]}_${lastName}_${domainPart}` : `${firstName}_academico`,
    emailPart.length <= 20 ? emailPart : emailPart.slice(0, 20),
  ]

  const suggestions: string[] = []
  for (const cand of candidates) {
    const isFree = await checkUsernameAvailability(cand)
    if (isFree && !suggestions.includes(cand) && cand.length >= 3 && cand.length <= 20) {
      suggestions.push(cand)
    }
  }

  return suggestions.slice(0, 2)
}

/**
 * Registro manual de usuario (US-01) alineado con POST /api/auth/register
 */
export async function registerUser(formData: RegisterFormData): Promise<RegisterResponse> {
  const baseUrl = getApiBaseUrl()
  const registerEndpoint = `${baseUrl}/api/auth/register`

  // Contrato exacto del backend (registerSchema)
  const backendPayload = {
    firstName: formData.nombres.trim(),
    lastName: formData.apellidos.trim(),
    username: formData.username.trim(),
    avatar: formData.avatar,
    email: formData.email.trim().toLowerCase(),
    password: formData.password,
  }

  let backendSuccess = false
  let backendData: unknown = null

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 6000)

    const response = await fetch(registerEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(backendPayload),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (response.ok) {
      backendSuccess = true
      backendData = await response.json()
    } else {
      const errorJson = (await response.json().catch(() => ({}))) as Record<string, unknown>
      const errObj = (errorJson.error || errorJson) as Record<string, unknown>
      const code = (errObj.code || '') as string

      if (response.status === 409 || code === 'USERNAME_TAKEN') {
        if (code === 'USERNAME_TAKEN' || String(errObj.message).toLowerCase().includes('usuario')) {
          throw new AuthError('Este nombre de usuario ya está en uso, prueba con otro.', 'USERNAME_TAKEN', 'username')
        }
        throw new AuthError('Este correo ya tiene una cuenta. ¿Quieres iniciar sesión?', 'EMAIL_ALREADY_IN_USE', 'email')
      }

      if (response.status === 400) {
        throw new AuthError(String(errObj.message || 'Datos de registro inválidos.'), 'VALIDATION_ERROR')
      }

      if (response.status !== 404) {
        throw new AuthError(`Error de autenticación con el servidor (${response.status}).`, 'NETWORK_ERROR')
      }
    }
  } catch (err) {
    if (err instanceof AuthError) throw err
  }

  if (backendSuccess && backendData) {
    const res = backendData as Record<string, unknown>
    const user = (res.data || res.user || res) as UserProfile
    return {
      user: {
        ...user,
        id: user.uid,
        nombres: user.firstName,
        apellidos: user.lastName,
        avatarUrl: user.avatar || 'avatar-01',
      },
      message: typeof res.message === 'string' ? res.message : '¡Tu cuenta está lista!',
    }
  }

  // Simulación segura de persistencia y latencia
  await new Promise((resolve) => setTimeout(resolve, 1200))

  const existing = getStoredUsers()
  const lowerUsername = backendPayload.username.toLowerCase()
  const lowerEmail = backendPayload.email.toLowerCase()

  if (existing.some((u) => u.username.toLowerCase() === lowerUsername)) {
    throw new AuthError('Este nombre de usuario ya está en uso, prueba con otro.', 'USERNAME_TAKEN', 'username')
  }

  if (existing.some((u) => u.email.toLowerCase() === lowerEmail)) {
    throw new AuthError('Este correo ya tiene una cuenta. ¿Quieres iniciar sesión?', 'EMAIL_ALREADY_IN_USE', 'email')
  }

  saveStoredUser({
    username: backendPayload.username,
    email: backendPayload.email,
    name: `${backendPayload.firstName} ${backendPayload.lastName}`,
  })

  const avatarMatch = PRESET_AVATARS.find((a) => a.id === backendPayload.avatar)

  const created: UserProfile = {
    uid: `usr_${Date.now()}`,
    id: `usr_${Date.now()}`,
    firstName: backendPayload.firstName,
    lastName: backendPayload.lastName,
    nombres: backendPayload.firstName,
    apellidos: backendPayload.lastName,
    username: backendPayload.username,
    email: backendPayload.email,
    avatar: avatarMatch?.id || 'avatar-01',
    avatarUrl: avatarMatch?.id || 'avatar-01',
    provider: 'password',
    profileComplete: true,
    createdAt: new Date().toISOString(),
  }

  return {
    user: created,
    message: '¡Tu cuenta está lista!',
    token: `token_${Date.now()}`,
  }
}

/**
 * Autenticación con Google (US-02)
 * Se conecta con Google y consulta GET /api/users/me. Si el perfil está incompleto (username = null),
 * profileComplete es false y requiere elegir username.
 */
export async function signInWithGoogleService(): Promise<GoogleAuthResult> {
  const baseUrl = getApiBaseUrl()

  // 1. Si Firebase client SDK tiene credenciales reales, ejecutar flujo nativo
  if (isFirebaseConfigured) {
    try {
      const cred = await signInWithPopup(auth, googleProvider)
      const idToken = await cred.user.getIdToken()
      localStorage.setItem(STORAGE_TOKEN_KEY, idToken)

      // Consultar GET /api/users/me en el backend
      const meResponse = await fetch(`${baseUrl}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
          Accept: 'application/json',
        },
      })

      if (meResponse.ok) {
        const json = (await meResponse.json()) as { data: UserProfile; message?: string }
        const profile = json.data
        return {
          user: {
            ...profile,
            id: profile.uid,
            nombres: profile.firstName,
            apellidos: profile.lastName,
            avatarUrl: profile.avatar || 'avatar-01',
          },
          isNewUser: !profile.profileComplete,
          token: idToken,
          message: json.message,
        }
      }
    } catch (err: unknown) {
      const errorObj = err as { code?: string; message?: string }
      if (errorObj?.code === 'auth/popup-closed-by-user' || errorObj?.code === 'auth/cancelled-popup-request') {
        throw new AuthError('No pudimos conectar con Google. Intenta de nuevo', 'NETWORK_ERROR')
      }
      // Si falla la conexión remota con Firebase, permitir fallback de simulación académica
    }
  }

  // 2. Simulación interactiva fiel al mockup de Mateo Cardona (UdeA)
  await new Promise((resolve) => setTimeout(resolve, 1400))

  const mockGoogleUser: UserProfile = {
    uid: `google_usr_${Date.now()}`,
    id: `google_usr_${Date.now()}`,
    firstName: 'Mateo',
    lastName: 'Cardona',
    nombres: 'Mateo',
    apellidos: 'Cardona',
    username: null, // Perfil incompleto obligatorio (US-02)
    email: 'mateo.cardona@udea.edu.co',
    avatar: 'avatar-02',
    avatarUrl: 'avatar-02',
    provider: 'google',
    profileComplete: false, // Bloquea acceso a rutas privadas hasta elegir username
    createdAt: new Date().toISOString(),
    institutionalDomain: 'Universidad de Antioquia',
  }

  return {
    user: mockGoogleUser,
    isNewUser: true,
    token: `mock_google_token_${Date.now()}`,
    message: 'Tomamos tus datos de Google. Elige tu nombre de usuario para continuar.',
  }
}

/**
 * Completar perfil eligiendo username único (US-02)
 * Alineado con POST /api/users/me/username
 */
export async function completeGoogleUsernameService(
  username: string,
  user: UserProfile,
  token?: string
): Promise<UserProfile> {
  const baseUrl = getApiBaseUrl()
  const cleanUsername = username.trim()
  const authToken = token || localStorage.getItem(STORAGE_TOKEN_KEY)

  // 1. Intentar llamar al backend si hay token disponible
  if (authToken) {
    try {
      const response = await fetch(`${baseUrl}/api/users/me/username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/json',
        },
        body: JSON.stringify({ username: cleanUsername }),
      })

      if (response.ok) {
        const json = (await response.json()) as { data: UserProfile }
        const profile = json.data
        saveStoredUser({
          username: cleanUsername,
          email: profile.email,
          name: `${profile.firstName} ${profile.lastName}`,
        })
        return {
          ...profile,
          id: profile.uid,
          nombres: profile.firstName,
          apellidos: profile.lastName,
          avatarUrl: profile.avatar || 'avatar-02',
        }
      }

      if (response.status === 409) {
        throw new AuthError('Este nombre de usuario ya está en uso, prueba con otro.', 'USERNAME_TAKEN', 'username')
      }
    } catch (err) {
      if (err instanceof AuthError) throw err
    }
  }

  // 2. Simulación de validación de unicidad en servidor
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const existing = getStoredUsers()
  if (existing.some((u) => u.username.toLowerCase() === cleanUsername.toLowerCase())) {
    throw new AuthError('Este nombre de usuario ya está en uso, prueba con otro.', 'USERNAME_TAKEN', 'username')
  }

  saveStoredUser({
    username: cleanUsername,
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
  })

  return {
    ...user,
    username: cleanUsername,
    profileComplete: true,
    updatedAt: new Date().toISOString(),
  }
}
