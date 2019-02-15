import { FOV, Lighting } from 'rot-js'
import { TlbWorld } from '../tlb'
import { WorldMap, WorldMapResource } from '../resources/world-map'
import { Vector } from '../spatial'
import { Color } from './color'

export interface RayCaster {
  fov(world: TlbWorld, origin: Vector, callback: (pos: Vector, distance: number) => void): void
  lighting(world: TlbWorld, origin: Vector, color: Color, callback: (pos: Vector, color: Color) => void): void
}

export class RotRayCaster implements RayCaster {
  public fov(world: TlbWorld, origin: Vector, callback: (pos: Vector, distance: number) => void) {
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const fov = new FOV.RecursiveShadowcasting((x, y) => !map.isLightBlocking(world, new Vector(x, y)), { topology: 8 })
    const seenAlready = new Set<string>()
    fov.compute(origin.x, origin.y, 20, (x, y, distance) => {
      const position = new Vector(x, y)
      const key = position.key
      if (!seenAlready.has(key)) {
        seenAlready.add(key)
        callback(position, distance)
      }
    })
  }

  public lighting(world: TlbWorld, origin: Vector, color: Color, callback: (pos: Vector, color: Color) => void) {
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const fov = new FOV.RecursiveShadowcasting((x, y) => !map.isLightBlocking(world, new Vector(x, y)), { topology: 8 })
    const lighting = new Lighting((x, y) => (map.isLightBlocking(world, new Vector(x, y)) ? 0.0 : 1.0), { passes: 1 })
    lighting.setLight(origin.x, origin.y, color.color)
    lighting.setFOV(fov)
    lighting.setOptions({ range: 6 })
    lighting.compute((x: number, y: number, c: [number, number, number]) => {
      callback(new Vector(x, y), new Color(c))
    })
  }
}
