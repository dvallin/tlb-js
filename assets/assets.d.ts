import { Asset } from '../components/asset';
declare const assetsDefinition: {
    door: Asset;
    locker: Asset;
    trash: Asset;
    loot: Asset;
    table: Asset;
    generator: Asset;
    elevator: Asset;
    terminal: Asset;
    urinal: Asset;
    core: Asset;
};
export declare type AssetType = keyof typeof assetsDefinition;
export declare const assets: {
    [key in AssetType]: Asset;
};
export {};
