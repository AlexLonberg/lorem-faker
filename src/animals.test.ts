import { test, expect } from 'vitest'
import {
  animals,
  // type TAnimal,
  animal
} from './animals.js'

test('animal', () => {
  // @ts-expect-error read-only
  expect(() => animals.length = 0).toThrow()
  // @ts-expect-error read-only
  expect(() => animals[0] = 'any').toThrow()

  expect(animals).toContain(animal())
  expect(animals).toContain(animal())
})
