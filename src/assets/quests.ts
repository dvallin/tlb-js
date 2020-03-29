import { DialogType } from './dialogs'

export interface Quest {
  name: string
  startText: string
  start: DialogType
}

function quest(name: string, start: DialogType, startText: string): Quest {
  return { name, start, startText }
}

const questDefintions = {
  quest1: quest('quest1', 'startQuest1', 'something you want?'),
}
export type QuestType = keyof typeof questDefintions
export const quests: { [key in QuestType]: Quest } = questDefintions
