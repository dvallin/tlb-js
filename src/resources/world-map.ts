import { DiscreteSpace, Vector, Space } from '../spatial'
import { Entity } from '../ecs/entity'
import { ResourceName, TlbResource, TlbWorld } from '../tlb'
import { FeatureComponent, features } from '../components/feature'
import { Shape } from '../geometry/shape'
import { SetSpace, DiscreteSetSpace } from '../spatial/set-space'
import { FovComponent } from '../components/fov'
import { Rectangle } from '../geometry/rectangle'

export class WorldMap implements TlbResource {
  public readonly kind: ResourceName = 'map'

  public readonly tiles: Space<Entity> = new DiscreteSpace<Entity>()
  public readonly characters: Space<Entity> = new DiscreteSpace<Entity>()

  public boundaries = new Rectangle(0, 0, 0, 0)

  public visible: SetSpace = new DiscreteSetSpace()
  public readonly discovered: SetSpace = new DiscreteSetSpace()

  public constructor() {}

  public update(world: TlbWorld): void {
    this.visible = new DiscreteSetSpace()
    world.components.get('player')!.foreach(player => {
      const fov = world.getComponent<FovComponent>(player, 'fov')
      if (fov !== undefined) {
        fov.fov.forEach(p => {
          this.visible.set(p)
          this.discovered.set(p)
        })
      }
    })
  }

  public setTile(position: Vector, entity: Entity): void {
    this.tiles.set(position, entity)
    this.boundaries = this.boundaries.cover(position)
  }
  public setCharacter(position: Vector, entity: Entity): void {
    this.characters.set(position, entity)
    this.boundaries = this.boundaries.cover(position)
  }
  public getTile(position: Vector): Entity | undefined {
    return this.tiles.get(position)
  }
  public getCharacter(position: Vector): Entity | undefined {
    return this.characters.get(position)
  }
  public removeTile(position: Vector): Entity | undefined {
    return this.tiles.remove(position)
  }
  public removeCharacter(position: Vector): Entity | undefined {
    return this.characters.remove(position)
  }

  public isTileBlocking(world: TlbWorld, position: Vector): boolean {
    return this.tileMatches(world, position, f => {
      if (f === undefined) {
        return true
      }
      return features[f.type].blocking
    })
  }

  public isDiscovered(position: Vector): boolean {
    return this.discovered.has(position)
  }

  public isLightBlocking(world: TlbWorld, position: Vector): boolean {
    return this.tileMatches(world, position, f => {
      if (f === undefined) {
        return true
      }
      return features[f.type].lightBlocking
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

  public isShapeBlocked(world: TlbWorld, shape: Shape): boolean {
    return this.shapeHasSome(world, shape, f => f !== undefined)
  }

  public shapeHasAll(world: TlbWorld, shape: Shape, predicate: (f: FeatureComponent | undefined) => boolean): boolean {
    return shape.all(p => this.tileMatches(world, p, predicate))
  }

  public shapeHasSome(world: TlbWorld, shape: Shape, predicate: (f: FeatureComponent | undefined) => boolean): boolean {
    return shape.some(p => this.tileMatches(world, p, predicate))
  }
}
