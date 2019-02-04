import { FOV, Lighting } from 'rot-js'
import { TlbWorld } from '../tlb'
import { WorldMap } from '../resources/world-map'
import { Vector } from '../spatial'
import { Color } from './color'

export interface RayCaster {
  fov(world: TlbWorld, origin: Vector, callback: (pos: Vector) => void): void
  lighting(world: TlbWorld, origin: Vector, color: Color, callback: (pos: Vector, color: Color) => void): void
}

export class RotRayCaster implements RayCaster {
  public fov(world: TlbWorld, origin: Vector, callback: (pos: Vector) => void) {
    const map = world.getResource<WorldMap>('map')
    const fov = new FOV.RecursiveShadowcasting((x, y) => !map.isLightBlocking(world, new Vector(x, y)), { topology: 8 })
    fov.compute(origin.x, origin.y, 20, (x, y) => callback(new Vector(x, y)))
  }

  public lighting(world: TlbWorld, origin: Vector, color: Color, callback: (pos: Vector, color: Color) => void) {
    const map = world.getResource<WorldMap>('map')
    const fov = new FOV.RecursiveShadowcasting((x, y) => !map.isLightBlocking(world, new Vector(x, y)), { topology: 8 })
    const lighting = new Lighting((x, y) => (map.isLightBlocking(world, new Vector(x, y)) ? 0.0 : 1.0), { passes: 1 })
    lighting.setLight(origin.x, origin.y, color.color)
    lighting.setFOV(fov)
    lighting.compute((x: number, y: number, c: [number, number, number]) => {
      callback(new Vector(x, y), new Color(c))
    })
  }
}
