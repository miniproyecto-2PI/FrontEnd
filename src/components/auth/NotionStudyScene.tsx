import studentLaptop from '../../assets/notion-student-laptop.png'
import studentBooks from '../../assets/notion-student-books.png'
import studentDesk from '../../assets/notion-student-desk.png'

export interface NotionStudySceneProps {
  isFadingOut?: boolean
}

export function NotionStudyScene({ isFadingOut = false }: NotionStudySceneProps) {
  return (
    <div
      className={`flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-linear-to-b from-[#f9fbfe] via-[#f1f6fb] to-[#e7f0f8] border border-[#d2e0ec] shadow-sm relative overflow-hidden min-h-[430px] sm:min-h-[450px] transition-all duration-500 ease-out ${
        isFadingOut ? 'opacity-0 translate-x-8 scale-95' : 'opacity-100 translate-x-0 scale-100'
      }`}
    >
      {/* SUTILES ELEMENTOS DE AMBIENTACIÓN */}
      <div
        className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-100/50 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-cyan-100/40 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* ESCENA DE PERSONAJES ESTILO NOTION */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-2">
        {/* COMPOSICIÓN DINÁMICA DE PERSONAJES */}
        <div className="relative w-full max-w-[390px] h-[220px] flex items-end justify-center select-none">
          {/* PERSONAJE 1: ESTUDIANTE CON LAPTOP (IZQUIERDA) */}
          <div className="absolute bottom-0 left-2 w-[115px] sm:w-[125px] z-10 animate-float-slow transition-transform duration-300 hover:scale-105">
            <img
              src={studentLaptop}
              alt="Estudiante con laptop e ideas"
              className="w-full h-auto drop-shadow-xs"
              loading="eager"
            />
          </div>

          {/* PERSONAJE 2: ESTUDIANTE EN ESCRITORIO CON CAFÉ (CENTRO) */}
          <div className="relative z-15 w-[145px] sm:w-[155px] -mb-1 transition-transform duration-300 hover:scale-105">
            <img
              src={studentDesk}
              alt="Estudiante escribiendo en libreta con café"
              className="w-full h-auto drop-shadow-xs"
              loading="eager"
            />
          </div>

          {/* PERSONAJE 3: ESTUDIANTE CON PILA DE LIBROS (DERECHA) */}
          <div className="absolute bottom-0 right-2 w-[105px] sm:w-[115px] z-10 animate-float-delayed transition-transform duration-300 hover:scale-105">
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
          className="w-2/3 h-2.5 bg-[#cbd5e1]/40 rounded-full blur-xs -mt-1 mx-auto"
          aria-hidden="true"
        />
      </div>

      {/* PIE DEL PANEL: MENSAJE MINIMALISTA */}
      <div className="relative z-10 pt-4 border-t border-[#d5e2ec]/80">
        <h2 className="text-sm sm:text-base font-bold text-[#102c40] tracking-tight">
          El espacio colaborativo donde las ideas toman forma
        </h2>
        <p className="text-xs text-[#526679] mt-1 leading-relaxed">
          Salas virtuales en tiempo real, tableros compartidos y técnicas de enfoque diseñadas por y para estudiantes.
        </p>
      </div>
    </div>
  )
}
