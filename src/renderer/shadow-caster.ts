import { FOV } from 'rot-js'
import { TlbWorld } from '../tlb'
import { WorldMap } from '../resources/world-map'
import { Vector } from '../spatial'

export interface ShadowCaster {
  calculate(world: TlbWorld, origin: Vector, callback: (pos: Vector) => void): void
}

export class RotShadowCaster implements ShadowCaster {
  public calculate(world: TlbWorld, origin: Vector, callback: (pos: Vector) => void) {
    const map = world.getResource<WorldMap>('map')
    const fov = new FOV.RecursiveShadowcasting((x, y) => !map.isLightBlocking(world, new Vector(x, y)), { topology: 8 })
    fov.compute(origin.x, origin.y, 20, (x, y) => callback(new Vector(x, y)))
  }
}
