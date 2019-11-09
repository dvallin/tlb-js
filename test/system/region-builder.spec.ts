import { RegionBuilder } from '../../src/systems/region-builder'
import { Uniform } from '../../src/random/distributions'
import { World } from '../../src/ecs/world'
import { TlbWorld, registerComponents, registerResources } from '../../src/tlb'
import { RegionComponent } from '../../src/components/region'
import { Rectangle } from '../../src/geometry/rectangle'
import { mockRenderer } from '../mocks'
import { renderMap } from '../render'

describe('RegionBuilder', () => {
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
        exits: [],
      }).entity

    const system = new RegionBuilder(new Uniform('12'))

    system.update(world, region)

    expect(renderMap(world, shape)).toMatchSnapshot()
  })
})
