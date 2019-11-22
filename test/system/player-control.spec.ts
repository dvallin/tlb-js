import { registerComponents, TlbWorld } from '../../src/tlb'
import { World } from '../../src/ecs/world'
import { Vector } from '../../src/spatial'
import { characterCreators } from '../../src/assets/characters'
import { placeCharacter } from '../../src/component-reducers/place-character'
import { WorldMapResource } from '../../src/resources/world-map'
import { Entity } from '../../src/ecs/entity'
import { PlayerControl } from '../../src/systems/player-control'
import { mockInput, mockReturnValue } from '../mocks'
import { Input } from '../../src/resources/input'
import { PositionComponent } from '../../src/components/position'
import { createFeatureFromType } from '../../src/components/feature'

describe('PlayerControl', () => {
  let world: TlbWorld
  let input: Input
  let player: Entity
  let system: PlayerControl
  beforeEach(() => {
    world = new World()
    registerComponents(world)
    world.registerResource(new WorldMapResource(4))
    input = mockInput(world)

    player = characterCreators.player(world)
    placeCharacter(world, player, 0, new Vector([0, 0]))

    system = new PlayerControl()
  })

  it('does not move on zero delta', () => {
    mockReturnValue<Vector>(input.createMovementDelta, new Vector([0, 0]))
    system.update(world, player)
    expect(world.getComponent<PositionComponent>(player, 'position')!.position).toEqual(new Vector([0.5, 0.25]))
  })

  it('moves player position', () => {
    mockReturnValue<Vector>(input.createMovementDelta, new Vector([1, 0]))
    createFeatureFromType(world, 0, new Vector([0, 0]), 'corridor')

    system.update(world, player)
    expect(world.getComponent<PositionComponent>(player, 'position')!.position).toMatchSnapshot()
  })

  it('moves player in map', () => {
    world.getComponent<PositionComponent>(player, 'position')!.position = new Vector([0.8, 0.25])
    mockReturnValue<Vector>(input.createMovementDelta, new Vector([1, 0]))
    createFeatureFromType(world, 0, new Vector([0, 0]), 'corridor')
    createFeatureFromType(world, 0, new Vector([1, 0]), 'corridor')

    system.update(world, player)

    const map = world.getResource<WorldMapResource>('map')
    expect(map.levels[0].getCharacter(new Vector([0, 0]))).toBeUndefined()
    expect(map.levels[0].getCharacter(new Vector([1, 0]))).toEqual(player)
  })

  it('does not move player if moving into blocking', () => {
    world.getComponent<PositionComponent>(player, 'position')!.position = new Vector([0.8, 0.25])
    mockReturnValue<Vector>(input.createMovementDelta, new Vector([1, 0]))
    createFeatureFromType(world, 0, new Vector([0, 0]), 'corridor')

    system.update(world, player)

    expect(world.getComponent<PositionComponent>(player, 'position')!.position).toEqual(new Vector([0.8, 0.25]))

    const map = world.getResource<WorldMapResource>('map')
    expect(map.levels[0].getCharacter(new Vector([0, 0]))).toEqual(player)
    expect(map.levels[0].getCharacter(new Vector([1, 0]))).toBeUndefined()
  })
})
