import { describe, it, expect } from 'vitest'
import {
  curry, compose, pipe, or, and,
  each, map, mapObj, filter, reduce,
  groupBy, countBy, invoke, where, match,
  split, join, reverse,
  prop, propEq, propEqInv, sum, length,
} from '../src/index.js'
import { testArray, testObject, testComplexArray } from './fixtures.js'

function simple(a: string, b: string, c: string) {
  return a + b + c
}

describe('curry', () => {
  it('all args at once', () => {
    expect(curry(simple)('a', 'b', 'c')).toBe('abc')
  })

  it('two args then one', () => {
    expect(curry(simple)('a', 'b')('c')).toBe('abc')
  })

  it('one arg then two', () => {
    expect(curry(simple)('a')('b', 'c')).toBe('abc')
  })

  it('one arg at a time', () => {
    expect(curry(simple)('a')('b')('c')).toBe('abc')
  })

  it('custom arity smaller than fn.length', () => {
    const add = (a: number, b: number, c: number) => a + b + c
    const curried = curry(add, 2)
    expect(curried(1)).toBeInstanceOf(Function)
  })

  it('single-arg function returns immediately', () => {
    const id = (x: number) => x
    expect(curry(id)(42)).toBe(42)
  })

  it('zero-arg function returns immediately', () => {
    const fn = () => 42
    expect(curry(fn)()).toBe(42)
  })
})

describe('each', () => {
  it('iterates over an array', () => {
    const results: string[] = []
    each((item: string) => { results.push(item) }, testArray)
    expect(results).toEqual(['test', 'hello', 'hi'])
  })

  it('iterates with index', () => {
    const indices: string[] = []
    each((_, i) => { indices.push(i as string) }, testArray)
    expect(indices).toEqual(['0', '1', '2'])
  })

  it('iterates over an object', () => {
    const keys: string[] = []
    each((_, key) => { keys.push(key as string) }, testObject)
    expect(keys).toEqual(['key1', 'key2', 'key3'])
  })

  it('handles empty array', () => {
    const results: string[] = []
    each(() => { results.push('x') }, [])
    expect(results).toEqual([])
  })

  it('is curried', () => {
    const log = each((item: string) => item)
    expect(log([testArray[0]])).toBeUndefined()
  })
})

describe('map', () => {
  it('reverses each item', () => {
    expect(map(reverse)(testArray)[0]).toBe('tset')
  })

  it('preserves array length', () => {
    expect(map(reverse)(testArray).length).toBe(testArray.length)
  })

  it('extracts a property', () => {
    expect(map(prop('name'), testComplexArray)).toContain('Nadir')
  })

  it('identity transform', () => {
    expect(map((x: number) => x, [1, 2, 3])).toEqual([1, 2, 3])
  })

  it('handles empty array', () => {
    expect(map((x: number) => x * 2, [])).toEqual([])
  })

  it('is curried', () => {
    const double = map((x: number) => x * 2)
    expect(double([1, 2, 3])).toEqual([2, 4, 6])
  })
})

describe('mapObj', () => {
  it('reverses each value', () => {
    expect(mapObj(reverse)(testObject)['key1']).toBe('tset')
  })

  it('preserves keys', () => {
    const result = mapObj((x: string) => x + '!', testObject)
    expect(Object.keys(result)).toEqual(['key1', 'key2', 'key3'])
  })

  it('handles empty object', () => {
    expect(mapObj((x: any) => x, {})).toEqual({})
  })

  it('is curried', () => {
    const bang = mapObj((x: string) => x + '!')
    expect(bang({ a: 'hello' }).a).toBe('hello!')
  })
})

describe('compose', () => {
  it('composes right-to-left', () => {
    expect(compose(reverse, prop('key1'))(testObject)).toBe('tset')
  })

  it('composes three functions', () => {
    const fn = compose(reverse, (s: string) => s.toUpperCase(), prop('key1'))
    expect(fn(testObject)).toBe('TSET')
  })

  it('single function returns identity', () => {
    const fn = compose(reverse)
    expect(fn('abc')).toBe('cba')
  })
})

