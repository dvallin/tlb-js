import { DiscreteSpace, Vector, Space, StackedSpace, DiscreteStackedSpace } from '../spatial'
import { Entity } from '../ecs/entity'
import { ResourceName, TlbResource, TlbWorld } from '../tlb'
import { FeatureComponent, features } from '../components/feature'
import { Shape } from '../geometry/shape'
import { SetSpace, DiscreteSetSpace } from '../spatial/set-space'
import { FovComponent } from '../components/fov'
import { Rectangle } from '../geometry/rectangle'
import { FunctionalShape } from '../geometry/functional-shape'

export interface WorldMap {
  boundaries: Rectangle

  setTile(position: Vector, entity: Entity): void
  getTile(position: Vector): Entity | undefined
  removeTile(position: Vector): Entity | undefined

  setCharacter(position: Vector, entity: Entity): void
  getCharacter(position: Vector): Entity | undefined
  removeCharacter(position: Vector): Entity | undefined
  addLight(position: Vector, entity: Entity): void

  isDiscovered(position: Vector): boolean
  isVisible(position: Vector): boolean

  isTileBlocking(world: TlbWorld, position: Vector): boolean
  isLightBlocking(world: TlbWorld, position: Vector): boolean

  tileMatches(world: TlbWorld, position: Vector, predicate: (f: FeatureComponent | undefined) => boolean): boolean
  characterMatches(world: TlbWorld, position: Vector, predicate: (f: FeatureComponent | undefined) => boolean): boolean
  featureMatches(world: TlbWorld, entity: Entity | undefined, predicate: (f: FeatureComponent | undefined) => boolean): boolean

  isShapeFree(world: TlbWorld, shape: Shape): boolean
  isShapeBlocked(world: TlbWorld, shape: Shape): boolean
  shapeHasAll(world: TlbWorld, shape: Shape, predicate: (f: FeatureComponent | undefined) => boolean): boolean
  shapeHasSome(world: TlbWorld, shape: Shape, predicate: (f: FeatureComponent | undefined) => boolean): boolean
}

export class WorldMapResource implements TlbResource, WorldMap {
  public readonly kind: ResourceName = 'map'

  public readonly tiles: Space<Entity> = new DiscreteSpace<Entity>()
  public readonly characters: Space<Entity> = new DiscreteSpace<Entity>()

  public boundaries = new Rectangle(0, 0, 0, 0)

  public visible: SetSpace = new DiscreteSetSpace()
  public readonly discovered: SetSpace = new DiscreteSetSpace()

  public lights: StackedSpace<Entity> = new DiscreteStackedSpace<Entity>()

  public constructor() {}

  public update(world: TlbWorld): void {
    this.visible = new DiscreteSetSpace()
    const visibleLights = new Set<Entity>()
    world.components.get('player')!.foreach(player => {
      const fov = world.getComponent<FovComponent>(player, 'fov')
      if (fov !== undefined) {
        fov.fov.forEach(p => {
          this.visible.set(p)
          this.discovered.set(p)
          this.lights.get(p).forEach(v => visibleLights.add(v))
        })
      }
    })
    world.components.get('light')!.foreach(l => {
      const light = world.editEntity(l)
      if (visibleLights.has(l)) {
        light.removeComponent('active')
      } else {
        light.withComponent('active', {})
      }
    })
  }

  public setTile(position: Vector, entity: Entity): void {
    this.tiles.set(position, entity)
    this.boundaries = this.boundaries.cover(position)
  }
  public getTile(position: Vector): Entity | undefined {
    return this.tiles.get(position)
  }
  public removeTile(position: Vector): Entity | undefined {
    return this.tiles.remove(position)
  }

  public setCharacter(position: Vector, entity: Entity): void {
    this.characters.set(position, entity)
    this.boundaries = this.boundaries.cover(position)
  }
  public getCharacter(position: Vector): Entity | undefined {
    return this.characters.get(position)
  }
  public removeCharacter(position: Vector): Entity | undefined {
    return this.characters.remove(position)
  }

  public addLight(position: Vector, entity: Entity): void {
    this.lights.addAll(FunctionalShape.L2(position, 10, true), entity)
  }

  public isDiscovered(position: Vector): boolean {
    return this.discovered.has(position)
  }
  public isVisible(position: Vector): boolean {
    return this.visible.has(position)
  }

  public isTileBlocking(world: TlbWorld, position: Vector): boolean {
    return this.tileMatches(world, position, f => {
      if (f === undefined) {
        return true
      }
      return features[f.type].blocking
    })
  }

  public isLightBlocking(world: TlbWorld, position: Vector): boolean {
    return (
      this.tileMatches(world, position, (f: FeatureComponent | undefined) => {
        if (f === undefined) {
          return true
        }
        return features[f.type].lightBlocking
      }) ||
      this.characterMatches(world, position, (f: FeatureComponent | undefined) => {
        if (f === undefined) {
          return false
        }
        return features[f.type].lightBlocking
      })
    )
  }

  public tileMatches(world: TlbWorld, position: Vector, predicate: (f: FeatureComponent | undefined) => boolean): boolean {
    return this.featureMatches(world, this.tiles.get(position), predicate)
  }

  public characterMatches(world: TlbWorld, position: Vector, predicate: (f: FeatureComponent | undefined) => boolean): boolean {
    return this.featureMatches(world, this.characters.get(position), predicate)
  }

  public featureMatches(world: TlbWorld, entity: Entity | undefined, predicate: (f: FeatureComponent | undefined) => boolean): boolean {
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
