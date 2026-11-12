import studentLaptop from '../../assets/notion-student-laptop.png'
import studentBooks from '../../assets/notion-student-books.png'
import studentDesk from '../../assets/notion-student-desk.png'

export interface NotionStudySceneProps {
  isFadingOut?: boolean
}

export function NotionStudyScene({ isFadingOut = false }: NotionStudySceneProps) {
  return (
    <div
      className={`flex flex-col justify-between p-8 sm:p-9 rounded-3xl bg-linear-to-b from-[#f9fbfe] via-[#f1f6fb] to-[#e7f0f8] border border-[#d2e0ec] shadow-sm relative overflow-hidden min-h-[580px] transition-all duration-500 ease-out ${
        isFadingOut ? 'opacity-0 translate-x-8 scale-95' : 'opacity-100 translate-x-0 scale-100'
      }`}
    >
      {/* SUTILES ELEMENTOS DE AMBIENTACIÓN */}
      <div
        className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-blue-100/60 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-cyan-100/50 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* TOP TAG & ESTADO EN VIVO */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 text-[#102c40] text-xs font-semibold shadow-2xs border border-[#dfe8f0] backdrop-blur-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          Comunidad Universitaria Activa
        </span>
        <span className="text-xs text-[#526679] font-mono tracking-wide">
          128 estudiantes en vivo
        </span>
      </div>

      {/* ESCENA DE PERSONAJES ESTILO NOTION */}
      <div className="relative z-10 my-4 flex flex-col items-center justify-center">
        {/* COMPOSICIÓN DINÁMICA DE PERSONAJES */}
        <div className="relative w-full max-w-[420px] h-[310px] flex items-end justify-center select-none">
          {/* STICKER FLOTANTE SUPERIOR: SALA ACTIVA */}
          <div className="absolute top-2 left-6 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-[11px] font-semibold text-[#102c40] shadow-sm border border-[#dfe8f0] animate-float-bob">
            <span className="w-2 h-2 rounded-full bg-blue-500" aria-hidden="true" />
            <span>Sala #04 • Cálculo Vectorial</span>
          </div>

          {/* STICKER FLOTANTE DERECHO: POMODORO */}
          <div className="absolute top-8 right-4 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-[11px] font-semibold text-[#102c40] shadow-sm border border-[#dfe8f0] animate-float-delayed">
            <span>☕ 25 min concentración</span>
          </div>

          {/* PERSONAJE 1: ESTUDIANTE CON LAPTOP (IZQUIERDA) */}
          <div className="absolute bottom-0 left-0 w-[140px] z-10 animate-float-slow transition-transform duration-300 hover:scale-105">
            <img
              src={studentLaptop}
              alt="Estudiante con laptop e ideas"
              className="w-full h-auto drop-shadow-sm"
              loading="eager"
            />
          </div>

          {/* PERSONAJE 2: ESTUDIANTE EN ESCRITORIO CON CAFÉ (CENTRO) */}
          <div className="relative z-15 w-[175px] -mb-2 transition-transform duration-300 hover:scale-105">
            <img
              src={studentDesk}
              alt="Estudiante escribiendo en libreta con café"
              className="w-full h-auto drop-shadow-sm"
              loading="eager"
            />
          </div>

          {/* PERSONAJE 3: ESTUDIANTE CON PILA DE LIBROS (DERECHA) */}
          <div className="absolute bottom-0 right-0 w-[130px] z-10 animate-float-delayed transition-transform duration-300 hover:scale-105">
            <img
              src={studentBooks}
              alt="Estudiante con mochila cargando libros"
              className="w-full h-auto drop-shadow-sm"
              loading="eager"
            />
          </div>
        </div>

        {/* SOMBRA SUAVE DE CONTACTO COLECTIVA */}
        <div
          className="w-3/4 h-3 bg-[#cbd5e1]/40 rounded-full blur-xs -mt-1 mx-auto"
          aria-hidden="true"
        />
      </div>

      {/* PIE DEL PANEL: MENSAJE MINIMALISTA */}
      <div className="relative z-10 pt-4 border-t border-[#d5e2ec]">
        <h2 className="text-base font-bold text-[#102c40] tracking-tight">
          El espacio colaborativo donde las ideas toman forma
        </h2>
        <p className="text-xs text-[#526679] mt-1 leading-relaxed">
          Salas virtuales en tiempo real, tableros compartidos y técnicas de enfoque diseñadas por y para estudiantes.
        </p>
      </div>
    </div>
  )
}
