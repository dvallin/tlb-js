import { registerComponents, registerResources, registerSystems, ComponentName, SystemName, ResourceName } from '../src/tlb'
import { World } from '../src/ecs/world'
import { mockRenderer } from './mocks'

describe('registerComponents', () => {
  it('registers all components', () => {
    const world = new World<ComponentName, SystemName, ResourceName>()
    world.registerComponentStorage = jest.fn()

    registerComponents(world)

    expect(world.registerComponentStorage).toHaveBeenCalledTimes(15)
  })
})

describe('registerResources', () => {
  it('registers all systems', () => {
    const world = new World<ComponentName, SystemName, ResourceName>()
    world.registerSystem = jest.fn()

    registerSystems(world)

    expect(world.registerSystem).toHaveBeenCalledTimes(4)
  })
})

describe('registerSystems', () => {
  it('registers all components', () => {
    const world = new World<ComponentName, SystemName, ResourceName>()
    world.registerResource = jest.fn()

    registerResources(world, mockRenderer())

    expect(world.registerResource).toHaveBeenCalledTimes(3)
  })
})
