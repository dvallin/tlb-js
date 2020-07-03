import { Feature } from '../components/feature';
declare const featuresDefinition: {
    wall: {
        character: string;
        diffuse: import("../renderer/color").Color;
        blocking: boolean;
        lightBlocking: boolean;
        name: string;
    };
    corridor: {
        character: string;
        diffuse: import("../renderer/color").Color;
        blocking: boolean;
        lightBlocking: boolean;
        name: string;
    };
    room: {
        character: string;
        diffuse: import("../renderer/color").Color;
        blocking: boolean;
        lightBlocking: boolean;
        name: string;
    };
    locker: {
        character: string;
        diffuse: import("../renderer/color").Color;
        blocking: boolean;
        lightBlocking: boolean;
        name: string;
    };
    trash: {
        character: string;
        diffuse: import("../renderer/color").Color;
        blocking: boolean;
        lightBlocking: boolean;
        name: string;
    };
    door: {
        character: string;
        diffuse: import("../renderer/color").Color;
        blocking: boolean;
        lightBlocking: boolean;
        name: string;
    };
    hub: {
        character: string;
        diffuse: import("../renderer/color").Color;
        blocking: boolean;
        lightBlocking: boolean;
        name: string;
    };
    player: {
        character: string;
        diffuse: import("../renderer/color").Color;
        blocking: boolean;
        lightBlocking: boolean;
        name: string;
    };
    loot: {
        character: string;
        diffuse: import("../renderer/color").Color;
        blocking: boolean;
        lightBlocking: boolean;
        name: string;
    };
    table: {
        character: string;
        diffuse: import("../renderer/color").Color;
        blocking: boolean;
        lightBlocking: boolean;
        name: string;
    };
    guard: Feature;
    eliteGuard: Feature;
};
export declare type FeatureType = keyof typeof featuresDefinition;
export declare const features: {
    [key in FeatureType]: Feature;
};
declare const generatorsDefinition: {
    block: (index: number) => {
        character: string;
        diffuse: import("../renderer/color").Color;
        blocking: boolean;
        lightBlocking: boolean;
        name: string;
    };
};
export declare type FeatureGeneratorsType = keyof typeof generatorsDefinition;
export declare const generators: {
    [key in FeatureGeneratorsType]: (index: number) => Feature;
};
export {};
