/// <reference lib="dom" />
import { loremIpsumWords } from '../src/constants.js'
import { RatioGenerator } from '../src/utils.js'
import { PersonCombiner } from '../src/combiner.js'

const rnd = new RatioGenerator(true, false, 0.5)
const com = new PersonCombiner()

for (let i = 0; i < 10; ++i) {
  console.log(com.next('name', 'surname', rnd.next()))
}
com.reset()

// Сколько примерно потребуется комбинаций до появления первого _fallback() и расстояния между ними
let first = 0
let firstValue = ''
let counter = 0
while (counter < /* 10_000_000 */ 1000) {
  ++counter
  const value = com.next('name', 'surname', rnd.next())
  const splitted = value.split('.')
  if (splitted.some((v) => loremIpsumWords.includes(v))) {
    if (first === 0) {
      first = counter
      firstValue = value
    }
    else {
      console.log(first, counter)
      console.log(firstValue, value)
      break
    }
  }
}
console.log(first)
// первое столкновение с lorem - 6_458_625
// 6458625 ... второе 6464802

export { }
