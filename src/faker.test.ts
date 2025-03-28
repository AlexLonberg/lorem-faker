import { test, expect } from 'vitest'
import { maleNames } from './maleNames.js'
import { femaleNames } from './femaleNames.js'
import {
  // type TRecordResultMap,
  // type TRecordKind,
  // RatioGenerator,
  Faker
} from './faker.js'

test('Faker', () => {
  const faker = new Faker()

  const result = faker.gen(['name', 'email', 'age', 'gender', 'phone'], 10)
  expect(result.length).toBe(10)

  for (const item of result) {
    if (item.gender === 'male') {
      expect(maleNames).toContain(item.name)
    }
    else {
      expect(femaleNames).toContain(item.name)
    }
  }
})
