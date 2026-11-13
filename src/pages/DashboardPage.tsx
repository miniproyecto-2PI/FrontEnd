import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Badge } from '../components/ui/Badge'
import { PRESET_AVATARS } from '../components/ui/AvatarSelector'

interface DashboardPageProps {
  activeRooms?: readonly { id: string; name: string }[]
}

export function DashboardPage({ activeRooms = [] }: DashboardPageProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const hasActiveRooms = activeRooms.length > 0

  if (isLoading) {
    return (
      <main id="main-content" className="page-shell">
        <div className="flex flex-col items-center justify-center p-12 text-center" role="status">
          <div className="w-8 h-8 border-3 border-[#1f4e79] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm font-medium text-[#526679]">Cargando tu panel de estudio…</p>
        </div>
      </main>
    )
  }

  // Criterio S1-C04: "las pantallas privadas no se pueden abrir sin sesión."
  if (!isAuthenticated || !user) {
    return (
      <main id="main-content" className="page-shell">
        <section aria-labelledby="private-title" className="page-card text-center max-w-lg mx-auto">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <span className="eyebrow">ACCESO RESTRINGIDO</span>
          <h1 id="private-title" className="text-2xl font-bold text-[#102c40] mt-2 mb-3">
            Inicia sesión para acceder
          </h1>
          <p className="text-sm text-[#526679] mb-6">
            Esta pantalla es privada. Debes registrarte o iniciar sesión con tus credenciales institucionales para ver tu panel de estudio.
          </p>
          <div className="button-row justify-center">
            <Link to="/ingresar" className="button">
              Iniciar sesión
            </Link>
            <Link to="/registro" className="button button-outline">
              Registrarse
            </Link>
          </div>
        </section>
      </main>
    )
  }

  const avatar = PRESET_AVATARS.find((a) => a.id === user.avatarUrl) || PRESET_AVATARS[0]

  return (
    <main id="main-content" className="min-h-[calc(100vh-140px)] bg-[#f5faff] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        {/* TOP GREETING BANNER */}
        <header className="bg-white border border-[#dfe9f1] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 border border-slate-200 shadow-xs overflow-hidden"
              style={{ backgroundColor: avatar.bgColor, color: avatar.textColor }}
            >
              {user.avatarUrl?.startsWith('http') || user.avatarUrl?.startsWith('data:') ? (
                <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                avatar.icon
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-[#102c40]">
                  {user.firstName || user.nombres} {user.lastName || user.apellidos}
                </h1>
                <Badge variant="success" dot>
                  Cuenta activa
                </Badge>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#1f4e79]">@{user.username}</p>
              <p className="text-xs text-[#627482] mt-0.5">{user.email}</p>
            </div>
          </div>

        </header>

        {/* WORKSPACE & STUDY ROOMS */}
        <section aria-labelledby="rooms-heading" className="bg-white border border-[#dfe9f1] rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#edf2f7] mb-6">
            <div>
              <span className="eyebrow">SALAS DE ESTUDIO</span>
              <h2 id="rooms-heading" className="text-lg font-bold text-[#102c40] mt-1">
                Tus espacios de trabajo
              </h2>
            </div>
            {hasActiveRooms && (
              <Link to="/salas/nueva" className="button button-small">
                Crear sala
              </Link>
            )}
          </div>

          {hasActiveRooms ? (
            <ul className="divide-y divide-[#edf2f7]">
              {activeRooms.map((room) => (
                <li key={room.id}>
                  <Link to={`/salas/${encodeURIComponent(room.id)}`} className="block py-3 text-link hover:underline">
                    {room.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center border-2 border-dashed border-[#e2e8f0] rounded-xl bg-[#fafcff]">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#e7f1fb] text-[#1f4e79] flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#102c40]">Aún no tienes salas activas</h3>
              <p className="text-xs sm:text-sm text-[#617487] max-w-md mx-auto mt-1 mb-5">
                Crea tu primera sala de estudio para compartir apuntes, dudas y videollamadas con tus compañeros de clase.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link to="/salas/nueva" className="button">
                  Crear sala
                </Link>
                <Link to="/salas/unirse" className="button button-outline">
                  Unirme con un código
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

