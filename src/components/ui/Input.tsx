import { forwardRef, useState } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helperText?: string
  startIcon?: ReactNode
  endIcon?: ReactNode
  isPassword?: boolean
  success?: boolean
  badge?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    helperText,
    startIcon,
    endIcon,
    isPassword = false,
    success = false,
    badge,
    id,
    type = 'text',
    className = '',
    required,
    disabled,
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false)
  const inputId = id || `input-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
  const errorId = `${inputId}-error`
  const helperId = `${inputId}-helper`

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  const describedBy = [
    error ? errorId : null,
    helperText ? helperId : null,
  ].filter(Boolean).join(' ') || undefined

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="text-xs font-semibold tracking-wide text-[#102c40] flex items-center gap-1"
        >
          <span>{label}</span>
          {required && <span className="text-red-600 font-bold" aria-hidden="true">*</span>}
        </label>
        {badge && <div className="text-xs">{badge}</div>}
      </div>

      <div className="relative flex items-center">
        {startIcon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400" aria-hidden="true">
            {startIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={inputType}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`w-full min-h-[48px] px-3.5 py-2.5 text-sm rounded-lg bg-white text-[#102c40] placeholder:text-slate-400 transition-colors border
            ${startIcon ? 'pl-10' : ''}
            ${isPassword || endIcon || error || success ? 'pr-11' : ''}
            ${
              error
                ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500'
                : success
                ? 'border-emerald-500 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500'
                : 'border-[#cbd5e1] hover:border-slate-400 focus:border-[#1f4e79] focus:ring-1 focus:ring-[#1f4e79]'
            }
            focus:outline-none disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed`}
          {...props}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2.5 p-1.5 text-slate-500 hover:text-[#102c40] rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4e79]"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        ) : error ? (
          <div className="absolute right-3.5 flex items-center pointer-events-none text-red-600" aria-hidden="true">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        ) : success ? (
          <div className="absolute right-3.5 flex items-center pointer-events-none text-emerald-600" aria-hidden="true">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        ) : endIcon ? (
          <div className="absolute right-3.5 flex items-center pointer-events-none text-slate-400" aria-hidden="true">
            {endIcon}
          </div>
        ) : null}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="text-xs font-medium text-red-700 flex items-center gap-1.5 mt-0.5">
          <span aria-hidden="true" className="inline-block shrink-0">⚠</span>
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-slate-500 mt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  )
})

