import type { TRange } from './types.js'

const _hasOwn = ('hasOwn' in Object && typeof Object.hasOwn === 'function')
  ? Object.hasOwn
  : (obj: any, key: string | number | symbol) => Object.prototype.hasOwnProperty.call(obj, key)

const re = {
  _onlyLettersLowerCase: /^[a-z]+$/g,
  get onlyLettersLowerCase () {
    re._onlyLettersLowerCase.lastIndex = 0
    return re._onlyLettersLowerCase
  }
}

/**
 * Наличие собственного `enumerable` свойства объекта.
 *
 * @param obj Целевой объект.
 * @param key Искомое имя свойства.
 * @returns
 */
function hasOwn<T extends object, K extends string | number | symbol> (obj: T, key: K):
  obj is (T & { [_ in K]: K extends keyof T ? T[K] : never }) {
  return _hasOwn(obj, key)
}

/**
 * Является ли значение `value` объектом.
 */
function isObject<T> (value: T): value is (object & T) {
  return value !== null && typeof value === 'object'
}

/**
 * Является ли значение `value` строкой.
 */
function isString (value: any): value is string {
  return typeof value === 'string'
}

/**
 * Возвращает строку в нижнем регистре усекая крайние пробельные символы или `null`, если строка пуста.
 */
function clampStrOrNull (value: any): string | null {
  return isString(value) ? re.onlyLettersLowerCase.test(value) ? value : (value.trim().toLowerCase() || null) : null
}

/**
 * Является ли аргумент `value` числом исключая `NaN`.
 */
function isNumber (value: any): value is number {
  return typeof value === 'number' && !Number.isNaN(value)
}

/**
 * Нормализует минимальное и максимальное значение к `int`, возвращая правильную последовательность от `min` до `max`.
 *
 * @param min Минимальное значение, округляется до максимального целого.
 * @param max Максимальное значение, округляется до минимального целого.
 * @returns `normalizeMinMax(12.8, 0.7) // [0, 13]`
 */
function normalizeMinMax (min: number, max: number): TRange {
  min = Math.ceil(min)
  max = Math.floor(max)
  return (min > max) ? [max, min] : [min, max]
}

/**
 * Генерирует случайное число.
 *
 * @param min Минимальное значение.
 * @param max Максимальное значение.
 *
 * Эта функция выполняет то же что и {@link randomInt()}, но нормализует входные параметры.
 */
