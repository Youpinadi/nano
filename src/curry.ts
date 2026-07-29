type AnyFn = (...args: any[]) => any

function subCurry(this: any, fn: AnyFn, ...args: any[]): AnyFn {
  return function this_(this: any, ...inner: any[]) {
    return fn.apply(this, args.concat(inner))
  }
}

type Curried<T extends AnyFn> =
  T extends (a: infer A, b: infer B, c: infer C, d: infer D, ...rest: infer R) => infer Ret
    ? (a: A) => (b: B) => (c: C) => (d: D) => (...rest: R) => Ret
    : T extends (a: infer A, b: infer B, c: infer C, ...rest: infer R) => infer Ret
    ? (a: A) => (b: B) => (c: C) => (...rest: R) => Ret
    : T extends (a: infer A, b: infer B, ...rest: infer R) => infer Ret
    ? (a: A) => (b: B) => (...rest: R) => Ret
    : T extends (a: infer A, ...rest: infer R) => infer Ret
    ? (a: A) => (...rest: R) => Ret
    : T

export function curry<T extends AnyFn>(fn: T, arity?: number): Curried<T>
export function curry(fn: AnyFn, arity?: number): AnyFn {
  const len = arity ?? fn.length
  return function this_(this: any, ...args: any[]) {
    if (args.length < len) {
      return curry(subCurry(fn, ...args), len - args.length)
    }
    return fn.apply(this, args)
  }
}
