import { CharacterStatsComponent } from '../components/character-stats';
import { Entity } from '../ecs/entity';
import { TlbWorld } from '../tlb';
export declare function damageBodyPart(world: TlbWorld, source: Entity, target: Entity, stats: CharacterStatsComponent, bodyPartName: string, damage: number): void;
export declare function healBodyPart(stats: CharacterStatsComponent, bodyPartName: string, damage: number): void;
export declare function kill(world: TlbWorld, entity: Entity): void;
