import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import './InformationPage.css'

const topics = {
  accesibilidad: {
    title: 'Accesibilidad',
    path: '/accesibilidad',
    intro: 'Puedes recorrer Estudiemos con el teclado, orientarte con un lector de pantalla y ajustar el tamaño del texto.',
    sections: [
      ['Navegar con el teclado', 'Pulsa Tab para avanzar al siguiente enlace o control y Mayús + Tab para volver al anterior. El contorno indica dónde estás. Para abrir un enlace, pulsa Intro.'],
      ['Ir al contenido principal', 'Al empezar a recorrer la página con Tab, encontrarás el enlace «Saltar al contenido». Actívalo para pasar directamente al contenido principal. Con un lector de pantalla también puedes usar la lista de encabezados para encontrar una sección.'],
      ['Ampliar la lectura', 'Usa el zoom del navegador para leer con mayor comodidad. En Windows, pulsa Ctrl y + para ampliar, Ctrl y − para reducir y Ctrl y 0 para recuperar el tamaño original.'],
    ],
  },
  terminos: {
    title: 'Términos de servicio',
    path: '/terminos-de-servicio',
    intro: 'Estas condiciones orientan el uso de tu cuenta y la convivencia en las salas de estudio de Estudiemos.',
    sections: [
      ['Tu cuenta', 'Usa tu propia cuenta para participar. Mantén tus credenciales en privado y cierra la sesión cuando termines de estudiar en un equipo compartido.'],
      ['Acceso a las salas', 'Entra a las salas a las que te hayan invitado. Antes de compartir un código de acceso con otra persona, pide permiso a quien organizó la sala.'],
      ['Convivencia y materiales', 'Respeta las intervenciones de tus compañeros y evita el acoso, la suplantación de identidad y el envío de mensajes repetitivos. Comparte materiales propios o que tengas permiso para distribuir. Pide autorización antes de grabar una sesión o difundir conversaciones fuera del grupo.'],
    ],
  },
}

export function InformationPage({ topic }: { topic: keyof typeof topics }) {
  const { title, intro, sections } = topics[topic]
  const heading = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    heading.current?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [topic])

  return (
    <main id="main-content" className="page-shell info-page" tabIndex={-1}>
      <div className="page-card">
        <nav className="info-nav" aria-label="Información de la plataforma">
          {Object.values(topics).map(({ path, title }) => (
            <NavLink key={path} to={path}>{title}</NavLink>
          ))}
        </nav>
        <h1 ref={heading} tabIndex={-1}>{title}</h1>
        <p>{intro}</p>
        <div className="info-sections">
          {sections.map(([subtitle, body]) => (
            <section key={subtitle}>
              <h2>{subtitle}</h2>
              <p>{body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
