import { DialogType } from './dialogs'

export interface Lore {
  name: string
  start: DialogType
  startText: string
}

function lore(name: string, start: DialogType, startText: string): Lore {
  return { name, start, startText }
}

const loreDefinitions = {
  lore1: lore('lore1', 'startLore1', 'lore.txt'),
}
export type LoreType = keyof typeof loreDefinitions
export const lores: { [key in LoreType]: Lore } = loreDefinitions
