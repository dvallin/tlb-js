import { TlbWorld } from './tlb';
import { State } from './game-states/state';
import { Renderer } from './renderer/renderer';
import { Queries } from './renderer/queries';
import { Uniform } from './random/distributions';
export declare class Game {
    private readonly world;
    readonly renderer: Renderer;
    private readonly targetFps;
    computeTime: number;
    frames: number;
    renderTime: number;
    started: number;
    currentState: number;
    states: State[];
    rayCaster: Queries;
    uniform: Uniform;
    constructor(world: TlbWorld, renderer: Renderer, targetFps: number);
    init(): void;
    execute(): void;
    private tick;
    get fps(): number;
    get mspf(): number;
    get msrpf(): number;
    get mscpf(): number;
    private pushState;
    private enterState;
}
