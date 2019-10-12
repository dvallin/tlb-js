import { StructureComponent, StructureType } from '../../src/components/region'
import {
  StructureDescription,
  StructureRestriction,
  spawn,
  embedComplexes,
  ComplexDescription,
} from '../../src/generative/complex-embedder'
import { World } from '../../src/ecs/world'
import { TlbWorld } from '../../src/tlb'
import { MapStorage } from '../../src/ecs/storage'
import { Rectangle } from '../../src/geometry/rectangle'
import { Random } from '../../src/random'
import { Uniform } from '../../src/random/distributions'
import { indices } from '../../src/array-utils'
import { Vector } from '../../src/spatial'
import { Entity } from '../../src/ecs/entity'
import { AssetType } from '../../src/assets/assets'

function structure(
  id: number,
  restriction: Partial<StructureRestriction>
): { description: StructureDescription; restriction: Partial<StructureRestriction> } {
  return {
    description: {
      decorations: indices(id).map(() => spawn<AssetType>('door')),
      containers: [],
      npcs: [],
      loots: [],
      bosses: [],
    },
    restriction,
  }
}

function room(world: TlbWorld, connections: Entity[], kind: StructureType = 'room'): Entity {
  return world.createEntity().withComponent<StructureComponent>('structure', {
    kind,
    shape: new Rectangle(0, 0, 2, 2),
    connections: connections.map(other => ({ other, position: new Vector([0, 0]) })),
    region: 42,
  }).entity
}

