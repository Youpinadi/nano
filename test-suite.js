import { curry, compose, pipe, or, and, each, map, mapObj, filter, reduce, groupBy, countBy, invoke, where, match, reverse, prop, propEq, propEqInv, split, join, sum, length } from './dist/index.js'

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
    ['one arg at a time', curry(simple)('a')('b')('c'), 'abc'],
    ['single-arg fn returns immediately', curry((x) => x)(42), 42],
    ['zero-arg fn returns immediately', curry(() => 42)(), 42],
    ['custom arity smaller than fn.length', typeof curry(simple, 2)(1), 'function'],
  ],
  each: [
    ['calls fn for each element', () => { let acc = ''; each(x => acc += x, ['a', 'b', 'c']); return acc }, 'abc'],
    ['includes index', () => { const idx = []; each((_, i) => idx.push(i), ['x', 'y']); return idx }, ['0', '1']],
    ['over object keys', () => { const k = []; each((_, key) => k.push(key), { a: 1, b: 2 }); return k }, ['a', 'b']],
    ['empty array does nothing', () => { let called = false; each(() => called = true, []); return called }, false],
    ['is curried', () => { const f = each(x => x); return f([testArray[0]]) }, undefined],
  ],
  map: [
    ['reverse each item', map(reverse)(testArray)[0], 'tset'],
    ['preserves length', map(reverse)(testArray).length, testArray.length],
    ['works on objects', map(reverse)(testObject)[0], 'tset'],
    ['identity transform', map(x => x, [1, 2, 3]), [1, 2, 3]],
    ['empty array', map(x => x * 2, []), []],
    ['extracts a property', () => map(prop('name'), testComplexArray).includes('Nadir'), true],
    ['is curried', () => { const f = map(x => x * 2); return f([1, 2, 3]) }, [2, 4, 6]],
  ],
  mapObj: [
    ['reverse each value', mapObj(reverse)(testObject).key1, 'tset'],
    ['preserves keys', () => Object.keys(mapObj(x => x + '!', testObject)), ['key1', 'key2', 'key3']],
    ['empty object', mapObj(x => x, {}), {}],
    ['is curried', () => { const f = mapObj(x => x + '!'); return f({ a: 'hello' }).a }, 'hello!'],
  ],
  compose: [
    ['compose right-to-left', compose(reverse, prop('key1'))(testObject), 'tset'],
    ['three functions', compose(reverse, s => s.toUpperCase(), prop('key1'))(testObject), 'TSET'],
    ['single function', compose(reverse)('abc'), 'cba'],
  ],
  pipe: [
    ['pipe left-to-right', pipe(prop('key1'), reverse)(testObject), 'tset'],
    ['three functions', pipe(prop('key1'), s => s.toUpperCase(), reverse)(testObject), 'TSET'],
    ['single function', pipe(reverse)('abc'), 'cba'],
  ],
  reverse: [
    ['reverse array', reverse(testArray)[0], 'hi'],
    ['reverse string', reverse('test'), 'tset'],
    ['empty array', reverse([]), []],
    ['single element', reverse([42]), [42]],
    ['empty string', reverse(''), ''],
    ['palindrome', reverse('radar'), 'radar'],
  ],
  reduce: [
    ['concatenate array', reduce((m, i) => m + i, '')(testArray), 'testhellohi'],
    ['concatenate object', reduce((m, i, k) => m + k + i, '')(testObject), 'key1testkey2hellokey3hi'],
    ['with initial value', reduce((m, x) => m + x, 10, [1, 2, 3]), 16],
    ['empty array', reduce((m, x) => m + x, 0, []), 0],
    ['is curried', () => { const f = reduce((m, x) => m + x, ''); return f(['a', 'b', 'c']) }, 'abc'],
  ],
  filter: [
    ['by equality', filter(i => i === 'test')(testArray)[0], 'test'],
    ['correct length', filter(i => i === 'test')(testArray).length, 1],
    ['works on objects', filter(i => i === 'test')(testObject)[0], 'test'],
    ['object length', filter(i => i === 'test')(testObject).length, 1],
    ['none match', filter(() => false, [1, 2, 3]), []],
    ['all match', filter(() => true, [1, 2, 3]), [1, 2, 3]],
    ['empty array', filter(() => true, []), []],
    ['is curried', () => { const f = filter(x => x === 'test'); return f(testArray).length }, 1],
  ],
  prop: [
    ['get property', prop('key1')(testObject), 'test'],
    ['missing key', prop('nope')(testObject), undefined],
    ['is curried', () => { const f = prop('name'); return f(testComplexArray[0]) }, 'Nadir'],
  ],
  invoke: [
    ['toUpperCase', invoke('toUpperCase')(testArray)[0], 'TEST'],
    ['empty array', invoke('toString')([]), []],
  ],
  propEq: [
    ['find Jenny', filter(propEq('name', 'Jenny'))(testComplexArray).length, 1],
    ['no match', filter(propEq('name', 'Nobody'))(testComplexArray).length, 0],
    ['is curried', () => { const f = propEq('gender', 'male'); return filter(f, testComplexArray).length }, 4],
  ],
  propEqInv: [
    ['finds match', propEqInv('male', 'gender', testComplexArray[0]), true],
    ['no match', propEqInv('female', 'gender', testComplexArray[0]), false],
    ['is curried', () => { const f = propEqInv('male', 'gender'); return f(testComplexArray[0]) }, true],
  ],
  or: [
    ['male or Jenny', filter(or(propEq('gender', 'male'), propEq('name', 'Jenny')))(testComplexArray).length, 5],
    ['single predicate', filter(or(propEq('gender', 'male')))(testComplexArray).length, 4],
    ['none match', filter(or(() => false), [1, 2, 3]), []],
  ],
  and: [
    ['male Eric from US', filter(and(propEq('gender', 'male'), propEq('name', 'Eric'), propEq('country', 'United States')))(testComplexArray).length, 1],
    ['single predicate', filter(and(propEq('gender', 'male')))(testComplexArray).length, 4],
    ['none match', filter(and(() => true, () => false), [1, 2, 3]), []],
  ],
  match: [
    ['object pattern', match({ gender: 'male', name: 'Eric', country: 'United States' })(testComplexArray).length, 1],
    ['empty pattern matches all', match({})(testComplexArray).length, testComplexArray.length],
    ['no match', match({ name: 'Nobody' })(testComplexArray).length, 0],
    ['is curried', () => { const f = match({ country: 'France' }); return f(testComplexArray).length }, 2],
  ],
  groupBy: [
    ['group by country', groupBy(prop('country'))(testComplexArray).France.length, 2],
    ['empty array', groupBy(prop('country'))([]), {}],
    ['is curried', () => { const f = groupBy(prop('country')); return f(testComplexArray)['United States'].length }, 4],
  ],
  countBy: [
    ['count by country', countBy(prop('country'))(testComplexArray).France, 2],
    ['empty array', countBy(prop('country'))([]), {}],
    ['is curried', () => { const f = countBy(prop('country')); return f(testComplexArray)['United States'] }, 4],
  ],
  where: [
    ['matches Jenny', where({ name: 'Jenny' })(testComplexArray[4]), true],
    ['no match', where({ name: 'Jenny' })(testComplexArray[0]), false],
    ['empty pattern', where({})(testComplexArray[0]), true],
    ['is curried (match)', () => { const f = where({ name: 'Jenny' }); return f(testComplexArray[4]) }, true],
    ['is curried (no match)', () => { const f = where({ name: 'Jenny' }); return f(testComplexArray[0]) }, false],
  ],
  sum: [
    ['basic sum', sum([1, 2, 3, 4, 5]), 15],
    ['empty array', sum([]), 0],
    ['single element', sum([42]), 42],
    ['negative numbers', sum([-5, 5, -2, 2]), 0],
  ],
  length: [
    ['array length', length(testArray), 3],
    ['empty array', length([]), 0],
  ],
  split: [
    ['by character', split('', 'test'), ['t', 'e', 's', 't']],
    ['by word', split(' ', 'hello world'), ['hello', 'world']],
    ['is curried', () => { const f = split(','); return f('a,b,c') }, ['a', 'b', 'c']],
  ],
  join: [
    ['by character', join('', ['t', 'e', 's', 't']), 'test'],
    ['with separator', join(', ', ['a', 'b', 'c']), 'a, b, c'],
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

    for (let [desc, actual, expected] of tests) {
      if (typeof actual === 'function') actual = actual()

      const isArrayOrObj = (v) => v !== null && typeof v === 'object'
      const pass = isArrayOrObj(actual) || isArrayOrObj(expected)
        ? JSON.stringify(actual) === JSON.stringify(expected)
        : actual === expected
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
