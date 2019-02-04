import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { PositionComponent } from '../components/position'
import { RayCaster } from '../renderer/ray-caster'
import { LightComponent, LightingComponent } from '../components/light'
import { WorldMap } from '../resources/world-map'
import { Vector } from '../spatial'
import { Color } from '../renderer/color'
import { Entity } from '../ecs/entity'

export class Light implements TlbSystem {
  public readonly components: ComponentName[] = ['active', 'light', 'position']

  public constructor(public readonly rayCaster: RayCaster) {}

  public update(world: TlbWorld, entity: Entity): void {
    const light = world.getComponent<LightComponent>(entity, 'light')!
    const position = world.getComponent<PositionComponent>(entity, 'position')!
    const map = world.getResource<WorldMap>('map')
    this.rayCaster.lighting(world, position.position.floor(), light.color, (pos: Vector, color: Color) => {
      const tile = map.getTile(pos)
      if (tile !== undefined) {
        this.addLight(world, tile, entity, color)
      }
      const character = map.getCharacter(pos)
      if (character !== undefined) {
        this.addLight(world, character, entity, color)
      }
    })
  }

  public addLight(world: TlbWorld, entity: Entity, light: Entity, color: Color) {
    const lighting = world.getComponent<LightingComponent>(entity, 'lighting') || { incomingLight: new Map() }
    lighting.incomingLight.set(light, color)
    world.editEntity(entity).withComponent('lighting', lighting)
  }
}
