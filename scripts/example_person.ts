/// <reference lib="dom" />
import { PhoneGenerator } from '../src/phones.js'
import { LoremGenerator } from '../src/lorem.js'
import { type TGender, PersonGenerator } from '../src/person.js'

const lorem = new LoremGenerator({ sentence: { min: 30, max: 60 } })
const phone = new PhoneGenerator('+{7-7} {450-460} {600-700} 78 {10-80}')
const person = new PersonGenerator({
  ageRange: { min: 30, max: 40 },
  genderRatio: 0.4,
  // strategy: { ... }
})

// Определяем любой подходящий тип полей, имена не имеют значения
type UserData = {
  id: number
  name: string
  login: string
  email: string
  phone: string
  age: number
  gender: TGender
  about: string
}

// Генератор возвращает доступ к текущему контексту с методами получения уникальных записей.
for (const ctx of person.generate(10)) {
  const user: UserData = {
    // Индексы генератора начинаются с 0 и мы можем их использать как ctx.index() + 1.
    // но дополнительное поле генерирует рандомные перестановки от 1 до 100
    // user.id = ctx.index() + 1
    id: ctx.id(),
    // Порядок получения полей не имеет значения
    // При запросе login/email/fullName всегда генерируются name+surname
    login: ctx.login(),
    // уже было сгенерировано, так как от name может зависеть login
    name: ctx.name(),
    email: ctx.email(),
    gender: ctx.gender(),
    age: ctx.age(),

    // Функции next() возвращают следующее уникальное значение
    phone: phone.next(),
    // Набор слов Lorem ipsum
    about: lorem.sentence()
  }
  if (`${user.name} ${ctx.surname()}` !== ctx.fullName()) {
    throw new Error('TODO: Только для проверки')
  }
  console.table(user)
}
/*
┌─────────┬──────────────────────────────────────────────────────────────┐
│ (index) │ Values                                                       │
├─────────┼──────────────────────────────────────────────────────────────┤
│ id      │ 5                                                            │
│ login   │ 'farrell.graham'                                             │
│ name    │ 'Graham'                                                     │
│ email   │ 'okra.graham@mail.test'                                      │
│ phone   │ '+7 460 675 19 63'                                           │
│ age     │ 31                                                           │
│ gender  │ 'male'                                                       │
│ about   │ 'Exercitation, exercitation nisi adipiscing laboris veniam.' │
└─────────┴──────────────────────────────────────────────────────────────┘
*/

export { }
