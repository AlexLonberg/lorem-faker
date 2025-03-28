import { test, expect } from 'vitest'
import { safeMailDomains } from './domains.js'
import { maleNames } from './maleNames.js'
import { femaleNames } from './femaleNames.js'
import { surnames } from './surnames.js'
import {
  maleName,
  femaleName,
  surname,
  name,
  fullName,
  email,
  phone
} from './person.js'

const allNames = [...maleNames, ...femaleNames]

function mailTest (x: string): boolean {
  const [fn, m] = x.split('@')!
  const [n, s] = fn!.split('.')!
  // @ts-expect-error
  return allNames.includes(n.substring(0, 1).toUpperCase() + n.substring(1).toLowerCase()) &&
    // @ts-expect-error
    surnames.includes(s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase()) &&
    // @ts-expect-error
    safeMailDomains.includes('@' + m)
}

function phoneTest (p: string): boolean {
  return /^\+[0-9]+\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(p)
}

test('names', () => {
  // @ts-expect-error read-only
  expect(() => maleNames.length = 0).toThrow()
  // @ts-expect-error read-only
  expect(() => femaleNames.length = 0).toThrow()
  // @ts-expect-error read-only
  expect(() => surnames.length = 0).toThrow()

  expect(allNames).toContain(name())
  expect(maleNames).toContain(name(1))
  expect(femaleNames).toContain(name(2))
  expect(maleNames).toContain(maleName())
  expect(femaleNames).toContain(femaleName())
  expect(surnames).toContain(surname())

  const fullNameAny = fullName().split(' ')
  const fullNameMale = fullName(1).split(' ')
  const fullNameFemale = fullName(2).split(' ')

  expect(allNames).toContain(fullNameAny[0])
  expect(surnames).toContain(fullNameAny[1])

  expect(maleNames).toContain(fullNameMale[0])
  expect(surnames).toContain(fullNameMale[1])

  expect(femaleNames).toContain(fullNameFemale[0])
  expect(surnames).toContain(fullNameFemale[1])
})

test('email', () => {
  expect(mailTest(email())).toBe(true)

  const userName = fullName()
  const userEmail = email(userName)

  expect(mailTest(userEmail)).toBe(true)
  const prefix = userName.split(/\s+/).join('.').toLowerCase()
  expect(userEmail.startsWith(prefix)).toBe(true)
})

test('phone', () => {
  expect(phoneTest(phone())).toBe(true)
  const userPhone = phone(7)
  expect(phoneTest(userPhone)).toBe(true)
  expect(userPhone.startsWith('+7')).toBe(true)
})
