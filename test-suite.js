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
  const title = document.createElement('h1')
  title.textContent = 'nano.js — test suite'
  root.appendChild(title)

  let totalOk = 0
  let totalKo = 0

  for (const [groupName, tests] of Object.entries(suite)) {
    let ok = 0
    let ko = 0

    const table = document.createElement('table')
    const thead = document.createElement('thead')
    const headRow = document.createElement('tr')
    const headCell = document.createElement('td')
    headCell.colSpan = 4
    const bold = document.createElement('b')
    bold.textContent = groupName
    headCell.appendChild(bold)
    headRow.appendChild(headCell)
    thead.appendChild(headRow)
    table.appendChild(thead)

    const labelRow = document.createElement('tr')
    labelRow.className = 'head'
    ;['Description', 'Value', 'Expected value'].forEach(t => {
      const td = document.createElement('td')
      td.textContent = t
      labelRow.appendChild(td)
    })
    table.appendChild(labelRow)

    for (const [desc, actual, expected] of tests) {
      const pass = actual === expected
      pass ? ok++ : ko++

      const row = document.createElement('tr')
      row.className = pass ? 'ok' : 'ko'
      ;[desc, JSON.stringify(actual), JSON.stringify(expected)].forEach(v => {
        const td = document.createElement('td')
        td.textContent = v
        row.appendChild(td)
      })
      table.appendChild(row)
    }

    const total = ok + ko
    const resultRow = document.createElement('tr')
    resultRow.className = `result ${ko > 0 ? 'ko' : 'ok'}`
    const resultCell = document.createElement('td')
    resultCell.colSpan = 4
    resultCell.textContent = `${total} tests / ${ok} pass / ${ko} fail`
    resultRow.appendChild(resultCell)
    table.appendChild(resultRow)

    root.appendChild(table)
    totalOk += ok
    totalKo += ko
  }

  const summary = document.createElement('div')
  summary.className = `suite-results ${totalKo > 0 ? 'ko' : 'ok'}`
  summary.textContent = `${totalOk + totalKo} tests / ${totalOk} pass / ${totalKo} fail`
  root.appendChild(summary)
}

render()
