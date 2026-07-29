export function prop<K extends keyof any>(key: K): <T extends Record<K, any>>(obj: T) => T[K]
export function prop<K extends keyof any, T extends Record<K, any>>(key: K, obj: T): T[K]
export function prop<K extends keyof any, T extends Record<K, any>>(key: K, obj?: T) {
  if (obj === undefined) return (obj: T) => prop(key, obj)
  return obj[key]
}

export function propEq<K extends keyof any>(key: K, value: any): <T extends Record<K, any>>(obj: T) => boolean
export function propEq<K extends keyof any, T extends Record<K, any>>(key: K, value: any, obj: T): boolean
export function propEq<K extends keyof any, T extends Record<K, any>>(key: K, value: any, obj?: T) {
  if (obj === undefined) return (obj: T) => propEq(key, value, obj)
  return obj[key] == value
}

export function propEqInv(value: any, key: string): (obj: Record<string, any>) => boolean
export function propEqInv(value: any, key: string, obj: Record<string, any>): boolean
export function propEqInv(value: any, key: string, obj?: Record<string, any>) {
  if (obj === undefined) return (obj: Record<string, any>) => propEqInv(value, key, obj)
  return obj[key] == value
}

export function log<T>(item: T): T
export function log<T>(item: T) {
  console.log(item)
  return item
}

export function length(items: { length: number }): number {
  return items.length
}

export function sum(items: number[]): number;
export function sum(items: number[]) {
  let total = 0
  for (let i = 0; i < items.length; i++) {
    total += items[i]
  }
  return total
}
