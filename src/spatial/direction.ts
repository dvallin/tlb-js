export type Direction = 'up' | 'right' | 'down' | 'left'

export const directions: Direction[] = ['up', 'right', 'down', 'left']

export function leftOf(direction: Direction): Direction {
  switch (direction) {
    case 'up':
      return 'left'
    case 'right':
      return 'up'
    case 'down':
      return 'right'
    case 'left':
      return 'down'
  }
}

export function rightOf(direction: Direction): Direction {
  switch (direction) {
    case 'up':
      return 'right'
    case 'right':
      return 'down'
    case 'down':
      return 'left'
    case 'left':
      return 'up'
  }
}
export function oppositeOf(direction: Direction): Direction {
  switch (direction) {
    case 'up':
      return 'down'
    case 'right':
      return 'left'
    case 'down':
      return 'up'
    case 'left':
      return 'right'
  }
}
