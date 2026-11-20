import { useEffect } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Header } from './components/common/Header'
import { Footer } from './components/common/Footer'
import { PageShell } from './components/common/PageShell'
import { AuthProvider, useAuth } from './context/AuthContext'
import { HomePage, benefits } from './pages/HomePage'
import { BaseTechnicalPage } from './pages/BaseTechnicalPage'
import { RegisterPage } from './pages/RegisterPage'
import { LoginPage } from './pages/LoginPage'
import { ChooseUsernamePage } from './pages/ChooseUsernamePage'
import { DashboardPage } from './pages/DashboardPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { LiveAnnouncerProvider } from './components/ui/LiveAnnouncer'
import { ProfilePage } from './pages/ProfilePage'
import { RoomPage } from './pages/RoomPage'
import { InformationPage } from './pages/InformationPage'

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Inicio',
  '/beneficios': 'Beneficios',
  '/como-funciona': 'Cómo funciona',
  '/ingresar': 'Iniciar sesión',
  '/login': 'Iniciar sesión',
  '/registro': 'Registrarse',
  '/elegir-usuario': 'Elegir nombre de usuario',
  '/registro/usuario': 'Elegir nombre de usuario',
  '/panel': 'Panel de estudio',
  '/dashboard': 'Panel de estudio',
  '/perfil': 'Mi Perfil',
  '/salas': 'Salas',
  '/salas/nueva': 'Crear una Sala',
  '/salas/unirse': 'Unirse a una Sala',
  '/ayuda': 'Ayuda',
  '/accesibilidad': 'Accesibilidad',
  '/terminos-de-servicio': 'Términos de servicio',
  '/base-tecnica': 'Base técnica',
}

/** /salas: con sesión completa lleva al panel (donde están las salas); sin sesión, invita a ingresar. */
function SalasLanding() {
  const { isAuthenticated, profileComplete } = useAuth()
  if (isAuthenticated && profileComplete) return <Navigate to="/panel" replace />
  return (
    <PageShell title="Tus Salas" description="Inicia sesión para consultar tus salas de estudio o crea una nueva.">
      <div className="button-row">
        <Link className="button" to="/ingresar">
          Iniciar sesión
        </Link>
        <Link className="button button-outline" to="/salas/unirse">
          Unirme con un código
        </Link>
      </div>
    </PageShell>
  )
}

function App() {
  const location = useLocation()

  useEffect(() => {
    // El interior de una sala pone su propio título con el nombre de la sala (RoomPage)
    if (/^\/salas\/(?!nueva$|unirse$)[^/]+$/.test(location.pathname)) return
    const pageTitle =
      ROUTE_TITLES[location.pathname] ??
      (location.pathname.startsWith('/salas/') ? 'Sala' : 'Página no encontrada')
    document.title = `${pageTitle} | Estudiemos`
  }, [location.pathname])

  return (
    <AuthProvider>
      <LiveAnnouncerProvider>
        <a className="skip-link" href="#main-content">
          Saltar al contenido
        </a>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/base-tecnica" element={<BaseTechnicalPage />} />
          <Route
            path="/beneficios"
            element={
              <PageShell
                title="Todo lo que necesitas para enfocarte"
                description="Salas privadas, conversación con historial y herramientas para colaborar en equipo."
              >
                <div className="simple-list">
                  {benefits.map((b) => (
                    <article key={b.title}>
                      <h2>{b.title}</h2>
                      <p>{b.text}</p>
                    </article>
                  ))}
                </div>
              </PageShell>
            }
          />
          <Route
            path="/como-funciona"
            element={
              <PageShell
                title="Cómo funciona"
                description="Después del registro, reúne a tu grupo en una sala de estudio."
              />
            }
          />
          <Route path="/salas" element={<SalasLanding />} />
          {/* US-03: Ruta de inicio de sesión con correo y Google (/ingresar y /login) */}
          <Route path="/ingresar" element={<LoginPage />} />
          <Route path="/login" element={<Navigate to="/ingresar" replace />} />
          {/* US-01: Ruta de registro con los 4 estados y componentes base TS-06 */}
          <Route path="/registro" element={<RegisterPage />} />
          {/* US-02: Flujo de selección obligatoria de nombre de usuario tras Google Auth */}
          <Route path="/elegir-usuario" element={<ChooseUsernamePage />} />
          <Route path="/registro/usuario" element={<Navigate to="/elegir-usuario" replace />} />
          {/* Panel y rutas privadas protegidas por ProtectedRoute (S1-C04, US-02). US-06: salas propias */}
          <Route
            path="/panel"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/dashboard" element={<Navigate to="/panel" replace />} />

          {/* US-04: ver y editar perfil (GET/PATCH /api/users/me) */}
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          {/* US-06: crear sala (abre el formulario en el panel) e interior mínimo de la sala */}
          <Route
            path="/salas/nueva"
            element={
              <ProtectedRoute>
                <DashboardPage openCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/salas/unirse"
            element={
              <ProtectedRoute>
                <DashboardPage focusJoin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/salas/:id"
            element={
              <ProtectedRoute>
                <RoomPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ayuda"
            element={<PageShell title="Ayuda" description="Información de apoyo para las personas usuarias." />}
          />
          <Route
            path="/accesibilidad"
            element={<InformationPage topic="accesibilidad" />}
          />
          <Route path="/terminos-de-servicio" element={<InformationPage topic="terminos" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </LiveAnnouncerProvider>
    </AuthProvider>
  )
}

export default App
