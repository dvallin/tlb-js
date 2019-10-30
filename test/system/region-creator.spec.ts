import { RegionCreator } from '../../src/systems/region-creator'
import { Uniform } from '../../src/random/distributions'
import { World } from '../../src/ecs/world'
import { TlbWorld, registerComponents, registerResources } from '../../src/tlb'
import { RegionComponent } from '../../src/components/region'
import { Rectangle } from '../../src/geometry/rectangle'
import { Vector } from '../../src/spatial'
import { mockRenderer } from '../mocks'
import { renderMap } from '../render'

describe('RegionCreator', () => {
  it('creates a region', () => {
    const world: TlbWorld = new World()
    registerComponents(world)
    registerResources(world, mockRenderer())
    const shape = new Rectangle(0, 0, 30, 30)
    const region = world
      .createEntity()
      .withComponent('active', {})
      .withComponent<RegionComponent>('region', {
        type: 'red',
        shape,
        level: 0,
        authorized: new Set(),
        entry: new Vector([0, 0]),
      }).entity

    const system = new RegionCreator(new Uniform('12'))

    system.update(world, region)

    expect(renderMap(world, shape)).toMatchSnapshot()
  })
})
