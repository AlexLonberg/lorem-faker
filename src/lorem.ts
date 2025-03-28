/** Алфавит. */
const alphabet = Object.freeze(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'] as const)
/** Алфавит. */
type TAlphabet = typeof alphabet

/** Оригинальный `Lorem ipsum ...` */
const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

/** Максимальная и максимальная длина слова в `Lorem ipsum ...` */
const loremImsumWordLengths = Object.freeze({
  min: 2,
  max: 13
})
/** Доступные длины слов `Lorem ipsum ...` */
const availableLoremIpsumLengths = Object.freeze([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const)
/** Возможная длина слова в `Lorem ipsum ...` */
type TLoremIpsumWordLength = (typeof availableLoremIpsumLengths)[number] // 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13

/**
 * Список всех слов `Lorem ipsum ...` в нижнем регистре.
 */
const loremIpsumWords: readonly string[] = (() => {
  const set = new Set(loremIpsum.replace(/\.$/, '').split(/[\s,.]+/g).map((s) => s.toLowerCase()))
  return Object.freeze([...set])
})()

/**
 * Структура набора слов с одной длиной в `Lorem ipsum ...`.
 */
type TLoremIpsumSet<K extends TLoremIpsumWordLength = TLoremIpsumWordLength> = {
  /** Длина слова */
  readonly length: K
  /** Количество слов */
  readonly count: number // > 1
  /** Список слов */
  readonly words: readonly string[]
}

/**
 * Структура всех наборов {@link TLoremIpsumSet} сопоставленная с длиной слов `Lorem ipsum ...`.
 */
type TLoremIpsumMap = {
  readonly [K in TLoremIpsumWordLength]: TLoremIpsumSet<K>
}

/**
 * Структура всех наборов {@link TLoremIpsumSet} сопоставленная с длиной слов `Lorem ipsum ...`.
 */
const loremIpsumMap: TLoremIpsumMap = ((): TLoremIpsumMap => {
  // Подготавливаем структуру

  const map = new Map<TLoremIpsumWordLength, Set<string>>()
  for (const word of loremIpsumWords) {
    const length = word.length as TLoremIpsumWordLength
    const set = map.get(length)
    if (set) {
      set.add(word)
    }
    else {
      map.set(length, new Set([word]))
    }
  }

  const liMap = {} as any
  for (const [length, set] of map) {
    const words = Object.freeze([...set] as const)
    const count = words.length
    liMap[length] = Object.freeze({ length, count, words })
  }

  return Object.freeze(liMap)
})()

export {
  alphabet,
  type TAlphabet,
  loremIpsum,
  loremImsumWordLengths,
  availableLoremIpsumLengths,
  type TLoremIpsumWordLength,
  loremIpsumWords,
  type TLoremIpsumSet,
  type TLoremIpsumMap,
  loremIpsumMap
}
