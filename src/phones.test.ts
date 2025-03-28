import { test, expect } from 'vitest'
import {
  // type TPhoneRangeOptions,
  NumTupleGenerator,
  PhoneGenerator
} from './phones.js'

test('NumTupleGenerator', () => {
  const tg = new NumTupleGenerator<[number, number]>([[7, 7], [4, 99]])
  const cache = new Set()
  for (let i = 0; i < tg.maxCombinations; ++i) {
    cache.add(tg.next().join(','))
  }
  expect(cache.size).toBe(tg.maxCombinations)
  const tuple = tg.next().join(',')
  expect(tuple).toBe(cache.values().next().value)
  cache.add(tuple)
  expect(cache.size).toBe(tg.maxCombinations)

  cache.clear()
  const tgPhone = new NumTupleGenerator<[number, number]>([[7, 8], [1, 999], [1, 99]])
  for (let i = 0; i < tgPhone.maxCombinations; ++i) {
    cache.add(tg.next().join(','))
  }
  expect(cache.size).toBe(tg.maxCombinations)
  cache.add(tg.next().join(','))
  expect(cache.size).toBe(tg.maxCombinations)
})

test('PhoneGenerator', () => {
  const pg = new PhoneGenerator()
  const p1 = pg.gen(10)
  pg.reset()
  const p2 = pg.gen(10)
  expect(p1).toStrictEqual(p2)
  expect(/^\+[0-9]{1,3}\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(p1[0]!)).toBe(true)
})
