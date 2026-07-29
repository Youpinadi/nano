import { curry, compose, pipe, or, and, map, mapObj, filter, reduce, groupBy, countBy, invoke, where, match, reverse, prop, propEq, sum, length } from './dist/index.js'

const testArray = ['wizard', 'potion', 'dragon']
const testObject = { hero: 'wizard', loot: 'potion', foe: 'dragon' }

const heroes = [
  { name: 'Luna', class: 'mage', level: 34, realm: 'Avalon', pet: 'owl' },
  { name: 'Ragnar', class: 'warrior', level: 25, realm: 'Avalon', pet: 'wolf' },
  { name: 'Zara', class: 'rogue', level: 25, realm: 'Shadowfen', pet: 'cat' },
  { name: 'Thorn', class: 'warrior', level: 56, realm: 'Shadowfen', pet: 'bear' },
  { name: 'Elara', class: 'mage', level: 25, realm: 'Shadowfen', pet: 'owl' },
  { name: 'Brock', class: 'paladin', level: 32, realm: 'Avalon', pet: 'horse' },
]

function simple(a, b, c) { return a + b + c }

const suite = {
  curry: [
    ['🔥 all three runes at once', curry(simple)('a', 'b', 'c'), 'abc'],
    ['🔥 two runes, then one', curry(simple)('a', 'b')('c'), 'abc'],
    ['🔥 one rune, then two', curry(simple)('a')('b', 'c'), 'abc'],
  ],
  map: [
    ['🔄 reverse the wizard spell', map(reverse)(testArray)[0], 'draziw'],
    ['🔄 spell count preserved', map(reverse)(testArray).length, testArray.length],
    ['🔄 reverse works on ancient tomes', map(reverse)(testObject)[0], 'draziw'],
  ],
  mapObj: [
    ['📜 reverse the scroll of wizard', mapObj(reverse)(testObject).hero, 'draziw'],
  ],
  compose: [
    ['🧙 compose magic: reverse then read', compose(reverse, prop('hero'))(testObject), 'draziw'],
  ],
  pipe: [
    ['🧪 pipe potion: read then reverse', pipe(prop('hero'), reverse)(testObject), 'draziw'],
  ],
  reverse: [
    ['🔁 reverse the relic array', reverse(testArray)[0], 'dragon'],
    ['🔁 reverse the dragon name', reverse('dragon'), 'nogard'],
  ],
  reduce: [
    ['📦 combine potion names', reduce((m, i) => m + i, '')(testArray), 'wizardpotiondragon'],
    ['📦 combine object keys & values', reduce((m, i, k) => m + k + i, '')(testObject), 'herowizardlootpotionfoedragon'],
  ],
  filter: [
    ['🎯 find the wizard', filter(i => i === 'wizard')(testArray)[0], 'wizard'],
    ['🎯 only one wizard exists', filter(i => i === 'wizard')(testArray).length, 1],
    ['🎯 find wizard in the tome', filter(i => i === 'wizard')(testObject)[0], 'wizard'],
    ['🎯 only one wizard in the tome', filter(i => i === 'wizard')(testObject).length, 1],
  ],
  prop: [
    ['🔍 read the hero property', prop('hero')(testObject), 'wizard'],
  ],
  invoke: [
    ['📢 shout the first spell', invoke('toUpperCase')(testArray)[0], 'WIZARD'],
  ],
  propEq: [
    ['🎯 find Elara by name', filter(propEq('name', 'Elara'))(heroes).length, 1],
  ],
  or: [
    ['🎭 mages or owl owners', filter(or(propEq('class', 'mage'), propEq('pet', 'owl')))(heroes).length, 2],
  ],
  and: [
    ['🎭 warriors from Shadowfen', filter(and(propEq('class', 'warrior'), propEq('realm', 'Shadowfen')))(heroes).length, 1],
  ],
  match: [
    ['🎭 match an owl mage from Shadowfen', match({ class: 'mage', realm: 'Shadowfen', pet: 'owl' })(heroes).length, 1],
  ],
  groupBy: [
    ['🏰 group heroes by realm', groupBy(prop('realm'))(heroes).Avalon.length, 3],
  ],
  countBy: [
    ['🏰 count heroes by realm', countBy(prop('realm'))(heroes).Avalon, 3],
  ],
  where: [
    ['🎯 where oracle identifies Elara', where({ name: 'Elara' })(heroes[4]), true],
  ],
  sum: [
    ['➕ sum magic levels', sum([1, 2, 3, 4, 5]), 15],
  ],
  length: [
    ['📏 length of the hero party', length(heroes), 6],
  ],
}

function render() {
  const root = document.getElementById('root')
  root.className = 'bg-slate-900 min-h-screen py-10 px-4'

  const h1 = document.createElement('h1')
  h1.className = 'text-4xl text-center font-normal text-gray-100 mb-10'
  h1.textContent = 'nano.js \u2014 test suite'
  root.appendChild(h1)

  let totalOk = 0
  let totalKo = 0

  for (const [groupName, tests] of Object.entries(suite)) {
    let ok = 0
    let ko = 0

    const table = document.createElement('table')
    table.className = 'border-separate rounded-xl border border-gray-700 overflow-hidden w-4/5 mx-auto text-sm mb-8'
    table.style.tableLayout = 'fixed'
    table.style.borderSpacing = '0'

    const titleRow = document.createElement('tr')
    const titleCell = document.createElement('td')
    titleCell.colSpan = 3
    titleCell.className = 'bg-slate-700 text-gray-100 text-lg px-4 py-3 border-b border-gray-700'
    titleCell.innerHTML = `<b>${groupName}</b>`
    titleRow.appendChild(titleCell)
    table.appendChild(titleRow)

    const headRow = document.createElement('tr')
    headRow.className = 'bg-slate-600 text-gray-100'
    ;['Description', 'Value', 'Expected value'].forEach((text, i) => {
      const td = document.createElement('td')
      td.className = `px-3 py-2 border-b border-gray-700${i < 2 ? ' border-r border-gray-700' : ''}`
      td.textContent = text
      headRow.appendChild(td)
    })
    table.appendChild(headRow)

    for (const [desc, actual, expected] of tests) {
      const pass = actual === expected
      pass ? ok++ : ko++

      const row = document.createElement('tr')
      row.className = pass ? 'bg-green-500' : 'bg-red-400'
      ;[desc, JSON.stringify(actual), JSON.stringify(expected)].forEach((v, i) => {
        const td = document.createElement('td')
        td.className = `px-3 py-2 border-b border-gray-700 text-gray-100${i < 2 ? ' border-r border-gray-700' : ''}`
        td.textContent = v
        row.appendChild(td)
      })
      table.appendChild(row)
    }

    const total = ok + ko
    const resultRow = document.createElement('tr')
    resultRow.className = `font-bold ${ko > 0 ? 'bg-red-600' : 'bg-green-700'} text-gray-100`
    const resultCell = document.createElement('td')
    resultCell.colSpan = 3
    resultCell.className = 'px-3 py-2'
    resultCell.textContent = `${total} tests / ${ok} pass / ${ko} fail`
    resultRow.appendChild(resultCell)
    table.appendChild(resultRow)

    root.appendChild(table)
    totalOk += ok
    totalKo += ko
  }

  const summary = document.createElement('div')
  summary.className = `w-72 mx-auto text-center px-6 py-3 text-base text-gray-100 font-bold ${totalKo > 0 ? 'bg-red-600' : 'bg-green-700'}`
  summary.textContent = `${totalOk + totalKo} tests / ${totalOk} pass / ${totalKo} fail`
  root.appendChild(summary)
}

render()