describe('pipe', () => {
  it('pipes left-to-right', () => {
    expect(pipe(prop('key1'), reverse)(testObject)).toBe('tset')
  })

  it('pipes three functions', () => {
    const fn = pipe(prop('key1'), (s: string) => s.toUpperCase(), reverse)
    expect(fn(testObject)).toBe('TSET')
  })

  it('single function returns identity', () => {
    const fn = pipe(reverse)
    expect(fn('abc')).toBe('cba')
  })
})

describe('reverse', () => {
  it('reverses an array', () => {
    expect(reverse(testArray)[0]).toBe('hi')
  })

  it('reverses a string', () => {
    expect(reverse('test')).toBe('tset')
  })

  it('handles empty array', () => {
    expect(reverse([])).toEqual([])
  })

  it('handles single-element array', () => {
    expect(reverse([42])).toEqual([42])
  })

  it('handles empty string', () => {
    expect(reverse('')).toBe('')
  })

  it('handles palindrome string', () => {
    expect(reverse('radar')).toBe('radar')
  })
})

describe('reduce', () => {
  it('reduces an array', () => {
    const fn = (memo: string, item: string) => memo + item
    expect(reduce(fn, '', testArray)).toBe('testhellohi')
  })

  it('reduces an object', () => {
    const fn = (memo: string, item: string, index: number) => memo + String(index) + item
    expect(reduce(fn, '', testObject)).toBe('key1testkey2hellokey3hi')
  })

  it('reduces with initial value', () => {
    expect(reduce((m: number, x: number) => m + x, 10, [1, 2, 3])).toBe(16)
  })

  it('handles empty array', () => {
    expect(reduce((m: number, x: number) => m + x, 0, [])).toBe(0)
  })

  it('is curried', () => {
    const concat = reduce((m: string, x: string) => m + x, '')
    expect(concat(['a', 'b', 'c'])).toBe('abc')
  })
})

describe('filter', () => {
  it('filters by equality', () => {
    expect(filter((item: string) => item === 'test', testArray)[0]).toBe('test')
  })

  it('returns correct length', () => {
    expect(filter((item: string) => item === 'test', testArray).length).toBe(1)
  })

  it('handles empty result', () => {
    expect(filter(() => false, testArray)).toEqual([])
  })

  it('all pass', () => {
    expect(filter(() => true, [1, 2, 3])).toEqual([1, 2, 3])
  })

  it('handles empty array', () => {
    expect(filter(() => true, [])).toEqual([])
  })

  it('is curried', () => {
    const onlyTests = filter((item: string) => item === 'test')
    expect(onlyTests(testArray).length).toBe(1)
  })
})

describe('prop', () => {
  it('gets a property from an object', () => {
    expect(prop('key1', testObject)).toBe('test')
  })

  it('returns undefined for missing key', () => {
    expect(prop('nope', testObject)).toBeUndefined()
  })

  it('is curried', () => {
    const getName = prop('name')
    expect(getName(testComplexArray[0])).toBe('Nadir')
  })
})

describe('propEq', () => {
  it('finds exact match', () => {
    expect(filter(propEq('name', 'Jenny'), testComplexArray).length).toBe(1)
  })

  it('no match returns empty', () => {
    expect(filter(propEq('name', 'Nobody'), testComplexArray).length).toBe(0)
  })

  it('is curried', () => {
    const isMale = propEq('gender', 'male')
    expect(filter(isMale, testComplexArray).length).toBe(4)
  })
})

describe('propEqInv', () => {
  it('finds match with swapped args', () => {
    expect(propEqInv('male', 'gender', testComplexArray[0])).toBe(true)
  })

  it('no match', () => {
    expect(propEqInv('female', 'gender', testComplexArray[0])).toBe(false)
  })

  it('is curried', () => {
    const isGenderMale = propEqInv('male', 'gender')
    expect(isGenderMale(testComplexArray[0])).toBe(true)
  })
})

describe('invoke', () => {
  it('invokes a method on each item', () => {
    expect(invoke('toUpperCase', testArray)[0]).toBe('TEST')
  })

  it('handles empty array', () => {
    expect(invoke('toString', [])).toEqual([])
  })
})

describe('or', () => {
  it('matches with OR', () => {
    expect(filter(
      or(
        propEq('gender', 'male'),
        propEq('name', 'Jenny'),
      ),
      testComplexArray,
    ).length).toBe(5)
  })

  it('single predicate', () => {
    expect(filter(or(propEq('gender', 'male')), testComplexArray).length).toBe(4)
  })

  it('none match', () => {
    expect(filter(or(() => false), [1, 2, 3])).toEqual([])
  })
})

