import type { ReactNode } from 'react'

export interface PageShellProps {
  title: string
  description: string
  children?: ReactNode
}

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <main id="main-content" className="page-shell">
      <div className="page-card">
        <span className="eyebrow">ESTUDIEMOS</span>
        <h1>{title}</h1>
        <p>{description}</p>
        {children}
      </div>
    </main>
  )
}
