import { ComplexTemplate, ComplexDescription } from '../generative/complex-embedder';
import { RegionsType } from '../components/region';
declare const complexesDefinition: {
    [key: string]: ComplexTemplate;
};
export declare type ComplexesType = keyof typeof complexesDefinition;
export declare const complexes: {
    [key in ComplexesType]: ComplexTemplate;
};
export declare const regionParams: {
    [key in RegionsType]: ComplexDescription[];
};
export {};
