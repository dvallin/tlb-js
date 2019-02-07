import { PlayerControl } from '../../src/systems/player-control'
import { TlbWorld } from '../../src/tlb'
import { World } from '../../src/ecs/world'
import { Input } from '../../src/resources/input'
import { VectorStorage } from '../../src/ecs/storage'
import { Vector } from '../../src/spatial'
import { PositionComponent } from '../../src/components/position'
import { WorldMap } from '../../src/resources/world-map'
import { mockMap, mockReturnValue } from '../mocks'

describe('PlayerControl', () => {
  let system: PlayerControl
  let world: TlbWorld
  let input: Input
  let map: WorldMap
  beforeEach(() => {
    system = new PlayerControl()
    world = new World()
    input = new Input(jest.fn())
    world.registerResource(input)
    map = mockMap(world)
    world.registerComponentStorage('position', new VectorStorage<PositionComponent>())
    world.createEntity().withComponent('position', { position: new Vector(2, 3) })
  })

  it('only adds delta if non blocking', () => {
    input.createMovementDelta = jest.fn().mockReturnValue(new Vector(-1, 0))
    mockReturnValue(map.isTileBlocking, true)

    system.update(world, 0)

    expect(world.getComponent(0, 'position')).toEqual({ position: new Vector(2, 3) })
  })

  describe('movement allowed', () => {
    beforeEach(() => {
      input.createMovementDelta = jest.fn().mockReturnValue(new Vector(-1, 0))
      mockReturnValue(map.isTileBlocking, false)

      system.update(world, 0)
    })

    it('adds delta times speed', () => {
      expect(world.getComponent(0, 'position')).toEqual({ position: new Vector(1.87, 3) })
    })

    it('moves character', () => {
      expect(map.characters.remove).toHaveBeenCalledWith(new Vector(2, 3))
      expect(map.characters.set).toHaveBeenCalledWith(new Vector(1, 3), 0)
    })
  })
})
