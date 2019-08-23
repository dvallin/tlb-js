import { DiscreteSpace, Vector, Space, StackedSpace, DiscreteStackedSpace } from '../spatial'
import { Entity } from '../ecs/entity'
import { ResourceName, TlbResource, TlbWorld } from '../tlb'
import { FeatureComponent, features } from '../components/feature'
import { Shape } from '../geometry/shape'
import { SetSpace, DiscreteSetSpace } from '../spatial/set-space'
import { FovComponent } from '../components/fov'
import { FunctionalShape } from '../geometry/functional-shape'
import { PositionComponent } from '../components/position'
import { Rectangle } from '../geometry/rectangle'

export class Level {
  public readonly boundary: Rectangle

  public readonly tiles: Space<Entity>
  public readonly characters: Space<Entity>
  public readonly rooms: Space<Entity>

  public visible: SetSpace
  public readonly discovered: SetSpace

  public lights: StackedSpace<Entity>

  public constructor(width: number) {
    this.boundary = new Rectangle(0, 0, width, width)

    this.tiles = new DiscreteSpace(width)
    this.characters = new DiscreteSpace(width)
    this.rooms = new DiscreteSpace(width)

    this.visible = new DiscreteSetSpace(width)
    this.discovered = new DiscreteSetSpace(width)

    this.lights = new DiscreteStackedSpace(width)
  }

  public setTile(position: Vector, entity: Entity): void {
    this.tiles.set(position, entity)
  }
  public getTile(position: Vector): Entity | undefined {
    return this.tiles.get(position)
  }
  public removeTile(position: Vector): Entity | undefined {
    return this.tiles.remove(position)
  }

  public setRoom(position: Vector, entity: Entity): void {
    this.rooms.set(position, entity)
  }
  public getRoom(position: Vector): Entity | undefined {
    return this.rooms.get(position)
  }

  public setCharacter(position: Vector, entity: Entity): void {
    this.characters.set(position, entity)
  }
  public getCharacter(position: Vector): Entity | undefined {
    return this.characters.get(position)
  }
  public removeCharacter(position: Vector): Entity | undefined {
    return this.characters.remove(position)
  }

  public addLight(position: Vector, entity: Entity): void {
    this.lights.addAll(FunctionalShape.l2(position, 6, true), entity)
  }

  public isDiscovered(position: Vector): boolean {
    return this.discovered.has(position)
  }
  public isVisible(position: Vector): boolean {
    return this.visible.has(position)
  }

  public isBlocking(world: TlbWorld, position: Vector, self?: Entity | undefined): boolean {
    return (
      this.tileMatches(world, position, f => {
        if (f === undefined) {
          return true
        }
        return features[f.type].blocking
      }) ||
      this.characterMatches(
        world,
        position,
        (f: FeatureComponent | undefined) => {
          if (f === undefined) {
            return false
          }
          return features[f.type].blocking
        },
        self
      )
    )
  }

  public isLightBlocking(world: TlbWorld, position: Vector, useCharacters: boolean = true): boolean {
    return (
      this.tileMatches(world, position, (f: FeatureComponent | undefined) => {
        if (f === undefined) {
          return true
        }
        return features[f.type].lightBlocking
      }) ||
      (useCharacters &&
        this.characterMatches(world, position, (f: FeatureComponent | undefined) => {
          if (f === undefined) {
            return false
          }
          return features[f.type].lightBlocking
        }))
    )
  }

  public tileMatches(world: TlbWorld, position: Vector, predicate: (f: FeatureComponent | undefined) => boolean): boolean {
    return this.featureMatches(world, this.tiles.get(position), predicate)
  }

  public characterMatches(
    world: TlbWorld,
    position: Vector,
    predicate: (f: FeatureComponent | undefined) => boolean,
    self?: Entity | undefined
  ): boolean {
    const character = this.characters.get(position)
    if (character !== undefined && self !== undefined && self === character) {
      return false
    }
    return this.featureMatches(world, character, predicate)
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

export interface WorldMap {
  levels: Level[]
}

export class WorldMapResource implements TlbResource, WorldMap {
  public readonly kind: ResourceName = 'map'

  public readonly levels: Level[] = []

  public constructor(public readonly width: number) {
    this.levels.push(new Level(this.width))
  }

  public update(world: TlbWorld): void {
    const visibleLights = new Set<Entity>()
    world.components.get('player')!.foreach(player => {
      const position = world.getComponent<PositionComponent>(player, 'position')
      if (position !== undefined) {
        const level = this.levels[position.level]
        const fov = world.getComponent<FovComponent>(player, 'fov')
        level.visible = new DiscreteSetSpace(this.width)
        if (fov !== undefined) {
          fov.fov.forEach(p => {
            level.visible.set(p.position)
            level.discovered.set(p.position)
            level.lights.get(p.position).forEach(v => visibleLights.add(v))
          })
        }
      }
    })
    world.components.get('light')!.foreach(l => {
      const light = world.editEntity(l)
      if (visibleLights.has(l)) {
        light.withComponent('active', {})
      } else {
        light.removeComponent('active')
      }
    })
  }
}
