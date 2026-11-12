import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Link className="brand" to="/" aria-label="Estudiemos, inicio">
          <span className="brand-icon" aria-hidden="true">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </span>
          <span>Estudiemos</span>
        </Link>

        <nav aria-label="Enlaces institucionales y legales">
          <Link to="/accesibilidad">Accesibilidad</Link>
          <Link to="/ayuda">Términos de servicio</Link>
          <Link to="/ayuda">Privacidad</Link>
          <Link to="/ayuda">Centro de ayuda</Link>
        </nav>

        <span className="copyright">
          © 2025 Estudiemos. Plataforma académica colaborativa. Todos los derechos reservados.
        </span>
      </div>
    </footer>
  )
}

