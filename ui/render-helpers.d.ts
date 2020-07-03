import { CharacterStatsComponent } from '../components/character-stats';
import { Renderer } from '../renderer/renderer';
import { Vector } from '../spatial';
export declare function renderHealth(renderer: Renderer, position: Vector, stats: CharacterStatsComponent): void;
export declare function renderPercentage(renderer: Renderer, position: Vector, key: string, value: number): void;
