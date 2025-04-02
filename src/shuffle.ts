/**
 * Возвращает константные ключи предопределенного набора в случайном порядке с примерным соотношением возможных
 * выпадений и точным количеством раз.
 */
class ShuffledKeyGenerator<K> {
  protected readonly _initial: readonly (readonly [K, bigint])[]
  protected readonly _pairs: [number, K, bigint][] = []
  protected readonly _length: number = -1 // переустановится в конструкторе

  /**
   * @param pairs Пары `[Key, num]`, где второе значение точно указывает максимальное количество раз выпадения ключа
   *              пока все наборы не будут исчерпаны. Попросту говоря набор `[[A, 7], [B, 3], [C, 0]]` возвратит `7`
   *              раз ключ `A`, `3` раза ключ `B` и ни одного раза `C`, после чего цикл восстанавливается.
   */
  constructor(pairs: readonly ([K, (number | bigint)] | readonly [K, number | bigint])[]) {
    const toBigint = (v: bigint | number) => {
      v = (typeof v === 'bigint' ? v : BigInt(v))
      return v < 0n ? 0n : v
    }
    this._initial = Object.freeze(pairs.map(([k, v]) => Object.freeze([k, toBigint(v)] as const)))
    this.reset()
  }

  get length (): number {
    return this._length
  }

  protected _calculateNumberProbabilities (pairs: readonly (readonly [K, bigint])[]) {
    const totalWeightBigInt = pairs.reduce((a, [_, w]) => a + w, 0n)
    const temp: [number, K, bigint][] = []

    let factor = 1n
    let totalBigint!: bigint
    while ((totalBigint = totalWeightBigInt / factor) > Number.MAX_SAFE_INTEGER) {
      factor *= 10n
    }
    const total = Number(totalBigint)

    for (let i = 0; i < pairs.length; ++i) {
      const [k, w] = pairs[i]!
      if (w > 0) {
        temp.push([Number(w / factor) / total, k, w])
      }
    }

    for (const item of temp) {
      if (item[0] <= 0) {
        item[0] = 0.05
      }
    }

    if (this._length === -1) {
      // @ts-expect-error
      this._length = temp.length
    }

    if (temp.length === 0 && pairs.length > 0) {
      temp[0] = [1, pairs[0]![0], pairs[0]![1]]
    }

    this._pairs.splice(0)
    this._pairs.push(...temp)
  }

  protected _removeIndex (index: number): void {
    this._pairs.splice(index, 1)
    if (this._pairs.length === 0) {
      this.reset()
    }
    else {
      this._calculateNumberProbabilities(this._pairs.map(([_, k, b]) => [k, b]))
    }
  }

  protected _decrementByIndex (index: number): void {
    if (--this._pairs[index]![2]! <= 0n) {
      this._removeIndex(index)
    }
  }

  next (): K {
    const rand = Math.random()
    let cumulative = 0
    for (let i = 0; i < this._pairs.length; i++) {
      cumulative += this._pairs[i]![0]!
      if (rand < cumulative) {
        const next = this._pairs[i]![1]!
        this._decrementByIndex(i)
        return next
      }
    }
    if (this._pairs.length > 0) {
      const next = this._pairs[0]![1]!
      this._decrementByIndex(0)
      return next
    }
    return null as K
  }

  reset (): void {
    this._pairs.splice(0)
    this._calculateNumberProbabilities(this._initial)
  }
}

export {
  ShuffledKeyGenerator
}
