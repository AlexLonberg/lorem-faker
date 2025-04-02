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
  // type TPersonOptions,
  // type TGender,
  // PersonGeneratorContext,
  PersonGenerator
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

test('PersonGenerator', () => {
  const gen = new PersonGenerator({ ageRange: { min: 30, max: 40 } })

  const idCache = new Set()
  const loginCache = new Set()
  const emailCache = new Set()
  let index = 0
  for (const ctx of gen.generate(3)) {
    expect(index).toBe(ctx.index())
    ++index
    const id = ctx.id()
    const login = ctx.login()
    const email = ctx.email()
    expect(idCache.has(id)).toBe(false)
    idCache.add(id)
    expect(loginCache.has(login)).toBe(false)
    loginCache.add(login)
    expect(emailCache.has(email)).toBe(false)
    emailCache.add(email)
    expect(`${ctx.name()} ${ctx.surname()}`).toBe(ctx.fullName())
    const age = ctx.age()
    expect(30 <= age && age <= 40).toBe(true)
    const gender = ctx.gender()
    expect(gender === 'female' || gender === 'male').toBe(true)
  }
})
