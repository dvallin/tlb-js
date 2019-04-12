import { TlbWorld } from '../tlb'
import { AbstractState } from './state'

import { RegionComponent } from '../components/region'

import { Rectangle } from '../geometry/rectangle'
import { Entity } from '../ecs/entity'
import { PositionComponent } from '../components/position'
import { WorldMap, WorldMapResource } from '../resources/world-map'
import { FunctionalShape } from '../geometry/functional-shape'
import { createFeature } from '../components/feature'
import { ViewportResource, Viewport } from '../resources/viewport'

export class MapCreation extends AbstractState {
  private startRegion: Entity | undefined

  public constructor() {
    super(['region-creator', 'agent'])
  }

  public start(world: TlbWorld): void {
    super.start(world)

    const viewport: Viewport = world.getResource<ViewportResource>('viewport')
    viewport.addLayer({
      getRenderable: (world, position) => {
        const map = world.getResource<WorldMapResource>('map')
        const entity = map.getTile(position.floor())
        return { entity, opaque: true, centered: true }
      },
      transformed: true,
    })
    viewport.addLayer({
      getRenderable: (world, position) => {
        const map = world.getResource<WorldMapResource>('map')
        const entity = map.getCharacter(position.floor())
        return { entity, opaque: true, centered: false }
      },
      transformed: true,
    })

    this.startRegion = world
      .createEntity()
      .withComponent<RegionComponent>('region', {
        shape: new Rectangle(0, 0, 50, 50),
        landmarks: [],
      })
      .withComponent('active', {}).entity
  }

  public update({  }: TlbWorld): void {}

  public stop(world: TlbWorld): void {
    super.stop(world)
    if (this.startRegion !== undefined) {
      const region = world.getComponent<RegionComponent>(this.startRegion, 'region')!
      const position = region.landmarks[0].shape.bounds().center
      world
        .createEntity()
        .withComponent<PositionComponent>('position', { position })
        .withComponent('spawn', {})
    }
    this.fillWalls(world)
  }

  public isFrameLocked(): boolean {
    return false
  }

  private fillWalls(world: TlbWorld) {
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    map.boundaries.grow().foreach(p => {
      if (map.getTile(p) === undefined && map.isShapeBlocked(world, FunctionalShape.lN(p, 1))) {
        createFeature(world, map, p, 'wall')
      }
    })
  }
}
