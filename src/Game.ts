import { World } from './ecs/world'
import { TlbWorld, registerComponents, registerSystems, registerResources } from './tlb'
import { State } from './game-states/state'
import { Running } from './game-states/running'
import { MapCreation } from './game-states/map-creation'

export class Game {
  public compute: number = 0
  public render: number = 0
  public started: number = 0
  public frames: number = 0
  public states: State[] = []

  public constructor(private readonly world: TlbWorld = new World(), private readonly targetFps: number = 60) {}

  public init(): void {
    registerComponents(this.world)
    registerResources(this.world)
    registerSystems(this.world)
    const running = new Running()
    const mapCreation = new MapCreation()
    this.states = [running, mapCreation]
  }

  public execute(): void {
    this.enterState()
    this.started = Date.now()
    this.tick()
  }

  private tick(): void {
    const state = this.states[this.states.length - 1]
    let msLeft = 1000 / this.targetFps

    // update all resources (io, clipping, rendering, etc...)
    const startRender = Date.now()
    this.world.updateResources()
    const renderDelta = Date.now() - startRender
    msLeft -= renderDelta
    this.render += renderDelta

    // execute the world
    while (true) {
      const start = Date.now()
      this.world.updateSystems()
      const delta = Date.now() - start
      msLeft -= delta
      this.compute += delta

      if (state.isFrameLocked() || state.isDone(this.world) || msLeft < delta) {
        break
      }
    }

    if (state.isDone(this.world)) {
      this.states.pop()
      if (this.states.length === 0) {
        return
      }
      this.enterState()
    }

    this.frames++
    if (this.frames % 100 === 0) {
      console.log(`${this.mspf.toFixed(2)} ms per frame @${this.fps.toFixed(1)} FPS`)
      console.log(`(computation, rendering) = (${this.mscpf.toFixed(2)}, ${this.msrpf.toFixed(2)}) ms`)
      console.log(`Entities: ${this.world.entityCount}`)
      this.frames = 0
      this.compute = 0
      this.render = 0
      this.started = Date.now()
    }

    setTimeout(() => this.tick(), msLeft)
  }

  public get fps(): number {
    return this.frames / ((Date.now() - this.started) / 1000)
  }

  public get mspf(): number {
    return (this.compute + this.render) / this.frames
  }

  public get msrpf(): number {
    return this.render / this.frames
  }

  public get mscpf(): number {
    return this.compute / this.frames
  }

  private enterState(): void {
    const nextState = this.states[this.states.length - 1]
    nextState.start(this.world)
  }
}
