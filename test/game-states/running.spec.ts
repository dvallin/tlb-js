import { Running } from '../../src/game-states/running'
import { TlbWorld, registerComponents } from '../../src/tlb'
import { World } from '../../src/ecs/world'
import { mockViewport, mockUi, callArgument } from '../mocks'
import { PositionComponent } from '../../src/components/position'
import { Vector } from '../../src/spatial'
import { WorldMapResource } from '../../src/resources/world-map'
import { createFeatureFromType } from '../../src/components/feature'
import { State } from '../../src/game-states/state'

describe('Running', () => {
  it('spawns a player', () => {
    const world: TlbWorld = new World()
    registerComponents(world)

    mockUi(world)
    mockViewport(world)
    world.registerResource(new WorldMapResource(4))
    createFeatureFromType(world, 0, new Vector([0, 0]), 'corridor')

    world
      .createEntity()
      .withComponent('spawn', {})
      .withComponent<PositionComponent>('position', { level: 0, position: new Vector([0, 0]) })

    const state = new Running()
    state.start(world)

    expect(world.getStorage('player').first()).toBeDefined()
  })

  it('pushes main menu if player is dead', () => {
    const world: TlbWorld = new World()
    registerComponents(world)

    world
      .createEntity()
      .withComponent('player', {})
      .withComponent('dead', {})

    const state = new Running()
    const pushState = jest.fn()
    state.update(world, pushState)

    expect((callArgument(pushState, 0, 0) as State).name).toEqual('main-menu')
  })
})
