import { useEffect } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Header } from './components/common/Header'
import { Footer } from './components/common/Footer'
import { PageShell } from './components/common/PageShell'
import { AuthProvider } from './context/AuthContext'
import { HomePage, benefits } from './pages/HomePage'
import { BaseTechnicalPage } from './pages/BaseTechnicalPage'
import { RegisterPage } from './pages/RegisterPage'
import { LoginPage } from './pages/LoginPage'
import { ChooseUsernamePage } from './pages/ChooseUsernamePage'
import { DashboardPage } from './pages/DashboardPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Inicio',
  '/beneficios': 'Beneficios',
  '/como-funciona': 'Cómo funciona',
  '/ingresar': 'Iniciar sesión',
  '/login': 'Iniciar sesión',
  '/registro': 'Crear cuenta',
  '/elegir-usuario': 'Elegir nombre de usuario',
  '/registro/usuario': 'Elegir nombre de usuario',
  '/panel': 'Panel de estudio',
  '/dashboard': 'Panel de estudio',
  '/perfil': 'Perfil',
  '/salas': 'Salas',
  '/salas/nueva': 'Crear una Sala',
  '/salas/unirse': 'Unirse a una Sala',
  '/ayuda': 'Ayuda',
  '/accesibilidad': 'Accesibilidad',
  '/base-tecnica': 'Base técnica',
}

function App() {
  const location = useLocation()

  useEffect(() => {
    const pageTitle =
      ROUTE_TITLES[location.pathname] ??
      (location.pathname.startsWith('/salas/') ? 'Sala' : 'Página no encontrada')
    document.title = `${pageTitle} | Estudiemos`
  }, [location.pathname])

  return (
    <AuthProvider>
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
              description="Crea tu cuenta, reúne a tu grupo en una Sala y empieza a avanzar juntos."
            />
          }
        />
        <Route
          path="/salas"
          element={
            <PageShell
              title="Tus Salas"
              description="Inicia sesión para consultar tus salas de estudio o crea una nueva."
            >
              <div className="button-row">
                <Link className="button" to="/ingresar">
                  Iniciar sesión
                </Link>
                <Link className="button button-outline" to="/salas/unirse">
                  Unirme con un código
                </Link>
              </div>
            </PageShell>
          }
        />
        {/* US-03: Ruta de inicio de sesión con correo y Google (/ingresar y /login) */}
        <Route path="/ingresar" element={<LoginPage />} />
        <Route path="/login" element={<Navigate to="/ingresar" replace />} />
        {/* US-01: Ruta de registro con los 4 estados y componentes base TS-06 */}
        <Route path="/registro" element={<RegisterPage />} />
        {/* US-02: Flujo de selección obligatoria de nombre de usuario tras Google Auth */}
        <Route path="/elegir-usuario" element={<ChooseUsernamePage />} />
        <Route path="/registro/usuario" element={<Navigate to="/elegir-usuario" replace />} />
        {/* Panel y rutas privadas protegidas por ProtectedRoute (S1-C04, US-02) */}
        <Route
          path="/panel"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard" element={<Navigate to="/panel" replace />} />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <PageShell title="Perfil" description="Pantalla prevista en el mapa del sitio." />
            </ProtectedRoute>
          }
        />
        <Route
          path="/salas/nueva"
          element={
            <ProtectedRoute>
              <PageShell title="Crear una Sala" description="Pantalla prevista en el mapa del sitio." />
            </ProtectedRoute>
          }
        />
        <Route
          path="/salas/unirse"
          element={<PageShell title="Unirse a una Sala" description="Pantalla prevista en el mapa del sitio." />}
        />
        <Route
          path="/salas/:id"
          element={<PageShell title="Sala" description="Pantalla prevista en el mapa del sitio." />}
        />
        <Route
          path="/ayuda"
          element={<PageShell title="Ayuda" description="Información de apoyo para las personas usuarias." />}
        />
        <Route
          path="/accesibilidad"
          element={<PageShell title="Declaración de accesibilidad" description="Información de accesibilidad del producto." />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </AuthProvider>
  )
}

export default App
