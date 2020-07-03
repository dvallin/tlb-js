import { Feature } from '../components/feature';
declare const featuresDefinition: {
    wall: Feature;
    corridor: Feature;
    room: Feature;
    hub: Feature;
    locker: Feature;
    trash: Feature;
    urinal: Feature;
    door: Feature;
    yellow_player: Feature;
    green_player: Feature;
    blue_player: Feature;
    red_player: Feature;
    loot: Feature;
    table: Feature;
    civilian: Feature;
    guard: Feature;
    eliteGuard: Feature;
    terminal: Feature;
    core: Feature;
};
export declare type FeatureType = keyof typeof featuresDefinition;
export declare const features: {
    [key in FeatureType]: Feature;
};
declare const generatorsDefinition: {
    [key: string]: (index: number) => Feature | undefined;
};
export declare type FeatureGeneratorsType = keyof typeof generatorsDefinition;
export declare const generators: {
    [key in FeatureGeneratorsType]: (index: number) => Feature | undefined;
};
export {};
