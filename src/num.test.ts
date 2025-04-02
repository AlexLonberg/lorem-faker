import { test, expect } from 'vitest'
import {
  // type TNumGeneratorOptions,
  NumGenerator,
  // NumMultiGeneratorBase,
  NumTupleGenerator,
  NumPermutationGenerator,
  NumCombinationGenerator
} from './num.js'

test('NumGenerator', () => {
  const size = 789
  const numGenerator = new NumGenerator(size)
  expect(numGenerator.canNext()).toBe(true)

  // Один цикл обхода гарантирует уникальные значения и возвращается к первоначальному после исчерпания диапазона.
  const set = new Set<number>()
  const startValue = numGenerator.next()
  expect(startValue).toBe(0)
  set.add(startValue)
  for (let i = 1; i < size; ++i) {
    expect(numGenerator.canNext()).toBe(true)
    const value = numGenerator.next()
    expect(value).not.toBe(0)
    expect(set.has(value)).toBe(false)
    set.add(value)
  }
  expect(numGenerator.canNext()).toBe(false)
  expect(numGenerator.next()).toBe(startValue)

  const nextValue = numGenerator.peek()
  expect(numGenerator.next()).toBe(nextValue)

  // Более наглядный пример цикла генератора
  const gen = new NumGenerator(3)
  const initial = gen.next()
  gen.next()
  expect(gen.canNext()).toBe(true)
  gen.next()
  expect(gen.canNext()).toBe(false)
  // На четвертой итерации цикл повторяется
  expect(gen.next()).toBe(initial)
})

test('NumGenerator with step', () => {
  let gen = new NumGenerator(10, 1)

  // Шаг 1 не имеет эффекта и похож на инкремент в цикле
  for (let i = 0; i < 123; ++i) {
    expect(gen.next()).toBe(i % 10)
  }

  // Шаг не гарантируется, но в нашем случае он подходит
  gen = new NumGenerator(10, 3)
  expect(gen.prime).toBe(3)
  expect(gen.next()).toBe(0)
  expect(gen.next()).toBe(3)
  // Сброс счетчика начинает генерацию со стартовой позиции
  gen.reset()
  expect(gen.next()).toBe(0)
  expect(gen.next()).toBe(3)

  // Смещение
  expect(new NumGenerator(10, null, /* offset */ 5).next()).toBe(5)
})

test('NumGenerator 0', () => {
  // Пустой генератор всегда возвращает стартовое значение генератора
  const numGenerator = new NumGenerator(0)
  expect(numGenerator.size).toBe(0)
  expect(numGenerator.canNext()).toBe(false)
  expect(numGenerator.next()).toBe(0)
  expect(numGenerator.next()).toBe(0)
  expect(numGenerator.canNext()).toBe(false)
  expect(numGenerator.canNext()).toBe(false)
})

test('NumGenerator 1', () => {
  // У генератора с одним числом такой же эффект что и у пустого, но один раз сработает canNext()
  const numGenerator = new NumGenerator(1, null)
  expect(numGenerator.size).toBe(1)
  expect(numGenerator.canNext()).toBe(true)
  expect(numGenerator.next()).toBe(0)
  expect(numGenerator.next()).toBe(0)
  expect(numGenerator.canNext()).toBe(false)
  expect(numGenerator.canNext()).toBe(false)
  // Сброс
  numGenerator.reset()
  expect(numGenerator.canNext()).toBe(true)
  expect(numGenerator.next()).toBe(0)
  expect(numGenerator.canNext()).toBe(false)
})

test('NumTupleGenerator', () => {
  // Пустые генераторы не вызывают ошибок, но возвращают значения по умолчанию на каждой итерации
  expect(new NumTupleGenerator([]).canNext()).toBe(false)
  expect(new NumTupleGenerator([]).size).toBe(0n)
  const empty = new NumTupleGenerator([0, 0, 0])
  expect(empty.canNext()).toBe(false)
  expect(empty.size).toBe(0n)
  // Пустой генератор всегда возвращает первое нулевое значение, независимо от количества вызовов
  expect(empty.next()).toStrictEqual([0, 0, 0])
  expect(empty.next()).toStrictEqual([0, 0, 0])

  // Пустые значение и 1 не имеют эффекта и возвращают 0 в своих ячейках
  const gen = new NumTupleGenerator([2, 0, 1, 3])
  expect(gen.canNext()).toBe(true)
  expect(gen.size).toBe(6n)

  const initial = gen.next()
  expect(initial).toStrictEqual([0, 0, 0, 0])
  gen.next()
  gen.next()
  gen.next()
  gen.next()
  expect(gen.canNext()).toBe(true)
  // После шестой итерации генератор возобновит цикл, но canNext() будет возвращать false,
  // сигнализируя об отсутствии уникальных значений
  gen.next()
  expect(gen.canNext()).toBe(false)
  // Новая итерация возвращает самое первое значение генератора.
  const values = gen.next()
  expect(gen.canNext()).toBe(false)
  expect(values).toStrictEqual(initial)
  expect(values).toStrictEqual([0, 0, 0, 0])
})

