import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeRoomCode, sortRoomsByNewest, validateRoomName } from '../src/utils/rooms.ts'

test('nombre vacío o solo espacios explica cómo corregirlo', () => {
  assert.match(validateRoomName(''), /obligatorio.*3 a 60/)
  assert.match(validateRoomName('    '), /obligatorio/)
})

test('nombre corto y nombre de 61 caracteres no son válidos', () => {
  assert.match(validateRoomName('ab'), /muy corto/)
  assert.match(validateRoomName('a'.repeat(61)), /supera los 60 caracteres/)
})

test('acepta los límites 3 y 60 (sin contar espacios de los extremos)', () => {
  assert.equal(validateRoomName('abc'), null)
  assert.equal(validateRoomName(`  ${'a'.repeat(60)}  `), null)
})

test('normaliza el código como lo comparten', () => {
  assert.equal(normalizeRoomCode(' 8k4m-9q2t '), '8K4M9Q2T')
  assert.equal(normalizeRoomCode('https://estudiemos.vercel.app/salas/8K4M9Q2T'), '8K4M9Q2T')
  assert.equal(normalizeRoomCode('8K4M 9Q2T7W'), '8K4M9Q2T7W')
})

test('rechaza códigos que no pueden ser un ID', () => {
  assert.equal(normalizeRoomCode(''), null)
  assert.equal(normalizeRoomCode('abc'), null)
  assert.equal(normalizeRoomCode('sala#1!'), null)
})

test('ordena las salas de la más reciente a la más antigua', () => {
  const sorted = sortRoomsByNewest([
    { id: 'A', createdAt: '2026-11-01T10:00:00Z' },
    { id: 'B', createdAt: '2026-11-18T10:00:00Z' },
  ])
  assert.deepEqual(sorted.map((r) => r.id), ['B', 'A'])
})
