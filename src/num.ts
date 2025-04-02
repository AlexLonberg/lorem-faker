import {
  isObject,
  isNumber,
  calculatePrimeForSfl,
  calculateBigintCoPrimeForSfl,
  generatePermutations,
  generateCombinations
} from './utils.js'
import { ShuffledKeyGenerator } from './shuffle.js'

/**
 * Параметры генератора.
 *
 * Параметры должны быть валидными и расчитываться функцией {@link calculatePrimeForSfl()}
 */
type TNumGeneratorOptions = {
  size: number
  prime: number
  offset?: undefined | null | number
}

/**
 * Генератор чисел на основе **Shuffled Frog-Leaping Algorithm**.
 */
class NumGenerator {
  protected readonly _size: number
  protected readonly _prime: number
  protected readonly _offset: number
  protected _counter: number = 0

  /**
   * @param size   Верхняя граница генерируемого значения минус один. Не может быть менее `1`.
   *               Значение `10` означает генерацию чисел от `0` до `9`.
   *               Если это объект {@link TNumGeneratorOptions}, остальные параметры игнорируются и `{size, prime}`
   *               должны быть рассчитаны функцией {@link calculatePrimeForSfl}.
   * @param step   Желаемый, но не гарантированный, шаг. С этого числа производится попытка найти `GCD` для генератора.
   * @param offset Если задано, то будет добавлено к генерируемым значениям.
   */
  constructor(size: TNumGeneratorOptions)
  constructor(size: number, step?: undefined | null | number, offset?: undefined | null | number)
  constructor(size: number | TNumGeneratorOptions, step?: undefined | null | number, offset?: undefined | null | number) {
    [this._size, this._prime] = isObject(size) ? [size.size, size.prime] : calculatePrimeForSfl(size, step)
    if (isObject(size)) {
      offset = size.offset
    }
    this._offset = isNumber(offset) ? Math.round(offset) : 0
  }

  get size (): number {
    return this._size
  }

  get prime (): number {
    return this._prime
  }

  get offset (): number {
    return this._offset
  }

  get counter (): number {
    return this._counter
  }

  /**
   * Проверяет, будет ли следующее значение уникальным или начнется новый круг итераций.
   */
  canNext (): boolean {
    return this._counter < this._size && this._size > 0
  }

  /**
   * Возвращает следующее число не увеличивая счетчик.
   */
  peek (): number {
    // Нет смысла производить вычисление для `(1 * 0|1) % 1`, так как остаток всегда 0
    if (this._size < 2) {
      return this._offset
    }
    return this._offset + ((this._prime * this._counter) % this._size)
  }

  // current (): number {
  //   if (this._size === 0) {
  //     return this.peek()
  //   }
  //   // Счетчик, который использовался для генерации предыдущего значения
  //   // (т.к. текущий _counter будет использован для следующего значения)
  //   const counter = this._counter - 1

  //   // Вычисляем "сырое" значение для этого предыдущего счетчика
  //   const rawValue = this._prime * counter

  //   // Применяем математически корректный модуль для обработки возможных отрицательных rawValue
  //   const moduloResult = ((rawValue % this._size) + this._size) % this._size

  //   // Добавляем смещение
  //   return this._offset + moduloResult
  // }

  /**
   * Возвращает следующее число.
   */
  next (): number {
    const value = this.peek()
    if (this._size > 0) this._counter++
    return value
  }

  /**
   * Сбрасывает счетчик генератора.
   */
  reset (): void {
    this._counter = 0
  }

  _internalSetCounter (value: number): void {
    if (this._size > 0) {
      this._counter = value
    }
  }
}

interface IDecoder<T extends readonly number[]> {
  values: T
  decode (currentState: bigint): void
  reset (): void
}

function decoder (length: number, n: bigint, active: readonly (readonly [number, bigint])[]): IDecoder<any> {
  const values: number[] = Array.from<number>({ length }).fill(0)
  return {
    get values () {
      return values
    },
    decode (currentState: bigint) {
      if (currentState < 0n || currentState >= n) {
        currentState = ((currentState % n) + n) % n // Приводим к диапазону [0, n-1]
      }
      for (let i = 0; i < active.length; ++i) {
        const currentActiveSize = active[i]![1]
        const value = currentState % currentActiveSize
        values[active[i]![0]] = Number(value)
        // Обновляем оставшееся состояние для следующего счетчика
        currentState = currentState / currentActiveSize
      }
    },
    reset (): void {
      values.fill(0)
    }
  }
}

function fakeDecoder (length: number): IDecoder<any> {
  return {
    values: Object.freeze(Array.from({ length }).fill(0)),
    decode (_currentState: bigint) { /**/ },
    reset () { /**/ }
  }
}

