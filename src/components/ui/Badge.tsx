import type { ReactNode } from 'react'

export interface BadgeProps {
  variant?: 'institutional' | 'success' | 'warning' | 'error' | 'neutral'
  children: ReactNode
  icon?: ReactNode
  dot?: boolean
  className?: string
}

export function Badge({
  variant = 'neutral',
  children,
  icon,
  dot = false,
  className = '',
}: BadgeProps) {
  const styles = {
    institutional: 'bg-[#e7f1fb] text-[#1f4e79] border-[#c8ddf2]',
    success: 'bg-[#e8f5ef] text-[#1e654d] border-[#c5e8d9]',
    warning: 'bg-[#fef6ee] text-[#b25e29] border-[#fcdbc3]',
    error: 'bg-[#fef2f2] text-[#991b1b] border-[#fecaca]',
    neutral: 'bg-[#f1f5f9] text-[#475569] border-[#e2e8f0]',
  }[variant]

  const dotStyles = {
    institutional: 'bg-[#1f4e79]',
    success: 'bg-[#10b981]',
    warning: 'bg-[#f59e0b]',
    error: 'bg-[#ef4444]',
    neutral: 'bg-[#64748b]',
  }[variant]

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border select-none ${styles} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotStyles}`} aria-hidden="true" />}
      {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </span>
  )
}

