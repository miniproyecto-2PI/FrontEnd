import assert from 'node:assert/strict'
import test from 'node:test'
import { persistRegisteredAvatar } from '../src/services/registeredAvatar.ts'

test('sube la imagen con el token de la cuenta recién registrada', async () => {
  const result = await persistRegisteredAvatar('new-user', async () => ({
    user: { uid: 'new-user' }, token: 'new-token',
  }), async (token) => {
    assert.equal(token, 'new-token')
    return 'https://example.com/avatar.webp'
  })
  assert.equal(result, 'https://example.com/avatar.webp')
})

test('no sube la imagen si la sesión pertenece a otra cuenta', async () => {
  await assert.rejects(() => persistRegisteredAvatar('new-user', async () => ({
    user: { uid: 'other-user' }, token: 'other-token',
  }), async () => assert.fail('No debe subir la imagen')))
})

test('no acepta una vista previa local como foto persistida', async () => {
  await assert.rejects(() => persistRegisteredAvatar('new-user', async () => ({
    user: { uid: 'new-user' }, token: 'new-token',
  }), async () => 'data:image/png;base64,a'))
})
