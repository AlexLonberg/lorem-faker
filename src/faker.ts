import { animals } from './animals.js'
import { mailSuffix } from './domains.js'
import {
  maleName,
  femaleName,
  surname
} from './person.js'
import {
  type TPhoneRangeOptions,
  PhoneGenerator
} from './phones.js'
import {
  loremIpsumOptions,
  word,
  generateSentence,
  generateParagraph
} from './text.js'
import {
  randomInt,
  validateMinmax
} from './utils.js'

/**
 * Результирующая запись генератора.
 *
 * Структура будет содержать только заданные в параметрах поля.
 */
type TRecordResultMap = {
  /** Для удобства тестивани списков в Vue и подобных фреймворках, установите генерацию ключа Symbol() */
  key: symbol
  name: string
  surname: string
  fullName: string
  email: string
  age: number
  phone: string
  gender: 'male' | 'female'
  word: string
  sentence: string
  paragraph: string
}

/**
 * Тип поля.
 */
type TRecordKind = keyof TRecordResultMap

/**
 * Генерирует два значения в желаемом процентном соотношении.
 */
class RatioGenerator<T> {
  protected readonly _first: T
  protected readonly _second: T
  protected readonly _ratio: number

  constructor(first: T, second: T, ratio: number) {
    this._first = first
    this._second = second
    this._ratio = Math.max(0, Math.min(1, ratio))
  }

  get ratio (): 0 | number | 1 {
    return this._ratio
  }

  next (): T {
    return Math.random() < this._ratio ? this._first : this._second
  }
}

/**
 * Генератор уникальных наборов с пользовательскими данными.
 */
class Faker {
  protected readonly _emails = new Map<string, { freeAnimals: null | Set<string>, emails: Set<string> }>()
  protected readonly _gender: RatioGenerator<1 | 2>
  protected readonly _phones: PhoneGenerator
  protected readonly _age: readonly [number, number]
  protected readonly _sentence: readonly [number, number]
  protected readonly _paragraph: readonly [number, number]

  /**
   * @param genderRatio Соотношение мужских и женских имен `0 - 1`. По умолчанию `0.5`.
   * @param phoneRanges Массив диапазонов для телефонного номера в формате `[[number, number],[...],[...],...]`.
   *                    Минимальная длина массива - `3` элемента.
   * @param ageRange    Диапазон возраста.
   * @param sentence    Минимальная и максимальная длина предложения.
   * @param paragraph   Минимальная и максимальная длина параграфа.
   */
  constructor(
    genderRatio?: undefined | null | 0 | number | 1,
    phoneRanges?: undefined | null | TPhoneRangeOptions,
    ageRange?: undefined | null | { min: number, max: number },
    sentence?: undefined | null | { min: number, max: number },
    paragraph?: undefined | null | { min: number, max: number }
  ) {
    this._gender = new RatioGenerator<1 | 2>(1, 2, Math.max(0, Math.min(1, typeof genderRatio === 'number' ? genderRatio : 0.5)))
    this._phones = new PhoneGenerator(phoneRanges)
    this._age = validateMinmax({ min: 20, max: 80 } as const, ageRange?.min, ageRange?.max)
    this._sentence = validateMinmax(loremIpsumOptions.sentence, sentence?.min, sentence?.max)
    this._paragraph = validateMinmax(loremIpsumOptions.paragraph, paragraph?.min, paragraph?.max)
  }

  name (): [string, 'male' | 'female'] {
    const gender = this._gender.next() === 1 ? 'male' : 'female'
    return [gender === 'male' ? maleName() : femaleName(), gender]
  }

  surname (): string {
    return surname()
  }

  fullName (): [string, 'male' | 'female'] {
    const gender = this._gender.next() === 1 ? 'male' : 'female'
    return [`${gender === 'male' ? maleName() : femaleName()} ${surname()}`, gender]
  }

  // Стратегия подбора почты с подстановкой имени животного. Теоретически может быть все занято.
  protected _emailWithAnimal (cache: { freeAnimals: Set<string>, emails: Set<string> }, first: string, domain: string): null | string {
    let an: string | undefined
    while ((an = cache.freeAnimals.values().next().value!)) {
      cache.freeAnimals.delete(an)
      const email = `${first}.${an}${domain}`
      if (!cache.emails.has(email)) {
        cache.emails.add(email)
        return email
      }
    }
    return null
  }

