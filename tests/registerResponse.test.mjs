import assert from 'node:assert/strict'
import test from 'node:test'
import { extractRefreshToken, parsePasswordLoginResponse } from '../src/services/passwordLoginResponse.ts'

// POST /api/auth/register (201) responde con la misma forma que el login: { profile, session }
const registerBody = {
  success: true,
  message: '¡Tu cuenta está lista!',
  data: {
    profile: {
      uid: 'uid-nuevo',
      firstName: 'Santiago',
      lastName: 'Arias',
      username: 'santi_nuevo',
      email: 'santi@udea.edu.co',
      avatar: 'avatar-01',
      provider: 'password',
      profileComplete: true,
      createdAt: '2026-11-19T00:00:00Z',
    },
    session: { idToken: 'id-token-registro', refreshToken: 'refresh-registro', expiresIn: 3600 },
  },
}

test('el registro trae el perfil y los tokens para entrar directo al panel', () => {
  const session = parsePasswordLoginResponse(registerBody)
  assert.equal(session?.user.uid, 'uid-nuevo')
  assert.equal(session?.token, 'id-token-registro')
  assert.equal(extractRefreshToken(registerBody), 'refresh-registro')
})

test('la respuesta anterior (solo perfil) no se toma como sesión: se usa el respaldo', () => {
  assert.equal(parsePasswordLoginResponse({ data: registerBody.data.profile }), null)
})
