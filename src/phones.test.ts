import { test, expect } from 'vitest'
import {
  // defaultPhoneFormat,
  // parsePhoneTemplate,
  PhoneGenerator,
  phone
} from './phones.js'

function phoneTest (p: string): boolean {
  return /^\+[0-9]+\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(p)
}

test('PhoneGenerator', () => {
  const gen = new PhoneGenerator()
  const p1 = gen.next()
  gen.reset()
  const p2 = gen.next()
  expect(p1).toStrictEqual(p2)
  expect(phoneTest(p1)).toBe(true)

  const set = new Set()
  for (const item of gen.generate(100)) {
    expect(set.has(item)).toBe(false)
    set.add(item)
    expect(phoneTest(item)).toBe(true)
  }
})

test('phone', () => {
  expect(phoneTest(phone())).toBe(true)
})
