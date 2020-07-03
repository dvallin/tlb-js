import { ComplexTemplate, ComplexDescription, StructureRestriction, CharacterCreator } from '../generative/complex-embedder';
import { RegionsType } from '../components/region';
declare const complexesDefinition: {
    anEncounter: {
        structures: {
            description: {
                decorations: import("../generative/complex-embedder").Spawn<"locker" | "trash" | "door" | "loot" | "table" | "generator">[];
                containers: import("../generative/complex-embedder").Spawn<"locker" | "trash" | "door" | "loot" | "table" | "generator">[];
                loots: import("../generative/complex-embedder").Spawn<"rifle" | "bandages" | "nailGun" | "sniperRifle" | "deathPill" | "leatherJacket" | "bootsOfStriding" | "idCard">[];
                npcs: import("../generative/complex-embedder").Spawn<CharacterCreator>[];
                bosses: import("../generative/complex-embedder").Spawn<CharacterCreator>[];
            };
            restriction: Partial<StructureRestriction>;
        }[];
    };
    guardsStation: {
        structures: {
            description: {
                decorations: never[];
                containers: import("../generative/complex-embedder").Spawn<"locker" | "trash" | "door" | "loot" | "table" | "generator">[];
                loots: import("../generative/complex-embedder").Spawn<"rifle" | "bandages" | "nailGun" | "sniperRifle" | "deathPill" | "leatherJacket" | "bootsOfStriding" | "idCard">[];
                npcs: import("../generative/complex-embedder").Spawn<CharacterCreator>[];
                bosses: never[];
            };
            restriction: Partial<StructureRestriction>;
        }[];
    };
    generators: {
        structures: {
            description: {
                decorations: import("../generative/complex-embedder").Spawn<"locker" | "trash" | "door" | "loot" | "table" | "generator">[];
                containers: import("../generative/complex-embedder").Spawn<"locker" | "trash" | "door" | "loot" | "table" | "generator">[];
                loots: import("../generative/complex-embedder").Spawn<"rifle" | "bandages" | "nailGun" | "sniperRifle" | "deathPill" | "leatherJacket" | "bootsOfStriding" | "idCard">[];
                npcs: never[];
                bosses: never[];
            };
            restriction: Partial<StructureRestriction>;
        }[];
    };
};
export declare type ComplexesType = keyof typeof complexesDefinition;
export declare const complexes: {
    [key in ComplexesType]: ComplexTemplate;
};
export declare const regionParams: {
    [key in RegionsType]: ComplexDescription[];
};
export {};
