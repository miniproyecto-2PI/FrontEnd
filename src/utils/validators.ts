import type { RegisterFormData, FormErrors } from '../types/auth'

export const USERNAME_REGEX = /^[a-zA-Z0-9_.]{3,20}$/
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/

export const KNOWN_UNIVERSITIES: Record<string, string> = {
  'correounivalle.edu.co': 'Universidad del Valle'
}

export function getUniversityName(email: string): string | null {
  if (!email || !email.includes('@')) return null
  const domain = email.split('@')[1]?.toLowerCase().trim()
  if (!domain) return null
  return KNOWN_UNIVERSITIES[domain] ?? (domain.endsWith('.edu.co') ? 'Institución de Educación Superior' : null)
}

export function validateUsername(username: string): string | null {
  const trimmed = username.trim()
  if (!trimmed) {
    return 'El nombre de usuario es obligatorio.'
  }
  if (trimmed.length < 3 || trimmed.length > 20) {
    return 'El nombre de usuario debe tener entre 3 y 20 caracteres.'
  }
  if (/\s/.test(username)) {
    return 'El nombre de usuario no puede contener espacios.'
  }
  if (!USERNAME_REGEX.test(username)) {
    return 'Solo se permiten letras, números, punto (.) o guion bajo (_).'
  }
  return null
}

export function validateEmail(email: string): string | null {
  const trimmed = email.trim()
  if (!trimmed) {
    return 'El correo electrónico es obligatorio.'
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Escribe un correo válido, por ejemplo nombre@correo.com'
  }
  return null
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return 'La contraseña es obligatoria.'
  }
  if (password.length < 8) {
    return 'La contraseña debe tener mínimo 8 caracteres.'
  }
  if (!/(?=.*[A-Za-z])/.test(password) || !/(?=.*\d)/.test(password)) {
    return 'La contraseña debe contener al menos una letra y un número.'
  }
  return null
}

export function validateRegisterForm(data: RegisterFormData): { isValid: boolean; errors: FormErrors; firstErrorField: keyof RegisterFormData | null } {
  const errors: FormErrors = {}
  let firstErrorField: keyof RegisterFormData | null = null

  // Nombres
  const nombresTrim = data.nombres.trim()
  if (!nombresTrim) {
    errors.nombres = 'Ingresa tus nombres (máximo 50 caracteres).'
    if (!firstErrorField) firstErrorField = 'nombres'
  } else if (nombresTrim.length > 50) {
    errors.nombres = 'Los nombres no pueden superar los 50 caracteres.'
    if (!firstErrorField) firstErrorField = 'nombres'
  }

  // Apellidos
  const apellidosTrim = data.apellidos.trim()
  if (!apellidosTrim) {
    errors.apellidos = 'Ingresa tus apellidos (máximo 50 caracteres).'
    if (!firstErrorField) firstErrorField = 'apellidos'
  } else if (apellidosTrim.length > 50) {
    errors.apellidos = 'Los apellidos no pueden superar los 50 caracteres.'
    if (!firstErrorField) firstErrorField = 'apellidos'
  }

  // Username
  const usernameError = validateUsername(data.username)
  if (usernameError) {
    errors.username = usernameError
    if (!firstErrorField) firstErrorField = 'username'
  }

  // Avatar
  if (!data.avatar) {
    errors.avatar = 'Selecciona un avatar para tu perfil.'
    if (!firstErrorField) firstErrorField = 'avatar'
  }

  // Correo
  const emailError = validateEmail(data.email)
  if (emailError) {
    errors.email = emailError
    if (!firstErrorField) firstErrorField = 'email'
  }

  // Contraseña
  const passwordError = validatePassword(data.password)
  if (passwordError) {
    errors.password = passwordError
    if (!firstErrorField) firstErrorField = 'password'
  }

  // Confirmar contraseña
  if (!data.confirmPassword) {
    errors.confirmPassword = 'Debes confirmar tu contraseña.'
    if (!firstErrorField) firstErrorField = 'confirmPassword'
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden. Escribe la misma contraseña para confirmar.'
    if (!firstErrorField) firstErrorField = 'confirmPassword'
  }

  const isValid = Object.keys(errors).length === 0
  return { isValid, errors, firstErrorField }
}

