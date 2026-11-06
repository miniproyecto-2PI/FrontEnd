import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { getBaseData, getBaseMessage } from './services/baseApi'

const links = [
  ['/beneficios', 'Beneficios'], ['/como-funciona', 'Cómo funciona'], ['/salas', 'Salas'], ['/base-tecnica', 'Base técnica'],
] as const

function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  useEffect(() => setOpen(false), [location.pathname])
  return <header className="site-header"><div className="nav-wrap">
    <Link className="brand" to="/" aria-label="Estudiemos, inicio"><span className="brand-icon" aria-hidden="true">✳</span><span>Estudiemos</span></Link>
    <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>{open ? 'Cerrar' : 'Menú'}</button>
    <nav id="main-nav" className={open ? 'main-nav open' : 'main-nav'} aria-label="Navegación principal">
      <div className="nav-links">{links.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}</div>
      <div className="nav-actions"><Link className="nav-login" to="/ingresar">Iniciar sesión</Link><Link className="button button-small" to="/registro">Crear cuenta</Link></div>
    </nav>
  </div></header>
}

function Footer() { return <footer className="site-footer"><div className="footer-inner"><Link className="brand" to="/"><span className="brand-icon" aria-hidden="true">✳</span><span>Estudiemos</span></Link><nav aria-label="Enlaces de ayuda"><Link to="/ayuda">Ayuda</Link><Link to="/accesibilidad">Declaración de accesibilidad</Link><Link to="/ayuda">Contacto</Link></nav><span className="copyright">Aprender en equipo se siente mejor.</span></div></footer> }

type ApiState = { kind: 'loading' | 'error' | 'success'; data?: unknown; message?: string }
function ApiCard() {
  const [state, setState] = useState<ApiState>({ kind: 'loading' })
  const load = async () => {
    setState({ kind: 'loading' })
    try {
      const data = await getBaseData()
      setState({ kind: 'success', data })
    } catch (error) {
      // Keep technical details out of the public UI; the backend owner can inspect the browser network panel.
      setState({ kind: 'error', message: error instanceof Error && error.message.includes('VITE_API_URL')
        ? 'La conexión con la API aún no está configurada.'
        : 'No se pudo cargar el dato. Revisa tu conexión e inténtalo de nuevo.' })
    }
  }
  useEffect(() => { void load() }, [])
  return <section className="api-card" aria-labelledby="api-title"><div><span className="eyebrow">Estado del sistema</span><h2 id="api-title">Dato leído desde Firestore</h2>
    {state.kind === 'loading' && <p role="status" className="muted"><span className="spinner" aria-hidden="true" /> Cargando información…</p>}
    {state.kind === 'error' && <div className="inline-error" role="alert"><p>{state.message}</p><button className="button button-outline focus-visible:ring-2 focus-visible:ring-blue-700" type="button" onClick={() => void load()}>Reintentar</button></div>}
    {state.kind === 'success' && <p className="api-success" role="status">{getBaseMessage(state.data)}</p>}
  </div></section>
}

const benefits = [
  { icon: '◈', title: 'Salas privadas', text: 'Crea espacios seguros con invitaciones para tu grupo de trabajo, sin interrupciones.' },
  { icon: '▤', title: 'Chat con historial', text: 'Conserva preguntas, fórmulas y enlaces para repasarlos cuando los necesites.' },
  { icon: '▣', title: 'Video y pantalla compartida', text: 'Resuelve ejercicios en equipo y comparte tus materiales durante la sesión.' },
]

function Home() { return <><main id="main-content">
  <section className="hero"><div className="hero-copy"><span className="eyebrow"><span className="live-dot" /> ESTUDIAR EN EQUIPO, MÁS FÁCIL</span><h1>Estudia en grupo,<br /><span>en tiempo real.</span></h1><p>Un lugar tranquilo para reunirte, compartir ideas y avanzar con tus compañeros.</p><div className="hero-actions"><Link className="button" to="/registro">Crear cuenta <span aria-hidden="true">→</span></Link><Link className="text-link" to="/ingresar">Ya tengo una cuenta</Link></div><div className="hero-note"><span aria-hidden="true">✓</span> Sin instalaciones pesadas. Empieza cuando quieras.</div></div>
    <div className="hero-art" aria-hidden="true"><div className="art-glow" /><div className="study-window"><div className="window-top"><span>● ● ●</span><span> Sala de estudio</span><span className="secure-label">● Privada</span></div><div className="video-grid"><div className="person-card person-one"><span className="avatar">A</span><b>Andrea</b><small>● Conectada</small></div><div className="person-card person-two"><span className="avatar avatar-coral">M</span><b>Mateo</b><small>● Conectado</small></div></div><div className="chat-preview"><span className="chat-avatar">A</span><span><b>Andrea</b><br />¿Empezamos por el primer punto?</span><span className="chat-time">10:42</span></div><div className="call-controls"><span>⌕</span><span>◉</span><span className="control-on">▣</span><span>•••</span></div></div><div className="floating-note"><span>✦</span> ¡Buen trabajo en equipo!</div></div>
  </section>
  <section className="trust-strip" aria-label="Características"><span>● Fácil de usar</span><span>● Pensado para aprender</span><span>● Hecho para colaborar</span></section>
  <section className="section" id="beneficios"><div className="section-heading"><span className="eyebrow">TODO EN UN MISMO LUGAR</span><h2>Un espacio para avanzar juntos</h2><p>Menos tiempo organizando. Más tiempo entendiendo.</p></div><div className="feature-grid">{benefits.map((item, i) => <article className="feature-card" key={item.title}><span className={`feature-icon feature-${i}`} aria-hidden="true">{item.icon}</span><h3>{item.title}</h3><p>{item.text}</p><Link to="/registro" className="card-link">Descubrir más <span aria-hidden="true">→</span></Link></article>)}</div></section>
  <section className="section steps-section" id="como-funciona"><div className="section-heading"><span className="eyebrow">SIMPLE Y ÁGIL</span><h2>¿Cómo funciona?</h2><p>Empieza a colaborar en tres pasos sencillos.</p></div><ol className="steps-grid"><li><span className="step-number">01</span><h3>Crea tu cuenta</h3><p>Regístrate con tu correo y prepara tu espacio de estudio.</p></li><li><span className="step-number">02</span><h3>Crea o únete a una Sala</h3><p>Inicia una sala para tu materia o entra con el código de invitación.</p></li><li><span className="step-number">03</span><h3>Estudia con tu grupo</h3><p>Conversen, compartan ideas y trabajen en equipo.</p></li></ol></section>
  <section className="cta-section"><div><span className="eyebrow">TU PRÓXIMO GRAN AVANCE EMPIEZA AQUÍ</span><h2>¿Listo para estudiar<br />con más foco?</h2><p>Reúne a tu grupo y conviertan las ideas en resultados.</p><Link className="button button-light" to="/registro">Crear cuenta gratis <span aria-hidden="true">→</span></Link></div><div className="cta-mark" aria-hidden="true">✳</div></section>
  <div className="api-section"><p className="base-link"><Link className="text-link" to="/base-tecnica">Ver estado de la base técnica →</Link></p></div>
  </main></> }

