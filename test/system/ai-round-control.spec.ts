import { AiRoundControl } from '../../src/systems/ai-round-control'
import { registerComponents, TlbWorld } from '../../src/tlb'
import { mockLog, mockQueries, mockReturnValue } from '../mocks'
import { ViewportResource } from '../../src/resources/viewport'
import { WorldMapResource } from '../../src/resources/world-map'
import { Vector } from '../../src/spatial'
import { characterCreators } from '../../src/assets/characters'
import { Entity } from '../../src/ecs/entity'
import { World } from '../../src/ecs/world'
import { TakeTurnComponent, SelectionState } from '../../src/components/rounds'
import { Uniform } from '../../src/random/distributions'
import { placeCharacter } from '../../src/component-reducers/place-character'
import { Queries } from '../../src/renderer/queries'
import { Path } from '../../src/renderer/astar'
import { actions } from '../../src/assets/actions'
import { EffectComponent } from '../../src/components/effects'

describe('AiRoundControl', () => {
  let world: TlbWorld
  let guard: Entity
  let player: Entity
  let system: AiRoundControl
  let queries: Queries
  beforeEach(() => {
    world = new World()
    registerComponents(world)

    world.registerResource(new ViewportResource(new Vector([4, 4])))
    world.registerResource(new WorldMapResource(4))
    mockLog(world)

    queries = mockQueries()
    system = new AiRoundControl(queries, new Uniform('12'))

    guard = characterCreators.guard(world)
    placeCharacter(world, guard, 0, new Vector([0, 0]))
    world.editEntity(guard).withComponent<TakeTurnComponent>('take-turn', { acted: false, moved: false, selectionState: undefined })
  })

  function getSelectionState(): SelectionState | undefined {
    return world.getComponent<TakeTurnComponent>(guard, 'take-turn')!.selectionState
  }

  function getTakeTurnComponent(): TakeTurnComponent {
    return world.getComponent<TakeTurnComponent>(guard, 'take-turn')!
  }

  function setSelectionState(selectionState: SelectionState | undefined): void {
    world.getComponent<TakeTurnComponent>(guard, 'take-turn')!.selectionState = selectionState
  }

  describe('action selection', () => {
    describe('standing next to player', () => {
      beforeEach(() => {
        player = characterCreators.player(world)
        placeCharacter(world, player, 0, new Vector([1, 0]))
      })

      it('ends turn if cannot hit player', () => {
        system.update(world, guard)

        expect(world.hasComponent(guard, 'take-turn')).toBeFalsy()
        expect(world.hasComponent(guard, 'took-turn')).toBeTruthy()
      })

      it('selects attack action against player', () => {
        mockReturnValue<Path>(queries.los, { path: [new Vector([1, 0])], cost: 1 })

        system.update(world, guard)

        expect(getSelectionState()!.target).toEqual(player)
        expect(getSelectionState()!.selection!.action.subActions.some(e => e.kind === 'attack')).toBeTruthy()
      })
    })

    describe('standing some tiles away from player', () => {
      beforeEach(() => {
        player = characterCreators.player(world)
        placeCharacter(world, player, 0, new Vector([3, 0]))
      })

      it('selects movement action towards player', () => {
        mockReturnValue<Path>(queries.los, { path: [new Vector([1, 0])], cost: 1 })

        system.update(world, guard)

        expect(getSelectionState()!.target).toEqual(player)
        expect(getSelectionState()!.selection!.action.subActions.some(e => e.kind === 'movement')).toBeTruthy()
      })
    })
  })

  describe('attack action', () => {
    beforeEach(() => {
      player = characterCreators.player(world)
      placeCharacter(world, player, 0, new Vector([1, 0]))
    })

    it('applies effects and increases subaction', () => {
      const selection = { entity: 42, action: actions.hit }
      setSelectionState({ skippedActions: 0, currentSubAction: 0, selection, target: player })
      mockReturnValue<Path>(queries.los, { path: [new Vector([1, 0])], cost: 1 })

      system.update(world, guard)

      expect(world.getStorage<EffectComponent>('effect').size()).toEqual(1)
      world.getStorage<EffectComponent>('effect').foreach((_, effect) => {
        expect(effect.source).toEqual(guard)
        expect(effect.target).toEqual(player)
      })
      expect(getSelectionState()!.currentSubAction).toEqual(1)
    })
  })

  describe('move action', () => {
    beforeEach(() => {
      player = characterCreators.player(world)
      placeCharacter(world, player, 0, new Vector([1, 0]))
    })

    it('creates script and increases subaction', () => {
      const selection = { entity: 42, action: actions.move }
      setSelectionState({ skippedActions: 0, currentSubAction: 0, selection, target: player })
      mockReturnValue<Path>(queries.shortestPath, { path: [new Vector([1, 0])], cost: 1 })

      system.update(world, guard)

      expect(world.hasComponent(guard, 'script')).toBeTruthy()
      expect(getSelectionState()!.currentSubAction).toEqual(1)
    })
  })

  describe('acted and moved fields', () => {
    it('actions credited', () => {
      const selection = { entity: 42, action: actions.hitAndRun }
      setSelectionState({ skippedActions: 1, currentSubAction: 2, selection })

      system.update(world, guard)

      expect(getTakeTurnComponent().acted).toBeTruthy()
      expect(getTakeTurnComponent().moved).toBeFalsy()
    })

    it('cost all actions are fully credited', () => {
      const selection = { entity: 42, action: actions.rush }
      setSelectionState({ skippedActions: 0, currentSubAction: 1, selection })

      system.update(world, guard)

      expect(getTakeTurnComponent().acted).toBeTruthy()
      expect(getTakeTurnComponent().moved).toBeTruthy()
    })
  })
})
