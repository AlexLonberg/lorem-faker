import { test, expect } from 'vitest'
import {
  // hasOwn,
  // randomInt,
  // normalizeMinMax,
  // randomIntSafe,
  randomNumAsStr,
  capitalize
} from './utils.js'

function testNumAsStr (min: number, length: number, value: string): boolean {
  return /^[0-9]+$/.test(value) && value.length === length && Number.parseInt(value) >= min
}

test('randomNumAsStr', () => {
  expect(testNumAsStr(1, 4, randomNumAsStr(1, 4))).toBe(true)
})

test('capitalize', () => {
  expect(capitalize('foo')).toBe('Foo')
})