function randomIntSafe (min: number, max: number): number {
  // Если не реверсировать непоследовательные параметры,
  // вызов randomInt(1, -1) будет всегда возвращать 0
  [min, max] = normalizeMinMax(min, max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Генерирует случайное число.
 *
 * @param min Минимальное значение. Не должно быть больше `max`.
 * @param max Максимальное значение. Не должно быть меньше `min`.
 *
 * Warning: Эта функция не проверяет корректность параметров. Для нормализации и проверки используйте {@link randomIntSafe()}.
 */
function randomInt (min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Валидирует последовательность диапазонов. Все числа приводятся к `int >= 0`.
 *
 * @param ranges Массив с кортежами `[min , max]` {@link TRange}.
 */
function validateRanges (ranges?: undefined | null | readonly (TRange | Readonly<TRange>)[]): TRange[] {
  const tuples: TRange[] = []
  if (!Array.isArray(ranges)) {
    return tuples
  }
  for (const item of ranges) {
    if (Array.isArray(item)) {
      const first = isNumber(item[0]) && item[0] > -1 ? item[0] : 0
      const second = isNumber(item[1]) && item[1] > -1 ? item[1] : 0
      tuples.push(normalizeMinMax(first, second))
    }
    else {
      tuples.push([0, 0])
    }
  }
  return tuples
}

/**
 * Количество символов в числе.
 */
function countDigits (n: number): number {
  n = Math.abs(Math.floor(n)) // Берем целую часть по модулю
  if (n === 0) {
    return 1 // Особый случай для нуля
  }
  return Math.floor(Math.log10(n)) + 1
}

/**
 * Валидирует предполагаемое число и возвращает значение от `0` до `1`.
 *
 * @param value Значение предполагаемое для использования в вероятностных методах, которое должно быть в диапазоне `0-1`.
 * @param defaultValue Значение в диапазоне `0-1`.
 */
function validateProbabilityValue (value: 0 | any | 1, defaultValue: 0 | number | 1): number {
  return isNumber(value) ? Math.max(0, Math.min(1, value)) : defaultValue
}

/**
 * Возвращает случайное число в строковом формате дополняя нулями до требуемой `length`.
 *
 * @param min    Минимальное значение. По умолчанию `0`.
 * @param max    Максимальное значение. По умолчанию максимально возможное из `length`, например : `length:3 -> 999`.
 * @param length Целевая длина строки.
 *
 * ```ts
 * randomIntAsStr(1, null, 4)
 * // => '0048'
 * ```
 */
function randomIntAsStr (min: null | number, max: null | number, length: number): string {
  min ??= 0
  max ??= Math.pow(10, length) - 1
  const num = randomInt(min, max)
  return num.toString().padStart(length, '0')
}

/**
 * Приводит первый символ к `toUpperCase()` и остальные к `toLowerCase()`.
 */
function capitalize (text: string): string {
  return `${text.substring(0, 1).toUpperCase()}${text.substring(1).toLowerCase()}`
}

/**
 * Вычисляет значения для **Shuffled Frog-Leaping Algorithm**.
 *
 * @param size Диапазон генерируемых значений. Ноль вернет `[0, 0]`.
 *             Значение `10` означает: что генерируются числа от `0` до `9`.
 * @param step Необязательный желаемый шаг.
 * @returns    Возвращает кортеж `[size, step]`.
 */
function calculatePrimeForSfl (size: number, step?: undefined | null | number): [number, number] {
  size = Math.max(0, Math.round(size))
  step = isNumber(step) ? Math.max(1, Math.min(Math.round(step), size)) : null
  if (size === 0) {
    return [0, 0]
  }

  // Проверка на простое число
  const isPrime = (n: number): boolean => {
    if (n <= 1) return false
    if (n <= 3) return true
    if (n % 2 === 0 || n % 3 === 0) return false
    for (let i = 5; i * i <= n; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) return false
    }
    return true
  }

  // Наибольший общий делитель
  const gcd = (a: number, b: number): number => {
    while (b !== 0) {
      [a, b] = [b, a % b]
    }
    return a
  }

  // По умолчанию
  const findPrime = (): number => {
    // Крайние случаи
    if (size <= 1) return 1
    const start = size - Math.floor(size / 8)
    let fallback: number | null = null
    for (let candidate = start; candidate <= size; candidate++) {
      if ((gcd(candidate, size) === 1)) {
        fallback = candidate
        if (isPrime(candidate)) return candidate
      }
    }
    // Если не нашли, пробуем в обратном порядке
    for (let candidate = start - 1; candidate > 1; candidate--) {
      if ((gcd(candidate, size) === 1)) {
        fallback ??= candidate
        if (isPrime(candidate)) return candidate
      }
    }
    return fallback ?? 1 // fallback
  }

  // Ищем от заданного шага
  const findStep = (desiredStep: number): number => {
    if (size <= 1 || desiredStep <= 1) return 1
    for (let candidate = desiredStep; candidate <= size; candidate++) {
      if (gcd(candidate, size) === 1) {
        return candidate
      }
    }
    return findPrime()
  }

  return [size, step === null ? findPrime() : findStep(step)]
}

/**
 * Вычисляет значения для **Shuffled Frog-Leaping Algorithm**.
 *
 * @param size Диапазон генерируемых значений. `size < 1n` вернет `[0, 0]`.
 *             Значение `10` означает: что генерируются числа от `0` до `9`.
 * @param fraction Знаменатель который будет применен для начального состояния поиска `size - (size / fraction)`.
 *                 Не может быть менее `2`. По умолчанию `8`.
 * @returns Возвращает кортеж `[size, prime]`.
 */
function calculateBigintCoPrimeForSfl (size: bigint, fraction?: undefined | null | number): [bigint, bigint] {
  if (size < 1n) {
    return [0n, 0n]
  }

  let fr = BigInt(
    Math.max(2, Math.round(isNumber(fraction) && fraction >= 2 ? fraction : 8))
  )
  if (fr >= size) {
    fr = size
  }

  // Наибольший общий делитель
  const gcd = (a: bigint, b: bigint): bigint => {
    while (b !== 0n) {
      [a, b] = [b, a % b]
    }
    return a
  }

  const findCoPrime = (): bigint => {
    if (size <= 1n) return 1n
    const start = size - (size / fr)
    for (let candidate = start; candidate <= size; candidate++) {
      if (gcd(candidate, size) === 1n) return candidate
    }
    for (let candidate = start - 1n; candidate > 1; candidate--) {
      if (gcd(candidate, size) === 1n) return candidate
    }
    return 1n
  }

  return [size, findCoPrime()]
}

/**
 * Генерирует все перестановки элементов от `0` до `n-1`.
 *
 * @param num Количество элементов.
 * @returns   Возвращает только полные перестановки длиной `num:2 -> [[0, 1], [1, 0]]`.
 */
function generatePermutations (num: number): number[][] {
  if (num <= 0) {
    return []
  }

  const result: number[][] = []
  const indices = Array.from({ length: num }, (_, i) => i) // [0, 1, ..., n-1]

  function permute (arr: number[], prefix: number[] = []) {
    // Если больше нет элементов для добавления, значит prefix содержит полную перестановку длины num.
    if (arr.length === 0) {
      result.push([...prefix]) // Добавляем копию полной перестановки
      return
    }

    // Рекурсивный шаг:
    // Пробуем добавить каждый из оставшихся элементов
    for (let i = 0; i < arr.length; ++i) {
      // Создаем новый массив оставшихся элементов, исключая текущий
      // Рекурсивно вызываем для оставшихся элементов, добавляя текущий к перестановке
      permute([...arr.slice(0, i), ...arr.slice(i + 1)], [...prefix, arr[i]!])
    }
  }

  permute(indices, []) // Запускаем рекурсию с полным набором индексов
  return result
}

/**
 * Возвращает массив всех возможных комбинаций в диапазоне от `0` до `num - 1`.
 *
 * @param num Для числа `2` будет сгенерирован массив `[[0], [0, 1], [1], [1, 0]]`.
 * @param minComboSize Минимальный размер комбинации. Например `2` удалит комбинации с одним элементом.
 */
function generateCombinations (num: number, minComboSize?: undefined | null | 1 | number): number[][] {
  if (num <= 0) {
    return []
  }

  const result: number[][] = []
  const indices = Array.from({ length: num }, (_, i) => i) // [0, 1, ..., n-1]

  function permute (arr: number[], prefix: number[] = []) {
    if (prefix.length > 0) result.push([...prefix])

    for (let i = 0; i < arr.length; ++i) {
      permute([...arr.slice(0, i), ...arr.slice(i + 1)], [...prefix, arr[i]!])
    }
  }

  permute(indices)

  if (isNumber(minComboSize) && minComboSize >= 2) {
    for (let i = result.length - 1; i >= 0; --i) {
      if (result[i]!.length < minComboSize) {
        result.splice(i, 1)
      }
    }
  }
  return result
}

/**
 * Генерирует одно из двух значений в желаемом соотношении вероятности.
 */
class RatioGenerator<T> {
  protected readonly _first: T
  protected readonly _second: T
  protected readonly _ratio: number

  /**
   * @param first  Первое значение.
   * @param second Второе значение.
   * @param ratio  Коэффициент желаемого вероятностного выпадения `first` относительно `second` в диапазоне `0 - 1`.
   */
  constructor(first: T, second: T, ratio: 0 | number | 1) {
    this._first = first
    this._second = second
    this._ratio = validateProbabilityValue(ratio, 0.5)
  }

  get ratio (): 0 | number | 1 {
    return this._ratio
  }

  next (): T {
    return Math.random() < this._ratio ? this._first : this._second
  }
}

// только для внутреннего использования
export {
  re
}

export {
  hasOwn,
  isObject,
  isString,
  clampStrOrNull,
  isNumber,
  randomInt,
  normalizeMinMax,
  randomIntSafe,
  validateRanges,
  countDigits,
  validateProbabilityValue,
  randomIntAsStr,
  capitalize,
  calculatePrimeForSfl,
  calculateBigintCoPrimeForSfl,
  generatePermutations,
  generateCombinations,
  RatioGenerator
}