  // Стратегия подбора почты с подстановкой счетчика. Абсолютно точно вернет адрес.
  protected _emailWithCounter (cache: { freeAnimals: any, emails: Set<string> }, first: string, domain: string): string {
    // eslint-disable-next-line no-constant-condition
    for (let i = 0; true; ++i) {
      const email = `${first}.${i}${domain}`
      if (!cache.emails.has(email)) {
        cache.emails.add(email)
        return email
      }
    }
  }

  email (fullName: string): string {
    const first = fullName.replaceAll(/\s+/g, '.').toLowerCase()
    const domain = mailSuffix()
    const email = `${first}${domain}`
    const list = this._emails.get(email)
    if (list) {
      list.freeAnimals ??= new Set(animals)
      return this._emailWithAnimal(list as { freeAnimals: Set<string>, emails: Set<string> }, first, domain) ?? this._emailWithCounter(list, first, domain)
    }
    this._emails.set(email, { freeAnimals: null, emails: new Set([email]) })
    return email
  }

  phone (): string {
    return this._phones.next()
  }

  age (): number {
    return randomInt(...this._age)
  }

  word (): string {
    return word()
  }

  sentence (): string {
    return generateSentence(randomInt(...this._sentence))
  }

  paragraph (): string {
    return generateParagraph(randomInt(...this._paragraph))
  }

  gen<T extends TRecordKind> (fields: readonly T[], num: number): { [K in T]: TRecordResultMap[K] }[] {
    this.clear()
    const result: any[] = []
    if (num < 1) {
      return result
    }

    // Собираем свойства генератора
    const set = new Set<TRecordKind>(fields)
    const handlerNames = [] as TRecordKind[]
    const provider = {} as { [K in TRecordKind]: ((record: TRecordResultMap) => void) }

    if (set.has('key')) {
      handlerNames.push('key')
      provider.key = (record: TRecordResultMap) => {
        record.key = Symbol()
      }
    }

    // Пушим данные в строгом порядке - это необходимо для правильного порядка генерации имен
    if (set.has('name') || set.has('fullName') || set.has('email') || set.has('gender')) {
      handlerNames.push('name')
      provider.name = (record: TRecordResultMap) => {
        [record.name, record.gender] = this.name()
      }
    }
    if (set.has('surname') || set.has('fullName') || set.has('email')) {
      handlerNames.push('surname')
      provider.surname = (record: TRecordResultMap) => {
        record.surname = this.surname()
      }
    }
    if (set.has('fullName') || set.has('email')) {
      handlerNames.push('fullName')
      provider.fullName = (record: TRecordResultMap) => {
        record.fullName = `${record.name} ${record.surname}`
      }
    }
    if (set.has('email')) {
      handlerNames.push('email')
      provider.email = (record: TRecordResultMap) => {
        record.email = this.email(record.fullName)
      }
    }
    if (set.has('age')) {
      handlerNames.push('age')
      provider.age = (record: TRecordResultMap) => {
        record.age = this.age()
      }
    }
    if (set.has('phone')) {
      handlerNames.push('phone')
      provider.phone = (record: TRecordResultMap) => {
        record.phone = this.phone()
      }
    }
    if (set.has('word')) {
      handlerNames.push('word')
      provider.word = (record: TRecordResultMap) => {
        record.word = this.word()
      }
    }
    if (set.has('sentence')) {
      handlerNames.push('sentence')
      provider.sentence = (record: TRecordResultMap) => {
        record.sentence = this.sentence()
      }
    }
    if (set.has('paragraph')) {
      handlerNames.push('paragraph')
      provider.paragraph = (record: TRecordResultMap) => {
        record.paragraph = this.paragraph()
      }
    }

    // Генерируем
    for (let i = 0; i < num; ++i) {
      const record = {} as TRecordResultMap
      for (const handle of handlerNames) {
        provider[handle](record)
      }
      result.push(record)
    }

    return result
  }

  clear (): void {
    this._emails.clear()
    this._phones.reset()
  }
}

export {
  type TRecordResultMap,
  type TRecordKind,
  RatioGenerator,
  Faker
}
