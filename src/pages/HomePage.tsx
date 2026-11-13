import { Link } from 'react-router-dom'

export const benefits = [
  { icon: '◈', title: 'Salas privadas', text: 'Crea espacios seguros con invitaciones para tu grupo de trabajo, sin interrupciones.' },
  { icon: '▤', title: 'Chat con historial', text: 'Conserva preguntas, fórmulas y enlaces para repasarlos cuando los necesites.' },
  { icon: '▣', title: 'Video y pantalla compartida', text: 'Resuelve ejercicios en equipo y comparte tus materiales durante la sesión.' },
]

export function HomePage() {
  return (
    <main id="main-content">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="live-dot" /> ESTUDIAR EN EQUIPO, MÁS FÁCIL
          </span>
          <h1>
            Estudia en grupo,<br />
            <span>en tiempo real.</span>
          </h1>
          <p>Un lugar tranquilo para reunirte, compartir ideas y avanzar con tus compañeros.</p>
          <div className="hero-actions">
            <Link className="button" to="/registro">
              Registrarse <span aria-hidden="true">→</span>
            </Link>
            <Link className="text-link" to="/ingresar">
              Ya tengo una cuenta
            </Link>
          </div>
          <div className="hero-note">
            <span aria-hidden="true">✓</span> Sin instalaciones pesadas. Empieza cuando quieras.
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-glow" />
          <div className="study-window">
            <div className="window-top">
              <span>● ● ●</span>
              <span> Sala de estudio</span>
              <span className="secure-label">● Privada</span>
            </div>
            <div className="video-grid">
              <div className="person-card person-one">
                <span className="avatar">A</span>
                <b>Andrea</b>
                <small>● Conectada</small>
              </div>
              <div className="person-card person-two">
                <span className="avatar avatar-coral">M</span>
                <b>Mateo</b>
                <small>● Conectado</small>
              </div>
            </div>
            <div className="chat-preview">
              <span className="chat-avatar">A</span>
              <span>
                <b>Andrea</b>
                <br />
                ¿Empezamos por el primer punto?
              </span>
              <span className="chat-time">10:42</span>
            </div>
            <div className="call-controls">
              <span>⌕</span>
              <span>◉</span>
              <span className="control-on">▣</span>
              <span>•••</span>
            </div>
          </div>
          <div className="floating-note">
            <span>✦</span> ¡Buen trabajo en equipo!
          </div>
        </div>
      </section>
      <section className="trust-strip" aria-label="Características">
        <span>● Fácil de usar</span>
        <span>● Pensado para aprender</span>
        <span>● Hecho para colaborar</span>
      </section>
      <section className="section" id="beneficios">
        <div className="section-heading">
          <span className="eyebrow">TODO EN UN MISMO LUGAR</span>
          <h2>Un espacio para avanzar juntos</h2>
          <p>Menos tiempo organizando. Más tiempo entendiendo.</p>
        </div>
        <div className="feature-grid">
          {benefits.map((item, i) => (
            <article className="feature-card" key={item.title}>
              <span className={`feature-icon feature-${i}`} aria-hidden="true">
                {item.icon}
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section steps-section" id="como-funciona">
        <div className="section-heading">
          <span className="eyebrow">SIMPLE Y ÁGIL</span>
          <h2>¿Cómo funciona?</h2>
          <p>Empieza a colaborar en tres pasos sencillos.</p>
        </div>
        <ol className="steps-grid">
          <li>
            <span className="step-number">01</span>
            <h3>Registrarse</h3>
            <p>Usa tu correo para preparar tu espacio de estudio.</p>
          </li>
          <li>
            <span className="step-number">02</span>
            <h3>Crea o únete a una Sala</h3>
            <p>Inicia una sala para tu materia o entra con el código de invitación.</p>
          </li>
          <li>
            <span className="step-number">03</span>
            <h3>Estudia con tu grupo</h3>
            <p>Conversen, compartan ideas y trabajen en equipo.</p>
          </li>
        </ol>
      </section>
      <section className="cta-section">
        <div>
          <span className="eyebrow">TU PRÓXIMO GRAN AVANCE EMPIEZA AQUÍ</span>
          <h2>
            ¿Listo para estudiar<br />
            con más foco?
          </h2>
          <p>Reúne a tu grupo y conviertan las ideas en resultados.</p>
          <Link className="font-semibold text-white underline underline-offset-4" to="/registro">
            Registrarse <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="cta-mark" aria-hidden="true">
          ✳
        </div>
      </section>
      <div className="api-section">
        <p className="base-link">
          <Link className="text-link" to="/base-tecnica">
            Ver estado de la base técnica →
          </Link>
        </p>
      </div>
    </main>
  )
}
