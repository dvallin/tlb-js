import { registerComponents, registerResources, registerSystems, ComponentName, SystemName, ResourceName } from '../src/tlb'
import { World } from '../src/ecs/world'
import { mockRenderer, mockQueries } from './mocks'

describe('registerComponents', () => {
  it('registers all components', () => {
    const world = new World<ComponentName, SystemName, ResourceName>()
    world.registerComponentStorage = jest.fn()

    registerComponents(world)

    expect(world.registerComponentStorage).toHaveBeenCalledTimes(33)
  })
})

describe('registerResources', () => {
  it('registers all systems', () => {
    const world = new World<ComponentName, SystemName, ResourceName>()
    world.registerSystem = jest.fn()

    registerSystems(world, mockQueries(), jest.fn())

    expect(world.registerSystem).toHaveBeenCalledTimes(13)
  })
})

describe('registerSystems', () => {
  it('registers all components', () => {
    const world = new World<ComponentName, SystemName, ResourceName>()
    world.registerResource = jest.fn()

    registerResources(world, mockRenderer())

    expect(world.registerResource).toHaveBeenCalledTimes(5)
  })
})
