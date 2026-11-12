import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main id="main-content" className="page-shell not-found-shell">
      <section className="page-card not-found-card" aria-labelledby="not-found-title">
        <p className="not-found-code" aria-hidden="true">
          404
        </p>
        <span className="eyebrow">ERROR 404 · PÁGINA NO ENCONTRADA</span>
        <h1 id="not-found-title">No encontramos esa página</h1>
        <p>Puede que el enlace haya cambiado. Vuelve al inicio o visita la sección de ayuda.</p>
        <div className="button-row not-found-actions">
          <Link className="button" to="/">
            Volver al inicio
          </Link>
          <Link className="button button-outline" to="/ayuda">
            Ir a ayuda
          </Link>
        </div>
      </section>
    </main>
  )
}
