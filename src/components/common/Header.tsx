import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { PRESET_AVATARS } from '../ui/AvatarSelector'

const navLinks = [
  ['/beneficios', 'Beneficios'],
  ['/como-funciona', 'Cómo funciona'],
  ['/salas', 'Salas'],
  ['/base-tecnica', 'Base técnica'],
] as const

export function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/ingresar', { replace: true })
  }

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const avatar = user ? PRESET_AVATARS.find((a) => a.id === user.avatarUrl) || PRESET_AVATARS[0] : null

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link className="brand" to="/" aria-label="Estudiemos, inicio">
          <span className="brand-icon" aria-hidden="true">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </span>
          <span>Estudiemos</span>
        </Link>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? 'Cerrar' : 'Menú'}
        </button>

        <nav id="main-nav" className={open ? 'main-nav open' : 'main-nav'} aria-label="Navegación principal">
          <div className="nav-links">
            {navLinks.map(([to, label]) => (
              <NavLink key={to} to={to}>
                {label}
              </NavLink>
            ))}
          </div>

          <div className="nav-actions">
            <Link to="/ayuda" className="nav-login hidden sm:flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>Ayuda</span>
            </Link>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/panel"
                  className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full bg-[#f0f5f9] border border-[#dbe7f0] hover:border-[#1f4e79] transition-colors"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs overflow-hidden"
                    style={{ backgroundColor: avatar?.bgColor, color: avatar?.textColor }}
                  >
                    {user.avatarUrl?.startsWith('http') || user.avatarUrl?.startsWith('data:') ? (
                      <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      avatar?.icon
                    )}
                  </div>
                  <span className="text-xs font-bold text-[#102c40]">
                    {(user.firstName || user.nombres || 'Estudiante').split(' ')[0]}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs font-semibold text-slate-500 hover:text-red-700 transition-colors"
                  title="Cerrar sesión"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <>
                <Link className="nav-login" to="/ingresar">
                  Ingresar
                </Link>
                <Link className="button button-small" to="/registro">
                  Crear cuenta
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

