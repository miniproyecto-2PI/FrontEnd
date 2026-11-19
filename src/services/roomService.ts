import { apiRequest } from './apiClient'

/** rooms/{roomId} tal como lo devuelve la API (US-06). */
export interface Room {
  id: string
  name: string
  ownerId: string
  createdAt: string
  updatedAt?: string
}

/** GET /api/rooms: solo las salas creadas por el usuario del token. */
export async function listMyRooms(signal?: AbortSignal): Promise<Room[]> {
  const { data } = await apiRequest<Room[]>('/api/rooms', { signal })
  return Array.isArray(data) ? data : []
}

/** POST /api/rooms: el ID lo genera el servidor. */
export async function createRoom(name: string): Promise<Room> {
  const { data } = await apiRequest<Room>('/api/rooms', { method: 'POST', body: { name: name.trim() } })
  return data
}

/** GET /api/rooms/:id (404 si no existe). */
export async function getRoom(id: string, signal?: AbortSignal): Promise<Room> {
  const { data } = await apiRequest<Room>(`/api/rooms/${encodeURIComponent(id)}`, { signal })
  return data
}
