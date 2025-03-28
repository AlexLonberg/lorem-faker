import { maleNames } from './maleNames.js'
import { femaleNames } from './femaleNames.js'
import { surnames } from './surnames.js'
import {
  randomInt,
  randomNumAsStr
} from './utils.js'
import { mailSuffix } from './domains.js'

/**
 * Случайное имя пользователя из набора {@link maleNames}.
 */
function maleName (): string {
  return maleNames[randomInt(0, maleNames.length - 1)]!
}

/**
 * Случайное имя пользователя из набора {@link femaleNames}.
 */
function femaleName (): string {
  return femaleNames[randomInt(0, femaleNames.length - 1)]!
}

/**
 * Случайное имя пользователя из набора {@link surname}.
 */
function surname (): string {
  return surnames[randomInt(0, surnames.length - 1)]!
}

/**
 * Случайное имя пользователя: `FirstName`.
 *
 * @param maleOrFemale Использовать ли таблицу на основе гендера:
 *                       + `1` - male
 *                       + `2` - female
 */
function name (maleOrFemale?: undefined | null | 0 | 1 | 2): string {
  if (maleOrFemale !== 1 && maleOrFemale !== 2) {
    maleOrFemale = randomInt(1, 2) as 1 | 2
  }
  return maleOrFemale === 1 ? maleName() : femaleName()
}

/**
 * Случайное имя пользователя: `FirstName LastName`.
 *
 * @param maleOrFemale Использовать ли таблицу на основе гендера:
 *                       + `1` - male
 *                       + `2` - female
 */
function fullName (maleOrFemale?: undefined | null | 0 | 1 | 2): string {
  if (maleOrFemale !== 1 && maleOrFemale !== 2) {
    maleOrFemale = randomInt(1, 2) as 1 | 2
  }
  return `${maleOrFemale === 1 ? maleName() : femaleName()} ${surname()}`
}

/**
 * Случайная почта пользователя.
 *
 * @param personName Если указано, имя будет добавлено до символа `@`.
 */
function email (personName?: undefined | null | string): string {
  if (personName) {
    personName = personName.replaceAll(/\s+/g, '.')
  }
  else {
    personName = `${name()}.${surname()}`
  }
  return `${personName.toLowerCase()}${mailSuffix()}`
}

/**
 * Случайный телефон в простом формате `+code(999)999-99-99`.
 *
 * @param code Если не указано, код будет случаным от `1` до `999`.
 */
function phone (code?: undefined | null | number): string {
  return `+${code ?? randomInt(1, 999)}(${randomNumAsStr(1, 3)})${randomNumAsStr(0, 3)}-${randomNumAsStr(0, 2)}-${randomNumAsStr(0, 2)}`
}

export {
  maleName,
  femaleName,
  surname,
  name,
  fullName,
  email,
  phone
}
