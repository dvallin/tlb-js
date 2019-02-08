import { createAssetFromPosition } from '../../src/components/asset'
import { Vector } from '../../src/spatial'
import { World } from '../../src/ecs/world'
import { TlbWorld, registerComponents, registerResources } from '../../src/tlb'
import { WorldMap } from '../../src/resources/world-map'
import { FeatureComponent } from '../../src/components/feature'
import { mockRenderer } from '../mocks'

describe('createAssetFromPosition', () => {
  let world: TlbWorld
  let map: WorldMap
  beforeEach(() => {
    jest.clearAllMocks()
    world = new World()
    registerComponents(world)
    registerResources(world, mockRenderer())
    map = world.getResource('map')
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
    map.tiles.set(position, ground)

    // when / then
    expect(() => createAssetFromPosition(world, map, position, 'door')).toThrowErrorMatchingSnapshot()
  })

  it('creates doors', () => {
    // given
    const position = new Vector(0, 0)
    const ground = world.createEntity().withComponent<FeatureComponent>('feature', { type: 'corridor' }).entity
    map.tiles.set(position, ground)

    // when
    const asset = createAssetFromPosition(world, map, position, 'door')

    // then
    const door = map.tiles.get(position)!
    expect(world.getComponent(door, 'position')).toEqual({ position })
    expect(world.getComponent(door, 'ground')).toEqual({ feature: 'corridor' })
    expect(world.getComponent(door, 'feature')).toEqual({ type: 'door' })
    expect(world.getComponent(door, 'parent')).toEqual({ entity: asset })
    expect(world.getComponent(asset, 'asset')).toEqual({ type: 'door' })
  })

  it('creates lockers', () => {
    // given
    const position = new Vector(0, 0)
    const ground = world.createEntity().withComponent<FeatureComponent>('feature', { type: 'corridor' }).entity
    map.tiles.set(position, ground)

    // when
    const asset = createAssetFromPosition(world, map, position, 'locker')

    // then
    const door = map.tiles.get(position)!
    expect(world.getComponent(door, 'position')).toEqual({ position })
    expect(world.getComponent(door, 'ground')).toEqual({ feature: 'corridor' })
    expect(world.getComponent(door, 'feature')).toEqual({ type: 'locker' })
    expect(world.getComponent(door, 'parent')).toEqual({ entity: asset })
    expect(world.getComponent(asset, 'asset')).toEqual({ type: 'locker' })
  })

  it('creates trash', () => {
    // given
    const position = new Vector(0, 0)
    const ground = world.createEntity().withComponent<FeatureComponent>('feature', { type: 'corridor' }).entity
    map.tiles.set(position, ground)

    // when
    const asset = createAssetFromPosition(world, map, position, 'trash')

    // then
    const door = map.tiles.get(position)!
    expect(world.getComponent(door, 'position')).toEqual({ position })
    expect(world.getComponent(door, 'ground')).toEqual({ feature: 'corridor' })
    expect(world.getComponent(door, 'feature')).toEqual({ type: 'trash' })
    expect(world.getComponent(door, 'parent')).toEqual({ entity: asset })
    expect(world.getComponent(asset, 'asset')).toEqual({ type: 'trash' })
  })
})
