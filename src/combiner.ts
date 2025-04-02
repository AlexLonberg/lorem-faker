import { animals } from './animals.js'
import { plants } from './plants.js'
import { re, hasOwn, isObject, clampStrOrNull } from './utils.js'
import { type TSafeMailDomain, safeMailDomains } from './domains.js'
import { word } from './lorem.js'
import { ShuffledKeyGenerator } from './shuffle.js'
import { NumGenerator, NumPermutationGenerator } from './num.js'

function validateSet (list: readonly string[]): string[] {
  if (list === animals || list === plants) {
    return [...list]
  }
  if (!Array.isArray(list)) {
    return []
  }
  const set = new Set<string>()
  for (const item of list) {
    const v = clampStrOrNull(item)
    if (v && re.onlyLettersLowerCase.test(v)) set.add(v)
  }
  return [...set]
}

function filterSets (sets: readonly ((readonly string[] | string[]))[]): readonly (readonly string[])[] {
  const cleaned: (readonly string[])[] = []
  const stored = new Set<string>()
  for (const item of sets) {
    const set = validateSet(item)
    const filtered: string[] = []
    for (const item of set) {
      if (!stored.has(item)) {
        stored.add(item)
        filtered.push(item)
      }
    }
    if (filtered.length > 0) {
      cleaned.push(Object.freeze(filtered))
    }
  }
  return Object.freeze(cleaned)
}

/**
 * Параметры стратегии генератора.
 *
 * Каждый элемент должен быть целым числом определяющим количество выпадений стратегии.
 */
type TPersonCombinerStrategyOptions = {
  /** первое слово параметра */
  ff: number
  /** второе слово параметра */
  ss: number
  /** первое + второе */
  fs: number
  /** второе + первое */
  sf: number
  /** первое + подстановка */
  fp: number
  /** подстановка + первое */
  pf: number
  /** второе + подстановка */
  sp: number
  /** подстановка + второе */
  ps: number
  /** только подстановка */
  pp: number
}

const strategy = Object.freeze({
  ff: 5,
  ss: 5,
  fs: 10,
  sf: 10,
  fp: 20,
  pf: 20,
  sp: 20,
  ps: 20,
  pp: 30
} as const)

function validateOptions (options?: undefined | null | TPersonCombinerStrategyOptions): [keyof TPersonCombinerStrategyOptions, number][] {
  const entries = [] as any
  if (isObject(options)) {
    for (const [key, value] of Object.entries(strategy)) {
      if (hasOwn(options, key) && Number.isInteger(options[key] && options[key] > 0)) {
        entries.push([key, options[key]])
      }
      else {
        entries.push([key, value])
      }
    }
  }
  else {
    entries.push(...Object.entries(strategy))
  }
  return entries
}

/**
 * Комбинирует уникальные строки на основе константных наборов.
 */
class PersonCombiner {
  protected readonly _sets: readonly [readonly string[], readonly string[]]
  protected readonly _nameCache = new Map<string, string>()
  protected readonly _loginCache = new Set<string>()
  protected readonly _emailCache = new Set<string>()
  protected readonly _abCache: string[] = []
  protected readonly _genAOrB: readonly [NumGenerator, NumGenerator]
  protected readonly _genAB: NumPermutationGenerator<[number, number]>
  protected readonly _shuffleAOrB: ShuffledKeyGenerator<0 | 1>
  protected readonly _shuffleEmail: ShuffledKeyGenerator<TSafeMailDomain>
  protected readonly _strategy: ShuffledKeyGenerator<keyof TPersonCombinerStrategyOptions>

  /**
   * @param strategy Стратегии объединения имен. По умолчанию применяется предопределенный {@link strategy}.
   */
  constructor(strategy?: undefined | null | TPersonCombinerStrategyOptions) {
    this._sets = filterSets([animals, plants]) as [string[], string[]]
    this._genAOrB = [new NumGenerator(this._sets[0].length), new NumGenerator(this._sets[1].length)]
    this._genAB = new NumPermutationGenerator([this._sets[0].length, this._sets[1].length])
    this._shuffleAOrB = new ShuffledKeyGenerator([[0, this._sets[0].length], [1, this._sets[1].length]])
    this._shuffleEmail = new ShuffledKeyGenerator(safeMailDomains.map((k) => [k, 100]))
    this._strategy = new ShuffledKeyGenerator(validateOptions(strategy))
  }

  protected _getName (name: string): string {
    let value = this._nameCache.get(name)
    if (!value) {
      value = name.toLowerCase()
      this._nameCache.set(name, value)
    }
    return value
  }

  protected _nextAOrB (): string {
    const index = this._shuffleAOrB.next()
    return this._sets[index]![this._genAOrB[index].next()]!
  }

  protected _tryNextAB (): null | { value: string, cancel (): void } {
    if (this._genAB.canNext()) {
      const [indexes, values] = this._genAB.next()
      const value = `${this._sets[indexes[0]!]![values[0]!]}.${this._sets[indexes[1]!]![values[1]!]}`
      return {
        value,
        cancel: () => this._abCache.push(value)
      }
    }
    if (this._abCache.length > 0) {
      const value = this._abCache.shift()!
      return {
        value,
        cancel: () => this._abCache.push(value)
      }
    }
    return null
  }

