import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Alert } from '../ui/Alert'
import { Badge } from '../ui/Badge'
import { AvatarSelector } from '../ui/AvatarSelector'
import { RegisterHeader } from './RegisterHeader'
import { PRESET_AVATARS } from '../../constants/avatars'
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
    step,
    refs,
    handleChange,
    handleUsernameBlur,
    handleNextStep,
    handlePrevStep,
    handleSubmit,
  } = form

  const selectedAvatar =
    PRESET_AVATARS.find((a) => a.id === formData.avatar) || PRESET_AVATARS[0]

  const handleGoogleClick = () => {
    void form.handleGoogleSignIn()
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
        {/* CARD HEADER CON RUEDITA "PASO 1 DE 2" */}
        <RegisterHeader
          isLoading={isLoading}
          step={step}
          onGoogleClick={handleGoogleClick}
        />

        {/* FORM */}
        <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-4">
          {/* ==================== PASO 1: IDENTIDAD Y AVATAR ==================== */}
          {step === 1 && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-200">
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
                label="Nombre de usuario único"
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
                    <span className="text-slate-400 text-[11px] animate-pulse">
                      Comprobando disponibilidad…
                    </span>
                  ) : usernameStatus === 'available' ? (
                    <Badge variant="success">✓ Disponible</Badge>
                  ) : usernameStatus === 'taken' ? (
                    <Badge variant="error">✕ Ocupado</Badge>
                  ) : undefined
                }
              />

              {/* SELECTOR DE AVATAR INSTITUCIONAL Y FOTO PERSONALIZADA */}
              <AvatarSelector
                selectedId={formData.avatar}
                onSelect={(id) => handleChange('avatar', id)}
                customPreview={formData.customAvatarPreview}
                onCustomFileSelect={(file, previewUrl) => {
                  form.handleCustomAvatarSelect(file, previewUrl)
                }}
                onClearCustomFile={() => {
                  form.handleClearCustomAvatar()
                }}
                error={errors.avatar}
              />

              {/* BOTÓN CONTINUAR AL PASO 2 */}
              <div className="pt-2">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => void handleNextStep()}
                >
                  Continuar a credenciales →
                </Button>
              </div>
            </div>
          )}

          {/* ==================== PASO 2: CREDENCIALES DE ACCESO ==================== */}
          {step === 2 && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-200">
              {/* RESUMEN IDENTIDAD PREVIA */}
              <div className="flex items-center justify-between p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl">
                <div className="flex items-center gap-3">
                  {formData.customAvatarPreview ? (
                    <img
                      src={formData.customAvatarPreview}
                      alt="Foto seleccionada"
                      className="w-10 h-10 rounded-full object-cover shrink-0 shadow-2xs border border-slate-200"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-2xs"
                      style={{ backgroundColor: selectedAvatar.bgColor, color: selectedAvatar.textColor }}
                    >
                      {selectedAvatar.icon}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#102c40]">
                      {formData.nombres} {formData.apellidos}
                    </span>
                    <span className="font-mono text-[11px] text-[#1f4e79] font-semibold">
                      @{formData.username}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="text-xs font-semibold text-[#1f4e79] hover:underline px-2 py-1 rounded"
                >
                  Cambiar
                </button>
              </div>

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
              />

              {/* CONTRASEÑA */}
              <Input
                ref={refs.password}
                label="Contraseña"
                id="reg-password"
                name="new-password"
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                error={errors.password}
                helperText="Mínimo 8 caracteres con al menos una letra y un número."
                disabled={isLoading}
                required
                isPassword
              />

              {/* CONFIRMAR CONTRASEÑA */}
              <Input
                ref={refs.confirmPassword}
                label="Confirmar contraseña"
                id="reg-confirm-password"
                name="new-password"
                autoComplete="new-password"
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                error={errors.confirmPassword}
                disabled={isLoading}
                required
                isPassword
              />

              {/* HONOR CODE */}
              <p className="text-[11px] text-[#617487] leading-relaxed mt-1">
                Al continuar, confirmas que aceptas el{' '}
                <span className="text-[#1f4e79] font-medium underline">
                  código de honor académico
                </span>{' '}
                y las normativas de colaboración de Estudiemos.
              </p>

              {/* BOTONES ACCIÓN: SUBMIT & VOLVER */}
              <div className="flex flex-col gap-2.5 mt-2">
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

                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  fullWidth
                  disabled={isLoading}
                  onClick={handlePrevStep}
                >
                  ← Volver al paso 1: Identidad
                </Button>

                {isLoading && (
                  <p className="text-xs text-center text-[#526679] mt-2 animate-pulse" role="status">
                    Configurando tu biblioteca personal y grupos académicos…
                  </p>
                )}
              </div>
            </div>
          )}

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
