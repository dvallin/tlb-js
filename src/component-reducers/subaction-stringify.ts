import { Movement, Attack, Status } from '../components/action'

export function subactionStringify(subAction: Movement | Attack | Status): string {
  switch (subAction.kind) {
    case 'movement':
      return `${subAction.kind} ${subAction.range}`
    case 'attack':
      const damage = subAction.effects.filter(e => e.type === 'damage')[0].value!
      const other = subAction.effects.filter(e => e.type !== 'damage').map(e => (e.negated ? '-' : '+' + e.type[0]))
      return `${subAction.kind} ${damage} ${other}`
    case 'status':
      return subAction.effects.map(e => (e.negated ? '-' : '+' + e.type[0])).join(' ')
  }
}