function preprocessForBigintTupleGenerator (sizes: readonly number[]) {
  const normalized = sizes.map((v) => isNumber(v) && v > 0 ? Math.round(v) : 0)
  const active: [number, bigint][] = []

  let size1 = false
  let combinationCount = 0n
  for (let i = 0; i < normalized.length; ++i) {
    const size = BigInt(normalized[i]!)
    if (size > 1n) {
      if (combinationCount === 0n) {
        combinationCount = size
      }
      else {
        combinationCount *= size
      }
      active.push([i, BigInt(size)])
    }
    else if (size > 0n) {
      size1 = true
    }
  }

  const [size, prime] = combinationCount > 0
    ? calculateBigintCoPrimeForSfl(combinationCount)
    : ([0n, 0n] as [bigint, bigint])

  return {
    sizes: normalized,
    active,
    size,
    prime,
    size1,
    decoder: active.length > 0
      ? decoder(normalized.length, size, active)
      : fakeDecoder(normalized.length)
  }
}

/**
 * Генератор фиксированной последовательности числовых значений в заданных диапазонах.
 *
 * Warning: Реализация основана на `bigint` и вычисляет `GCD` суммируя размерности ячеек для максимально возможного
 * количества комбинаций.
 *
 * Установите параметр типа для комфортного получения и использования `tuple` требуемой длины. Длина `tuple` должна
 * соответствовать длине массива передаваемого в параметры конструктора.
 */
class NumTupleGenerator<T extends number[]> {
  protected readonly _sizes: readonly number[]
  protected readonly _size: bigint
  protected readonly _prime: bigint
  protected readonly _decoder: IDecoder<T>
  protected _counter: bigint = 0n

  /**
   * @param sizes Каждый элемент массива означает максимальное значение ячейки минус один. То есть число `8` будет
   *              генерировать диапазон от `0` до `7`. Числа `0|1` не имеют эффекта и возвращают `0`.
   */
  constructor(sizes: readonly number[]) {
    const params = preprocessForBigintTupleGenerator(sizes)
    this._sizes = Object.freeze(params.sizes)
    this._size = params.size
    this._prime = params.prime
    this._decoder = params.decoder
    if (this._size === 0n && params.size1) {
      this._size = 1n
    }
  }

  get sizes (): readonly number[] {
    return this._sizes
  }

  get size (): bigint {
    return this._size
  }

  get counter (): bigint {
    return this._counter
  }

  /**
   * Проверяет, есть ли следующая уникальная комбинация.
   */
  canNext (): boolean {
    // Размерность 0 никогда не возвращает уникальный элемент.
    // Хотя size:1 не имеет эффекта, функция должна сохранить консистентность и вернуть ожидаемый результат.
    return this._counter < this._size && this._size > 0n
  }

  // /**
  //  * Возвращает текущее значение генератора.
  //  *
  //  * Warning: Не изменяйте ячейки массива: последний ссылается на исходный объект и не копируется.
  //  */
  // current (): Readonly<T> {
  //   return this._decoder.values
  // }

  /**
   * Возвращает следующий кортеж не увеличивая счетчик.
   *
   * Warning: Не изменяйте ячейки массива: последний ссылается на исходный объект и не копируется.
   */
  peek (): Readonly<T> {
    // При 0n|1n нет смысла ничего считать
    if (this._size > 1n) {
      const value = ((this._prime * this._counter) % this._size)
      this._decoder.decode(value)
    }
    return this._decoder.values
  }

  /**
   * Возвращает следующий кортеж.
   *
   * Warning: Не изменяйте ячейки массива: последний ссылается на исходный объект и не копируется.
   */
  next (): Readonly<T> {
    this.peek()
    if (this._size > 0n) this._counter++
    return this._decoder.values
  }

  /**
   * Сбрасывает счетчик в нулевое состояние.
   */
  reset (): void {
    this._counter = 0n
    this._decoder.reset()
  }
}

/**
 * Генератор последовательности числовых значений в заданных диапазонах и с перетасовкой индексов.
 *
 * Warning: Реализация основана на `bigint` и вычисляет `GCD` суммируя размерности ячеек для максимально возможного
 * количества комбинаций.
 *
 * Установите параметр типа для комфортного получения и использования `tuple` требуемой длины.
 */
class NumMultiGeneratorBase<T extends number[]> {
  protected readonly _generators: readonly (readonly [readonly number[], NumTupleGenerator<T>])[]
  protected readonly _selector: ShuffledKeyGenerator<number>
  protected readonly _size: bigint
  protected _counter: bigint = 0n

