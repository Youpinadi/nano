export function split(separator: string | RegExp): (str: string) => string[]
export function split(separator: string | RegExp, str: string): string[]
export function split(separator: string | RegExp, str?: string) {
  if (str === undefined) return (str: string) => split(separator, str)
  return str.split(separator)
}

export function join(separator: string): (arr: string[]) => string
export function join(separator: string, arr: string[]): string
export function join(separator: string, arr?: string[]) {
  if (arr === undefined) return (arr: string[]) => join(separator, arr)
  return arr.join(separator)
}

export function reverse<T>(items: T[]): T[]
export function reverse(items: string): string
export function reverse(items: any): any {
  if (typeof items === 'string') {
    return items.split('').reverse().join('')
  }
  const result: any[] = []
  for (let i = items.length - 1; i >= 0; i--) {
    result.push(items[i])
  }
  return result
}
