import { test, expect } from 'vitest'
import {
  ShuffledKeyGenerator
} from './shuffle.js'

test('ShuffledKeyGenerator', () => {
  const empty = new ShuffledKeyGenerator([])
  expect(empty.next()).toBe(null)

  const skg = new ShuffledKeyGenerator([['a', 245], ['b', 0], ['c', 785]] as const)

  let a = 0
  let b = 0
  let c = 0
  const run = () => {
    for (let i = 0; i < 245 + 785; ++i) {
      const key = skg.next()
      if (key === 'a') {
        a++
      }
      else if (key === 'b') {
        b++
      }
      else {
        c++
      }
    }
  }

  run()
  expect(a).toBe(245)
  expect(b).toBe(0)
  expect(c).toBe(785)

  run()
  expect(a).toBe(245 * 2)
  expect(b).toBe(0)
  expect(c).toBe(785 * 2)
})
