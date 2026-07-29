export const testArray = ['wizard', 'potion', 'dragon']

export const testObject: Record<string, string> = {
  hero: 'wizard',
  loot: 'potion',
  foe: 'dragon',
}

export interface Hero {
  name: string
  class: string
  level: number
  realm: string
  pet: string
}

export const heroes: Hero[] = [
  { name: 'Luna', class: 'mage', level: 34, realm: 'Avalon', pet: 'owl' },
  { name: 'Ragnar', class: 'warrior', level: 25, realm: 'Avalon', pet: 'wolf' },
  { name: 'Zara', class: 'rogue', level: 25, realm: 'Shadowfen', pet: 'cat' },
  { name: 'Thorn', class: 'warrior', level: 56, realm: 'Shadowfen', pet: 'bear' },
  { name: 'Elara', class: 'mage', level: 25, realm: 'Shadowfen', pet: 'owl' },
  { name: 'Brock', class: 'paladin', level: 32, realm: 'Avalon', pet: 'horse' },
]
