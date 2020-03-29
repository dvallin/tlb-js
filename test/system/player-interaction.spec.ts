import { PlayerInteraction } from '../../src/systems/player-interaction'
import { World } from '../../src/ecs/world'
import { TlbWorld, registerComponents } from '../../src/tlb'
import { Entity } from '../../src/ecs/entity'
import { mockInput, mockImplementation, mockUi, callArgument, mockReturnValue } from '../mocks'
import { WorldMapResource, WorldMap } from '../../src/resources/world-map'
import { characterCreators } from '../../src/assets/characters'
import { Input, KeyboardCommand } from '../../src/resources/input'
import { placeCharacter } from '../../src/component-reducers/place-character'
import { Vector } from '../../src/spatial'
import { createFeatureFromType } from '../../src/components/feature'
import { createAssetFromShape } from '../../src/components/asset'
import { Rectangle } from '../../src/geometry/rectangle'
import { UI } from '../../src/resources/ui'
import { State } from '../../src/game-states/state'
import { Random } from '../../src/random'
import { Uniform } from '../../src/random/distributions'

describe('PlayerInteraction', () => {
  let world: TlbWorld
  let player: Entity
  let input: Input
  let system: PlayerInteraction
  let map: WorldMap
  let pushState: () => void
  let ui: UI
  let random: Random
  beforeEach(() => {
    world = new World()
    registerComponents(world)

    world.registerResource(new WorldMapResource(4))
    map = world.getResource<WorldMapResource>('map')
    map.levels[0].boundary.foreach(p => createFeatureFromType(world, 0, p, 'corridor'))

    ui = mockUi(world)
    input = mockInput(world)
    pushState = jest.fn()

    player = characterCreators.player(world)
    placeCharacter(world, player, 0, new Vector([0, 0]))

    system = new PlayerInteraction(pushState)
    random = new Random(new Uniform('PlayerInteraction'))
  })

  it('activates direct triggers', () => {
    const guard = characterCreators.guard(world)
    placeCharacter(world, guard, 0, new Vector([0, 1]))

    mockImplementation<KeyboardCommand, boolean>(input.isActive, k => k === 'use')
    system.update(world, player)

    expect(world.hasComponent(guard, 'active')).toBeTruthy()
  })

  it('activates reverse triggers', () => {
    const door = createAssetFromShape(world, random, 0, new Rectangle(1, 1, 1, 1), 'door')

    mockImplementation<KeyboardCommand, boolean>(input.isActive, k => k === 'use')
    system.update(world, player)

    expect(world.hasComponent(door, 'active')).toBeTruthy()
  })

  it('shows a dialog for multiple triggers and pushes modal state', () => {
    const guard = characterCreators.guard(world)
    placeCharacter(world, guard, 0, new Vector([0, 1]))
    createAssetFromShape(world, random, 0, new Rectangle(1, 1, 1, 1), 'door')

    mockImplementation<KeyboardCommand, boolean>(input.isActive, k => k === 'use')
    system.update(world, player)

    expect(ui.showMultipleChoiceModal).toHaveBeenCalled()
    expect((callArgument(pushState, 0, 0) as State).name).toEqual('modal')
  })

  it('triggers multiple choice modals result', () => {
    const guard = characterCreators.guard(world)
    placeCharacter(world, guard, 0, new Vector([0, 1]))
    createAssetFromShape(world, random, 0, new Rectangle(1, 1, 1, 1), 'door')

    mockReturnValue<boolean>(ui.multipleChoiceModalShowing, true)
    mockReturnValue<Entity>(ui.selectedModalOption, guard)
    system.update(world, player)

    expect(world.hasComponent(guard, 'active')).toBeTruthy()
  })
})
