import { curry, compose, pipe, or, and, map, mapObj, filter, reduce, groupBy, countBy, invoke, where, match, reverse, prop, propEq, sum, length } from './dist/index.js'

const testArray = ['test', 'hello', 'hi']
const testObject = { key1: 'test', key2: 'hello', key3: 'hi' }

const testComplexArray = [
  { name: 'Nadir', gender: 'male', age: 34, country: 'France' },
  { name: 'Eric', gender: 'male', age: 25, country: 'France' },
  { name: 'Bob', gender: 'male', age: 25, country: 'United States' },
  { name: 'Eric', gender: 'male', age: 56, country: 'United States' },
  { name: 'Jenny', gender: 'female', age: 25, country: 'United States' },
  { name: 'Roberta', gender: 'female', age: 32, country: 'United States' },
]

function simple(a, b, c) { return a + b + c }

const suite = {
  curry: [
    ['all args at once', curry(simple)('a', 'b', 'c'), 'abc'],
    ['two args then one', curry(simple)('a', 'b')('c'), 'abc'],
    ['one arg then two', curry(simple)('a')('b', 'c'), 'abc'],
  ],
  map: [
    ['reverse each item', map(reverse)(testArray)[0], 'tset'],
    ['same length', map(reverse)(testArray).length, testArray.length],
    ['works on objects', map(reverse)(testObject)[0], 'tset'],
  ],
  mapObj: [
    ['reverse each value', mapObj(reverse)(testObject).key1, 'tset'],
  ],
  compose: [
    ['compose right-to-left', compose(reverse, prop('key1'))(testObject), 'tset'],
  ],
  pipe: [
    ['pipe left-to-right', pipe(prop('key1'), reverse)(testObject), 'tset'],
  ],
  reverse: [
    ['reverse array', reverse(testArray)[0], 'hi'],
    ['reverse string', reverse('test'), 'tset'],
  ],
  reduce: [
    ['reduce array', reduce((m, i) => m + i, '')(testArray), 'testhellohi'],
    ['reduce object', reduce((m, i, k) => m + k + i, '')(testObject), 'key1testkey2hellokey3hi'],
  ],
  filter: [
    ['filter by equality', filter(i => i === 'test')(testArray)[0], 'test'],
    ['filter length', filter(i => i === 'test')(testArray).length, 1],
    ['filter object', filter(i => i === 'test')(testObject)[0], 'test'],
    ['filter object length', filter(i => i === 'test')(testObject).length, 1],
  ],
  prop: [
    ['get property', prop('key1')(testObject), 'test'],
  ],
  invoke: [
    ['invoke method', invoke('toUpperCase')(testArray)[0], 'TEST'],
  ],
  propEq: [
    ['filter by propEq', filter(propEq('name', 'Jenny'))(testComplexArray).length, 1],
  ],
  or: [
    ['or predicate', filter(or(propEq('gender', 'male'), propEq('name', 'Jenny')))(testComplexArray).length, 5],
  ],
  and: [
    ['and predicate', filter(and(propEq('gender', 'male'), propEq('name', 'Eric'), propEq('country', 'United States')))(testComplexArray).length, 1],
  ],
  match: [
    ['match pattern', match({ gender: 'male', name: 'Eric', country: 'United States' })(testComplexArray).length, 1],
  ],
  groupBy: [
    ['group by country', groupBy(prop('country'))(testComplexArray).France.length, 2],
  ],
  countBy: [
    ['count by country', countBy(prop('country'))(testComplexArray).France, 2],
  ],
  where: [
    ['where predicate returns true for match', where({ name: 'Jenny' })(testComplexArray[4]), true],
  ],
  sum: [
    ['sum numbers', sum([1, 2, 3, 4, 5]), 15],
  ],
  length: [
    ['array length', length(testArray), 3],
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
    table.className = 'w-4/5 mx-auto border-collapse text-sm mb-8'
    table.style.tableLayout = 'fixed'

    const titleRow = document.createElement('tr')
    const titleCell = document.createElement('td')
    titleCell.colSpan = 4
    titleCell.className = 'bg-slate-700 text-gray-100 text-lg px-4 py-3 border border-gray-700'
    titleCell.innerHTML = `<b>${groupName}</b>`
    titleRow.appendChild(titleCell)
    table.appendChild(titleRow)

    const headRow = document.createElement('tr')
    headRow.className = 'bg-slate-600 text-gray-100'
    ;['Description', 'Value', 'Expected value', ''].forEach(text => {
      const td = document.createElement('td')
      td.className = 'px-3 py-2 w-1/4 border border-gray-700'
      td.textContent = text
      headRow.appendChild(td)
    })
    table.appendChild(headRow)

    for (const [desc, actual, expected] of tests) {
      const pass = actual === expected
      pass ? ok++ : ko++

      const row = document.createElement('tr')
      row.className = pass ? 'bg-green-500' : 'bg-red-400'
      ;[desc, JSON.stringify(actual), JSON.stringify(expected), ''].forEach(v => {
        const td = document.createElement('td')
        td.className = 'px-3 py-2 border border-gray-700 text-gray-100'
        td.textContent = v
        row.appendChild(td)
      })
      table.appendChild(row)
    }

    const total = ok + ko
    const resultRow = document.createElement('tr')
    resultRow.className = `font-bold ${ko > 0 ? 'bg-red-600' : 'bg-green-700'} text-gray-100`
    const resultCell = document.createElement('td')
    resultCell.colSpan = 4
    resultCell.className = 'px-3 py-2 border border-gray-700'
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
