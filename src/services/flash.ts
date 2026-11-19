/**
 * Aviso de un solo uso para la siguiente pantalla ("Tu cuenta fue eliminada").
 * Se guarda en sessionStorage porque al cerrar la sesión el guard de rutas privadas
 * redirige y reemplaza el `state` de la navegación.
 */
const FLASH_KEY = 'estudiemos_flash'

export function setFlash(message: string) {
  try {
    sessionStorage.setItem(FLASH_KEY, message)
  } catch {
    // Almacenamiento no disponible: el aviso simplemente no se muestra
  }
}

export function peekFlash(): string | null {
  try {
    return sessionStorage.getItem(FLASH_KEY)
  } catch {
    return null
  }
}

export function clearFlash() {
  try {
    sessionStorage.removeItem(FLASH_KEY)
  } catch {
    // Ignorar
  }
}
