import assert from 'node:assert/strict'
import test from 'node:test'
import { ApiError, parseApiError } from '../src/services/apiErrors.ts'

test('lee el contrato TS-05 tal cual lo envía la API', () => {
  const error = parseApiError(409, {
    error: {
      code: 'USERNAME_TAKEN',
      message: 'El nombre de usuario ya se encuentra registrado por otro estudiante.',
      fields: { username: 'Este nombre de usuario ya está en uso, prueba con otro.' },
    },
  })
  assert.ok(error instanceof ApiError)
  assert.equal(error.status, 409)
  assert.equal(error.code, 'USERNAME_TAKEN')
  assert.equal(error.fields.username, 'Este nombre de usuario ya está en uso, prueba con otro.')
})

test('sin cuerpo usa un código y un mensaje en español según el estado', () => {
  const error = parseApiError(503, null)
  assert.equal(error.code, 'SERVICE_UNAVAILABLE')
  assert.match(error.message, /no está disponible/)
  assert.deepEqual(error.fields, {})
})

test('ignora campos con formato inesperado', () => {
  const error = parseApiError(400, { error: { code: 'VALIDATION_ERROR', message: 'x', fields: ['mal'] } })
  assert.deepEqual(error.fields, {})
})
