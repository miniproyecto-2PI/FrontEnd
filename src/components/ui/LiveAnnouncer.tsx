import { createContext, useCallback, useContext, useRef, useState } from 'react'
import type { ReactNode } from 'react'

type Politeness = 'polite' | 'assertive'

const AnnouncerContext = createContext<(message: string, politeness?: Politeness) => void>(() => {})

/**
 * Anunciador central para lectores de pantalla (TS-06): dos regiones vivas
 * (role="status" y role="alert") siempre presentes en el DOM. Se usa para avisos
 * que no tienen un lugar visible estable, como "ID copiado".
 */
export function LiveAnnouncerProvider({ children }: { children: ReactNode }) {
  const [polite, setPolite] = useState('')
  const [assertive, setAssertive] = useState('')
  const timer = useRef<number | undefined>(undefined)

  const announce = useCallback((message: string, politeness: Politeness = 'polite') => {
    const set = politeness === 'assertive' ? setAssertive : setPolite
    // Vaciar primero permite repetir el mismo mensaje (copiar dos veces seguidas)
    set('')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => set(message), 60)
  }, [])

  return (
    <AnnouncerContext.Provider value={announce}>
      {children}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {polite}
      </div>
      <div className="sr-only" role="alert" aria-live="assertive" aria-atomic="true">
        {assertive}
      </div>
    </AnnouncerContext.Provider>
  )
}

export function useAnnouncer() {
  return useContext(AnnouncerContext)
}
