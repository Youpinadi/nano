# Nano.js

A pet functional library, rewritten in modern TypeScript.

Don't use in production ;)

## Usage

```typescript
import { pipe, prop, map, sum, log, countBy, filter, propEq } from 'nano'

const data = [
  { name: 'Alice', age: 30, gender: 'female' },
  { name: 'Bob', age: 25, gender: 'male' },
  { name: 'Charlie', age: 35, gender: 'male' },
]

// Data-last curried functions
pipe(
  filter(propEq('gender', 'male')),
  map(prop('name')),
  log,
)(data)

// Composition
countBy(prop('gender'), data)
// => { female: 1, male: 2 }
```

## API

### Core
- `curry(fn, arity?)` — auto-curry a function
- `compose(...fns)` — right-to-left composition
- `pipe(...fns)` — left-to-right composition

### Logic
- `or(...predicates)` — logical OR of predicates
- `and(...predicates)` — logical AND of predicates

### Collection
- `each(fn, items?)` — iterate (arrays & objects)
- `map(fn, items?)` — transform each element
- `mapObj(fn, obj?)` — transform object values
- `filter(predicate, items?)` — filter elements
- `reduce(fn, memo, items?)` — fold over elements
- `groupBy(fn, items?)` — group by key
- `countBy(fn, items?)` — count by key
- `invoke(method, items?)` — invoke method on each item
- `where(pattern, item?)` — match object properties
- `match(pattern, items?)` — filter by object pattern

### Property
- `prop(key, obj?)` — get property
- `propEq(key, value, obj?)` — property equality
- `propEqInv(value, key, obj?)` — inverse property equality

### String
- `split(separator, str?)` — split string
- `join(separator, arr?)` — join array

### Util
- `reverse(items)` — reverse array or string
- `length(items)` — get length
- `log(item)` — console.log and return
- `sum(items)` — sum numbers

All functions are **data-last** and **auto-curried** — pass only the transform to get back a function expecting data.

## Development

```bash
npm install
npm test        # 28 tests via vitest
npm run build   # compile to dist/
```
