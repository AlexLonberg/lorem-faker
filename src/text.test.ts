import { test, expect } from 'vitest'
import {
  alphabet,
  // type TAlphabet,
  // loremIpsum,
  // loremImsumWordLengths,
  // availableLoremIpsumLengths,
  // type TLoremIpsumWordLength,
  loremIpsumWords,
  // type TLoremIpsumSet,
  // type TLoremIpsumMap,
  loremIpsumMap
} from './lorem.js'
import {
  loremIpsumOptions,
  // type TSentenceOptions,
  // type TParagraphOptions,
  // validateLength,
  word,
  generateSentenceBlueprint,
  generateSentence,
  sentence,
  generateParagraphBlueprint,
  // generateParagraph,
  paragraph,
  page
} from './text.js'
import { randomInt } from './utils.js'

test('readonly', () => {
  // @ts-expect-error read-only
  expect(() => alphabet.length = 0).toThrow()
  // @ts-expect-error read-only
  expect(() => loremIpsumWords.length = 0).toThrow()
  // @ts-expect-error read-only
  expect(() => loremIpsumMap[10].count = 0).toThrow()
  // @ts-expect-error read-only
  expect(() => loremIpsumOptions.commaProbability = 0).toThrow()
})

test('word', () => {
  expect(loremIpsumWords).toContain(word())
})

test('generateSentenceBlueprint', () => {
  expect(generateSentenceBlueprint(1)).toStrictEqual([2])
  expect(generateSentenceBlueprint(2)).toStrictEqual([2])
  expect(generateSentenceBlueprint(3)).toStrictEqual([3])
  expect(generateSentenceBlueprint(4)).toStrictEqual([4])
  for (let i = 0; i < 1000; ++i) {
    const required = randomInt(3, 1000)
    const blueprint = generateSentenceBlueprint(required) as number[]

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
  expect(generateSentence(-10).length).toBe(3)
  expect(generateSentence(1).length).toBe(3)
  expect(generateSentence(2).length).toBe(3)
  //
  expect(generateSentence(3).length).toBe(3)
  expect(generateSentence(4).length).toBe(4)
  expect(generateSentence(5).length).toBe(5)
  expect(generateSentence(6).length).toBe(6)
  expect(generateSentence(7).length).toBe(7)
  expect(generateSentence(8).length).toBe(8)
  expect(generateSentence(9).length).toBe(9)
  expect(generateSentence(120).length).toBe(120)
  expect(generateSentence(1000).length).toBe(1000)
})

test('sentence', () => {
  const availableLengths = Array.from(
    { length: loremIpsumOptions.sentence.max - loremIpsumOptions.sentence.min + 1 },
    (_v, i: number) => i + loremIpsumOptions.sentence.min
  )
  expect(sentence(10, 10).length).toBe(10)
  for (let i = 0; i < 1000; ++i) {
    expect(availableLengths).toContain(sentence().length)
  }
})

test('generateParagraphBlueprint', () => {
  expect(generateParagraphBlueprint(1)).toStrictEqual([3])
  expect(generateParagraphBlueprint(2)).toStrictEqual([3])
  expect(generateParagraphBlueprint(3)).toStrictEqual([3])
  expect(generateParagraphBlueprint(4)).toStrictEqual([4])
  for (let i = 0; i < 1000; ++i) {
    const required = randomInt(3, 1000)
    const blueprint = generateParagraphBlueprint(required) as number[]

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

test('paragraph', () => {
  const availableLengths = Array.from(
    { length: loremIpsumOptions.paragraph.max - loremIpsumOptions.paragraph.min + 1 },
    (_v, i: number) => i + loremIpsumOptions.paragraph.min
  )
  expect(paragraph(10, 10).length).toBe(10)
  for (let i = 0; i < 1000; ++i) {
    expect(availableLengths).toContain(paragraph().length)
  }
})

test('page', () => {
  expect(page(0)).toStrictEqual([])
  const [first, second] = page(2, 1000, 1000)
  expect(first!.length).toBe(1000)
  expect(second!.length).toBe(1000)
})
