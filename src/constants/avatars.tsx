import type { ReactNode } from 'react'

export interface PresetAvatar {
  id: string
  label: string
  bgColor: string
  textColor: string
  icon: ReactNode
}

export const PRESET_AVATARS: PresetAvatar[] = [
  {
    id: 'avatar-estudiante-azul',
    label: 'Estudiante (Azul)',
    bgColor: '#e7f1fb',
    textColor: '#1f4e79',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    id: 'avatar-estudiante-coral',
    label: 'Estudiante (Coral)',
    bgColor: '#fdeee9',
    textColor: '#c25e3d',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
  {
    id: 'avatar-buho-sabiduria',
    label: 'Búho Sabio',
    bgColor: '#e8f5ef',
    textColor: '#1e654d',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="9" cy="10" r="3" />
        <circle cx="15" cy="10" r="3" />
        <path strokeLinecap="round" d="M12 11v3m0 0l-1-1m1 1l1-1M4 19c2-3 4-5 8-5s6 2 8 5" />
      </svg>
    ),
  },
  {
    id: 'avatar-libros-estudio',
    label: 'Lectura y Libros',
    bgColor: '#fef6ee',
    textColor: '#b25e29',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    id: 'avatar-ciencia-investigacion',
    label: 'Ciencia e Investigación',
    bgColor: '#eef8f8',
    textColor: '#196b75',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 5H9L8 4z" />
      </svg>
    ),
  },
  {
    id: 'avatar-pluma-academica',
    label: 'Pluma Académica',
    bgColor: '#f5f0fa',
    textColor: '#5e3a87',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  },
  {
    id: 'avatar-brujula-enfoque',
    label: 'Brújula y Enfoque',
    bgColor: '#f1f5f9',
    textColor: '#334155',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="12" cy="12" r="9" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" opacity="0.3" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
  },
  {
    id: 'avatar-cohete-innovacion',
    label: 'Meta y Progreso',
    bgColor: '#fff8ea',
    textColor: '#9a6308',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
]
