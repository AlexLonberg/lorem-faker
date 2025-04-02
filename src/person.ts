import type { TMinMax, TRange } from './types.js'
import { isNumber, randomInt, validateProbabilityValue, RatioGenerator } from './utils.js'
import { maleNames } from './maleNames.js'
import { femaleNames } from './femaleNames.js'
import { surnames } from './surnames.js'
import { mailSuffix } from './domains.js'
import { NumGenerator } from './num.js'
import { type TPersonCombinerStrategyOptions, PersonCombiner } from './combiner.js'

function validateAge (min: any, max: any): TRange {
  if (!isNumber(min)) {
    min = 20
  }
  else if (!Number.isInteger(min)) {
    min = Math.max(Math.round(min), 0)
  }
  else if (min < 0) {
    min = 0
  }
  if (!isNumber(max)) {
    max = 80
  }
  else if (!Number.isInteger(max)) {
    max = Math.round(max)
  }
  return [min, Math.max(min, max)]
}

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
 * @param personName Если указано, будет добавлено до символа `@`.
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
 * Опции генератора {@link PersonGenerator}.
 *
 *   + `genderRatio` - Соотношение гендера. От этой опции зависит частота генерируемых имен.
 *   + `ageRange` - Возрастной диапазон.
 */
type TPersonOptions = {
  /** Пример: `0.4` - 4 male и 6 female */
  genderRatio?: undefined | null | 0 | number | 1
  /** Возрастной диапазон */
  ageRange?: undefined | null | TMinMax
  /** Смотри {@link TPersonCombinerStrategyOptions} */
  strategy?: undefined | null | TPersonCombinerStrategyOptions
}

type TGender = 'male' | 'female'

class PersonGeneratorContext {
  protected _id: null | number = null
  protected _name: null | string = null
  protected _gender: null | TGender = null
  protected _surname: null | string = null
  protected _login: null | string = null
  protected _email: null | string = null
  protected _age: null | number = null

  protected readonly _parent: PersonGenerator
  protected readonly _index: number
  protected readonly _idCounter: NumGenerator

  constructor(parent: PersonGenerator, index: number, idCounter: NumGenerator) {
    this._parent = parent
    this._index = index
    this._idCounter = idCounter
  }

  index (): number {
    return this._index
  }

  id (): number {
    return this._id ?? (this._id = this._idCounter.next())
  }

  name (): string {
    if (!this._name) {
      [this._name, this._gender] = this._parent.name()
    }
    return this._name
  }

  surname (): string {
    return this._surname ?? (this._surname = this._parent.surname())
  }

  fullName (): string {
    return `${this.name()} ${this.surname()}`
  }

  login (): string {
    return this._login ?? (this._login = this._parent.login(this.name(), this.surname()))
  }

  email (): string {
    return this._email ?? (this._email = this._parent.email(this.name(), this.surname()))
  }

  gender (): TGender {
    if (!this._gender) {
      this._parent.name()
    }
    return this._gender!
  }

  age (): number {
    return this._age ?? (this._age = this._parent.age())
  }
}

/**
 * Генератор фейковых имен, электронной почты и других полей.
 */
class PersonGenerator {
  protected readonly _gender: RatioGenerator<boolean>
  protected readonly _ageRange: Readonly<TRange>
  protected readonly _combiner: PersonCombiner

  constructor(options?: undefined | null | TPersonOptions) {
    this._gender = new RatioGenerator(true, false, validateProbabilityValue(options?.genderRatio, 0.5))
    this._ageRange = Object.freeze(validateAge(options?.ageRange?.min, options?.ageRange?.max))
    this._combiner = new PersonCombiner(options?.strategy)
  }

  name (): [string, TGender] {
    return this._gender.next() ? [maleName(), 'male'] : [femaleName(), 'female']
  }

  surname (): string {
    return surname()
  }

  login (first: string, second: string): string {
    return this._combiner.next(first, second, false)
  }

  email (first: string, second: string): string {
    return this._combiner.next(first, second, true)
  }

  age (): number {
    return randomInt(...this._ageRange)
  }

  /**
   * Возвращает итерируем объект с доступом к контексту получения пользовательских данных с уникальными `login` и `email`.
   *
   * @param num Требуемое количество итераций.
   */
  *generate (num: number): Generator<PersonGeneratorContext, void, undefined> {
    this.reset()
    if (!isNumber(num) || (num = Math.round(num)) < 1) {
      return
    }
    const idCounter = new NumGenerator(num, null, 1)
    for (let i = 0; i < num; ++i) {
      yield new PersonGeneratorContext(this, i, idCounter)
    }
  }

  /**
   * Сбросить кешированные данные
   */
  reset (): void {
    this._combiner.reset()
  }
}

export {
  maleName,
  femaleName,
  surname,
  name,
  fullName,
  email,
  type TPersonOptions,
  type TGender,
  PersonGeneratorContext,
  PersonGenerator
}
