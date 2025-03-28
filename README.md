
# 🎲 Lorem Ipsum fake generator

Легкий минималистичный генератор фейковых данных.

## Установка

    npm i -D lorem-faker

## API

Генерируемые слова гарантированно находятся в списке [Lorem ipsum](./src/lorem.ts)

* `word()` - Случайное слово из набора _Lorem ipsum ..._.
* `generateSentence(length)` - Предложение с точным количеством символов.
* `sentence(min, max)` - Предложение ограниченное диапазоном.
* `generateParagraph(length)` - Параграф с точным количеством символов.
* `paragraph(min, max)` - Параграф.
* `page(num, min, max)` - Несколько параграфов.
* `name(maleOrFemale)` - Случайное имя (1500+).
* `surname()` - Случайная фамилия (900+).
* `fullName(maleOrFemale)` - Полное имя.
* `email()` - Электронная почта.
* `phone()` - Телефон.
* `Faker` - Генератор наборов с уникальными `email` и `phone`.
* `...` - другие функции и классы + типизация `TS`.

## 🔥 Пример использования

```ts
import { Faker, sentence /* , paragraph , ... */ } from 'lorem-faker'

const faker = new Faker(/* options */)

// Параметр принимает список доступных полей TRecordResultMap
// Генератор возвратит уникальные email + phone
const records = faker.gen(['name', 'email', 'age', 'gender', 'phone'], 10)
// records[0].email layla.flores.cat@example.com

// Доступные поля
type TRecordResultMap = {
  name: string
  surname: string
  fullName: string
  email: string
  age: number
  phone: string
  gender: 'male' | 'female'
  word: string
  sentence: string
  paragraph: string
}

// Так же доступны независимые функции.
const text = sentence(50, 180) // min, max
// Точное количество символов предложения включая точку.
const strict = generateSentence(78)
```

**Генерация уникальных числовых последовательностей**

```ts
import { NumTupleGenerator } from 'lorem-faker'

const tuples = new NumTupleGenerator<[number, number, number]>([
    [7, 8], 
    [1, 999], 
    [1, 99]
  ])

const records = tuples.gen(10)
// [[7, 457, 68], ...]
```

**Example**

![](exmple.jpg)

## Ссылки

* [lipsum.com](https://lipsum.com/). Оригинальный `Lorem ipsum ...` имеет 69(63 уникальных) слов от `2` до `13` символов.
* Здесь можно найти [файлы с именами](https://www.ssa.gov/oact/babynames/limits.html) `male/female`.
* [Фамилии](https://www.census.gov/topics/population/genealogy/data/2010_surnames.html) по данным переписи 2010 года.
* [Список животных](https://en.wikipedia.org/wiki/List_of_animal_names)
