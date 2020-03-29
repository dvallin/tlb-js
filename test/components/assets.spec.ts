import { createAssetFromShape, createAsset } from '../../src/components/asset'
import { Vector } from '../../src/spatial'
import { World } from '../../src/ecs/world'
import { TlbWorld, registerComponents, registerResources } from '../../src/tlb'
import { WorldMap, WorldMapResource } from '../../src/resources/world-map'
import { FeatureComponent } from '../../src/components/feature'
import { mockRenderer } from '../mocks'
import { Rectangle } from '../../src/geometry/rectangle'
import { Entity } from '../../src/ecs/entity'
import { features } from '../../src/assets/features'
import { GroundComponent } from '../../src/components/ground'
import { Random } from '../../src/random'
import { Uniform } from '../../src/random/distributions'

describe('createAssetFromPosition', () => {
  let world: TlbWorld
  let map: WorldMap
  let random: Random
  beforeEach(() => {
    jest.clearAllMocks()
    world = new World()
    registerComponents(world)
    registerResources(world, mockRenderer())
    map = world.getResource<WorldMapResource>('map')
    random = new Random(new Uniform('createAssetFromPosition'))
  })

  it('throws error on missing ground', () => {
    // given
    const position = new Vector([0, 0])

    // when / then
    expect(() => createAsset(world, random, 0, position, 'up', 'door')).toThrowErrorMatchingSnapshot()
  })

  it('throws error on blocking ground', () => {
    // given
    const position = new Vector([0, 0])
    const ground = world.createEntity().withComponent<FeatureComponent>('feature', { feature: () => features['wall'] }).entity
    map.levels[0].setTile(position, ground)

    // when / then
    expect(() => createAsset(world, random, 0, position, 'up', 'door')).toThrowErrorMatchingSnapshot()
  })

  it('creates assets', () => {
    // given
    const shape = new Rectangle(0, 0, 2, 2)
    const entities: Entity[] = []
    shape.foreach(position => {
      const ground = world.createEntity().withComponent<FeatureComponent>('feature', { feature: () => features['corridor'] }).entity
      map.levels[0].setTile(position, ground)
      entities.push(ground)
    })

    // when
    const asset = createAssetFromShape(world, random, 0, shape, 'door')

    // then
    shape.foreach(position => {
      const tile = map.levels[0].getTile(position)!
      expect(world.getComponent(tile, 'position')).toEqual({ position, level: 0 })
      expect(world.getComponent<GroundComponent>(tile, 'ground')!.feature()).toEqual(features['corridor'])
      expect(world.getComponent<FeatureComponent>(tile, 'feature')!.feature()).toEqual(features['door'])
      expect(world.getComponent(tile, 'triggered-by')).toEqual({ entity: asset })
    })

    expect(world.getComponent(asset, 'triggers')).toEqual({ entities, type: 'asset', name: 'metal door' })
    expect(world.getComponent(asset, 'asset')).toEqual({ type: 'door' })
  })
})
