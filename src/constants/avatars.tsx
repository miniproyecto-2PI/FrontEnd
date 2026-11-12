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
    id: 'avatar-01',
    label: 'Sofía (Ciencias)',
    bgColor: '#e7f1fb',
    textColor: '#1f4e79',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.75}>
        {/* Cabello largo recogido con cola */}
        <path d="M10 13c0-4 2.5-7 6-7s6 3 6 7v3H10v-3z" fill="currentColor" fillOpacity={0.15} />
        {/* Cabeza / Rostro */}
        <circle cx="16" cy="14" r="5" strokeLinecap="round" />
        {/* Gafas de lectura */}
        <circle cx="14" cy="14" r="1.5" />
        <circle cx="18" cy="14" r="1.5" />
        <path d="M15.5 14h1" strokeLinecap="round" />
        {/* Hombros y cuello */}
        <path d="M10 27c0-4 2.5-7 6-7s6 3 6 7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'avatar-02',
    label: 'Mateo (Ingeniería)',
    bgColor: '#e8f5ef',
    textColor: '#1e654d',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.75}>
        {/* Auriculares de concentración */}
        <path d="M8 15a8 8 0 0116 0" strokeLinecap="round" />
        <rect x="7" y="14" width="2.5" height="5" rx="1.25" fill="currentColor" />
        <rect x="22.5" y="14" width="2.5" height="5" rx="1.25" fill="currentColor" />
        {/* Cabeza */}
        <circle cx="16" cy="15" r="4.5" strokeLinecap="round" />
        {/* Pelo corto moderno */}
        <path d="M12 12c1.5-2 3.5-3 6.5-2" strokeLinecap="round" />
        {/* Hombros con sudadera */}
        <path d="M9 27c0-4 3-6.5 7-6.5s7 2.5 7 6.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'avatar-03',
    label: 'Valentina (Medicina)',
    bgColor: '#fef3e7',
    textColor: '#a35b1d',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.75}>
        {/* Moño / rodete superior */}
        <circle cx="16" cy="7.5" r="2" fill="currentColor" fillOpacity={0.2} />
        {/* Cabeza */}
        <circle cx="16" cy="14" r="5" strokeLinecap="round" />
        <path d="M11 13c1-2.5 3-4 5-4s4 1.5 5 4" strokeLinecap="round" />
        {/* Cuello y estetoscopio estilizado */}
        <path d="M10 27c0-4 2.5-7 6-7s6 3 6 7" strokeLinecap="round" />
        <path d="M14 20v2.5a2 2 0 004 0V20" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'avatar-04',
    label: 'Camilo (Filosofía)',
    bgColor: '#f3e8ff',
    textColor: '#7c3aed',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.75}>
        {/* Boina académica */}
        <path d="M10 11c2-3 8-3 12 0-3 1-9 1-12 0z" fill="currentColor" fillOpacity={0.2} />
        <circle cx="16" cy="8" r="0.75" fill="currentColor" />
        {/* Cabeza */}
        <circle cx="16" cy="15" r="4.5" strokeLinecap="round" />
        {/* Bufanda / cuello */}
        <path d="M10 27c0-3.5 2.5-6 6-6s6 2.5 6 6" strokeLinecap="round" />
        <path d="M14 21h4v3h-4z" fill="currentColor" fillOpacity={0.15} />
      </svg>
    ),
  },
  {
    id: 'avatar-05',
    label: 'Elena (Matemáticas)',
    bgColor: '#fce7f3',
    textColor: '#be185d',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.75}>
        {/* Pelo corto asimétrico */}
        <path d="M11 11c2-3 7-3 10 0v5h-10v-5z" fill="currentColor" fillOpacity={0.15} />
        <circle cx="16" cy="14.5" r="4.5" strokeLinecap="round" />
        {/* Gafas cuadradas sutiles */}
        <rect x="12.5" y="13.5" width="3" height="2" rx="0.5" />
        <rect x="16.5" y="13.5" width="3" height="2" rx="0.5" />
        <path d="M15.5 14.5h1" strokeLinecap="round" />
        {/* Hombros */}
        <path d="M10 27c0-4 2.5-6.5 6-6.5s6 2.5 6 6.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'avatar-06',
    label: 'Daniel (Derecho)',
    bgColor: '#e0f2fe',
    textColor: '#0369a1',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.75}>
        {/* Cabeza y peinado formal */}
        <circle cx="16" cy="13.5" r="4.5" strokeLinecap="round" />
        <path d="M12 11c1-2 4-2.5 7-1" strokeLinecap="round" />
        {/* Cuello camisa y corbata elegante */}
        <path d="M9 27c0-4 3-6.5 7-6.5s7 2.5 7 6.5" strokeLinecap="round" />
        <path d="M16 20.5l-1 4.5h2l-1-4.5z" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'avatar-07',
    label: 'Isabella (Arquitectura)',
    bgColor: '#ecfdf5',
    textColor: '#047857',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.75}>
        {/* Gorro de taller / diadema */}
        <path d="M11 12.5a6 6 0 0110 0" strokeLinecap="round" strokeWidth={2.2} />
        <circle cx="16" cy="15" r="4.5" strokeLinecap="round" />
        {/* Lápiz tras la oreja */}
        <path d="M21 11l2-2" strokeLinecap="round" />
        {/* Hombros */}
        <path d="M10 27c0-4 2.5-6.5 6-6.5s6 2.5 6 6.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'avatar-08',
    label: 'Lucas (Informática)',
    bgColor: '#ffedd5',
    textColor: '#c2410c',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.75}>
        {/* Capucha hoodie */}
        <path d="M9 27c0-4.5 3-7 7-7s7 2.5 7 7" strokeLinecap="round" />
        <path d="M10 16a6 6 0 0112 0v4H10v-4z" fill="currentColor" fillOpacity={0.12} />
        {/* Cabeza */}
        <circle cx="16" cy="15" r="4" strokeLinecap="round" />
        <path d="M13 12c1.5-1 4.5-1 6 0" strokeLinecap="round" />
      </svg>
    ),
  },
]
