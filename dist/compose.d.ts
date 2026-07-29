type Predicate<T> = (value: T) => boolean;
export declare function compose<A, B, C>(f: (x: B) => C, g: (x: A) => B): (x: A) => C;
export declare function compose<A, B, C, D>(f: (x: C) => D, g: (x: B) => C, h: (x: A) => B): (x: A) => D;
export declare function compose<A, B, C, D, E>(f: (x: D) => E, g: (x: C) => D, h: (x: B) => C, i: (x: A) => B): (x: A) => E;
export declare function pipe<A, B>(f: (x: A) => B): (x: A) => B;
export declare function pipe<A, B, C>(f: (x: A) => B, g: (x: B) => C): (x: A) => C;
export declare function pipe<A, B, C, D>(f: (x: A) => B, g: (x: B) => C, h: (x: C) => D): (x: A) => D;
export declare function pipe<A, B, C, D, E>(f: (x: A) => B, g: (x: B) => C, h: (x: C) => D, i: (x: D) => E): (x: A) => E;
export declare function or<T>(...predicates: Array<Predicate<T>>): Predicate<T>;
export declare function and<T>(...predicates: Array<Predicate<T>>): Predicate<T>;
export {};
//# sourceMappingURL=compose.d.ts.map