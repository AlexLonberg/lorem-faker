import { countDigits, validateRanges } from './utils.js'
import { phone } from './person.js'

/**
 * Формат генерации телефонного номера.
 *
 *  + `ranges`  - Массив кортежей длиной не менее 3 элементов вида `[[number, number],[...],[...],...]`.
 *  + `lengths` - Массив сопоставленный каждому элементу `ranges` и означающий длину генерируемых символов.
 *
 * ```ts
 * {
 *   ranges: [[7, 8], [450, 999], [0, 999], [0, 99], [0, 99]]
 *   lengths: [1, 3, 3, 2, 2]
 * }
 * // Результат: первые три числа имеют константный формат, остальные добавляются через дефис
 * '+8(456)783-427-34-04
 * ```
 */
type TPhoneRangeOptions = {
  ranges: readonly [number, number][]
  lengths: readonly number[]
}

/**
 * Генератор фиксированной последовательности числовых значений в заданных диапазонах.
 *
 * Установите параметр типа для комфортного получения и использования `tuple` требуемой длины.
 */
class NumTupleGenerator<T extends number[]> {
  protected readonly _ranges: [number, number][]
  protected readonly _primes: number[]
  protected readonly _offsets: number[]
  protected readonly _sizes: number[]
  protected readonly _maxCombinations: number
  protected _counter: number = 0;

  constructor(ranges: readonly [number, number][]) {
    this._ranges = ranges.map(([a, b]) => [a, b])
    this._offsets = ranges.map(([min]) => min)
    this._sizes = ranges.map(([min, max]) => max - min + 1)
    this._primes = this._generateCoprimePrimes(this._sizes)
    this._maxCombinations = this._sizes.reduce((acc, size) => acc * size, 1)
  }

  get length (): number {
    return this._ranges.length
  }

  get ranges (): [number, number][] {
    return this._ranges.map(([a, b]) => [a, b])
  }

  get maxCombinations (): number {
    return this._maxCombinations
  }

  get counter (): number {
    return this._counter
  }

  next (): T {
    // if (this.counter >= this._maxCombinations) return null

    const tuple: number[] = []
    for (let i = 0; i < this._ranges.length; i++) {
      const prime = this._primes[i]!
      const size = this._sizes[i]!
      const offset = this._offsets[i]!

      // Корректная формула с взаимно простыми числами
      const value = offset + ((prime * this._counter) % size)
      tuple.push(value)
    }

    this._counter++
    return tuple as T
  }

  gen (num: number): T[] {
    const records = []
    for (let i = 0; i < num; ++i) {
      records.push(this.next())
    }
    return records
  }

  protected _generateCoprimePrimes (sizes: number[]): number[] {
    return sizes.map(size => {
      let candidate = size
      while (true) {
        candidate = this._nextPrime(candidate)
        if (this._gcd(candidate, size) === 1) return candidate
        candidate++
      }
    })
  }

  protected _gcd (a: number, b: number): number {
    return b === 0 ? a : this._gcd(b, a % b)
  }

  protected _nextPrime (n: number): number {
    while (!this._isPrime(n)) n++
    return n
  }

  protected _isPrime (n: number): boolean {
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return false
    }
    return n > 1
  }

  reset (): void {
    this._counter = 0
  }
}

function parseRanges (ranges_?: undefined | null | TPhoneRangeOptions): TPhoneRangeOptions {
  const ranges = validateRanges(ranges_?.ranges)
  if (ranges.length < 3) {
    return { lengths: [1, 3, 3, 2, 2], ranges: [[7, 8], [450, 499], [10, 999], [10, 99], [10, 99]] }
  }
  const custom: number[] = Array.isArray(ranges_?.lengths) ? ranges_.lengths.map((v) => Number.isInteger(v) && v > 0 ? v : 0) : []
  const lengths = []
  for (let i = 0; i < ranges.length; ++i) {
    if (custom.length > i) {
      lengths.push(custom[i]!)
    }
    else {
      lengths.push(countDigits(ranges[1]![i]!))
    }
  }
  return { ranges, lengths }
}

/**
 * Генератор простого телефонного номера в формате `+code(999)999-99-99`.
 */
class PhoneGenerator {
  // По факту неизвестно сколько пользователь передаст в параметр, но минимум три элемента
  protected readonly _tupleGen: NumTupleGenerator<[number, number, number, ...number[]]>
  protected readonly _format: readonly number[]

  /**
   * @param ranges
   */
  constructor(ranges?: undefined | null | TPhoneRangeOptions) {
    const options = parseRanges(ranges)
    this._format = Object.freeze(options.lengths)
    this._tupleGen = new NumTupleGenerator(options.ranges)
  }

  get maxCombinations (): number {
    return this._tupleGen.maxCombinations
  }

  /**
   * Возвращает следующий доступный номер.
   */
  next (): string {
    const tuple = this._tupleGen.next()
    let result = `+${tuple[0].toString().padStart(this._format[0]!, '0')}(${tuple[1].toString().padStart(this._format[1]!, '0')})${tuple[2].toString().padStart(this._format[2]!, '0')}`
    for (let i = 3; i < this._tupleGen.length; ++i) {
      result += `-${tuple[i]!.toString().padStart(this._format[i]!, '0')}`
    }
    return result
  }

  /**
   * Генерирует список уникальных номеров.
   *
   * @param num Требуемое количество.
   */
  gen (num: number): string[] {
    this.reset()
    const result: string[] = []
    if (num < 1) {
      return result
    }
    for (let i = 0; i < num; ++i) {
      result.push(this.next())
    }
    return result
  }

  /**
   * Сбрасывает счетчик номеров.
   */
  reset () {
    this._tupleGen.reset()
  }

  /**
   * Случайный телефон в простом формате `+code(999)999-99-99`.
   *
   * @param code Если не указано, код будет случаным от `1` до `999`.
   */
  static phone (code?: undefined | null | number): string {
    return phone(code)
  }
}

export {
  type TPhoneRangeOptions,
  NumTupleGenerator,
  PhoneGenerator
}
