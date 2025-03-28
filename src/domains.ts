import { randomInt } from './utils.js'
import { loremIpsumWords } from './lorem.js'

/** Популярные и наиболее встречающиеся доменные имена первого уровня. */
const topLevelDomains = Object.freeze([
  'com',    // Основной (самый частый)
  'net',    // Сети/технологии
  'org',    // Некоммерческие организации
  'io',     // Технологические стартапы
  'info',   // Информационные ресурсы
  // 'co',     // Универсальный (альтернатива .com)
  // 'biz',    // Бизнес
  // 'me',     // Персональные сайты
  // 'edu',    // Образование
  // 'gov'     // Правительство
] as const)
/** Популярные и наиболее встречающиеся доменные имена первого уровня. */
type TTopLevelDomain = (typeof topLevelDomains)[number]

/** Несуществующие домены [rfc2606](https://datatracker.ietf.org/doc/html/rfc2606) для генерации фейковой почты. */
const safeMailDomains = Object.freeze([
  '@example.com', // RFC-зарезервированный (реальные компании не могут их купить)
  '@example.net',
  '@example.org',
  '@mail.test',   // TLDs for Testing
  '@mail.example'
] as const)
/** Несуществующие домены [rfc2606](https://datatracker.ietf.org/doc/html/rfc2606) для генерации фейковой почты. */
type TSafeMailDomain = (typeof safeMailDomains)[number]

/**
 * Случайное популярно доменное имя первого уровня.
 */
function tld (): TTopLevelDomain {
  return topLevelDomains[randomInt(0, topLevelDomains.length - 1)]!
}

/**
 * Случайное доменное имя второго уровня.
 *
 * Для генерации фейковых доменов используются защищенные [TLDs .test/.example](https://datatracker.ietf.org/doc/html/rfc2606).
 */
function domain (): string {
  return `${loremIpsumWords[randomInt(0, loremIpsumWords.length - 1)]!}.${Math.random() < 0.5 ? 'test' : 'example'}`
}

/**
 * Случаное защищенное доменное имя с префиксом `@*` для генерации почтового адреса.
 */
function mailSuffix (): TSafeMailDomain {
  return safeMailDomains[randomInt(0, safeMailDomains.length - 1)]!
}

export {
  topLevelDomains,
  type TTopLevelDomain,
  safeMailDomains,
  type TSafeMailDomain,
  tld,
  domain,
  mailSuffix
}
