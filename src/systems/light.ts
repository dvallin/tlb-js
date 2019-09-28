import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { PositionComponent } from '../components/position'
import { Queries } from '../renderer/queries'
import { LightComponent, getLighting } from '../components/light'
import { WorldMapResource } from '../resources/world-map'
import { Vector } from '../spatial'
import { Color } from '../renderer/color'
import { Entity } from '../ecs/entity'

export class Light implements TlbSystem {
  public readonly components: ComponentName[] = ['active', 'light', 'position']

  public constructor(public readonly queries: Queries) {}

  public update(world: TlbWorld, entity: Entity): void {
    const light = world.getComponent<LightComponent>(entity, 'light')!
    const position = world.getComponent<PositionComponent>(entity, 'position')!
    const level = world.getResource<WorldMapResource>('map').levels[position.level]
    this.queries.lighting(world, position.level, position.position, light.color, (pos: Vector, color: Color) => {
      const tile = level.getTile(pos)
      if (tile !== undefined) {
        this.addLight(world, tile, entity, color)
      }
      const character = level.getCharacter(pos)
      if (character !== undefined) {
        this.addLight(world, character, entity, color)
      }
    })
  }

  public addLight(world: TlbWorld, entity: Entity, light: Entity, color: Color) {
    const lighting = getLighting(world, entity)
    lighting.incomingLightInFrame.set(light, color)
    world.editEntity(entity).withComponent('lighting', lighting)
  }
}
