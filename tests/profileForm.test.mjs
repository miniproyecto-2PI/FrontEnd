import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildProfilePatch,
  draftFromProfile,
  errorsFromApi,
  firstErrorField,
  initialsOf,
  validateProfileDraft,
} from '../src/utils/profileForm.ts'

const saved = draftFromProfile({
  firstName: 'Mateo',
  lastName: 'Cardona',
  username: 'mateo_udea',
  email: 'mateo@udea.edu.co',
  avatar: 'avatar-02',
})

test('sin cambios no arma PATCH (Guardar queda deshabilitado)', () => {
  assert.deepEqual(buildProfilePatch(saved, { ...saved }, { canEditEmail: true }), {})
})

test('envía solo los campos modificados y recortados', () => {
  const draft = { ...saved, firstName: '  Mateo José ', username: 'mateo_c' }
  assert.deepEqual(buildProfilePatch(saved, draft, { canEditEmail: true }), {
    firstName: 'Mateo José',
    username: 'mateo_c',
  })
})

test('ignora espacios y mayúsculas del correo como cambio', () => {
  const draft = { ...saved, email: ' MATEO@udea.edu.co ' }
  assert.deepEqual(buildProfilePatch(saved, draft, { canEditEmail: true }), {})
})

test('una cuenta de Google nunca envía el correo', () => {
  const draft = { ...saved, email: 'otro@gmail.com' }
  assert.deepEqual(buildProfilePatch(saved, draft, { canEditEmail: false }), {})
})

test('solo envía avatares del catálogo; las fotos propias van por otro endpoint', () => {
  assert.deepEqual(buildProfilePatch(saved, { ...saved, avatar: 'avatar-05' }, { canEditEmail: true }), {
    avatar: 'avatar-05',
  })
  assert.deepEqual(
    buildProfilePatch(saved, { ...saved, avatar: 'https://res.cloudinary.com/x.webp' }, { canEditEmail: true }),
    {}
  )
})

test('valida con las reglas de US-01', () => {
  const errors = validateProfileDraft(
    { ...saved, firstName: ' ', username: 'ab', email: 'sin-arroba' },
    { canEditEmail: true }
  )
  assert.ok(errors.firstName)
  assert.ok(errors.username)
  assert.ok(errors.email)
  assert.equal(errors.lastName, undefined)
  assert.equal(firstErrorField(errors), 'firstName')
})

test('no valida el correo de solo lectura de Google', () => {
  const errors = validateProfileDraft({ ...saved, email: '' }, { canEditEmail: false })
  assert.equal(errors.email, undefined)
})

test('lleva los 409 de disponibilidad al campo correcto', () => {
  assert.match(errorsFromApi('USERNAME_TAKEN', {}).username, /ya lo usa otra persona/)
  assert.match(errorsFromApi('EMAIL_IN_USE', {}).email, /ya está registrado/)
  assert.deepEqual(errorsFromApi('VALIDATION_ERROR', { lastName: 'Escribe tus apellidos.' }), {
    lastName: 'Escribe tus apellidos.',
  })
})

test('iniciales para el avatar por defecto', () => {
  assert.equal(initialsOf('mateo', 'cardona'), 'MC')
  assert.equal(initialsOf('', ''), 'E')
})
