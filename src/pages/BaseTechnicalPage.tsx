import { useEffect, useState } from 'react'
import { getBaseData, getBaseMessage } from '../services/baseApi'

type ApiState = { kind: 'loading' | 'error' | 'success'; data?: unknown; message?: string }

export function ApiCard() {
  const [state, setState] = useState<ApiState>({ kind: 'loading' })

  const load = async () => {
    setState({ kind: 'loading' })
    try {
      const data = await getBaseData()
      setState({ kind: 'success', data })
    } catch (error) {
      setState({
        kind: 'error',
        message:
          error instanceof Error && error.message.includes('VITE_API_URL')
            ? 'La conexión con la API aún no está configurada.'
            : 'No se pudo cargar el dato. Revisa tu conexión e inténtalo de nuevo.',
      })
    }
  }

  useEffect(() => {
    void load()
  }, [])

  return (
    <section className="api-card" aria-labelledby="api-title">
      <div>
        <span className="eyebrow">Estado del sistema</span>
        <h2 id="api-title">Dato leído desde Firestore</h2>
        <div className="api-slot">
          {state.kind === 'loading' && (
            <p role="status" className="muted">
              <span className="spinner" aria-hidden="true" /> Cargando información…
            </p>
          )}
          {state.kind === 'error' && (
            <div className="inline-error" role="alert">
              <p>{state.message}</p>
              <button
                className="button button-outline focus-visible:ring-2 focus-visible:ring-blue-700"
                type="button"
                onClick={() => void load()}
              >
                Reintentar
              </button>
            </div>
          )}
          {state.kind === 'success' && (
            <p className="api-success" role="status">
              {getBaseMessage(state.data)}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export function BaseTechnicalPage() {
  return (
    <main id="main-content" className="page-shell">
      <div className="page-card base-page">
        <span className="eyebrow">BASE TÉCNICA</span>
        <h1>Estado del sistema</h1>
        <ApiCard />
      </div>
    </main>
  )
}
