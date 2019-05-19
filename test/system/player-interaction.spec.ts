import { TlbWorld } from '../../src/tlb'
import { World } from '../../src/ecs/world'
import { mockComponent, mockMap, mockInput, callArgument, mockReturnValue, mockImplementation } from '../mocks'
import { PositionComponent } from '../../src/components/position'
import { Input } from '../../src/resources/input'
import { KEYS } from 'rot-js'
import { PlayerInteraction } from '../../src/systems/player-interaction'
import { Storage } from '../../src/ecs/storage'
import { Vector } from '../../src/spatial'
import { FunctionalShape } from '../../src/geometry/functional-shape'
import { Shape } from '../../src/geometry/shape'
import { WorldMap } from '../../src/resources/world-map'
import { Rectangle } from '../../src/geometry/rectangle'
import { TriggeredByComponent } from '../../src/components/trigger'

describe('PlayerInteraction', () => {
  let world: TlbWorld

  let input: Input
  let map: WorldMap
  let actives: Storage<{}>
  let triggers: Storage<{}>
  let triggeredBy: Storage<TriggeredByComponent>
  beforeEach(() => {
    world = new World()
    map = mockMap(world)
    input = mockInput(world)

    const positions = mockComponent<PositionComponent>(world, 'position')
    mockReturnValue(positions.get, { position: new Vector(1.2, 1.3) })

    actives = mockComponent<PositionComponent>(world, 'active')
    triggers = mockComponent<PositionComponent>(world, 'triggers')
    triggeredBy = mockComponent<TriggeredByComponent>(world, 'triggered-by')
  })

  describe('when E key is hit', () => {
    beforeEach(() => {
      input.keyPressed.add(KEYS.VK_E)
    })

    it('searches for triggers', () => {
      const playerInteraction = new PlayerInteraction()
      playerInteraction.findTrigger = jest.fn()

      playerInteraction.update(world, 0)

      const searchShape = callArgument<Shape>(playerInteraction.findTrigger, 0, 2)
      const expectedShape = FunctionalShape.lN(new Vector(1, 1), 1, true)
      expect(searchShape.equals(expectedShape)).toBeTruthy()
    })

    it('activates triggers', () => {
      const playerInteraction = new PlayerInteraction()
      playerInteraction.findTrigger = jest.fn().mockReturnValue(42)

      playerInteraction.update(world, 0)

      expect(actives.insert).toHaveBeenCalledWith(42, {})
    })
  })

  describe('findTrigger', () => {
    beforeEach(() => {
      mockImplementation(map.getTile, (p: Vector) => (p.key === '1,1' ? 42 : undefined))
    })

    it('finds triggers', () => {
      const playerInteraction = new PlayerInteraction()
      mockImplementation(triggers.get, entity => (entity === 42 ? {} : undefined))
      mockReturnValue(triggeredBy.get, undefined)

      const trigger = playerInteraction.findTrigger(world, map, new Rectangle(0, 0, 2, 2))

      expect(trigger).toEqual(42)
    })

    it('finds triggers behind triggeredBy relationships', () => {
      const playerInteraction = new PlayerInteraction()
      mockImplementation(triggers.get, entity => (entity === 43 ? {} : undefined))
      mockReturnValue(triggeredBy.get, { entity: 43 })

      const trigger = playerInteraction.findTrigger(world, map, new Rectangle(0, 0, 2, 2))

      expect(trigger).toEqual(43)
    })
  })
})
