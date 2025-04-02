import { bench } from 'vitest'
import { calculateBigintCoPrimeForSfl } from './utils.js'

bench('prime with bigint', () => {
  const [size, prime] = calculateBigintCoPrimeForSfl(999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999n)
  for (let i = 0n; i < 10n; ++i) {
    // @ts-expect-error
    const _nextValue = ((prime * i) % size)
    // ...
  }
})

/*
 ✓ src/any.bench.ts 676ms
     name                       hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · prime with bigint  328,678.42  0.0025  1.1562  0.0030  0.0029  0.0064  0.0095  0.0178  ±0.58%   164340
*/
