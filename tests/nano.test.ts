import { describe, it, expect } from 'vitest'
import {
  curry, compose, pipe, or, and,
  each, map, mapObj, filter, reduce,
  groupBy, countBy, invoke, where, match,
  split, join, reverse,
  prop, propEq, sum, length,
} from '../src/index.js'
import { testArray, testObject, testComplexArray } from './fixtures.js'

function simple(a: string, b: string, c: string) {
  return a + b + c
}

describe('curry', () => {
  it('should work with all args at once', () => {
    expect(curry(simple)('a', 'b', 'c')).toBe('abc')
  })

  it('should work with two args then one', () => {
    expect(curry(simple)('a', 'b')('c')).toBe('abc')
  })

  it('should work with one arg then two', () => {
    expect(curry(simple)('a')('b', 'c')).toBe('abc')
  })
})

describe('map', () => {
  it('should reverse each item in an array', () => {
    expect(map(reverse)(testArray)[0]).toBe('tset')
  })

  it('should preserve array length', () => {
    expect(map(reverse)(testArray).length).toBe(testArray.length)
  })
})

describe('mapObj', () => {
  it('should reverse each value in an object', () => {
    expect(mapObj(reverse)(testObject)['key1']).toBe('tset')
  })
})

describe('compose', () => {
  it('should compose functions right-to-left', () => {
    expect(compose(reverse, prop('key1'))(testObject)).toBe('tset')
  })
})

describe('pipe', () => {
  it('should pipe functions left-to-right', () => {
    expect(pipe(prop('key1'), reverse)(testObject)).toBe('tset')
  })
})

describe('reverse', () => {
  it('should reverse an array', () => {
    expect(reverse(testArray)[0]).toBe('hi')
  })

  it('should reverse a string', () => {
    expect(reverse('test')).toBe('tset')
  })
})

describe('reduce', () => {
  it('should reduce an array', () => {
    const fn = (memo: string, item: string) => memo + item
    expect(reduce(fn, '', testArray)).toBe('testhellohi')
  })

  it('should reduce an object', () => {
    const fn = (memo: string, item: string, index: number) => memo + String(index) + item
    expect(reduce(fn, '', testObject)).toBe('key1testkey2hellokey3hi')
  })
})

describe('filter', () => {
  it('should filter array by equality', () => {
    expect(filter((item: string) => item === 'test', testArray)[0]).toBe('test')
  })

  it('should return correct filtered array length', () => {
    expect(filter((item: string) => item === 'test', testArray).length).toBe(1)
  })
})

describe('prop', () => {
  it('should get a property from an object', () => {
    expect(prop('key1', testObject)).toBe('test')
  })
})

describe('invoke', () => {
  it('should invoke a method on each item', () => {
    expect(invoke('toUpperCase', testArray)[0]).toBe('TEST')
  })
})

describe('propEq', () => {
  it('should filter by property equality', () => {
    expect(filter(propEq('name', 'Jenny'), testComplexArray).length).toBe(1)
  })
})

describe('or', () => {
  it('should match multiple predicates with OR', () => {
    expect(filter(
      or(
        propEq('gender', 'male'),
        propEq('name', 'Jenny'),
      ),
      testComplexArray,
    ).length).toBe(5)
  })
})

describe('and', () => {
  it('should match multiple predicates with AND', () => {
    expect(filter(
      and(
        propEq('gender', 'male'),
        propEq('name', 'Eric'),
        propEq('country', 'United States'),
      ),
      testComplexArray,
    ).length).toBe(1)
  })
})

describe('match', () => {
  it('should filter by object pattern', () => {
    expect(match(
      { gender: 'male', name: 'Eric', country: 'United States' },
      testComplexArray,
    ).length).toBe(1)
  })
})

describe('groupBy', () => {
  it('should group items by a key', () => {
    expect(groupBy(prop('country'), testComplexArray)['France'].length).toBe(2)
  })
})

describe('countBy', () => {
  it('should count items by a key', () => {
    expect(countBy(prop('country'), testComplexArray)['France']).toBe(2)
  })
})

describe('each', () => {
  it('should iterate over an array', () => {
    const results: string[] = []
    each((item: string) => { results.push(item) }, testArray)
    expect(results).toEqual(['test', 'hello', 'hi'])
  })
})

describe('length', () => {
  it('should return array length', () => {
    expect(length(testArray)).toBe(3)
  })
})

describe('sum', () => {
  it('should sum an array of numbers', () => {
    expect(sum([1, 2, 3, 4, 5])).toBe(15)
  })
})

describe('split / join', () => {
  it('should split and join strings', () => {
    expect(split('', 'test')).toEqual(['t', 'e', 's', 't'])
    expect(join('', ['t', 'e', 's', 't'])).toBe('test')
  })
})

describe('curry partial application via dependency', () => {
  it('should handle curried filter with propEq', () => {
    const filterMale = filter(propEq('gender', 'male'))
    expect(filterMale(testComplexArray).length).toBe(4)
  })

  it('should handle curried map with prop', () => {
    const getNames = map(prop('name'))
    expect(getNames(testComplexArray)).toContain('Nadir')
  })
})
