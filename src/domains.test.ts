import { test, expect } from 'vitest'
import { loremIpsumWords } from './lorem.js'
import {
  topLevelDomains,
  // type TTopLevelDomain,
  safeMailDomains,
  // type TSafeMailDomain,
  tld,
  domain,
  mailSuffix
} from './domains.js'

function domainTest (text: string): boolean {
  const [first, last] = text.split('.') as [string, string]
  return loremIpsumWords.includes(first) && (last === 'test' || last === 'example')
}

test('domain', () => {
  // @ts-expect-error read-only
  expect(() => topLevelDomains.length = 0).toThrow()
  // @ts-expect-error read-only
  expect(() => safeMailDomains[0] = 'any').toThrow()

  expect(topLevelDomains).toContain(tld())
  expect(safeMailDomains).toContain(mailSuffix())

  expect(domainTest(domain())).toBe(true)
  expect(domainTest(domain())).toBe(true)
})
