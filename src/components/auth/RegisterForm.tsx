import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Alert } from '../ui/Alert'
import { Badge } from '../ui/Badge'
import { AvatarSelector } from '../ui/AvatarSelector'
import { RegisterHeader } from './RegisterHeader'
import type { UseRegisterFormReturn } from '../../hooks/useRegisterForm'

export interface RegisterFormProps {
  form: UseRegisterFormReturn
}

export function RegisterForm({ form }: RegisterFormProps) {
  const {
    formData,
    errors,
    generalAlert,
    isLoading,
    usernameStatus,
    detectedUniversity,
    refs,
    handleChange,
    handleUsernameBlur,
    handleSubmit,
    setGeneralAlert,
  } = form

  const handleGoogleClick = () => {
    setGeneralAlert({
      variant: 'info',
      title: 'Registro con Google',
      message: 'El registro con Google te solicitará elegir tu nombre de usuario obligatorio antes de ingresar (US-02 en Sprint 1).',
    })
  }

  return (
    <div className="w-full max-w-[560px] flex flex-col gap-4">
      {/* GENERAL ALERT BANNER */}
      {generalAlert && (
        <Alert
          variant={generalAlert.variant}
          title={generalAlert.title}
          action={
            generalAlert.action === 'retry' ? (
              <Button variant="outline" size="sm" onClick={() => void handleSubmit()}>
                Reintentar
              </Button>
            ) : generalAlert.action === 'login' ? (
              <Link
                to="/ingresar"
                className="inline-flex items-center text-xs font-bold text-[#1f4e79] hover:underline"
              >
                Iniciar sesión →
              </Link>
            ) : undefined
          }
        >
          {generalAlert.message}
        </Alert>
      )}

      <div className="bg-white border border-[#dfe9f1] rounded-2xl shadow-sm p-6 sm:p-9 transition-all">
        {/* CARD HEADER & GOOGLE OAUTH */}
        <RegisterHeader isLoading={isLoading} onGoogleClick={handleGoogleClick} />

        {/* FORM */}
        <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-4">
          {/* NOMBRES Y APELLIDOS (GRID) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              ref={refs.nombres}
              label="Nombres"
              id="reg-nombres"
              name="given-name"
              autoComplete="given-name"
              placeholder="Tu nombre"
              value={formData.nombres}
              onChange={(e) => handleChange('nombres', e.target.value)}
              error={errors.nombres}
              disabled={isLoading}
              required
            />
            <Input
              ref={refs.apellidos}
              label="Apellidos"
              id="reg-apellidos"
              name="family-name"
              autoComplete="family-name"
              placeholder="Tus apellidos"
              value={formData.apellidos}
              onChange={(e) => handleChange('apellidos', e.target.value)}
              error={errors.apellidos}
              disabled={isLoading}
              required
            />
          </div>

          {/* NOMBRE DE USUARIO (USERNAME) */}
          <Input
            ref={refs.username}
            label="Nombre de usuario"
            id="reg-username"
            name="username"
            autoComplete="username"
            placeholder="ej. mateo_cardona"
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            onBlur={handleUsernameBlur}
            error={errors.username}
            helperText="De 3 a 20 caracteres; letras, números, punto o guion bajo. Sin espacios."
            disabled={isLoading}
            required
            startIcon={<span className="font-semibold text-xs text-slate-400">@</span>}
            badge={
              usernameStatus === 'checking' ? (
                <span className="text-slate-400 text-[11px] animate-pulse">Comprobando disponibilidad…</span>
              ) : usernameStatus === 'available' ? (
                <Badge variant="success">✓ Disponible</Badge>
              ) : usernameStatus === 'taken' ? (
                <Badge variant="error">✕ Ocupado</Badge>
              ) : undefined
            }
          />

          {/* SELECTOR DE AVATAR PREESTABLECIDO */}
          <AvatarSelector
            selectedId={formData.avatar}
            onSelect={(id) => handleChange('avatar', id)}
            error={errors.avatar}
          />

          {/* CORREO ELECTRÓNICO */}
          <Input
            ref={refs.email}
            label="Correo electrónico institucional o personal"
            id="reg-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="ejemplo@universidad.edu.co"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            helperText={
              detectedUniversity
                ? `Dominio universitario validado: ${detectedUniversity}`
                : 'Acepta correos institucionales (@univalle.edu.co, @unal.edu.co, etc.) o personales.'
            }
            disabled={isLoading}
            required
            badge={
              detectedUniversity ? (
                <Badge variant="institutional" icon="🏛">
                  Institucional
                </Badge>
              ) : undefined
            }
            startIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />

          {/* CONTRASEÑA */}
          <Input
            ref={refs.password}
            label="Contraseña"
            id="reg-password"
            name="new-password"
            autoComplete="new-password"
            placeholder="Crea una contraseña segura"
            isPassword
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={errors.password}
            helperText="Mínimo 8 caracteres, al menos una letra y un número."
            disabled={isLoading}
            required
          />

          {/* CONFIRMAR CONTRASEÑA */}
          <Input
            ref={refs.confirmPassword}
            label="Confirmar contraseña"
            id="reg-confirm-password"
            name="confirm-password"
            autoComplete="new-password"
            placeholder="Repite tu contraseña"
            isPassword
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
            disabled={isLoading}
            required
          />

          {/* HONOR CODE DISCLOSURE */}
          <p className="text-[11px] text-[#617487] leading-relaxed mt-1">
            Al continuar, confirmas que aceptas el <span className="text-[#1f4e79] font-medium underline">código de honor académico</span> y las normativas de colaboración de Estudiemos.
          </p>

          {/* SUBMIT BUTTON */}
          <div className="mt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              loadingText="Creando tu cuenta…"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              }
            >
              Crear cuenta
            </Button>

            {isLoading && (
              <p className="text-xs text-center text-[#526679] mt-2 animate-pulse" role="status">
                Configurando tu biblioteca personal y grupos académicos…
              </p>
            )}
          </div>

          {/* CARD BOTTOM LINK */}
          <div className="mt-2 pt-4 border-t border-[#edf2f7] text-center text-xs text-[#526679]">
            <span>¿Ya tienes cuenta? </span>
            <Link
              to="/ingresar"
              className="font-bold text-[#1f4e79] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1f4e79] rounded px-1"
            >
              Ingresa
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
