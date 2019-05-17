import { Fighting } from '../../src/game-states/fighting'
import { World } from '../../src/ecs/world'
import { TlbWorld } from '../../src/tlb'
import { mockComponent, mockReturnValue, mockViewport, mockImplementation, mockReturnValues } from '../mocks'
import { characterStats, CharacterStatsComponent } from '../../src/components/character-stats'
import { Viewport } from '../../src/resources/viewport'
import { Entity } from '../../src/ecs/entity'
import { TakeTurnComponent } from '../../src/components/rounds'
import { Storage } from '../../src/ecs/storage'

describe('Fighting', () => {
  const state = new Fighting()

  const playerStat: CharacterStatsComponent = { type: 'player', current: characterStats.player }
  const npcStat: CharacterStatsComponent = { type: 'eliteGuard', current: characterStats.eliteGuard }

  let world: TlbWorld
  let viewport: Viewport
  let takeTurn: Storage<TakeTurnComponent>
  let tookTurn: Storage<{}>
  let waitTurn: Storage<{}>
  let stats: Storage<{}>
  beforeEach(() => {
    world = new World()

    viewport = mockViewport(world)

    const player = mockComponent(world, 'player')
    mockReturnValue(player.first, 0)
    stats = mockComponent(world, 'character-stats')
    mockImplementation(stats.foreach, (f: (entity: Entity, value: CharacterStatsComponent) => void) => {
      f(0, playerStat)
      f(1, npcStat)
    })

    takeTurn = mockComponent(world, 'take-turn')
    tookTurn = mockComponent(world, 'took-turn')
    waitTurn = mockComponent(world, 'wait-turn')
  })

  describe('start', () => {
    beforeEach(() => {
      mockReturnValue(stats.get, playerStat)
    })

    it('enables grid lock ', () => {
      expect(viewport.gridLocked).toBeFalsy()

      const state = new Fighting()
      state.start(world)

      expect(viewport.gridLocked).toBeTruthy()
    })

    it('sets player to take turn', () => {
      const state = new Fighting()
      state.start(world)
      expect(stats.get).toHaveBeenCalledWith(0)
      expect(takeTurn.insert).toHaveBeenCalledWith(0, { actions: 3, movements: 3 })
      expect(waitTurn.remove).toHaveBeenCalledWith(0)
    })
  })

  describe('update', () => {
    beforeEach(() => {
      mockReturnValue(stats.get, npcStat)
      mockReturnValue(waitTurn.first, 1)
    })

    describe('when no one is taking turn', () => {
      beforeEach(() => {
        mockReturnValue(takeTurn.size, 0)
      })

      it('sets npc to take turn if he is waiting', () => {
        mockReturnValue(waitTurn.first, 1)
        state.update(world)
        expect(stats.get).toHaveBeenCalledWith(1)
        expect(takeTurn.insert).toHaveBeenCalledWith(1, { actions: 5, movements: 2 })
        expect(waitTurn.remove).toHaveBeenCalledWith(1)
      })

      it('starts new round if there is no one waiting', () => {
        mockImplementation(tookTurn.foreach, (f: (entity: Entity, value: CharacterStatsComponent) => void) => {
          f(0, playerStat)
          f(1, npcStat)
        })
        mockReturnValues(waitTurn.first, undefined, 42)
        state.update(world)
        expect(waitTurn.insert).toHaveBeenCalledWith(0, {})
        expect(waitTurn.insert).toHaveBeenCalledWith(1, {})
        expect(tookTurn.clear).toHaveBeenCalled()
        expect(stats.get).toHaveBeenCalledWith(42)
      })
    })
  })

  describe('stop', () => {
    beforeEach(() => {
      mockReturnValue(stats.get, playerStat)
    })

    it('resets grid lock', () => {
      expect(viewport.gridLocked).toBeFalsy()

      state.start(world)
      state.stop(world)

      expect(viewport.gridLocked).toBeFalsy()

      viewport.gridLocked = true

      state.start(world)
      state.stop(world)

      expect(viewport.gridLocked).toBeTruthy()
    })
  })

  it('is framelocked', () => expect(new Fighting().isFrameLocked()).toBeTruthy())
})
