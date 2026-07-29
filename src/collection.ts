import { and } from './compose.js'
import { propEqInv } from './util.js'

export function each<T>(fn: (value: T, key: string | number) => void): (items: Record<string, T> | T[]) => void
export function each<T>(fn: (value: T, key: string | number) => void, items: Record<string, T> | T[]): void
export function each<T>(fn: (value: T, key: string | number) => void, items?: Record<string, T> | T[]) {
  if (items === undefined) return (items: Record<string, T> | T[]) => each(fn, items)
  for (const key in items) {
    if (Object.prototype.hasOwnProperty.call(items, key)) {
      fn(items[key as keyof typeof items] as T, key)
    }
  }
}

export function map<T, R>(fn: (value: T, index: number) => R): (items: T[]) => R[]
export function map<T, R>(fn: (value: T, index: number) => R, items: T[]): R[]
export function map<T, R>(fn: (value: T, index: number) => R, items?: T[]) {
  if (items === undefined) return (items: T[]) => map(fn, items)
  const result: R[] = []
  each((item, index) => { result.push(fn(item, index as number)) }, items)
  return result
}

export function mapObj<T, R>(fn: (value: T, key: string) => R): (items: Record<string, T>) => Record<string, R>
export function mapObj<T, R>(fn: (value: T, key: string) => R, items: Record<string, T>): Record<string, R>
export function mapObj<T, R>(fn: (value: T, key: string) => R, items?: Record<string, T>) {
  if (items === undefined) return (items: Record<string, T>) => mapObj(fn, items)
  const result: Record<string, R> = {}
  each((item, key) => { result[key as string] = fn(item, key as string) }, items)
  return result
}

export function filter<T>(predicate: (value: T, index: number) => boolean): (items: T[]) => T[]
export function filter<T>(predicate: (value: T, index: number) => boolean, items: T[]): T[]
export function filter<T>(predicate: (value: T, index: number) => boolean, items?: T[]) {
  if (items === undefined) return (items: T[]) => filter(predicate, items)
  const result: T[] = []
  each((item, index) => {
    if (predicate(item, index as number)) result.push(item)
  }, items)
  return result
}

export function reduce<T, R>(fn: (memo: R, value: T, index: number) => R, memo: R): (items: T[]) => R
export function reduce<T, R>(fn: (memo: R, value: T, index: number) => R, memo: R, items: T[]): R
export function reduce<T, R>(fn: (memo: R, value: T, index: number) => R, memo: R, items?: T[]) {
  if (items === undefined) return (items: T[]) => reduce(fn, memo, items)
  each((item, index) => { memo = fn(memo, item, index as number) }, items)
  return memo
}

export function groupBy<T>(fn: (item: T) => string): (items: T[]) => Record<string, T[]>
export function groupBy<T>(fn: (item: T) => string, items: T[]): Record<string, T[]>
export function groupBy<T>(fn: (item: T) => string, items?: T[]) {
  if (items === undefined) return (items: T[]) => groupBy(fn, items)
  const result: Record<string, T[]> = {}
  each((item) => {
    const key = fn(item)
    if (!result[key]) result[key] = []
    result[key].push(item)
  }, items)
  return result
}

export function countBy<T>(fn: (item: T) => string): (items: T[]) => Record<string, number>
export function countBy<T>(fn: (item: T) => string, items: T[]): Record<string, number>
export function countBy<T>(fn: (item: T) => string, items?: T[]) {
  if (items === undefined) return (items: T[]) => countBy(fn, items)
  const groups = groupBy(fn, items)
  const result: Record<string, number> = {}
  for (const key in groups) {
    if (Object.prototype.hasOwnProperty.call(groups, key)) {
      result[key] = groups[key].length
    }
  }
  return result
}

export function invoke<T, K extends keyof T>(methodName: K): (items: T[]) => T[K] extends (...args: any[]) => infer R ? R[] : never
export function invoke<T, K extends keyof T>(methodName: K, items: T[]): T[K] extends (...args: any[]) => infer R ? R[] : never
export function invoke<T, K extends keyof T>(methodName: K, items?: T[]): any {
  if (items === undefined) return (items: T[]) => invoke(methodName, items)
  return map((item) => (item[methodName] as any).call(item), items)
}

export function where<T extends Record<string, any>>(pattern: Partial<T>): (item: T) => boolean
export function where<T extends Record<string, any>>(pattern: Partial<T>, item: T): boolean
export function where<T extends Record<string, any>>(pattern: Partial<T>, item?: T) {
  const predicates = Object.entries(pattern).map(
    ([key, value]) => propEqInv(value, key)
  )
  const predicate = and(...predicates as [(item: T) => boolean])
  if (item === undefined) return predicate
  return predicate(item)
}

export function match<T extends Record<string, any>>(pattern: Partial<T>): (items: T[]) => T[]
export function match<T extends Record<string, any>>(pattern: Partial<T>, items: T[]): T[]
export function match<T extends Record<string, any>>(pattern: Partial<T>, items?: T[]) {
  if (items === undefined) return (items: T[]) => match(pattern, items)
  return filter(where(pattern), items)
}
