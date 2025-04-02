import { test, expect } from 'vitest'
import {
  // type TPersonCombinerStrategyOptions,
  PersonCombiner
} from './combiner.js'

test('PersonCombiner', () => {
  const com = new PersonCombiner()
  expect(com.next('name', 'surname', true)).toStrictEqual(expect.any(String))
})
