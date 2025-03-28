import {
  randomInt,
  validateMinmax,
  capitalize
} from './utils.js'
import {
  type TLoremIpsumWordLength,
  loremIpsumWords,
  loremIpsumMap
} from './lorem.js'

/** Параметры по умолчанию для генерации предложений и параграфов. */
const loremIpsumOptions = Object.freeze({
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

type TSentenceOptions = typeof loremIpsumOptions['sentence']
type TParagraphOptions = typeof loremIpsumOptions['paragraph']



/**
 * Случайное слово из набора {@link loremIpsumWords}.
 */
function word (): string {
  return loremIpsumWords[randomInt(0, loremIpsumWords.length - 1)]!
}

/**
 * Генерирует схему предложения не учитывая точку.
 *
 * @param length Требуемая длина предложения. Не может быть менее `2`.
 * @returns      Возвращает индексы структуры {@link TLoremIpsumMap} или `0`, если после слова идет запятая.
 */
function generateSentenceBlueprint (length: number): (0 | TLoremIpsumWordLength)[] {
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
    if (currentLength < preLastLength && Math.random() < loremIpsumOptions.commaProbability) {
      blueprint.push(0)
      currentLength++
    }
  }

  return blueprint
}

/**
 * Генерация предложения с фиксированной длиной из слов набора {@link loremIpsumWords}.
 *
 * @param length Требуемая длина предложения. Значение должно быть валидным и не может быть менее `3`.
 */
function generateSentence (length: number): string {
  const blueprint = generateSentenceBlueprint(length - 1)
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
 *            Если не указано, используется случайное значение диапазона {@link TSentenceOptions}.
 * @param max Максимальное количество символов. Не может быть менее `3`.
 *            Если не указано, используется фиксированная длина `min`.
 */
function sentence (min?: undefined | null | number, max?: undefined | null | number): string {
  const minMax = validateMinmax(loremIpsumOptions.sentence, min, max)
  return generateSentence(randomInt(minMax[0], minMax[1]))
}

/**
 * Генерирует схему параграфа.
 *
 * @param length Требуемая длина параграфа. Не может быть менее `3`.
 * @returns      Возвращает массив количества символов в предложении от `3` и более, учитывая что между предложениями
 *               будут установлены пробелы.
 */
function generateParagraphBlueprint (length: number): number[] {
  // Меньше 5 символов подобрать невозможно
  if (length < 5) {
    return [length < 4 ? 3 : length]
  }

  const min = Math.min(length, loremIpsumOptions.sentence.min)
  const max = Math.min(length, loremIpsumOptions.sentence.max)
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
 */
function generateParagraph (length: number): string {
  const blueprint = generateParagraphBlueprint(length)
  const sentences: string[] = []
  for (const len of blueprint) {
    sentences.push(generateSentence(len))
  }
  return sentences.join(' ')
}

/**
 * Несколько предложений(параграф) состоящих из слов набора {@link loremIpsumWords}.
 *
 * @param min Минимальное количество символов. Не может быть менее `3`.
 *            Если не указано, используется случайное значение диапазона {@link TParagraphOptions}.
 * @param max Максимальное количество символов. Не может быть менее `3`.
 *            Если не указано, используется фиксированная длина `min`.
 */
function paragraph (min?: undefined | null | number, max?: undefined | null | number): string {
  const minMax = validateMinmax(loremIpsumOptions.paragraph, min, max)
  return generateParagraph(randomInt(minMax[0], minMax[1]))
}

/**
 * Несколько параграфов состоящих из слов набора {@link loremIpsumWords}.
 *
 * @param num Точное количество параграфов. Не может быть менее `0`.
 * @param min Минимальное количество символов параграфа. Не может быть менее `3`.
 *            Если не указано, используется случайное значение диапазона {@link TParagraphOptions}.
 * @param max Максимальное количество символов параграфа. Не может быть менее `3`.
 *            Если не указано, используется фиксированная длина `min`.
 */
function page (num: number, min?: undefined | null | number, max?: undefined | null | number): string[] {
  const minMax = validateMinmax(loremIpsumOptions.paragraph, min, max)
  const paragraphs: string[] = []
  if (num < 1) {
    num = 0
  }
  for (let i = 0; i < num; ++i) {
    paragraphs.push(generateParagraph(randomInt(minMax[0], minMax[1])))
  }
  return paragraphs
}

export {
  loremIpsumOptions,
  type TSentenceOptions,
  type TParagraphOptions,
  word,
  generateSentenceBlueprint,
  generateSentence,
  sentence,
  generateParagraphBlueprint,
  generateParagraph,
  paragraph,
  page
}