describe('embedComplexes', () => {
  it('embeds rooms', () => {
    // given
    const world: TlbWorld = new World()
    world.registerComponentStorage<StructureComponent>('structure', new MapStorage())
    const room1 = room(world, [])
    const room2 = room(world, [])

    const random = new Random(new Uniform('test1'))

    const complexes: ComplexDescription[] = [
      {
        occurrence: { minimum: 1, maximum: 1 },
        template: {
          structures: [structure(1, {}), structure(2, {})],
        },
      },
    ]

    // when
    const embedding = embedComplexes(world, random, 42, complexes)

    // then
    expect(embedding.length).toEqual(2)
    expect(embedding[0].structure).toEqual(complexes[0].template.structures[1].description)
    expect(embedding[0].embedding).toEqual(room1)
    expect(embedding[1].structure).toEqual(complexes[0].template.structures[0].description)
    expect(embedding[1].embedding).toEqual(room2)
  })

  it('enforces connection between rooms', () => {
    // given
    const world: TlbWorld = new World()
    world.registerComponentStorage<StructureComponent>('structure', new MapStorage())
    room(world, [])
    room(world, [])

    const random = new Random(new Uniform('test1'))

    const complexes: ComplexDescription[] = [
      {
        occurrence: { minimum: 1, maximum: 1 },
        template: {
          structures: [structure(1, { connects: [1] }), structure(2, { connects: [0] })],
        },
      },
    ]

    // when
    const embedding = embedComplexes(world, random, 42, complexes)

    // then
    expect(embedding.length).toEqual(0)
  })

  it('allows connections between rooms', () => {
    // given
    const world: TlbWorld = new World()
    world.registerComponentStorage<StructureComponent>('structure', new MapStorage())
    room(world, [1])
    room(world, [0])

    const random = new Random(new Uniform('test1'))

    const complexes: ComplexDescription[] = [
      {
        occurrence: { minimum: 1, maximum: 1 },
        template: {
          structures: [structure(1, { connects: [1] }), structure(2, { connects: [0] })],
        },
      },
    ]

    // when
    const embedding = embedComplexes(world, random, 42, complexes)

    // then
    expect(embedding.length).toEqual(2)
  })

  it('allows for multiple assignment of non blocking rooms', () => {
    // given
    const world: TlbWorld = new World()
    world.registerComponentStorage<StructureComponent>('structure', new MapStorage())
    const room1 = room(world, [1, 2])
    const room2 = room(world, [0])
    const room3 = room(world, [0])

    const random = new Random(new Uniform('test1'))

    const complexes: ComplexDescription[] = [
      {
        occurrence: { minimum: 3, maximum: 3 },
        template: {
          structures: [structure(1, { connects: [1] }), structure(2, { connects: [0], blocking: false })],
        },
      },
    ]

    // when
    const embedding = embedComplexes(world, random, 42, complexes)

    // then
    const blocking = complexes[0].template.structures[0].description
    const nonBlocking = complexes[0].template.structures[1].description
    expect(embedding.length).toEqual(6)
    expect(embedding[0]).toEqual({ blocking: true, embedding: room1, structure: blocking })
    expect(embedding[1]).toEqual({ blocking: false, embedding: room1, structure: nonBlocking })
    expect(embedding[2]).toEqual({ blocking: false, embedding: room1, structure: nonBlocking })
    expect(embedding[3]).toEqual({ blocking: false, embedding: room2, structure: nonBlocking })
    expect(embedding[4]).toEqual({ blocking: true, embedding: room2, structure: blocking })
    expect(embedding[5]).toEqual({ blocking: true, embedding: room3, structure: blocking })
  })

  it('does not match on wrong structure types', () => {
    // given
    const world: TlbWorld = new World()
    world.registerComponentStorage<StructureComponent>('structure', new MapStorage())
    room(world, [], 'room')

    const random = new Random(new Uniform('test1'))

    const complexes: ComplexDescription[] = [
      {
        occurrence: { minimum: 1, maximum: 1 },
        template: {
          structures: [structure(1, { kind: 'hub' })],
        },
      },
    ]

    // when
    const embedding = embedComplexes(world, random, 42, complexes)

    // then
    expect(embedding.length).toEqual(0)
  })

  it('matches exactly on the right room kinds', () => {
    // given
    const world: TlbWorld = new World()
    world.registerComponentStorage<StructureComponent>('structure', new MapStorage())

    room(world, [], 'room')
    room(world, [], 'hub')

    const random = new Random(new Uniform('test1'))

    const complexes: ComplexDescription[] = [
      {
        occurrence: { minimum: 1, maximum: 1 },
        template: {
          structures: [structure(1, { kind: 'hub' }), structure(2, { kind: 'room' })],
        },
      },
    ]

    // when
    const embedding = embedComplexes(world, random, 42, complexes)

    // then
    expect(embedding.length).toEqual(2)
    expect(embedding[0]).toEqual({ blocking: true, embedding: 0, structure: complexes[0].template.structures[1].description })
    expect(embedding[1]).toEqual({ blocking: true, embedding: 1, structure: complexes[0].template.structures[0].description })
  })

  it('does not exactly embed a single node in a path', () => {
    // given
    const world: TlbWorld = new World()
    world.registerComponentStorage<StructureComponent>('structure', new MapStorage())

    room(world, [1])
    room(world, [0])

    const random = new Random(new Uniform('test1'))

    const complexes: ComplexDescription[] = [
      {
        occurrence: { minimum: 1, maximum: 1 },
        template: {
          structures: [structure(1, { exact: true })],
        },
      },
    ]

    // when
    const embedding = embedComplexes(world, random, 42, complexes)

    // then
    expect(embedding.length).toEqual(0)
  })

  it('embeds the exact node at a possible node', () => {
    // given
    const world: TlbWorld = new World()
    world.registerComponentStorage<StructureComponent>('structure', new MapStorage())

    room(world, [1, 2, 3])
    room(world, [0, 2])
    room(world, [0, 1])
    room(world, [0])

    const random = new Random(new Uniform('test1'))

    const complexes: ComplexDescription[] = [
      {
        occurrence: { minimum: 1, maximum: 1 },
        template: {
          structures: [structure(1, { exact: true, connects: [1] }), structure(1, { exact: false, connects: [0] })],
        },
      },
    ]

    // when
    const embedding = embedComplexes(world, random, 42, complexes)

    // then
    expect(embedding.length).toEqual(2)
  })
})
