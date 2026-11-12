import type { RegisterFormData, RegisterResponse, UserProfile } from '../types/auth'
import { PRESET_AVATARS } from '../constants/avatars'

// Seeded existing records for demonstration and offline/dev testing
const MOCK_EXISTING_USERS: Array<{ username: string; email: string; name: string }> = [
  { username: 'ana_01', email: 'ana.martinez@univalle.edu.co', name: 'Ana Martínez' },
  { username: 'mateocardona', email: 'mateo.cardona@udea.edu.co', name: 'Mateo Cardona' },
  { username: 'camilarestrepo', email: 'camila.restrepo@unal.edu.co', name: 'Camila Restrepo' },
]

const LOCAL_STORAGE_USERS_KEY = 'estudiemos_registered_users'

function getStoredUsers(): Array<{ username: string; email: string; name: string }> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY)
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(MOCK_EXISTING_USERS))
      return MOCK_EXISTING_USERS
    }
    return JSON.parse(raw) as Array<{ username: string; email: string; name: string }>
  } catch {
    return MOCK_EXISTING_USERS
  }
}

function saveStoredUser(user: { username: string; email: string; name: string }) {
  try {
    const users = getStoredUsers()
    users.push(user)
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users))
  } catch {
    // Ignore storage quota errors
  }
}

function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_URL as string | undefined
  if (!envUrl) return 'http://localhost:3000'
  // Remove /archetype/data or /api/* subpath to reach base origin
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
  const cleanUsername = username.trim().toLowerCase()
  if (!cleanUsername || cleanUsername.length < 3) return true

  // Check stored database
  const users = getStoredUsers()
  return !users.some((u) => u.username.toLowerCase() === cleanUsername)
}

export async function checkEmailAvailability(email: string): Promise<boolean> {
  const cleanEmail = email.trim().toLowerCase()
  if (!cleanEmail || !cleanEmail.includes('@')) return true

  const users = getStoredUsers()
  return !users.some((u) => u.email.toLowerCase() === cleanEmail)
}

export async function registerUser(formData: RegisterFormData): Promise<RegisterResponse> {
  const baseUrl = getApiBaseUrl()
  const registerEndpoint = `${baseUrl}/api/auth/register`

  const normalizedPayload = {
    nombres: formData.nombres.trim(),
    apellidos: formData.apellidos.trim(),
    username: formData.username.trim(),
    email: formData.email.trim().toLowerCase(),
    avatar: formData.avatar,
    password: formData.password,
  }

  // 1. Intentar llamar al backend real si está configurado y respondiendo
  let backendAttemptSucceeded = false
  let backendResponseData: unknown = null

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6000)

    const response = await fetch(registerEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(normalizedPayload),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      backendAttemptSucceeded = true
      backendResponseData = await response.json()
    } else {
      // Backend returned an error response (e.g. 409 Conflict, 400 Bad Request)
      if (response.status === 409) {
        const errorBody = (await response.json().catch(() => ({}))) as Record<string, unknown>
        const message = typeof errorBody.message === 'string' ? errorBody.message : ''
        if (message.toLowerCase().includes('usuario') || errorBody.code === 'USERNAME_TAKEN') {
          throw new AuthError('Este nombre de usuario ya está en uso, prueba con otro.', 'USERNAME_TAKEN', 'username')
        }
        throw new AuthError('Este correo ya tiene una cuenta. ¿Quieres iniciar sesión?', 'EMAIL_ALREADY_IN_USE', 'email')
      }

      if (response.status === 400) {
        const errorBody = (await response.json().catch(() => ({}))) as Record<string, unknown>
        const message = typeof errorBody.message === 'string' ? errorBody.message : 'Por favor revisa los datos ingresados.'
        throw new AuthError(message, 'VALIDATION_ERROR')
      }

      // If status is 404 (endpoint not created yet on backend), fall through to simulated flow
      if (response.status !== 404) {
        throw new AuthError(
          `No pudimos conectar con el servidor de autenticación (código ${response.status}).`,
          'NETWORK_ERROR'
        )
      }
    }
  } catch (error) {
    if (error instanceof AuthError) {
      throw error
    }
    // If it's a TypeError (Network failure / CORS not ready / backend offline) or 404,
    // we use our simulated server persistence for seamless local operation and testing.
  }

  if (backendAttemptSucceeded && backendResponseData) {
    const res = backendResponseData as Record<string, unknown>
    const user = (res.user || res.data || res) as UserProfile
    return {
      user,
      message: typeof res.message === 'string' ? res.message : '¡Tu cuenta está lista!',
    }
  }

  // 2. Simulación de validación y persistencia del servidor (Garantía de unicidad)
  // Simular latencia de red para mostrar estado de carga auténtico
  await new Promise((resolve) => setTimeout(resolve, 1400))

  const existingUsers = getStoredUsers()
  const lowerUsername = normalizedPayload.username.toLowerCase()
  const lowerEmail = normalizedPayload.email.toLowerCase()

  // Regla US-01: Único sin distinguir mayúsculas (Ana_01 y ana_01 son el mismo)
  const usernameTaken = existingUsers.some((u) => u.username.toLowerCase() === lowerUsername)
  if (usernameTaken) {
    throw new AuthError('Este nombre de usuario ya está en uso, prueba con otro.', 'USERNAME_TAKEN', 'username')
  }

  // Regla US-01: Correo ya registrado
  const emailTaken = existingUsers.some((u) => u.email.toLowerCase() === lowerEmail)
  if (emailTaken) {
    throw new AuthError('Este correo ya tiene una cuenta. ¿Quieres iniciar sesión?', 'EMAIL_ALREADY_IN_USE', 'email')
  }

  // Guardar en la base de datos local
  saveStoredUser({
    username: normalizedPayload.username,
    email: normalizedPayload.email,
    name: `${normalizedPayload.nombres} ${normalizedPayload.apellidos}`,
  })

  const preset = PRESET_AVATARS.find((a) => a.id === normalizedPayload.avatar)

  const createdUser: UserProfile = {
    id: `usr_${Date.now()}`,
    nombres: normalizedPayload.nombres,
    apellidos: normalizedPayload.apellidos,
    username: normalizedPayload.username,
    email: normalizedPayload.email,
    avatarUrl: preset?.id || 'avatar-estudiante-azul',
    createdAt: new Date().toISOString(),
  }

  return {
    user: createdUser,
    message: '¡Tu cuenta está lista!',
    token: `mock_jwt_token_${Date.now()}`,
  }
}

