import type { ReactNode } from 'react'
import studentAvatar1 from '../assets/student-avatar-01.png'
import studentAvatar2 from '../assets/student-avatar-02.png'
import studentAvatar3 from '../assets/student-avatar-03.png'
import studentAvatar4 from '../assets/student-avatar-04.png'
import studentAvatar5 from '../assets/student-avatar-05.png'
import studentAvatar6 from '../assets/student-avatar-06.png'

export interface PresetAvatar {
  id: string
  label: string
  bgColor?: string
  textColor?: string
  icon?: ReactNode
  image?: string
}

export const PRESET_AVATARS: PresetAvatar[] = [
  { id: 'avatar-01', label: 'Sofía (Ciencias)', image: studentAvatar1 },
  { id: 'avatar-02', label: 'Mateo (Ingeniería)', image: studentAvatar2 },
  { id: 'avatar-03', label: 'Valentina (Medicina)', image: studentAvatar3 },
  { id: 'avatar-04', label: 'Camilo (Filosofía)', image: studentAvatar4 },
  { id: 'avatar-05', label: 'Elena (Matemáticas)', image: studentAvatar5 },
  { id: 'avatar-06', label: 'Daniel (Derecho)', image: studentAvatar6 },
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
