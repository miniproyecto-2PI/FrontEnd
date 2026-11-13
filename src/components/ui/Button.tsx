import type { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'secondary' | 'light' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  loadingText?: string
  fullWidth?: boolean
  icon?: ReactNode
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  fullWidth = false,
  icon,
  className = '',
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1f4e79] disabled:opacity-60 disabled:cursor-not-allowed select-none'

  const sizeClasses = {
    sm: 'text-xs px-3 py-2 min-h-[38px] gap-1.5',
    md: 'text-sm px-4 py-2.5 min-h-[48px] gap-2',
    lg: 'text-base px-6 py-3 min-h-[52px] gap-2.5',
  }[size]

  const variantClasses = {
    primary: 'bg-[#1f4e79] text-white hover:bg-[#163a5a] active:bg-[#112d47] border border-[#1f4e79] shadow-sm',
    secondary: 'bg-[#f0f5f9] text-[#1f4e79] hover:bg-[#e2eef7] border border-[#dbe7f0]',
    outline: 'bg-white text-[#1f4e79] border border-[#cbd5e1] hover:bg-[#f8fafc] hover:border-[#94a3b8] active:bg-[#f1f5f9]',
    ghost: 'bg-transparent text-[#526679] hover:bg-[#f1f5f9] hover:text-[#102c40]',
    light: 'bg-white text-[#1f4e79] border border-white hover:bg-[#edf5fb] shadow-sm',
    danger: 'border border-red-700 bg-red-700 text-white hover:border-red-800 hover:bg-red-800 active:bg-red-900',
  }[variant]

  const widthClass = fullWidth ? 'w-full' : ''

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${widthClass} ${className}`.trim()}
      {...props}
    >
      {isLoading ? (
        <>
          <span
            className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  )
}

