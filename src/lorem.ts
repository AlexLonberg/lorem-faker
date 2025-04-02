import type { TRange, TMinMax } from './types.js'
import {
  isNumber,
  randomInt,
  validateProbabilityValue,
  capitalize
} from './utils.js'
import {
  type TLoremIpsumWordLength,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type TLoremIpsumMap,
  loremIpsumWords,
  loremIpsumMap
} from './constants.js'

/** Параметры по умолчанию для генерации предложений и параграфов. */
const loremIpsumDefaultOptions = Object.freeze({
  sentence: Object.freeze({
    min: 40,
    max: 200
  } as const),
  paragraph: Object.freeze({
    min: 200,
    max: 800
  } as const),
  commaProbability: 0.2
} as const)

/**
 * Опции генератора. По умолчанию {@link loremIpsumDefaultOptions}.
 *
 *   + `sentence`  - Диапазон длины предложения. Не может быть менее `3`.
 *   + `paragraph` - Диапазон длины параграфа. Не может быть менее `3`.
 *   + `commaProbability` - Вероятность появления запятой в диапазоне `0 - 1`.
 */
type TLoremIpsumOptions = {
  sentence: TMinMax
  paragraph: TMinMax
  commaProbability: number
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type TSentenceOptions = typeof loremIpsumDefaultOptions['sentence']
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type TParagraphOptions = typeof loremIpsumDefaultOptions['paragraph']

/**
 * Валидирует допустимый диапазон для генерации текста `Lorem ipsum ...`.
 *
 * @param defaultMinMax Параметры по умолчанию.
 * @param min Предполагаемое значение не менее `3`.
 * @param max Предполагаемое значение не менее `3`.
 */
function validateLoremRange (defaultMinMax: typeof loremIpsumDefaultOptions['sentence' | 'paragraph'], min?: undefined | null | number, max?: undefined | null | number): TRange {
  if (isNumber(min)) {
    if (!Number.isInteger(min)) {
      min = Math.round(min)
    }
    if (min < 3) {
      min = 3
    }
  }
  else {
    min = defaultMinMax.min
  }

  if (isNumber(max)) {
    if (!Number.isInteger(max)) {
      max = Math.round(max)
    }
  }
  else {
    max = defaultMinMax.max
  }
  if (max < min) {
    max = min
  }
  return [min, max]
}

/**
 * Случайное слово из набора {@link loremIpsumWords}.
 */
function word (): string {
  return loremIpsumWords[randomInt(0, loremIpsumWords.length - 1)]!
}

/**
 * Генерирует схему предложения не учитывая точку.
 *
 * @param length           Требуемая длина предложения. Не может быть менее `2`.
 * @param commaProbability Вероятность появления запятой. Не может быть менее `0` и более `1`.
 * @returns Возвращает массив индексов или `0`, если после слова идет запятая, структуры {@link TLoremIpsumMap}.
 */
function generateSentenceBlueprint (length: 2 | number, commaProbability: 0 | number | 1): (0 | TLoremIpsumWordLength)[] {
  // Меньше 5 символов подобрать невозможно
  if (length < 5) {
    return [length < 3 ? 2 : (length as TLoremIpsumWordLength)]
  }

  // Длина перед поиском последнего слова не должна превышать минимально возможное слово + пробел
  const preLastLength = length - 2

  const blueprint: (0 | TLoremIpsumWordLength)[] = []
  let currentLength = 0

  const appendLast = () => {
    const remaining = length - currentLength
    if (remaining <= 7) {
      blueprint.push(remaining as TLoremIpsumWordLength)
    }
    else {
      const first = randomInt(
        2,
        // Отнимаем пробел + 2 символа, для минимально последнего слова
        Math.min(remaining - 3, 10)
      ) as TLoremIpsumWordLength
      blueprint.push(first)
      currentLength += first + 1
      blueprint.push((length - currentLength) as TLoremIpsumWordLength)
    }
  }

  while (currentLength < length) {
    // Выбираем случайное слово. Мы точно знаем что существует весь диапазон 2 - 13
    const wordLength = randomInt(2, 13) as TLoremIpsumWordLength
    // Если остаток меньше возможного, завершаем поиск и подбираем одно или два последних слова
    if (currentLength + wordLength + 1 >= preLastLength) {
      appendLast()
      break
    }

    blueprint.push(wordLength)
    currentLength += wordLength + 1

    // Добавляем запятую. В этом месте точно есть запас в 3 последних символа [',', ' ', '12'],
    // но неизвестно есть ли место для запятой
    if (currentLength < preLastLength && Math.random() < commaProbability) {
      blueprint.push(0)
      currentLength++
    }
  }

  return blueprint
}

/**
 * Генерация предложения с фиксированной длиной из слов набора {@link loremIpsumWords}.
 *
 * @param length           Требуемая длина предложения. Значение должно быть валидным и не может быть менее `3`.
 * @param commaProbability Вероятность появления запятой. Не может быть менее `0` и более `1`.
 */
function generateSentence (length: 3 | number, commaProbability: 0 | number | 1): string {
  const blueprint = generateSentenceBlueprint(length - 1, commaProbability)
  const words: string[] = []
  for (let i = 0; i < blueprint.length; ++i) {
    // Здесь не может быть 0, так как мы его пропускаем ниже
    const length = blueprint[i]!
    const set = loremIpsumMap[length as TLoremIpsumWordLength]
    if (!set) {
      debugger
    }
    words.push(set.words[randomInt(0, set.count - 1)]!)
    if (i < blueprint.length - 1 && blueprint[i + 1] === 0) {
      words.push(',')
      ++i
    }
    words.push(' ')
  }
  words[0] = capitalize(words[0]!)
  words[words.length - 1] = '.'
  return words.join('')
}

/**
 * Предложение состоящее из слов набора {@link loremIpsumWords}.
 *
 * @param min Минимальное количество символов. Не может быть менее `3`.
 *            Если не указано, используется значение диапазона {@link TSentenceOptions}.
 * @param max Максимальное количество символов. Не может быть менее `min`.
 * @param commaProbability Вероятность появления запятой. Не может быть менее `0` и более `1`.
 */
function sentence (min?: undefined | null | 3 | number, max?: undefined | null | 3 | number, commaProbability?: undefined | null | 0 | number | 1): string {
  const minMax = validateLoremRange(loremIpsumDefaultOptions.sentence, min, max)
  return generateSentence(randomInt(minMax[0], minMax[1]), validateProbabilityValue(commaProbability, loremIpsumDefaultOptions.commaProbability))
}

/**
 * Генерирует схему параграфа.
 *
 * @param length Требуемая длина параграфа. Не может быть менее `3`.
 * @param min    Желаемая минимальная длина предложения. Не может быть менее `3`.
 * @param max    Желаемая максимальна длина предложения. Не может быть менее `min`.
 * @returns      Возвращает массив количества символов в предложении от `3` и более, учитывая что между предложениями
 *               будут установлены пробелы.
 */
function generateParagraphBlueprint (length: 3 | number, min: 3 | number, max: 3 | number): number[] {
  // Меньше 5 символов подобрать невозможно
  if (length < 5) {
    return [length < 4 ? 3 : length]
  }

  const blueprint: number[] = []
  let currentLength = 0

  while (currentLength < length) {
    // Генерируем случайную длину предложения
    const sentenceLength = randomInt(min, max)
    // Если точно совпало
    if (currentLength + sentenceLength === length) {
      blueprint.push(sentenceLength)
      break
    }
    // Проверяем, поместится ли предложение в параграф. Добавляем 1 символ пробела и минимальное предложение 3 символа.
    if (currentLength + sentenceLength + 4 > length) {
      // Если не помещается, обрезаем длину предложения
      const remainingLength = length - currentLength
      // Предложение не может быть менее 3 символов, но мы возьмем параметр по умолчанию, иначе некрасиво получится.
      if (remainingLength >= min) {
        blueprint.push(remainingLength)
      }
      // Иначе добавим к предыдущему и отменяем пробел
      else if (blueprint.length > 0) {
        blueprint[blueprint.length - 1]! += remainingLength + 1
      }
      // ... это не сработает, но на всякий случай
      else {
        blueprint.push(remainingLength)
      }
      break
    }
    // Если предложение помещается, добавляем его длину в blueprint
    blueprint.push(sentenceLength)
    currentLength += sentenceLength + 1 // +1 для пробела
  }

  return blueprint
}

/**
 * Генерация параграфа с фиксированной длиной из слов набора {@link loremIpsumWords}.
 *
 * @param length Требуемая длина параграфа. Значение должно быть валидным и не может быть менее `3`.
 * @param min    Желаемая минимальная длина предложения. Не может быть менее `3`.
 * @param max    Желаемая максимальна длина предложения. Не может быть менее `min`.
 * @param commaProbability Вероятность появления запятой. Не может быть менее `0` и более `1`.
 */
function generateParagraph (length: 3 | number, min: 3 | number, max: 3 | number, commaProbability: 0 | number | 1): string {
  const blueprint = generateParagraphBlueprint(length, min, max)
  const sentences: string[] = []
  for (const len of blueprint) {
    sentences.push(generateSentence(len, commaProbability))
  }
  return sentences.join(' ')
}

/**
 * Несколько предложений(параграф) состоящих из слов набора {@link loremIpsumWords}.
 *
 * @param min Минимальное количество символов. Не может быть менее `3`.
 *            Если не указано, используется случайное значение диапазона {@link TParagraphOptions}.
 * @param max Максимальное количество символов. Не может быть менее `min`.
 *
 * Длина предложений расчитывается параметрами по умолчанию {@link TSentenceOptions}.
 */
function paragraph (min?: undefined | null | number, max?: undefined | null | number): string {
  const minMax = validateLoremRange(loremIpsumDefaultOptions.paragraph, min, max)
  return generateParagraph(
    randomInt(minMax[0], minMax[1]),
    loremIpsumDefaultOptions.sentence.min,
    loremIpsumDefaultOptions.sentence.max,
    loremIpsumDefaultOptions.commaProbability
  )
}

/**
 * Несколько параграфов состоящих из слов набора {@link loremIpsumWords}.
 *
 * @param num Точное количество параграфов. Не может быть менее `0`.
 *
 * Количество символов параграфа и предложений расчитываются параметрами по умолчанию {@link loremIpsumDefaultOptions}.
 */
function post (num: number): string[] {
  const paragraphs: string[] = []
  if (num < 1) {
    num = 0
  }
  for (let i = 0; i < num; ++i) {
    paragraphs.push(
      generateParagraph(
        randomInt(loremIpsumDefaultOptions.paragraph.min, loremIpsumDefaultOptions.paragraph.max),
        loremIpsumDefaultOptions.sentence.min,
        loremIpsumDefaultOptions.sentence.max,
        loremIpsumDefaultOptions.commaProbability
      ))
  }
  return paragraphs
}

/**
 * Генерирует фейковый текст из набора слов `Lorem ipsum ...`.
 */
class LoremGenerator {
  protected readonly _sentenceRange: Readonly<TRange>
  protected readonly _paragraphRange: Readonly<TRange>
  protected readonly _commaProbability: number

  constructor(options?: undefined | null | Partial<TLoremIpsumOptions>) {
    this._sentenceRange = Object.freeze(validateLoremRange(loremIpsumDefaultOptions.sentence, options?.sentence?.min, options?.sentence?.max))
    this._paragraphRange = Object.freeze(validateLoremRange(loremIpsumDefaultOptions.paragraph, options?.paragraph?.min, options?.paragraph?.max))
    this._commaProbability = validateProbabilityValue(options?.commaProbability, loremIpsumDefaultOptions.commaProbability)
  }

  word (): string {
    return word()
  }

  sentence (): string {
    return generateSentence(randomInt(...this._sentenceRange), this._commaProbability)
  }

  paragraph (): string {
    return generateParagraph(randomInt(...this._paragraphRange), this._sentenceRange[0], this._sentenceRange[1], this._commaProbability)
  }

  post (num: number): string[] {
    const result: string[] = []
    for (let i = 0; i < num; ++i) {
      result.push(this.paragraph())
    }
    return result
  }
}

export {
  loremIpsumDefaultOptions,
  type TLoremIpsumOptions,
  validateLoremRange,
  word,
  generateSentenceBlueprint,
  generateSentence,
  sentence,
  generateParagraphBlueprint,
  generateParagraph,
  paragraph,
  post,
  LoremGenerator
}
