import { Vector } from '../spatial';
import { TlbWorld } from '../tlb';
import { Entity } from '../ecs/entity';
import { WorldMap } from '../resources/world-map';
import { Shape } from '../geometry/shape';
import { Feature } from './feature';
import { AssetType } from '../assets/assets';
import { FeatureType } from '../assets/features';
import { Direction } from '../spatial/direction';
import { DialogType } from '../assets/dialogs';
import { Random } from '../random';
export interface AssetComponent {
    type: AssetType;
}
export interface Asset {
    name: string;
    size: Vector;
    hasInventory: boolean;
    dialog: DialogType | undefined;
    feature: (index: number) => Feature | undefined;
}
export interface PlacedAsset {
    type: AssetType;
    tiles: {
        position: Vector;
        feature: FeatureType;
    }[];
}
export declare function shapeOfAsset(type: AssetType, position: Vector, direction: Direction): Shape;
export declare function createAsset(world: TlbWorld, random: Random, level: number, position: Vector, direction: Direction, type: AssetType): Entity;
export declare function createAssetFromShape(world: TlbWorld, random: Random, level: number, shape: Shape, type: AssetType): Entity;
export declare function removeAsset(world: TlbWorld, map: WorldMap, entity: Entity): void;
