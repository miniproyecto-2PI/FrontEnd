import type { UserProfile } from '../types/auth'
import type { ProfilePatch } from '../utils/profileForm'
import { apiRequest } from './apiClient'

/** Perfil de la API → forma que usa la interfaz (alias en español y avatarUrl). */
export function toUserProfile(profile: UserProfile): UserProfile {
  return {
    ...profile,
    id: profile.uid,
    nombres: profile.firstName,
    apellidos: profile.lastName,
    avatarUrl: profile.avatar || undefined,
  }
}

/** GET /api/users/me (US-04) */
export async function getMyProfile(signal?: AbortSignal): Promise<UserProfile> {
  const { data } = await apiRequest<UserProfile>('/api/users/me', { signal })
  return toUserProfile(data)
}

/** PATCH /api/users/me (US-04): solo los campos modificados. */
export async function updateMyProfile(patch: ProfilePatch): Promise<{ profile: UserProfile; message: string }> {
  const { data, message } = await apiRequest<UserProfile>('/api/users/me', { method: 'PATCH', body: patch })
  return { profile: toUserProfile(data), message }
}

/** POST /api/users/me/avatar: foto propia (JPG, PNG o WebP, máximo 2 MB). */
export async function uploadMyAvatar(file: File): Promise<UserProfile> {
  const formData = new FormData()
  formData.append('avatar', file)
  const { data } = await apiRequest<UserProfile>('/api/users/me/avatar', { method: 'POST', formData })
  return toUserProfile(data)
}
