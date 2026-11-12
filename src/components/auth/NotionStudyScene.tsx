import studentLaptop from '../../assets/notion-student-laptop.png'
import studentBooks from '../../assets/notion-student-books.png'
import studentDesk from '../../assets/notion-student-desk.png'

export interface NotionStudySceneProps {
  isFadingOut?: boolean
}

export function NotionStudyScene({ isFadingOut = false }: NotionStudySceneProps) {
  return (
    <div
      className={`flex flex-col justify-center items-center text-center p-6 sm:p-8 lg:p-10 rounded-3xl bg-linear-to-b from-[#edf5fc]/70 via-[#e6f1fa]/60 to-[#dceaf6]/50 relative overflow-hidden transition-all duration-500 ease-out ${
        isFadingOut ? 'opacity-0 translate-x-8 scale-95' : 'opacity-100 translate-x-0 scale-100'
      }`}
    >
      {/* SUTILES ELEMENTOS DE AMBIENTACIÓN */}
      <div
        className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-blue-100/40 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-cyan-100/30 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* ESCENA DE PERSONAJES ESTILO NOTION */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center py-4">
        {/* COMPOSICIÓN DINÁMICA DE PERSONAJES - MÁS GRANDE */}
        <div className="relative w-full max-w-[500px] h-[280px] sm:h-[300px] flex items-end justify-center select-none">
          {/* PERSONAJE 1: ESTUDIANTE CON LAPTOP (IZQUIERDA) */}
          <div className="absolute bottom-0 left-0 sm:left-2 w-[150px] sm:w-[170px] z-10 animate-float-slow transition-transform duration-300 hover:scale-105">
            <img
              src={studentLaptop}
              alt="Estudiante con laptop e ideas"
              className="w-full h-auto drop-shadow-xs"
              loading="eager"
            />
          </div>

          {/* PERSONAJE 2: ESTUDIANTE EN ESCRITORIO CON CAFÉ (CENTRO) */}
          <div className="relative z-15 w-[190px] sm:w-[215px] -mb-1 transition-transform duration-300 hover:scale-105">
            <img
              src={studentDesk}
              alt="Estudiante escribiendo en libreta con café"
              className="w-full h-auto drop-shadow-xs"
              loading="eager"
            />
          </div>

          {/* PERSONAJE 3: ESTUDIANTE CON PILA DE LIBROS (DERECHA) */}
          <div className="absolute bottom-0 right-0 sm:right-2 w-[140px] sm:w-[155px] z-10 animate-float-delayed transition-transform duration-300 hover:scale-105">
            <img
              src={studentBooks}
              alt="Estudiante con mochila cargando libros"
              className="w-full h-auto drop-shadow-xs"
              loading="eager"
            />
          </div>
        </div>

        {/* SOMBRA SUAVE DE CONTACTO COLECTIVA */}
        <div
          className="w-4/5 h-3 bg-[#cbd5e1]/40 rounded-full blur-xs mt-1 mx-auto"
          aria-hidden="true"
        />
      </div>

      {/* MENSAJE MINIMALISTA INTEGRADO */}
      <div className="relative z-10 pt-6 max-w-lg mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-[#102c40] tracking-tight">
          El espacio colaborativo donde las ideas toman forma
        </h2>
        <p className="text-sm text-[#526679] mt-2 leading-relaxed">
          Salas virtuales en tiempo real, tableros compartidos y técnicas de enfoque diseñadas por y para estudiantes.
        </p>
      </div>
    </div>
  )
}
