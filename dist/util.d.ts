export declare function prop<K extends keyof any>(key: K): <T extends Record<K, any>>(obj: T) => T[K];
export declare function prop<K extends keyof any, T extends Record<K, any>>(key: K, obj: T): T[K];
export declare function propEq<K extends keyof any>(key: K, value: any): <T extends Record<K, any>>(obj: T) => boolean;
export declare function propEq<K extends keyof any, T extends Record<K, any>>(key: K, value: any, obj: T): boolean;
export declare function propEqInv(value: any, key: string): (obj: Record<string, any>) => boolean;
export declare function propEqInv(value: any, key: string, obj: Record<string, any>): boolean;
export declare function log<T>(item: T): T;
export declare function length(items: {
    length: number;
}): number;
export declare function sum(items: number[]): number;
//# sourceMappingURL=util.d.ts.map