import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { readFileSync, writeFileSync } from 'node:fs'

// Этот код используется для парсинга растений из текстового CSV-файла
//
// Имена взяты из открытого источника https://plants.sc.egov.usda.gov/downloads
// Файл https://plants.sc.egov.usda.gov/csvdownload?plantLst=plantCompleteList
// Если не удалось скачать, копируем текст в файл ./.temp/plants.csv
// Из полей
//  "Symbol","Synonym Symbol","Scientific Name with Author","Common Name","Family"
// ... берем только одно имя "Common Name"

const ws = dirname(dirname(fileURLToPath(import.meta.url)))
const tempFolder = '.temp'
const tempDir = join(ws, tempFolder)
const inputFile = join(tempDir, 'plants.csv')
const plantsFile = join(tempDir, 'plants.json')

const text = readFileSync(inputFile, 'utf8')
const lines = text.split(/\n/g)

function clean (str) {
  return str.replace(/(^[^a-z]+)|([^a-z]+$)/ig, '').toLowerCase()
}

const fielsd = lines.shift() // здесь поля
const index = fielsd.split(',').findIndex((v) => clean(v) === 'common name')

const plants = new Set()
for (const line of lines) {
  let name = line.split(',')[index]

  if (name && (name = clean(name)) && /^[a-z]+$/.test(name)) {
    plants.add(name)
  }
}

writeFileSync(plantsFile, JSON.stringify([...plants]), 'utf8')