  /**
   * @param sizes Каждый элемент массива означает максимальное значение минус один. То есть число `8` будет
   *              генерировать диапазон от `0` до `7`. Числа `0|1` не имеют эффекта и возвращают `0`.
   * @param permutations Комбинации перестановок индексов `sizes`. Массив должен иметь элементы не менее одного `[index]`
   *                     и не более `sizes.length`. Смотри примеры в тестах.
   */
  constructor(sizes: readonly number[], permutations: readonly number[][]) {
    // Проходимся по комбинациям и оборачиваем в кортеж NumTupleGenerator
    const gen: [readonly number[], NumTupleGenerator<T>][] = []
    let minLength = sizes.length
    for (const arrayIndexes of permutations) {
      const ins = new NumTupleGenerator<T>(arrayIndexes.map((i) => sizes[i]!))
      const frozen = Object.freeze([...arrayIndexes])
      // Несмотря на то что size=1 не генерирует, а возвращает одни нули, здесь мы используем перестановки,
      // поэтому два элемента с размером 1 дадут [0, 1] + [1, 0] два варианта, такие генераторы сохраняем
      if (ins.size > 0) {
        gen.push([frozen, ins])
      }
      minLength = Math.min(minLength, frozen.length)
    }

    // Если не создали ни одного генератора создаем фейковый
    if (gen.length === 0) {
      this._generators = [[
        Object.freeze(Array.from<number, number>({ length: minLength }, ((_, i) => i))),
        new NumTupleGenerator(Array.from<number>({ length: minLength }).fill(0))
      ]]
      this._size = 0n
    }
    else {
      this._generators = gen
      this._size = this._generators.reduce((a, [_, g]) => (a + g.size), 0n)
    }

    // Выбирает случайный генератор
    this._selector = new ShuffledKeyGenerator(this._generators.map(([_, g], i) => [i, g.size]))
  }

  get size (): bigint {
    return this._size
  }

  get counter (): bigint {
    return this._counter
  }

  /**
   * Проверяет, есть ли следующая уникальная комбинация.
   */
  canNext (): boolean {
    return this._counter < this._size && this._size > 0n
  }

  /**
   * Возвращает следующее состояние генератора.
   *
   * + Первый массив кортежа содержит перетасованные индексы второго кортежа.
   * + Второй массив кортежа содержит сгенерированное значение диапазона.
   *
   * ```ts
   * const [indexes, values] = gen.nex()
   * // indexes [0, 2, 1]
   * // values  [45, 2, 87]
   * ```
   *
   * Warning: Не изменяйте ячейки массива: последний ссылается на исходный объект и не копируется.
   */
  next (): [Readonly<T>, Readonly<T>] {
    const index = this._selector.next()
    if (this._size > 0n) {
      this._counter++
    }
    // @ts-expect-error
    return [this._generators[index][0]!, this._generators[index][1]!.next()]
  }

  /**
   * Сбрасывает счетчик в нулевое состояние.
   */
  reset (): void {
    this._counter = 0n
    this._generators.forEach(([_, g]) => g.reset())
    this._selector.reset()
  }
}

/**
 * Генератор фиксированной последовательности числовых значений в заданных диапазонах и с перетасовкой индексов.
 *
 * Warning: Реализация основана на `bigint` и вычисляет `GCD` суммируя размерности ячеек для максимально возможного
 * количества комбинаций.
 *
 * Установите параметр типа для комфортного получения и использования `tuple` требуемой длины. Длина `tuple` должна
 * соответствовать длине массива передаваемого в параметры конструктора.
 */
class NumPermutationGenerator<T extends number[]> extends NumMultiGeneratorBase<T> {
  constructor(sizes: readonly number[]) {
    super(sizes, generatePermutations(sizes.length))
  }
}

/**
 * Генератор последовательности числовых значений в заданных диапазонах с перетасовкой индексов и всех возможных
 * комбинаций: `[0, 1, 2], [1, 2], [1], ...`
 *
 * Warning: Реализация основана на `bigint` и вычисляет `GCD` суммируя размерности ячеек для максимально возможного
 * количества комбинаций.
 */
class NumCombinationGenerator extends NumMultiGeneratorBase<number[]> {
  /**
   * @param sizes Каждый элемент массива означает максимальное значение минус один. То есть число `8` будет
   *              генерировать диапазон от `0` до `7`. Числа `0|1` не имеют эффекта и возвращают `0`.
   * @param minComboSize Минимальный размер комбинации. Например `2` удалит комбинации с одним элементом.
   */
  constructor(sizes: readonly number[], minComboSize?: undefined | null | 1 | number) {
    super(sizes, generateCombinations(sizes.length, minComboSize))
  }
}

export {
  type TNumGeneratorOptions,
  NumGenerator,
  NumMultiGeneratorBase,
  NumTupleGenerator,
  NumPermutationGenerator,
  NumCombinationGenerator
}
