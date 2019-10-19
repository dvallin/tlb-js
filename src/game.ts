import { TlbWorld, registerComponents, registerSystems, registerResources } from './tlb'
import { State } from './game-states/state'
import { Running } from './game-states/running'
import { MapCreation } from './game-states/map-creation'

import { Renderer } from './renderer/renderer'
import { Queries } from './renderer/queries'

export class Game {
  public computeTime: number = 0
  public frames: number = 0
  public renderTime: number = 0
  public started: number = 0
  public states: State[] = []

  public rayCaster = new Queries()

  public constructor(private readonly world: TlbWorld, public readonly renderer: Renderer, private readonly targetFps: number) {}

  public init(): void {
    registerComponents(this.world)
    registerResources(this.world, this.renderer)
    registerSystems(this.world, this.rayCaster, s => this.pushState(s))
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

    // update all resources (io, clipping, etc...) and render afterwards
    const startRender = Date.now()
    this.world.updateResources()
    this.renderer.render(this.world)
    const renderDelta = Date.now() - startRender
    msLeft -= renderDelta
    this.renderTime += renderDelta

    state.update(this.world, s => this.pushState(s))
    while (true) {
      const start = Date.now()
      this.world.updateSystems()
      const delta = Date.now() - start
      msLeft -= delta
      this.computeTime += delta

      if (state.isFrameLocked() || state.isDone(this.world) || msLeft < delta) {
        break
      }
    }

    if (state.isDone(this.world)) {
      state.stop(this.world)
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
      this.computeTime = 0
      this.renderTime = 0
      this.started = Date.now()
    }

    requestAnimationFrame(() => this.tick())
  }

  public get fps(): number {
    return this.frames / ((Date.now() - this.started) / 1000)
  }

  public get mspf(): number {
    return (this.computeTime + this.renderTime) / this.frames
  }

  public get msrpf(): number {
    return this.renderTime / this.frames
  }

  public get mscpf(): number {
    return this.computeTime / this.frames
  }

  private pushState(state: State): void {
    this.states.push(state)
    this.enterState()
  }

  private enterState(): void {
    this.states[this.states.length - 1].start(this.world)
  }
}
