export const testArray = ['test', 'hello', 'hi']

export const testObject: Record<string, string> = {
  key1: 'test',
  key2: 'hello',
  key3: 'hi',
}

export interface Person {
  name: string
  gender: string
  age: number
  country: string
}

export const testComplexArray: Person[] = [
  { name: 'Nadir', gender: 'male', age: 34, country: 'France' },
  { name: 'Eric', gender: 'male', age: 25, country: 'France' },
  { name: 'Bob', gender: 'male', age: 25, country: 'United States' },
  { name: 'Eric', gender: 'male', age: 56, country: 'United States' },
  { name: 'Jenny', gender: 'female', age: 25, country: 'United States' },
  { name: 'Roberta', gender: 'female', age: 32, country: 'United States' },
]
