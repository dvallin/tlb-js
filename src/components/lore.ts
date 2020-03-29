import { LoreType } from '../assets/lores'
import { TlbWorld } from '../tlb'
import { Random } from '../random'
import { DialogType } from '../assets/dialogs'

export interface LoreComponent {
  type: LoreType
}

export function sampleLoreForDialog(_world: TlbWorld, _random: Random, dialog: DialogType): LoreType | undefined {
  if (dialog === 'terminal') {
    return 'lore1'
  }
  return undefined
}
