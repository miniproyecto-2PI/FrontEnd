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
  const response = await fetch(endpoint, { headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(`La API respondió con estado ${response.status}.`)
  return response.json() as Promise<unknown>
}

export function getBaseMessage(data: unknown): string {
  if (typeof data === 'string') return data
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>
    const message = record.message ?? record.mensaje
    if (typeof message === 'string') return message
  }
  return JSON.stringify(data, null, 2) ?? String(data)
}