test('NumTupleGenerator with empty', () => {
  // Пустой генератор пропускается и возвращает 0 или другое значение по умолчанию(например offset)
  const gen = new NumTupleGenerator([2, 0, 3])
  expect(gen.canNext()).toBe(true)
  expect(gen.size).toBe(6n)

  const initial = gen.next()
  expect(initial).toStrictEqual([0, 0, 0])
  expect(gen.next()).not.toStrictEqual([0, 0, 0])
  expect(gen.next()).not.toStrictEqual([0, 0, 0])
  expect(gen.next()).not.toStrictEqual([0, 0, 0])
  expect(gen.next()).not.toStrictEqual([0, 0, 0])
  expect(gen.canNext()).toBe(true)
  expect(gen.next()).not.toStrictEqual([0, 0, 0])
  expect(gen.canNext()).toBe(false)
  const values = gen.next()
  expect(values).toStrictEqual(initial)
  expect(values).toStrictEqual([0, 0, 0])
})

test('NumPermutationGenerator', () => {
  // Генераторы не могут быть пустыми и всегда имеют хотя бы один элемент
  expect(new NumPermutationGenerator([]).canNext()).toBe(false)
  const empty = new NumPermutationGenerator([0, 0, 0])
  expect(empty.size).toBe(0n)
  // Пустой генератор всегда возвращает первое нулевое значение, независимо от количества вызовов
  expect(empty.next()).toStrictEqual([[0, 1, 2], [0, 0, 0]])
  expect(empty.next()).toStrictEqual([[0, 1, 2], [0, 0, 0]])

  const gen = new NumPermutationGenerator([2, 3])
  expect(gen.canNext()).toBe(true)
  expect(gen.size).toBe(12n)

  const set = new Set<string>()
  let values = gen.next()
  let str = JSON.stringify(values)
  expect(set.has(str)).toBe(false)
  set.add(str)
  // Первый массив индексов предугадать невозможно: он может быть как [0, 1], так и [1, 0]
  expect(values).toStrictEqual([expect.any(Array), [0, 0]])
  // Осталось 11 уникальных итераций
  for (let i = 0; i < 11; ++i) {
    expect(gen.canNext()).toBe(true)
    values = gen.next()
    str = JSON.stringify(values)
    expect(set.has(str)).toBe(false)
    set.add(str)
  }

  expect(gen.canNext()).toBe(false)
  values = gen.next()
  str = JSON.stringify(values)
  // На втором круге обязательно есть совпадение
  expect(set.has(str)).toBe(true)
  expect(values).toStrictEqual([expect.any(Array), [0, 0]])
})

test('NumCombinationGenerator', () => {
  // Генераторы могут быть пустыми, но next() не поднимает ошибок
  expect(new NumCombinationGenerator([]).canNext()).toBe(false)
  const empty = new NumCombinationGenerator([0, 0, 0])
  expect(empty.size).toBe(0n)
  // Пустой генератор всегда возвращает первое нулевое значение, независимо от количества вызовов
  // В тестах практически невозможно понять как будут перетасованы индексы
  expect(empty.next()).toStrictEqual([expect.any(Array), expect.any(Array)])
  expect(empty.next()).toStrictEqual([expect.any(Array), expect.any(Array)])

  const gen = new NumCombinationGenerator([2, 3])
  expect(gen.canNext()).toBe(true)
  expect(gen.size).toBe(17n)

  const set = new Set<string>()
  let values = gen.next()
  let str = JSON.stringify(values)
  expect(set.has(str)).toBe(false)
  set.add(str)

  expect(values).toStrictEqual([expect.any(Array), expect.any(Array)])
  // Осталось 16 уникальных состояний
  for (let i = 0; i < 16; ++i) {
    expect(gen.canNext()).toBe(true)
    values = gen.next()
    str = JSON.stringify(values)
    expect(set.has(str)).toBe(false)
    set.add(str)
  }

  expect(set.size).toBe(17)
  expect(gen.canNext()).toBe(false)
  values = gen.next()
  str = JSON.stringify(values)
  // Совпадение на втором круге
  expect(set.has(str)).toBe(true)
  // Удаляем все ключи, чтобы проверить совпадение всех состояний
  set.delete(str)
  for (let i = 0; i < 16; ++i) {
    set.delete(JSON.stringify(gen.next()))
  }
  expect(set.size).toBe(0)
})

/*
Подсчёт для массива [2, 3] количества комбинаций

Комбинации:
  Длина 2: [0, 1].
  Длина 1: [0], [1].

Перестановки:
  [0, 1] → [[0, 1], [1, 0]] → 2! = 2.
  [0] → [[0]] → 1! = 1.
  [1] → [[1]] → 1! = 1.

Размеры:
  [0, 1] → 2 * 3 = 6.
  [1, 0] → 3 * 2 = 6.
  [0] → 2.
  [1] → 3.

Итого: 6 + 6 + 2 + 3 = 17n
*/
