import { MapCreation } from '../../src/game-states/map-creation'
import { TlbWorld, registerComponents } from '../../src/tlb'
import { World } from '../../src/ecs/world'
import { RegionBuilder } from '../../src/systems/region-builder'
import { Uniform } from '../../src/random/distributions'
import { WorldMapResource } from '../../src/resources/world-map'
import { ViewportResource } from '../../src/resources/viewport'
import { Vector } from '../../src/spatial'

describe('MapCreation', () => {
  it('creates a spawn point', () => {
    const world: TlbWorld = new World()
    registerComponents(world)

    world.registerResource(new WorldMapResource(40))
    world.registerResource(new ViewportResource(new Vector([4, 4])))

    const state = new MapCreation()
    state.start(world)

    // create a region
    const system = new RegionBuilder(new Uniform('12'))
    system.update(world, world.getStorage('region').first()!)

    state.stop(world)

    expect(world.getStorage('spawn').first()).toBeDefined()
  })
})
