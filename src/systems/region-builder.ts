import { createFeatureFromType } from '../components/feature'
import { RegionComponent, StructureComponent } from '../components/region'
import { Entity } from '../ecs/entity'
import { Rectangle } from '../geometry/rectangle'
import { Shape } from '../geometry/shape'
import { Random } from '../random'
import { Distribution, Exponential } from '../random/distributions'
import { WorldMap, WorldMapResource } from '../resources/world-map'
import { Vector } from '../spatial'
import { directions } from '../spatial/direction'
import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { shapeOfAsset, createAssetFromShape } from '../components/asset'
import { regionParams } from '../assets/complexes'
import { embedComplexes, ComplexEmbedding } from '../generative/complex-embedder'
import { fill } from '../generative/complex-filler'
import { SpacePartitioner, Corridor, Room, Hub } from '../generative/space-partitioner'

export class RegionBuilder implements TlbSystem {
  public readonly components: ComponentName[] = ['active', 'region']

  private readonly uniform: Random
  private readonly exponential: Random
  private readonly partitioner: SpacePartitioner

  public constructor(rng: Distribution) {
    this.uniform = new Random(rng)
    this.exponential = new Random(new Exponential(rng))
    this.partitioner = new SpacePartitioner(rng)
  }

  public update(world: TlbWorld, entity: Entity): void {
    const region = world.getComponent<RegionComponent>(entity, 'region')!

    let success = true
    switch (region.type) {
      case 'elevator':
        success = this.buildElevator(world, entity, region)
        break
      case 'red':
        success = this.buildOfficeSpace(world, entity, region)
        break
    }
    if (success) {
      world.editEntity(entity).removeComponent('active')
    }
  }

  private buildElevator(world: TlbWorld, entity: Entity, region: RegionComponent): boolean {
    const hub: Hub = {
      kind: 'hub',
      exits: region.exits.map(
        e =>
          ({
            kind: 'corridor',
            shape: new Rectangle(e.x, e.y - 1, 1, 3),
            exits: [],
            rooms: [],
            hubs: [],
          } as Corridor)
      ),
      shape: region.shape,
    }
    const rootStructure = this.createHub(world, entity, hub, undefined)
    const embeddings = this.findEmbedding(world, entity, rootStructure)
    if (embeddings !== undefined) {
      const map = world.getResource<WorldMapResource>('map')
      this.renderHub(world, map, region.level, hub)
      embeddings.forEach(e => fill(world, map, region.level, e.embedding, this.uniform, e.structure))
      return true
    } else {
      this.removeStructures(world, entity)
      return false
    }
  }

  private buildOfficeSpace(world: TlbWorld, entity: Entity, region: RegionComponent): boolean {
    const structure = this.partitioner.planStructureWithExits(region.shape, region.exits, 6, 10, 3)
    if (structure.kind !== 'corridor') {
      return false
    }

    const rootStructure = this.createCorridor(world, entity, structure, undefined)
    const embeddings = this.findEmbedding(world, entity, rootStructure)
    if (embeddings !== undefined) {
      const map = world.getResource<WorldMapResource>('map')

      this.renderCorridors(world, map, region.level, structure)
      this.renderRooms(world, map, region.level, structure)

      embeddings.forEach(e => fill(world, map, region.level, e.embedding, this.uniform, e.structure))

      return true
    } else {
      this.removeStructures(world, entity)
      return false
    }
  }

  private createCorridor(world: TlbWorld, region: Entity, corridor: Corridor, parent: Entity | undefined): Entity {
    const entity = world.createEntity().entity
    const connections = [
      ...corridor.exits.map(c => this.createCorridor(world, region, c, entity)),
      ...corridor.rooms.map(r => this.createRoom(world, region, r, entity)),
      ...corridor.hubs.map(h => this.createHub(world, region, h, entity)),
    ]
    if (parent !== undefined) {
      connections.push(parent)
    }
    world
      .editEntity(entity)
      .withComponent<StructureComponent>('structure', { kind: 'corridor', shape: corridor.shape, connections, region })
    corridor.entity = entity
    return entity
  }

