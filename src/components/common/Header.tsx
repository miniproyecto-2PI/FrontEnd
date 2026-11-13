import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { PRESET_AVATARS } from '../ui/AvatarSelector'
import { Button } from '../ui/Button'

const navLinks = [
  ['/beneficios', 'Beneficios'],
  ['/como-funciona', 'Cómo funciona'],
  ['/salas', 'Salas'],
  ['/base-tecnica', 'Base técnica'],
] as const

export function Header() {
  const [open, setOpen] = useState(false)
  const logoutDialog = useRef<HTMLDialogElement>(null)
  const logoutDialogTitle = useId()
  const logoutDialogDescription = useId()
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logoutDialog.current?.close()
    setOpen(false)
    logout()
    navigate('/ingresar', { replace: true })
  }

  useEffect(() => {
    setOpen(false)
    logoutDialog.current?.close()
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
            <NavLink to="/ayuda" className="inline-flex items-center gap-1.5">
              <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>Ayuda</span>
            </NavLink>
          </div>

          <div className="nav-actions">
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
                  onClick={() => logoutDialog.current?.showModal()}
                  aria-haspopup="dialog"
                  className="inline-flex min-h-11 items-center rounded-lg border border-[#dbe7f0] bg-[#f0f5f9] px-3 text-xs font-semibold text-[#1f4e79] transition-colors hover:border-[#1f4e79] hover:bg-[#e7f1fb]"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <>
                <Link className="nav-login" to="/ingresar">
                  Iniciar sesión
                </Link>
                {location.pathname.replace(/\/+$/, '') !== '/registro' && (
                  <Link className="nav-register" to="/registro">
                    Registrarse
                  </Link>
                )}
              </>
            )}
          </div>
        </nav>
      </div>
      {isAuthenticated && user && (
        <dialog
          ref={logoutDialog}
          aria-labelledby={logoutDialogTitle}
          aria-describedby={logoutDialogDescription}
          className="m-auto max-h-[calc(100%_-_2rem)] w-[calc(100%_-_2rem)] max-w-sm overflow-y-auto rounded-2xl border border-[#dbe7f0] bg-white p-6 text-[#102c40] shadow-lg backdrop:bg-[#102c40]/50"
        >
          <h2 id={logoutDialogTitle} className="text-lg font-bold">¿Cerrar sesión?</h2>
          <p id={logoutDialogDescription} className="mt-2 text-sm text-[#526679]">
            Vas a volver a la pantalla de inicio de sesión.
          </p>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Button variant="outline" onClick={() => logoutDialog.current?.close()}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </div>
        </dialog>
      )}
    </header>
  )
}

