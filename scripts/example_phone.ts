/// <reference lib="dom" />
import { PhoneGenerator } from '../src/phones.js'

const gen = new PhoneGenerator('+{7-7} {450-460} {600-700} 78 {10-80}')

for (const item of gen.generate(10)) {
  console.log(item)
}

export { }