  private createRoom(world: TlbWorld, region: Entity, room: Room, parent: Entity | undefined): Entity {
    const entity = world.createEntity().entity
    const connections = room.rooms.map(r => this.createRoom(world, region, r, entity))
    if (parent !== undefined) {
      connections.push(parent)
    }
    world.editEntity(entity).withComponent<StructureComponent>('structure', { kind: 'room', shape: room.shape, connections, region }).entity
    room.entity = entity
    return entity
  }

  private createHub(world: TlbWorld, region: Entity, hub: Hub, parent: Entity | undefined): Entity {
    const entity = world.createEntity().entity
    const connections = [...hub.exits.map(c => this.createCorridor(world, region, c, entity))]
    if (parent !== undefined) {
      connections.push(parent)
    }
    world.editEntity(entity).withComponent<StructureComponent>('structure', { kind: 'hub', shape: hub.shape, connections, region })
    hub.entity = entity
    return entity
  }

  private removeStructures(world: TlbWorld, region: Entity): void {
    const structures: Entity[] = []
    world.getStorage<StructureComponent>('structure').foreach((e, s) => {
      if (s.region === region) {
        structures.push(e)
      }
    })
    structures.forEach(e => world.deleteEntity(e))
  }

  private findEmbedding(world: TlbWorld, entity: Entity, structure: Entity): ComplexEmbedding[] | undefined {
    const s = world.getComponent<StructureComponent>(structure, 'structure')!
    if (s.region === entity) {
      const region = world.getComponent<RegionComponent>(entity, 'region')!
      const params = regionParams[region.type]
      return embedComplexes(world, this.uniform, entity, params)
    }
    return undefined
  }

  private renderCorridors(world: TlbWorld, map: WorldMap, level: number, corridor: Corridor): void {
    corridor.shape.foreach(p => {
      createFeatureFromType(world, level, p, 'corridor')
      map.levels[level].setStructure(p, corridor.entity!)
    })

    corridor.exits.forEach(c => this.renderCorridors(world, map, level, c))
  }

  private renderRooms(world: TlbWorld, map: WorldMap, level: number, corridor: Corridor): void {
    corridor.rooms.forEach(r => this.renderRoom(world, map, level, r))
    corridor.exits.forEach(c => this.renderRooms(world, map, level, c))
  }

  private renderHub(world: TlbWorld, map: WorldMap, level: number, hub: Hub): void {
    const structureShape = hub.shape.shrink()
    structureShape.foreach(p => {
      createFeatureFromType(world, level, p, 'hub')
      map.levels[level].setStructure(p, hub.entity!)
    })

    this.placeDoors(world, map, level, hub)

    hub.exits.forEach(c => this.renderCorridors(world, map, level, c))
  }

  private renderRoom(world: TlbWorld, map: WorldMap, level: number, room: Room): void {
    const structureShape = room.shape.shrink()
    structureShape.foreach(p => {
      createFeatureFromType(world, level, p, 'room')
      map.levels[level].setStructure(p, room.entity!)
    })

    this.placeDoors(world, map, level, room)

    room.rooms.forEach(r => this.renderRoom(world, map, level, r))
  }

  private placeDoors(world: TlbWorld, map: WorldMap, level: number, room: Room | Hub): void {
    const doors = this.findPossibleDoors(map, level, room.shape.bounds())
    if (doors.length > 0) {
      this.uniform.shuffle(doors)
      const count = this.exponential.integerBetween(1, doors.length)
      for (let i = 0; i < count; ++i) {
        const shape = doors[i]
        shape.foreach(p => {
          createFeatureFromType(world, level, p, 'corridor')
          map.levels[level].setStructure(p, room.entity!)
        })
        createAssetFromShape(world, level, shape, 'door')
      }
    }
  }

  private findPossibleDoors(map: WorldMap, level: number, rectangle: Rectangle): Shape[] {
    const result: Shape[] = []
    directions.forEach(direction => {
      const center = rectangle.centerOf(direction)
      const shape = shapeOfAsset('door', center, direction)
      const shapeInsideNeighbourRoom = shape.translate(Vector.fromDirection(direction))
      const doorCanBeBuilt = shapeInsideNeighbourRoom.all(p => map.levels[level].getStructure(p) !== undefined)
      if (doorCanBeBuilt) {
        result.push(shape)
      }
    })
    return result
  }
}
