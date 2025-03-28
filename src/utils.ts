const _hasOwn = ('hasOwn' in Object && typeof Object.hasOwn === 'function')
  ? Object.hasOwn
  : (obj: any, key: string | number | symbol) => Object.prototype.hasOwnProperty.call(obj, key)

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
 * Генерирует случайное число.
 *
 * @param min Минимальное значение. Не должно быть больше `max`.
 * @param max Максимальное значение. Не должно быть меньше `min`.
 */
function randomInt (min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Нормализует минимальное и максимальное значение к `int`, возвращая правильную последовательность от `min` до `max`.
 *
 * @param min Минимальное значение, округляется до максимального целого.
 * @param max Максимальное значение, округляется до минимального целого.
 * @returns `normalizeMinMax(12.8, 0.7) // [0, 13]`
 */
function normalizeMinMax (min: number, max: number): [number, number] {
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

function validateMinmax (def: { min: number, max: number }, min?: undefined | null | number, max?: undefined | null | number): [number, number] {
  if (!Number.isInteger(min)) {
    min = def.min
  }
  else if (min! < 3) {
    min = 3
  }
  if (!Number.isInteger(max)) {
    max = def.max
  }
  if (max! < min!) {
    max = min!
  }
  return [min!, max!]
}

/**
 * Возвращает случайное число в строковом формате.
 *
 * @param min    Минимальное значение.
 * @param length Целевая длина.
 *
 * ```ts
 * randomNumAsStr(1, 4)
 * // => '0048'
 * ```
 */
function randomNumAsStr (min: number, length: number): string {
  const max = Math.pow(10, length) - 1
  const num = randomInt(min, max)
  return num.toString().padStart(length, '0')
}

/**
 * Валидирует последовательность диапазонов.
 *
 * @param ranges Массив с кортежами `[min , max]`.
 */
function validateRanges (ranges?: undefined | null | readonly [number, number][]): [number, number][] {
  const tuples: [number, number][] = []
  if (!Array.isArray(ranges)) {
    return tuples
  }
  for (const item of ranges) {
    if (Array.isArray(item) && item.length > 0) {
      const first = Number.isInteger(item[0]) && item[0] > -1 ? item[0] : 0
      const second = Number.isInteger(item[1]) && item[1] > -1 ? item[1] : 0
      tuples.push(normalizeMinMax(first, second))
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
 * Приводит первый символ к `toUpperCase()` и остальные к `toLowerCase()`.
 */
function capitalize (text: string): string {
  return `${text.substring(0, 1).toUpperCase()}${text.substring(1).toLowerCase()}`
}

export {
  hasOwn,
  randomInt,
  normalizeMinMax,
  randomIntSafe,
  validateMinmax,
  randomNumAsStr,
  validateRanges,
  countDigits,
  capitalize
}
