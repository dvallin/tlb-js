import { createAssetFromPosition, createLocker, createTrash, createDoor } from '../../src/components/asset'
import { Vector } from '../../src/spatial'
import { World } from '../../src/ecs/world'
import { TlbWorld, registerComponents, registerResources } from '../../src/tlb'
import { WorldMap, WorldMapResource } from '../../src/resources/world-map'
import { FeatureComponent } from '../../src/components/feature'
import { mockRenderer } from '../mocks'
import { Rectangle } from '../../src/geometry/rectangle'
import { Entity } from '../../src/ecs/entity'

describe('createAssetFromPosition', () => {
  let world: TlbWorld
  let map: WorldMap
  beforeEach(() => {
    jest.clearAllMocks()
    world = new World()
    registerComponents(world)
    registerResources(world, mockRenderer())
    map = world.getResource<WorldMapResource>('map')
  })

  it('throws error on missing ground', () => {
    // given
    const position = new Vector(0, 0)

    // when / then
    expect(() => createAssetFromPosition(world, map, position, 'door')).toThrowErrorMatchingSnapshot()
  })

  it('throws error on blocking ground', () => {
    // given
    const position = new Vector(0, 0)
    const ground = world.createEntity().withComponent<FeatureComponent>('feature', { type: 'wall' }).entity
    map.setTile(position, ground)

    // when / then
    expect(() => createAssetFromPosition(world, map, position, 'door')).toThrowErrorMatchingSnapshot()
  })

  it('creates doors', () => {
    // given
    const shape = new Rectangle(0, 0, 2, 2)
    const entities: Entity[] = []
    shape.foreach(position => {
      const ground = world.createEntity().withComponent<FeatureComponent>('feature', { type: 'corridor' }).entity
      map.setTile(position, ground)
      entities.push(ground)
    })

    // when
    const asset = createDoor(world, map, shape)

    // then
    shape.foreach(position => {
      const tile = map.getTile(position)!
      expect(world.getComponent(tile, 'position')).toEqual({ position })
      expect(world.getComponent(tile, 'ground')).toEqual({ feature: 'corridor' })
      expect(world.getComponent(tile, 'feature')).toEqual({ type: 'door' })
      expect(world.getComponent(tile, 'triggered-by')).toEqual({ entity: asset })
    })

    expect(world.getComponent(asset, 'triggers')).toEqual({ entities })
    expect(world.getComponent(asset, 'asset')).toEqual({ type: 'door' })
  })

  it('creates lockers', () => {
    // given
    const position = new Vector(0, 0)
    const ground = world.createEntity().withComponent<FeatureComponent>('feature', { type: 'corridor' }).entity
    map.setTile(position, ground)

    // when
    const asset = createLocker(world, map, position)

    // then
    const tile = map.getTile(position)!
    expect(world.getComponent(tile, 'position')).toEqual({ position })
    expect(world.getComponent(tile, 'ground')).toEqual({ feature: 'corridor' })
    expect(world.getComponent(tile, 'feature')).toEqual({ type: 'locker' })
    expect(world.getComponent(tile, 'triggered-by')).toEqual({ entity: asset })

    expect(world.getComponent(asset, 'triggers')).toEqual({ entities: [ground] })
    expect(world.getComponent(asset, 'asset')).toEqual({ type: 'locker' })
  })

  it('creates trash', () => {
    // given
    const position = new Vector(0, 0)
    const ground = world.createEntity().withComponent<FeatureComponent>('feature', { type: 'corridor' }).entity
    map.setTile(position, ground)

    // when
    const asset = createTrash(world, map, position)

    // then
    const tile = map.getTile(position)!
    expect(world.getComponent(tile, 'position')).toEqual({ position })
    expect(world.getComponent(tile, 'ground')).toEqual({ feature: 'corridor' })
    expect(world.getComponent(tile, 'feature')).toEqual({ type: 'trash' })
    expect(world.getComponent(tile, 'triggered-by')).toEqual({ entity: asset })

    expect(world.getComponent(asset, 'triggers')).toEqual({ entities: [ground] })
    expect(world.getComponent(asset, 'asset')).toEqual({ type: 'trash' })
  })
})
