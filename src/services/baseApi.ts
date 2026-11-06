/**
 * Sprint 0 integration point for the backend teammate.
 * Agree on the public GET endpoint and its JSON shape before deployment.
 * The initial UI expects `{ "message": "..." }`; it also accepts plain text
 * or displays other JSON so the first integration response remains inspectable.
 */
export async function getBaseData(): Promise<unknown> {
  // Set this to the public Render endpoint in the Vercel environment settings.
  // VITE_* values are public in the browser bundle: never put secrets here.
  const endpoint = import.meta.env.VITE_API_URL as string | undefined
  if (!endpoint) throw new Error('Falta configurar la dirección del endpoint en VITE_API_URL.')

  // Backend integration checklist: allow the Vercel origin in CORS, return JSON,
  // and use a non-2xx HTTP status with a safe message when the data read fails.
  // Always re-read the Firestore-backed value so a browser cache cannot hide updates.
  const response = await fetch(endpoint, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`La API respondió con estado ${response.status}.`)
  return response.json() as Promise<unknown>
}

export function getBaseMessage(responseData: unknown): string {
  if (typeof responseData === 'string') return responseData
  if (responseData && typeof responseData === 'object') {
    const envelope = responseData as Record<string, unknown>

    // The backend wraps the Firestore document in `data`; render that value
    // instead of the envelope's generic success message.
    if (envelope.data !== undefined && envelope.data !== null) {
      return typeof envelope.data === 'string'
        ? envelope.data
        : JSON.stringify(envelope.data, null, 2) ?? String(envelope.data)
    }

    const message = envelope.message ?? envelope.mensaje
    if (typeof message === 'string') return message
  }
  return JSON.stringify(responseData, null, 2) ?? String(responseData)
}
