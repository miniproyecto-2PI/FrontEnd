import { apiRequest } from './apiClient'

export interface Participant {
  uid: string
  name: string
  avatar: string | null
}

export interface ChatMessage {
  id: string
  roomId: string
  author: Participant
  text: string
  createdAt: string
}

interface HistoryPage {
  messages: ChatMessage[]
  hasMore: boolean
  nextBefore: string | null
}

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

export async function renameRoom(id: string, name: string): Promise<Room> {
  const { data } = await apiRequest<Room>(`/api/rooms/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: { name: name.trim() },
  })
  return data
}

export async function deleteRoom(id: string): Promise<void> {
  await apiRequest(`/api/rooms/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export async function getRoomHistory(id: string, signal: AbortSignal, before?: string): Promise<HistoryPage> {
  const query = new URLSearchParams({ limit: '50' })
  if (before) query.set('before', before)
  const { data } = await apiRequest<HistoryPage>(`/api/rooms/${encodeURIComponent(id)}/messages?${query}`, { signal })
  return data
}
