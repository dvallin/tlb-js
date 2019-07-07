import { PlayerControl } from '../../src/systems/player-control'
import { TlbWorld } from '../../src/tlb'
import { World } from '../../src/ecs/world'
import { Input } from '../../src/resources/input'
import { VectorStorage } from '../../src/ecs/storage'
import { Vector } from '../../src/spatial'
import { PositionComponent } from '../../src/components/position'
import { WorldMapResource } from '../../src/resources/world-map'
import { mockMap, mockReturnValue, mockInput } from '../mocks'
import { CharacterStatsComponent, createCharacterStatsComponent } from '../../src/components/character-stats'

describe('PlayerControl', () => {
  let system: PlayerControl
  let world: TlbWorld
  let input: Input
  let map: WorldMapResource
  beforeEach(() => {
    system = new PlayerControl()
    world = new World()
    input = mockInput(world)
    map = mockMap(world)
    world.registerComponentStorage('position', new VectorStorage<PositionComponent>())
    world.registerComponentStorage('character-stats', new VectorStorage<CharacterStatsComponent>())
    world
      .createEntity()
      .withComponent('position', { position: new Vector([2, 3]) })
      .withComponent<CharacterStatsComponent>('character-stats', createCharacterStatsComponent('player'))
  })

  it('only adds delta if non blocking', () => {
    input.createMovementDelta = jest.fn().mockReturnValue(new Vector([-1, 0]))
    mockReturnValue(map.isBlocking, true)

    system.update(world, 0)

    expect(world.getComponent(0, 'position')).toEqual({ position: new Vector([2, 3]) })
  })

  describe('movement allowed', () => {
    beforeEach(() => {
      input.createMovementDelta = jest.fn().mockReturnValue(new Vector([-1, 0]))
      mockReturnValue(map.isBlocking, false)

      system.update(world, 0)
    })

    it('adds delta times speed', () => {
      expect(world.getComponent(0, 'position')).toEqual({ position: new Vector([1.7692307692307692, 3]) })
    })

    it('moves character', () => {
      expect(map.removeCharacter).toHaveBeenCalledWith(new Vector([2, 3]))
      expect(map.setCharacter).toHaveBeenCalledWith(new Vector([1, 3]), 0)
    })
  })
})
