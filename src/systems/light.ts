import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { PositionComponent } from '../components/position'
import { Queries } from '../renderer/queries'
import { LightComponent, LightingComponent } from '../components/light'
import { WorldMap, WorldMapResource } from '../resources/world-map'
import { Vector } from '../spatial'
import { Color } from '../renderer/color'
import { Entity } from '../ecs/entity'

export class Light implements TlbSystem {
  public readonly components: ComponentName[] = ['active', 'light', 'position']

  public constructor(public readonly queries: Queries) {}

  public update(world: TlbWorld, entity: Entity): void {
    const light = world.getComponent<LightComponent>(entity, 'light')!
    const position = world.getComponent<PositionComponent>(entity, 'position')!
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    this.queries.lighting(world, position.position, light.color, (pos: Vector, color: Color) => {
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
    const lighting = world.getComponent<LightingComponent>(entity, 'lighting') || {
      incomingLight: new Map(),
      incomingLightInFrame: new Map(),
    }
    lighting.incomingLightInFrame.set(light, color)
    world.editEntity(entity).withComponent('lighting', lighting)
  }
}
