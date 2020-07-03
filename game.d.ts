import { TlbWorld } from './tlb';
import { State } from './game-states/state';
import { Renderer } from './renderer/renderer';
import { Queries } from './renderer/queries';
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
    constructor(world: TlbWorld, renderer: Renderer, targetFps: number);
    init(): void;
    execute(): void;
    private tick;
    readonly fps: number;
    readonly mspf: number;
    readonly msrpf: number;
    readonly mscpf: number;
    private pushState;
    private enterState;
}
