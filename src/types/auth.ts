export type AuthProviderType = 'password' | 'google'

export interface UserProfile {
  uid: string
  id?: string
  firstName: string
  lastName: string
  nombres?: string
  apellidos?: string
  username: string | null
  email: string
  avatar: string | null
  avatarUrl?: string
  provider: AuthProviderType
  profileComplete: boolean
  createdAt: string
  updatedAt?: string
  institutionalDomain?: string
}

export interface RegisterFormData {
  nombres: string
  apellidos: string
  username: string
  email: string
  avatar: string
  password: string
  confirmPassword: string
}

export interface FormErrors {
  nombres?: string
  apellidos?: string
  username?: string
  email?: string
  avatar?: string
  password?: string
  confirmPassword?: string
  general?: string
}

export interface RegisterResponse {
  user: UserProfile
  message?: string
  token?: string
}

export interface GoogleAuthResult {
  user: UserProfile
  isNewUser: boolean
  token?: string
  message?: string
}

export interface ApiErrorResponse {
  code: 'USERNAME_TAKEN' | 'EMAIL_IN_USE' | 'VALIDATION_ERROR' | 'NETWORK_ERROR' | 'INTERNAL_ERROR' | 'PROFILE_INCOMPLETE' | 'UNAUTHENTICATED'
  message: string
  details?: Record<string, string>
}
