type AnyFn = (...args: any[]) => any
type Predicate<T> = (value: T) => boolean

function applyRight(this: any, funcs: AnyFn[], ...args: any[]): any {
  let i = funcs.length
  let result = args
  while (i--) {
    result = [funcs[i].apply(this, result)]
  }
  return result[0]
}

function applyLeft(this: any, funcs: AnyFn[], ...args: any[]): any {
  let result = args
  for (let i = 0; i < funcs.length; i++) {
    result = [funcs[i].apply(this, result)]
  }
  return result[0]
}

export function compose<A, B, C>(f: (x: B) => C, g: (x: A) => B): (x: A) => C
export function compose<A, B, C, D>(f: (x: C) => D, g: (x: B) => C, h: (x: A) => B): (x: A) => D
export function compose<A, B, C, D, E>(f: (x: D) => E, g: (x: C) => D, h: (x: B) => C, i: (x: A) => B): (x: A) => E
export function compose(...funcs: AnyFn[]): AnyFn {
  return function this_(this: any, ...args: any[]) {
    return applyRight.call(this, funcs, ...args)
  }
}

export function pipe<A, B>(f: (x: A) => B): (x: A) => B
export function pipe<A, B, C>(f: (x: A) => B, g: (x: B) => C): (x: A) => C
export function pipe<A, B, C, D>(f: (x: A) => B, g: (x: B) => C, h: (x: C) => D): (x: A) => D
export function pipe<A, B, C, D, E>(f: (x: A) => B, g: (x: B) => C, h: (x: C) => D, i: (x: D) => E): (x: A) => E
export function pipe(...funcs: AnyFn[]): AnyFn {
  return function this_(this: any, ...args: any[]) {
    return applyLeft.call(this, funcs, ...args)
  }
}

export function or<T>(...predicates: Array<Predicate<T>>): Predicate<T> {
  return function this_(this: any, ...args: any[]) {
    for (let i = 0; i < predicates.length; i++) {
      if ((predicates[i] as AnyFn).apply(this, args)) return true
    }
    return false
  }
}

export function and<T>(...predicates: Array<Predicate<T>>): Predicate<T> {
  return function this_(this: any, ...args: any[]) {
    for (let i = 0; i < predicates.length; i++) {
      if (!(predicates[i] as AnyFn).apply(this, args)) return false
    }
    return true
  }
}
