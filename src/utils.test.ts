import { test, expect } from 'vitest'
import {
  hasOwn,
  isObject,
  // isString,
  clampStrOrNull,
  isNumber,
  randomInt,
  normalizeMinMax,
  randomIntSafe,
  validateRanges,
  countDigits,
  validateProbabilityValue,
  randomIntAsStr,
  capitalize,
  calculatePrimeForSfl,
  calculateBigintCoPrimeForSfl,
  generatePermutations,
  generateCombinations,
  RatioGenerator
} from './utils.js'

function testNumAsStr (min: number, length: number, value: string): boolean {
  return /^[0-9]+$/.test(value) && value.length === length && Number.parseInt(value) >= min
}

test('hasOwn', () => {
  // @ts-expect-error
  expect(() => hasOwn(null, 'a')).toThrow()
  expect(hasOwn({}, 'b')).toBe(false)
  expect(hasOwn({ c: 0 }, 'c')).toBe(true)
})

test('isObject', () => {
  expect(isObject(null)).toBe(false)
  expect(isObject({})).toBe(true)
})

test('clampStrOrNull', () => {
  expect(clampStrOrNull(' ')).toBe(null)
  expect(clampStrOrNull(' A')).toBe('a')
})

test('isNumber', () => {
  expect(isNumber(NaN)).toBe(false)
  expect(isNumber(1.1)).toBe(true)
})

test('randomInt', () => {
  const int = randomInt(-10, 10)
  expect((-10 <= int && int <= 10)).toBe(true)
})

test('normalizeMinMax', () => {
  expect(normalizeMinMax(12.8, 0.7)).toStrictEqual([0, 13])
})

test('randomIntSafe', () => {
  const int = randomIntSafe(10, -10)
  expect((-10 <= int && int <= 10)).toBe(true)
})

test('randomIntAsStr', () => {
  expect(testNumAsStr(1, 4, randomIntAsStr(1, null, 4))).toBe(true)
})

test('validateRanges', () => {
  expect(validateRanges(null)).toStrictEqual([])
  // @ts-expect-error
  expect(validateRanges([[-10, 10], null, [4.1], [8, 3]])).toStrictEqual([[0, 10], [0, 0], [0, 5], [3, 8]])
})

test('validateProbabilityValue', () => {
  expect(validateProbabilityValue(null, 0.5)).toStrictEqual(0.5)
})

test('countDigits', () => {
  expect(countDigits(-1)).toBe(1)
  expect(countDigits(0)).toBe(1)
  expect(countDigits(9)).toBe(1)
  expect(countDigits(10)).toBe(2)
  expect(countDigits(999)).toBe(3)
  expect(countDigits(-999)).toBe(3)
})

test('capitalize', () => {
  expect(capitalize('foo')).toBe('Foo')
})

test('calculatePrimeForSfl', () => {
  const [size, prime] = calculatePrimeForSfl(8, 3)
  expect(prime).not.toBe(1)
  let i = 0
  let value = ((prime * i) % size)
  expect(value).toBe(0)
  ++i
  for (; i < size; ++i) {
    value = ((prime * i) % size)
  }
  value = ((prime * i) % size)
  expect(value).toBe(0)

  const [size_2, prime_x] = calculatePrimeForSfl(2, 3)
  expect(prime_x).toBe(1)
  expect(((prime_x * 0) % size_2)).toBe(0)
  expect(((prime_x * 1) % size_2)).toBe(1)
  expect(((prime_x * 0) % size_2)).toBe(0)

  const [size_0, prime_xx] = calculatePrimeForSfl(0, 3)
  expect(size_0).toBe(0)
  expect(prime_xx).toBe(0)
})

test('calculateBigintCoPrimeForSfl', () => {
  const [size_8, prime] = calculateBigintCoPrimeForSfl(8n)
  let i = 0n
  let value = ((prime * i) % size_8)
  expect(value).toBe(0n)
  ++i
  for (; i < size_8; ++i) {
    value = ((prime * i) % size_8)
  }
  // Обнуляется на следующем круге
  value = ((prime * i) % size_8)
  expect(value).toBe(0n)

  const [size_2, prime_x] = calculateBigintCoPrimeForSfl(2n)
  expect(((prime_x * 0n) % size_2)).toBe(0n)
  expect(((prime_x * 1n) % size_2)).toBe(1n)
  expect(((prime_x * 0n) % size_2)).toBe(0n)

  const [size_0, prime_0] = calculateBigintCoPrimeForSfl(0n)
  expect(size_0).toBe(0n)
  expect(prime_0).toBe(0n)
})

test('generatePermutations', () => {
  expect(generatePermutations(0)).toStrictEqual([])
  expect(generatePermutations(1)).toStrictEqual([[0]])
  expect(generatePermutations(2)).toStrictEqual([[0, 1], [1, 0]])
  expect(generatePermutations(3)).toStrictEqual([[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]])

  const combinations = generatePermutations(5)
  const set = new Set()
  for (const item of combinations) {
    const key = item.join(',')
    expect(set.has(key)).toBe(false)
    set.add(key)
  }
})

test('generateCombinations', () => {
  expect(generateCombinations(0)).toStrictEqual([])
  expect(generateCombinations(1)).toStrictEqual([[0]])
  expect(generateCombinations(2)).toStrictEqual([[0], [0, 1], [1], [1, 0]])
  expect(generateCombinations(3)).toStrictEqual([[0], [0, 1], [0, 1, 2], [0, 2], [0, 2, 1], [1], [1, 0], [1, 0, 2], [1, 2], [1, 2, 0], [2], [2, 0], [2, 0, 1], [2, 1], [2, 1, 0]])

  const combinations = generateCombinations(5)
  const set = new Set()
  for (const item of combinations) {
    const key = item.join(',')
    expect(set.has(key)).toBe(false)
    set.add(key)
  }
})

test('RatioGenerator', () => {
  const onlyTrue = new RatioGenerator(true, false, 1)
  const onlyFalse = new RatioGenerator(true, false, 0)
  expect(onlyTrue.next()).toBe(true)
  expect(onlyFalse.next()).toBe(false)
})
