import { dropAt } from '../array-utils'
import { Random } from '../random'

export function retry<T>(random: Random, arr: T[], f: (v: T) => boolean) {
  let tries = 5
  while (arr.length > 0 && tries > 0) {
    const index = random.pickIndex(arr)
    if (f(arr[index])) {
      dropAt(arr, index)
      tries = 5
    } else {
      tries--
    }
  }
}
