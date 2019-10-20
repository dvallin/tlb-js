import { TlbWorld } from '../tlb'
import { AbstractState } from './state'

import { RegionComponent } from '../components/region'

import { Rectangle } from '../geometry/rectangle'
import { Entity } from '../ecs/entity'
import { PositionComponent } from '../components/position'
import { WorldMap, WorldMapResource } from '../resources/world-map'
import { FunctionalShape } from '../geometry/functional-shape'
import { FeatureComponent, createFeatureFromType } from '../components/feature'
import { ViewportResource, Viewport } from '../resources/viewport'

export class MapCreation extends AbstractState {
  private startRegion: Entity | undefined

  public constructor() {
    super('map-creation', ['region-creator'])
  }

  public start(world: TlbWorld): void {
    super.start(world)

    const viewport: Viewport = world.getResource<ViewportResource>('viewport')
    const map = world.getResource<WorldMapResource>('map')
    viewport.addLayer({
      getRenderable: (_world, level, position) => {
        const entity = map.levels[level].getTile(position)
        return { entity, opaque: true, centered: true }
      },
      transformed: true,
    })
    viewport.addLayer({
      getRenderable: (_world, level, position) => {
        const entity = map.levels[level].getCharacter(position)
        return { entity, opaque: true, centered: false }
      },
      transformed: true,
    })

    this.startRegion = world
      .createEntity()
      .withComponent<RegionComponent>('region', {
        type: 'red',
        shape: new Rectangle(0, 0, 50, 50),
        level: 0,
        entry: undefined,
      })
      .withComponent('active', {}).entity
  }

  public update({  }: TlbWorld): void {}

  public stop(world: TlbWorld): void {
    super.stop(world)
    if (this.startRegion !== undefined) {
      const region = world.getComponent<RegionComponent>(this.startRegion, 'region')!
      world
        .createEntity()
        .withComponent<PositionComponent>('position', { level: region.level, position: region.entry! })
        .withComponent('spawn', {})
    }
    this.fillWalls(world)
  }

  public isFrameLocked(): boolean {
    return false
  }

  private fillWalls(world: TlbWorld) {
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    map.levels.forEach((region, index) => {
      region.boundary.foreach(p => {
        const someTileExists = FunctionalShape.lN(p, 1, false).some(p1 => {
          const e = region.getTile(p1)
          return e !== undefined && world.getComponent<FeatureComponent>(e, 'feature')!.feature().name !== 'wall'
        })
        if (region.getTile(p) === undefined && someTileExists) {
          createFeatureFromType(world, map, index, p, 'wall')
        }
      })
    })
  }
}