describe('and', () => {
  it('matches with AND', () => {
    expect(filter(
      and(
        propEq('gender', 'male'),
        propEq('name', 'Eric'),
        propEq('country', 'United States'),
      ),
      testComplexArray,
    ).length).toBe(1)
  })

  it('single predicate', () => {
    expect(filter(and(propEq('gender', 'male')), testComplexArray).length).toBe(4)
  })

  it('none match when one fails', () => {
    expect(filter(and(() => true, () => false), [1, 2, 3])).toEqual([])
  })
})

describe('match', () => {
  it('filters by object pattern', () => {
    expect(match(
      { gender: 'male', name: 'Eric', country: 'United States' },
      testComplexArray,
    ).length).toBe(1)
  })

  it('empty pattern matches all', () => {
    expect(match({}, testComplexArray).length).toBe(testComplexArray.length)
  })

  it('no match returns empty', () => {
    expect(match({ name: 'Nobody' }, testComplexArray).length).toBe(0)
  })

  it('is curried', () => {
    const matchFrench = match({ country: 'France' })
    expect(matchFrench(testComplexArray).length).toBe(2)
  })
})

describe('groupBy', () => {
  it('groups by a key', () => {
    expect(groupBy(prop('country'), testComplexArray)['France'].length).toBe(2)
  })

  it('handles empty array', () => {
    expect(groupBy(prop('country'), [])).toEqual({})
  })

  it('is curried', () => {
    const byCountry = groupBy(prop('country'))
    expect(byCountry(testComplexArray)['United States'].length).toBe(4)
  })
})

describe('countBy', () => {
  it('counts by a key', () => {
    expect(countBy(prop('country'), testComplexArray)['France']).toBe(2)
  })

  it('handles empty array', () => {
    expect(countBy(prop('country'), [])).toEqual({})
  })

  it('is curried', () => {
    const countByCountry = countBy(prop('country'))
    expect(countByCountry(testComplexArray)['United States']).toBe(4)
  })
})

describe('where', () => {
  it('matches existing object', () => {
    expect(where({ name: 'Jenny' }, testComplexArray[4])).toBe(true)
  })

  it('does not match different object', () => {
    expect(where({ name: 'Jenny' }, testComplexArray[0])).toBe(false)
  })

  it('empty pattern always matches', () => {
    expect(where({}, testComplexArray[0])).toBe(true)
  })

  it('is curried', () => {
    const isJenny = where({ name: 'Jenny' })
    expect(isJenny(testComplexArray[4])).toBe(true)
    expect(isJenny(testComplexArray[0])).toBe(false)
  })
})

describe('sum', () => {
  it('sums numbers', () => {
    expect(sum([1, 2, 3, 4, 5])).toBe(15)
  })

  it('handles empty array', () => {
    expect(sum([])).toBe(0)
  })

  it('handles single element', () => {
    expect(sum([42])).toBe(42)
  })

  it('handles negative numbers', () => {
    expect(sum([-5, 5, -2, 2])).toBe(0)
  })
})

describe('length', () => {
  it('returns array length', () => {
    expect(length(testArray)).toBe(3)
  })

  it('handles empty array', () => {
    expect(length([])).toBe(0)
  })
})

describe('split / join', () => {
  it('splits by character', () => {
    expect(split('', 'test')).toEqual(['t', 'e', 's', 't'])
  })

  it('joins by character', () => {
    expect(join('', ['t', 'e', 's', 't'])).toBe('test')
  })

  it('splits by word separator', () => {
    expect(split(' ', 'hello world')).toEqual(['hello', 'world'])
  })

  it('joins with separator', () => {
    expect(join(', ', ['a', 'b', 'c'])).toBe('a, b, c')
  })

  it('is curried', () => {
    const splitByComma = split(',')
    expect(splitByComma('a,b,c')).toEqual(['a', 'b', 'c'])
  })
})

describe('curry partial application via dependency', () => {
  it('curried filter with propEq', () => {
    const filterMale = filter(propEq('gender', 'male'))
    expect(filterMale(testComplexArray).length).toBe(4)
  })

  it('curried map with prop', () => {
    const getNames = map(prop('name'))
    expect(getNames(testComplexArray)).toContain('Nadir')
  })
})