  protected _trySetLogin (login: string): null | string {
    if (!this._loginCache.has(login)) {
      this._loginCache.add(login)
      return login
    }
    return null
  }

  protected _trySetEmail (prefix: string): null | string {
    for (let i = 0, e = this._shuffleEmail.next(); i < this._shuffleEmail.length; ++i, e = this._shuffleEmail.next()) {
      const email = `${prefix}${e}`
      if (!this._emailCache.has(email)) {
        this._emailCache.add(email)
        return email
      }
    }
    return null
  }

  protected _fallbackAB (npp: boolean, name: string, surname: string, tryUse: ((v: string) => null | string)): null | string {
    const [indexes, values] = this._genAB.next()
    const word = `${this._sets[indexes[0]!]![values[0]!]}.${this._sets[indexes[1]!]![values[1]!]}`
    return (npp ? tryUse(word) :
      (
        tryUse(`${name}.${word}`) ??
        tryUse(`${surname}.${word}`) ??
        tryUse(`${word}.${name}`) ??
        tryUse(`${word}.${surname}`)
      )
    )
  }

  protected _fallbackAOrB (name: string, surname: string, tryUse: ((v: string) => null | string)): null | string {
    // Рандомно добиваем имя словами из Lorem ipsum
    const fullName = `${name}.${surname}`

    // Пробуем по одному разу из A или B
    const index = this._shuffleAOrB.next()
    for (const i of [index, index === 0 ? 1 : 0]) {
      const w = this._sets[index]![this._genAOrB[i]!.next()]!
      const value = tryUse(`${fullName}.${w}`) ?? tryUse(`${w}.${fullName}`)
      if (value) {
        return value
      }
    }
    return null
  }

  protected _fallback (name: string, surname: string, tryUse: ((v: string) => null | string)): string {
    // Рандомно добиваем имя словами из Lorem ipsum
    let fullName = `${name}.${surname}`
    const next = (): string => (fullName = `${fullName}.${word()}`)
    let value: null | string
    do {
      value = tryUse(next())
    } while (value === null)
    return value
  }

  /**
   * Генерирует уникальную строку.
   *
   * @param name    Имя которое может, но необязательно, будет подставлено в целевую строку.
   * @param surname Фамилия.
   */
  next (name: string, surname: string, useEmail: boolean): string {
    name = this._getName(name)
    surname = this._getName(surname)

    let npp = true
    const tryUse = useEmail
      ? ((v: string) => this._trySetEmail(v))
      : ((v: string) => this._trySetLogin(v))

    // Выбираем стратегию и определяем доступность подстановочных слов.
    // Стратегия необязательно выполниться
    const strategySet = new Set()
    for (
      let i = 0, s = this._strategy.next();
      // на случай непонятностей с strategy.length подстрахуемся < 100
      (i < 100) && (strategySet.size < this._strategy.length);
      ++i,
      s = this._strategy.next()
    ) {
      if (!useEmail && (s === 'ff' || s === 'ss' || s === 'fs' || s === 'sf' || s === 'pp') && strategySet.has(s)) {
        continue
      }
      strategySet.add(s)
      if (s === 'ff' && name) {
        const result = tryUse(name)
        if (result) {
          return result
        }
      }
      else if (s === 'ss' && surname) {
        const result = tryUse(surname)
        if (result) {
          return result
        }
      }
      else if (s === 'fs' && name && surname) {
        const result = tryUse(`${name}.${surname}`)
        if (result) {
          return result
        }
      }
      else if (s === 'sf' && name && surname) {
        const result = tryUse(`${surname}.${name}`)
        if (result) {
          return result
        }
      }
      else if (s === 'fp' && name) {
        const result = tryUse(`${name}.${this._nextAOrB()}`)
        if (result) {
          return result
        }
      }
      else if (s === 'pf' && name) {
        const result = tryUse(`${this._nextAOrB()}.${name}`)
        if (result) {
          return result
        }
      }
      else if (s === 'sp' && surname) {
        const result = tryUse(`${surname}.${this._nextAOrB()}`)
        if (result) {
          return result
        }
      }
      else if (s === 'ps' && surname) {
        const result = tryUse(`${this._nextAOrB()}.${surname}`)
        if (result) {
          return result
        }
      }
      else if (s === 'pp') {
        npp = false
        const candidate = this._tryNextAB()
        if (candidate) {
          const result = tryUse(candidate.value)
          if (result) {
            return result
          }
          else {
            candidate.cancel()
          }
        }
      }
    }

    return this._fallbackAB(npp, name, surname, tryUse) ??
      this._fallbackAOrB(name, surname, tryUse) ??
      this._fallback(name, surname, tryUse)
  }

  /**
   * Очищает кеш данных.
   */
  reset (): void {
    this._nameCache.clear()
    this._loginCache.clear()
    this._emailCache.clear()
    this._abCache.splice(0)
    this._genAB.reset()
  }
}

export {
  type TPersonCombinerStrategyOptions,
  PersonCombiner
}
