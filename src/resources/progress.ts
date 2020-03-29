import { ResourceName, TlbResource, TlbWorld } from '../tlb'
import { Renderer } from '../renderer/renderer'
import { LoreType } from '../assets/lores'
import { LogResource, Log } from './log'
import { QuestType } from '../assets/quests'

export interface Progress {
  readonly unlockedLore: Set<LoreType>

  unlockLore(world: TlbWorld, lore: LoreType): void
  startQuest(world: TlbWorld, quest: QuestType): void
}

export class ProgressResource implements TlbResource, Progress {
  public readonly kind: ResourceName = 'progress'

  public readonly unlockedLore: Set<LoreType> = new Set()
  public readonly activeQuests: Set<QuestType> = new Set()

  public update({}: TlbWorld): void {}

  public render({}: Renderer): void {}

  public unlockLore(world: TlbWorld, lore: LoreType): void {
    this.unlockedLore.add(lore)
    const log: Log = world.getResource<LogResource>('log')
    log.text(`You unlocked ${lore}!`)
  }

  public startQuest(world: TlbWorld, quest: QuestType): void {
    this.activeQuests.add(quest)
    const log: Log = world.getResource<LogResource>('log')
    log.text(`You started quest ${quest}!`)
  }
}
