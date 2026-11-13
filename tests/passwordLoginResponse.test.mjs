import assert from 'node:assert/strict'
import test from 'node:test'
import { parsePasswordLoginResponse } from '../src/services/passwordLoginResponse.ts'

const profile = {
  uid: 'uid-1',
  firstName: 'Ana',
  lastName: 'Pérez',
  username: 'ana_01',
  email: 'ana@example.com',
  avatar: 'avatar-02',
  provider: 'password',
  profileComplete: true,
  createdAt: '2026-01-01T00:00:00Z',
}

test('lee el perfil completo y el ID token del contrato de login', () => {
  const result = parsePasswordLoginResponse({
    data: {
      profile,
      session: { idToken: 'real-id-token', refreshToken: 'refresh-token', expiresIn: 3600 },
    },
    message: '¡Hola de nuevo, Ana!',
  })

  assert.deepEqual(result, {
    user: { ...profile, id: 'uid-1', nombres: 'Ana', apellidos: 'Pérez', avatarUrl: 'avatar-02' },
    token: 'real-id-token',
    message: '¡Hola de nuevo, Ana!',
  })
})

test('preserva el estado de un perfil realmente incompleto', () => {
  const result = parsePasswordLoginResponse({
    data: {
      profile: { ...profile, username: null, profileComplete: false },
      session: { idToken: 'real-id-token' },
    },
  })

  assert.equal(result?.user.profileComplete, false)
  assert.equal(result?.user.username, null)
})

test('no construye una sesión si faltan el perfil o el ID token', () => {
  assert.equal(parsePasswordLoginResponse({ data: { session: { idToken: 'real-id-token' } } }), null)
  assert.equal(parsePasswordLoginResponse({ data: { profile, session: {} } }), null)
})
