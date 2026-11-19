/** Reglas de salas (US-06). Funciones puras para poder probarlas con node --test. */

export const ROOM_NAME_MIN = 3
export const ROOM_NAME_MAX = 60

const RANGE_HINT = `Escribe un nombre de ${ROOM_NAME_MIN} a ${ROOM_NAME_MAX} caracteres.`

/** Mensaje que explica cómo corregir el nombre, o null si es válido. */
export function validateRoomName(name: string): string | null {
  const length = name.trim().length
  if (length === 0) return `El nombre de la sala es obligatorio. ${RANGE_HINT}`
  if (length < ROOM_NAME_MIN) return `El nombre es muy corto. ${RANGE_HINT}`
  if (length > ROOM_NAME_MAX) return `El nombre supera los ${ROOM_NAME_MAX} caracteres. ${RANGE_HINT}`
  return null
}

const ROOM_CODE = /^[A-Z0-9]{6,12}$/

/**
 * Acepta el ID tal como lo comparten: con espacios o guiones, en minúsculas o como
 * enlace completo (…/salas/8K4M9Q2T). Devuelve el ID en mayúsculas o null si no sirve.
 */
export function normalizeRoomCode(input: string): string | null {
  let value = input.trim()
  const fromLink = value.match(/\/salas\/([^/?#\s]+)/i)
  if (fromLink) value = fromLink[1]
  try {
    value = decodeURIComponent(value)
  } catch {
    // Se usa tal cual
  }
  const code = value.replace(/[\s-]/g, '').toUpperCase()
  return ROOM_CODE.test(code) ? code : null
}

/** "18 de noviembre de 2026" en español de Colombia. */
export function formatRoomDate(iso: string | undefined): string | null {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** Más recientes primero. */
export function sortRoomsByNewest<T extends { createdAt: string }>(rooms: T[]): T[] {
  return [...rooms].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
}
