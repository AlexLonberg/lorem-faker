import { isNumber, isString, randomIntAsStr } from './utils.js'
import { NumTupleGenerator } from './num.js'

type _Num = {
  readonly isNum: true
  readonly index: number
  readonly offset: number
  readonly size: number
  readonly length: number
}

type _Text = {
  readonly isNum: false
  readonly text: string
}

/**
 * Формат телефона по умолчанию.
 */
const defaultPhoneFormat = '+0({450-499}){10-999}-{10-99}-{10-99}'
const defaultPhone: readonly (_Text | _Num)[] = Object.freeze([
  {
    isNum: false,
    text: '+0('
  },
  {
    isNum: true,
    index: 0,
    offset: 450,
    size: 50,
    length: 3,
  },
  {
    isNum: false,
    text: ')'
  },
  {
    isNum: true,
    index: 1,
    offset: 10,
    size: 990,
    length: 3,
  },
  {
    isNum: false,
    text: '-'
  },
  {
    isNum: true,
    index: 2,
    offset: 10,
    size: 90,
    length: 2,
  },
  {
    isNum: false,
    text: '-'
  },
  {
    isNum: true,
    index: 3,
    offset: 10,
    size: 90,
    length: 2,
  }
].map((v) => Object.freeze(v) as (_Text | _Num)))

function parsePhoneTemplate (template: string): (_Num | _Text)[] {
  const parts: (_Num | _Text)[] = []

  let index = 0
  let lastIndex = 0

  const addText = (text: string) => {
    if (parts.length > 0 && !parts[parts.length - 1]!.isNum) {
      (parts[parts.length - 1] as { text: string }).text += text
    }
    else {
      parts.push({
        isNum: false,
        text
      })
    }
  }

  const addRange = (value: string) => {
    const pair = value.replace(/\{|\}/g, '').split('-').map((v) => [v.trim().length, Number.parseInt(v, 10)])
    const length = Math.max(pair[0]![0]!, pair[1]![0]!)
    const offset = pair[0]![1]!
    const size = Math.abs(pair[1]![1]! - offset)
    if (size === 0) {
      addText(offset.toString().padStart(length, '0'))
    }
    else {
      parts.push({
        isNum: true,
        index,
        offset,
        size: size + 1,
        length
      })
      index++
    }
  }

  const addNum = (value: string) => {
    const length = value.trim().length
    const v = Number.parseInt(value, 10)
    if (v === 0) {
      addText('0'.padStart(length, '0'))
    }
    else {
      parts.push({
        isNum: true,
        index,
        offset: 0,
        size: v + 1,
        length
      })
      index++
    }
  }

  const addInRange = (value: string) => {
    addNum(value.replace(/\{|\}/g, ''))
  }

  for (const item of template.matchAll(/(\{[0-9]+-[0-9]+\})|(\{[0-9]+\})|([0-9]+)/g)) {
    const [match, range, braces, num] = item
    const i = item.index

    if (lastIndex < i) {
      addText(template.substring(lastIndex, i))
    }
    lastIndex = i + match.length

    if (range) {
      addRange(range)
    }
    else if (braces) {
      addInRange(braces)
    }
    else if (num) {
      addNum(num)
    }
    else {
      // @ts-expect-error
      console.error('Неопределенная ошибка при поиске совпадений шаблона телефонного номера.')
    }
  }

  return Object.freeze(parts.map((v) => Object.freeze(v))) as (_Num | _Text)[]
}

/**
 * Генератор телефонного номера.
 */
class PhoneGenerator {
  protected readonly _gen: NumTupleGenerator<number[]>
  protected readonly _parts: readonly (_Text | _Num)[]

  /**
   * @param format Формат телефонного номера.
   */
  constructor(format?: undefined | null | string) {
    this._parts = isString(format) ? parsePhoneTemplate(format) : defaultPhone
    const ranges: number[] = []
    for (const item of this._parts) {
      if (item.isNum) {
        ranges[item.index] = item.size
      }
    }
    this._gen = new NumTupleGenerator<number[]>(ranges)
  }

  get maxCombinations (): bigint {
    return this._gen.size
  }

  /**
   * Возвращает следующий доступный номер.
   */
  next (): string {
    const tuple = this._gen.next()
    const parts = []
    for (let i = 0; i < this._parts.length; ++i) {
      const part = this._parts[i]!
      if (part.isNum) {
        parts.push((part.offset + tuple[part.index]!).toString().padStart(part.length, '0'))
      }
      else {
        parts.push(part.text)
      }
    }
    return parts.join('')
  }

  /**
   * Возвращает итерируем объект получения уникальных телефонных номеров.
   *
   * @param num Требуемое количество итераций.
   */
  *generate (num: number): Generator<string, void, undefined> {
    this.reset()
    if (!isNumber(num) || (num = Math.round(num)) < 1) {
      return
    }
    for (let i = 0; i < num; ++i) {
      yield this.next()
    }
  }

  /**
   * Сбрасывает счетчик номеров.
   */
  reset () {
    this._gen.reset()
  }
}

/**
 * Случайный телефон в простом формате `+0(999)999-99-99`.
 *
 * Для любого формата и множества уникальных номеров используйте класс {@link PhoneGenerator}.
 */
function phone (): string {
  return `+0(${randomIntAsStr(1, null, 3)})${randomIntAsStr(0, null, 3)}-${randomIntAsStr(0, null, 2)}-${randomIntAsStr(0, null, 2)}`
}

export {
  defaultPhoneFormat,
  parsePhoneTemplate,
  PhoneGenerator,
  phone
}