function BaseTechnicalPage() {
  return <main id="main-content" className="page-shell"><div className="page-card base-page">
    <span className="eyebrow">BASE TÉCNICA</span>
    <h1>Estado del sistema</h1>
    <ApiCard />
  </div></main>
}

function Page({ title, description, children }: { title: string; description: string; children?: ReactNode }) { return <main id="main-content" className="page-shell"><div className="page-card"><span className="eyebrow">ESTUDIEMOS</span><h1>{title}</h1><p>{description}</p>{children}</div></main> }
function NotFound() { return <Page title="No encontramos esa página" description="Puede que el enlace haya cambiado. Vuelve al inicio y sigamos estudiando."><Link className="button" to="/">Volver al inicio</Link></Page> }

function App() {
  const location = useLocation()
  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'Inicio', '/beneficios': 'Beneficios', '/como-funciona': 'Cómo funciona',
      '/ingresar': 'Iniciar sesión', '/registro': 'Crear cuenta', '/registro/usuario': 'Elegir nombre de usuario',
      '/panel': 'Panel', '/perfil': 'Perfil', '/salas': 'Salas', '/salas/nueva': 'Crear una Sala',
      '/salas/unirse': 'Unirse a una Sala', '/ayuda': 'Ayuda', '/accesibilidad': 'Accesibilidad',
      '/base-tecnica': 'Base técnica',
    }
    document.title = `${titles[location.pathname] ?? (location.pathname.startsWith('/salas/') ? 'Sala' : 'Página no encontrada')} | Estudiemos`
  }, [location.pathname])
  return <><a className="skip-link" href="#main-content">Saltar al contenido</a><Header /><Routes>
  <Route path="/" element={<Home />} /><Route path="/base-tecnica" element={<BaseTechnicalPage />} /><Route path="/beneficios" element={<Page title="Todo lo que necesitas para enfocarte" description="Salas privadas, conversación con historial y herramientas para colaborar en equipo."><div className="simple-list">{benefits.map(b => <article key={b.title}><h2>{b.title}</h2><p>{b.text}</p></article>)}</div></Page>} />
  <Route path="/como-funciona" element={<Page title="Cómo funciona" description="Crea tu cuenta, reúne a tu grupo en una Sala y empieza a avanzar juntos." />} />
  <Route path="/salas" element={<Page title="Tus Salas" description="Inicia sesión para consultar tus salas de estudio o crea una nueva."><div className="button-row"><Link className="button" to="/ingresar">Iniciar sesión</Link><Link className="button button-outline" to="/salas/unirse">Unirme con un código</Link></div></Page>} />
  <Route path="/ingresar" element={<Page title="Iniciar sesión" description="Pantalla base prevista en el mapa del sitio. El flujo de autenticación se desarrollará en el Sprint 1." />} /><Route path="/registro" element={<Page title="Crear cuenta" description="Pantalla base prevista en el mapa del sitio. El flujo de registro se desarrollará en el Sprint 1." />} /><Route path="/registro/usuario" element={<Page title="Elegir nombre de usuario" description="Pantalla prevista para el flujo de registro." />} />
  <Route path="/panel" element={<Page title="Panel" description="Pantalla privada prevista en el mapa del sitio." />} />
  <Route path="/perfil" element={<Page title="Perfil" description="Pantalla prevista en el mapa del sitio." />} /><Route path="/salas/nueva" element={<Page title="Crear una Sala" description="Pantalla prevista en el mapa del sitio." />} />
  <Route path="/salas/unirse" element={<Page title="Unirse a una Sala" description="Pantalla prevista en el mapa del sitio." />} />
  <Route path="/salas/:id" element={<Page title="Sala" description="Pantalla prevista en el mapa del sitio." />} /><Route path="/ayuda" element={<Page title="Ayuda" description="Información de apoyo para las personas usuarias." />} /><Route path="/accesibilidad" element={<Page title="Declaración de accesibilidad" description="Información de accesibilidad del producto." />} /><Route path="*" element={<NotFound />} />
  </Routes><Footer /></>
}

export default App
