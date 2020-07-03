import { CharacterStatsComponent } from '../components/character-stats';
import { ActiveEffectsComponent } from '../components/effects';
import { Renderer } from '../renderer/renderer';
import { Vector } from '../spatial';
export declare function renderBodyPartInfo(renderer: Renderer, position: Vector, key: string, stats: CharacterStatsComponent, activeEffects: ActiveEffectsComponent): void;
export declare function renderPercentage(renderer: Renderer, position: Vector, key: string, value: number): void;
