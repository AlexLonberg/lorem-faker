import { test, expect } from 'vitest'
import {
  alphabet,
  // type TAlphabet,
  // loremIpsum,
  loremImsumWordLengths,
  availableLoremIpsumLengths,
  // type TLoremIpsumWordLength,
  loremIpsumWords,
  // type TLoremIpsumSet,
  // type TLoremIpsumMap,
  loremIpsumMap
} from './constants.js'
import {
  loremIpsumDefaultOptions,
  // type TLoremIpsumOptions,
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
} from './lorem.js'
import { randomInt } from './utils.js'

const commaProbability = loremIpsumDefaultOptions.commaProbability
const sentenceRange = [loremIpsumDefaultOptions.sentence.min, loremIpsumDefaultOptions.sentence.max] as const

test('readonly', () => {
  // @ts-expect-error read-only
  expect(() => alphabet.length = 0).toThrow()
  // @ts-expect-error read-only
  expect(() => loremImsumWordLengths.min = 0).toThrow()
  // @ts-expect-error read-only
  expect(() => availableLoremIpsumLengths.length = 0).toThrow()
  // @ts-expect-error read-only
  expect(() => loremIpsumWords.length = 0).toThrow()
  // @ts-expect-error read-only
  expect(() => loremIpsumMap[10].count = 0).toThrow()
  // @ts-expect-error read-only
  expect(() => loremIpsumDefaultOptions.commaProbability = 0).toThrow()
})

test('validateLoremRange', () => {
  expect(validateLoremRange(loremIpsumDefaultOptions.sentence, 0, 100)).toStrictEqual([3, 100])
})

test('word', () => {
  expect(loremIpsumWords).toContain(word())
})

test('generateSentenceBlueprint', () => {
  expect(generateSentenceBlueprint(1, commaProbability)).toStrictEqual([2])
  expect(generateSentenceBlueprint(2, commaProbability)).toStrictEqual([2])
  expect(generateSentenceBlueprint(3, commaProbability)).toStrictEqual([3])
  expect(generateSentenceBlueprint(4, commaProbability)).toStrictEqual([4])
  for (let i = 0; i < 1000; ++i) {
    const required = randomInt(3, 1000)
    const blueprint = generateSentenceBlueprint(required, commaProbability) as number[]

    // Подсчитываем количество слов, запятые и общую длину слов
    let words = 0
    let commas = 0
    let length = 0
    for (const item of blueprint) {
      if (item === 0) {
        commas++
      }
      else {
        words++
        length += item
      }
    }
    // Общая длина, от количества слов отнимаем 1 и получаем количество пробелов
    const total = (words - 1) + commas + length
    expect(total).toBe(required)
  }
})

test('generateSentence', () => {
  // Минимальная длина предложения - 3 символа
  expect(generateSentence(-10, commaProbability).length).toBe(3)
  expect(generateSentence(1, commaProbability).length).toBe(3)
  expect(generateSentence(2, commaProbability).length).toBe(3)
  //
  expect(generateSentence(3, commaProbability).length).toBe(3)
  expect(generateSentence(4, commaProbability).length).toBe(4)
  expect(generateSentence(5, commaProbability).length).toBe(5)
  expect(generateSentence(6, commaProbability).length).toBe(6)
  expect(generateSentence(7, commaProbability).length).toBe(7)
  expect(generateSentence(8, commaProbability).length).toBe(8)
  expect(generateSentence(9, commaProbability).length).toBe(9)
  expect(generateSentence(120, commaProbability).length).toBe(120)
  expect(generateSentence(1000, commaProbability).length).toBe(1000)
})

test('sentence', () => {
  const availableLengths = Array.from(
    { length: loremIpsumDefaultOptions.sentence.max - loremIpsumDefaultOptions.sentence.min + 1 },
    (_v, i: number) => i + loremIpsumDefaultOptions.sentence.min
  )
  expect(sentence(10, 10).length).toBe(10)
  for (let i = 0; i < 1000; ++i) {
    expect(availableLengths).toContain(sentence().length)
  }
})

test('generateParagraphBlueprint', () => {
  expect(generateParagraphBlueprint(1, ...sentenceRange)).toStrictEqual([3])
  expect(generateParagraphBlueprint(2, ...sentenceRange)).toStrictEqual([3])
  expect(generateParagraphBlueprint(3, ...sentenceRange)).toStrictEqual([3])
  expect(generateParagraphBlueprint(4, ...sentenceRange)).toStrictEqual([4])
  for (let i = 0; i < 1000; ++i) {
    const required = randomInt(3, 1000)
    const blueprint = generateParagraphBlueprint(required, ...sentenceRange) as number[]

    // Подсчитываем количество предложений и общую длину слов
    let count = 0
    let length = 0
    for (const item of blueprint) {
      count++
      length += item
    }
    // Общая длина, от количества слов отнимаем 1 и получаем количество пробелов
    const total = (count - 1) + length
    expect(total).toBe(required)
  }
})

test('generateParagraph', () => {
  expect(generateParagraph(2, 10, 10, 0.1).length).toBe(3)
})

test('paragraph', () => {
  const availableLengths = Array.from(
    { length: loremIpsumDefaultOptions.paragraph.max - loremIpsumDefaultOptions.paragraph.min + 1 },
    (_v, i: number) => i + loremIpsumDefaultOptions.paragraph.min
  )
  expect(paragraph(10, 10).length).toBe(10)
  for (let i = 0; i < 1000; ++i) {
    expect(availableLengths).toContain(paragraph().length)
  }
})

test('post', () => {
  expect(post(0)).toStrictEqual([])
  expect(post(-1)).toStrictEqual([])
  expect(post(2).length).toBe(2)
})

test('LoremGenerator', () => {
  const lorem = new LoremGenerator({ sentence: { min: 1000, max: 1000 }, paragraph: { min: 1, max: 1 } })

  expect(lorem.post(2).map((v) => v.length)).toStrictEqual([3, 3])
})
