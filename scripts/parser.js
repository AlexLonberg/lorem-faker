import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { readFileSync, writeFileSync } from 'node:fs'

// Этот код используется для парсинга имен из текстового CSV-файла
//
// Имена взяты из открытого источника https://www.ssa.gov/oact/babynames/limits.html
// Файл https://www.ssa.gov/oact/babynames/names.zip
// Из файла вытаскиваем последний yob2023.txt и ложим в каталог ./.temp
// Пример строки файла "Olivia,F,15270"
//
// Фамилии взяты из открытого источника https://www.census.gov/topics/population/genealogy/data/2010_surnames.html
// Файл https://www2.census.gov/topics/genealogy/2010surnames/names.zip
// Из файла вытаскиваем последний Names_2010Census.csv и ложим в каталог ./.temp
// Пример строки файла "SMITH,1,2442977,828.19,828.19,70.9,23.11,0.5,0.89,2.19,2.4"

const minPopularity = 240
const maxSurnameRank = 1000

const ws = dirname(dirname(fileURLToPath(import.meta.url)))
const tempFolder = '.temp'
const tempDir = join(ws, tempFolder)
const namesFile = join(tempDir, 'yob2023.txt')
const snFile = join(tempDir, 'Names_2010Census.csv')
const maleFile = join(tempDir, 'maleNames.json')
const femaleFile = join(tempDir, 'femaleNames.json')
const surnameFile = join(tempDir, 'surnames.json')

const text = readFileSync(namesFile, 'utf8')
const textSurnames = readFileSync(snFile, 'utf8')
const lines = text.split(/\n/g)
const surnameLines = textSurnames.split(/\n/g)

const male = new Set()
const female = new Set()
const surnames = new Set()

for (let line of lines) {
  line = line.trim()
  if (!/^[a-z]{3,}\s*,\s*(F|M)\s*,\s*[0-9]+$/i.test(line)) {
    continue
  }
  const [name, gen, popularity] = line.split(',')
  if (Number.parseInt(popularity) < minPopularity) {
    continue
  }
  const normalize = `${name.substring(0, 1).toUpperCase()}${name.substring(1).toLowerCase()}`
  if (/m/i.test(gen)) {
    male.add(normalize)
  }
  if (/f/i.test(gen)) {
    female.add(normalize)
  }
}

for (let line of lines) {
  line = line.trim()
  if (!/^[a-z]{3,}\s*,\s*(F|M)\s*,\s*[0-9]+$/i.test(line)) {
    continue
  }
  const [name, gen, popularity] = line.split(',')
  if (Number.parseInt(popularity) < minPopularity) {
    continue
  }
  const trimmed = name.trim()
  const normalize = `${trimmed.substring(0, 1).toUpperCase()}${trimmed.substring(1).toLowerCase()}`
  if (/m/i.test(gen)) {
    male.add(normalize)
  }
  if (/f/i.test(gen)) {
    female.add(normalize)
  }
}

for (let line of surnameLines) {
  line = line.trim()
  if (!/^[a-z]{3,}\s*,\s*[0-9]+/i.test(line)) {
    continue
  }
  const [name, rank] = line.split(',')
  if (Number.parseInt(rank) > maxSurnameRank) {
    continue
  }
  const trimmed = name.trim()
  const normalize = `${trimmed.substring(0, 1).toUpperCase()}${trimmed.substring(1).toLowerCase()}`
  surnames.add(normalize)
}

writeFileSync(maleFile, JSON.stringify([...male]), 'utf8')
writeFileSync(femaleFile, JSON.stringify([...female]), 'utf8')
writeFileSync(surnameFile, JSON.stringify([...surnames]), 'utf8')
