import { DiscreteSpace, Vector, Space } from '../spatial'
import { Entity } from '../ecs/entity'
import { ResourceName, TlbResource, TlbWorld } from '../tlb'
import { FeatureComponent, features } from '../components/feature'
import { Shape } from '../geometry/shape'

export class WorldMap implements TlbResource {
  public readonly kind: ResourceName = 'map'

  public readonly tiles: Space<Entity> = new DiscreteSpace<Entity>()
  public readonly characters: Space<Entity> = new DiscreteSpace<Entity>()

  public constructor(public readonly boundary: Vector) {}

  public update({  }: TlbWorld): void {
    return
  }

  public isValid(position: Vector): boolean {
    return this.boundary.bounds(position)
  }

  public isTileBlocking(world: TlbWorld, position: Vector): boolean {
    return this.tileMatches(world, position, f => {
      if (f === undefined) {
        return true
      }
      return features[f.type].blocking
    })
  }

  public tileMatches(world: TlbWorld, position: Vector, predicate: (f: FeatureComponent | undefined) => boolean): boolean {
    const entity = this.tiles.get(position)
    let feature: FeatureComponent | undefined
    if (entity !== undefined) {
      feature = world.getComponent<FeatureComponent>(entity, 'feature')
    }
    return predicate(feature)
  }

  public isShapeFree(world: TlbWorld, shape: Shape): boolean {
    return this.shapeHasAll(world, shape, f => f === undefined)
  }

  public shapeHasAll(world: TlbWorld, shape: Shape, predicate: (f: FeatureComponent | undefined) => boolean): boolean {
    return shape.all(p => this.tileMatches(world, p, predicate))
  }

  public shapeHasSome(world: TlbWorld, shape: Shape, predicate: (f: FeatureComponent | undefined) => boolean): boolean {
    return shape.some(p => this.tileMatches(world, p, predicate))
  }
}
