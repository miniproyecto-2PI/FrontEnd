export interface UserProfile {
  id: string
  nombres: string
  apellidos: string
  username: string
  email: string
  avatarUrl: string
  createdAt: string
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

export interface ApiErrorResponse {
  code: 'USERNAME_TAKEN' | 'EMAIL_ALREADY_IN_USE' | 'VALIDATION_ERROR' | 'NETWORK_ERROR' | 'INTERNAL_ERROR'
  message: string
  details?: Record<string, string>
}

