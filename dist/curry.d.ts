type AnyFn = (...args: any[]) => any;
type Curried<T extends AnyFn> = T extends (a: infer A, b: infer B, c: infer C, d: infer D, ...rest: infer R) => infer Ret ? (a: A) => (b: B) => (c: C) => (d: D) => (...rest: R) => Ret : T extends (a: infer A, b: infer B, c: infer C, ...rest: infer R) => infer Ret ? (a: A) => (b: B) => (c: C) => (...rest: R) => Ret : T extends (a: infer A, b: infer B, ...rest: infer R) => infer Ret ? (a: A) => (b: B) => (...rest: R) => Ret : T extends (a: infer A, ...rest: infer R) => infer Ret ? (a: A) => (...rest: R) => Ret : T;
export declare function curry<T extends AnyFn>(fn: T, arity?: number): Curried<T>;
export {};
//# sourceMappingURL=curry.d.ts.map