import { ResourceName, TlbResource, TlbWorld } from '../tlb';
import { Renderer } from '../renderer/renderer';
import { LoreType } from '../assets/lores';
import { QuestType } from '../assets/quests';
export interface Progress {
    readonly unlockedLore: Set<LoreType>;
    unlockLore(world: TlbWorld, lore: LoreType): void;
    startQuest(world: TlbWorld, quest: QuestType): void;
}
export declare class ProgressResource implements TlbResource, Progress {
    readonly kind: ResourceName;
    readonly unlockedLore: Set<LoreType>;
    readonly activeQuests: Set<QuestType>;
    update({}: TlbWorld): void;
    render({}: Renderer): void;
    unlockLore(world: TlbWorld, lore: LoreType): void;
    startQuest(world: TlbWorld, quest: QuestType): void;
}
