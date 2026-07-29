import { describe, it, expect } from 'vitest'
import {
  curry, compose, pipe, or, and,
  each, map, mapObj, filter, reduce,
  groupBy, countBy, invoke, where, match,
  reverse,
  prop, propEq, sum, length,
} from '../src/index.js'
import { testArray, testObject, heroes } from './fixtures.js'

function simple(a: string, b: string, c: string) {
  return a + b + c
}

describe('curry', () => {
  it('all three runes at once', () => {
    expect(curry(simple)('a', 'b', 'c')).toBe('abc')
  })

  it('two runes then one', () => {
    expect(curry(simple)('a', 'b')('c')).toBe('abc')
  })

  it('one rune then two', () => {
    expect(curry(simple)('a')('b', 'c')).toBe('abc')
  })
})

describe('map', () => {
  it('reverse the wizard spell', () => {
    expect(map(reverse)(testArray)[0]).toBe('draziw')
  })

  it('spell count preserved', () => {
    expect(map(reverse)(testArray).length).toBe(testArray.length)
  })
})

describe('mapObj', () => {
  it('reverse the wizard property', () => {
    expect(mapObj(reverse)(testObject)['hero']).toBe('draziw')
  })
})

describe('compose', () => {
  it('compose right-to-left', () => {
    expect(compose(reverse, prop('hero'))(testObject)).toBe('draziw')
  })
})

describe('pipe', () => {
  it('pipe left-to-right', () => {
    expect(pipe(prop('hero'), reverse)(testObject)).toBe('draziw')
  })
})

describe('reverse', () => {
  it('reverse the relic array', () => {
    expect(reverse(testArray)[0]).toBe('dragon')
  })

  it('reverse the dragon name', () => {
    expect(reverse('dragon')).toBe('nogard')
  })
})

describe('reduce', () => {
  it('combine potion names', () => {
    const fn = (memo: string, item: string) => memo + item
    expect(reduce(fn, '', testArray)).toBe('wizardpotiondragon')
  })

  it('combine object keys & values', () => {
    const fn = (memo: string, item: string, index: number) => memo + String(index) + item
    expect(reduce(fn, '', testObject)).toBe('herowizardlootpotionfoedragon')
  })
})

describe('filter', () => {
  it('find the wizard', () => {
    expect(filter((item: string) => item === 'wizard', testArray)[0]).toBe('wizard')
  })

  it('only one wizard exists', () => {
    expect(filter((item: string) => item === 'wizard', testArray).length).toBe(1)
  })
})

describe('prop', () => {
  it('read the hero property', () => {
    expect(prop('hero', testObject)).toBe('wizard')
  })
})

describe('invoke', () => {
  it('shout the first spell', () => {
    expect(invoke('toUpperCase', testArray)[0]).toBe('WIZARD')
  })
})

describe('propEq', () => {
  it('find Elara by name', () => {
    expect(filter(propEq('name', 'Elara'), heroes).length).toBe(1)
  })
})

describe('or', () => {
  it('mages or owl owners', () => {
    expect(filter(
      or(
        propEq('class', 'mage'),
        propEq('pet', 'owl'),
      ),
      heroes,
    ).length).toBe(2)
  })
})

describe('and', () => {
  it('warriors from Shadowfen', () => {
    expect(filter(
      and(
        propEq('class', 'warrior'),
        propEq('realm', 'Shadowfen'),
      ),
      heroes,
    ).length).toBe(1)
  })
})

describe('match', () => {
  it('match an owl mage from Shadowfen', () => {
    expect(match(
      { class: 'mage', realm: 'Shadowfen', pet: 'owl' },
      heroes,
    ).length).toBe(1)
  })
})

describe('groupBy', () => {
  it('group heroes by realm', () => {
    expect(groupBy(prop('realm'), heroes)['Avalon'].length).toBe(3)
  })
})

describe('countBy', () => {
  it('count heroes by realm', () => {
    expect(countBy(prop('realm'), heroes)['Avalon']).toBe(3)
  })
})

describe('each', () => {
  it('iterate over the potion array', () => {
    const results: string[] = []
    each((item: string) => { results.push(item) }, testArray)
    expect(results).toEqual(['wizard', 'potion', 'dragon'])
  })
})

describe('length', () => {
  it('size of the hero party', () => {
    expect(length(heroes)).toBe(6)
  })
})

describe('sum', () => {
  it('sum magic levels', () => {
    expect(sum([1, 2, 3, 4, 5])).toBe(15)
  })
})

describe('where', () => {
  it('where oracle identifies Elara', () => {
    expect(where({ name: 'Elara' }, heroes[4])).toBe(true)
  })
})
