import { AiRoundControl } from '../../src/systems/ai-round-control'
import { registerComponents, TlbWorld } from '../../src/tlb'
import { mockLog, mockQueries, mockReturnValue } from '../mocks'
import { ViewportResource } from '../../src/resources/viewport'
import { WorldMapResource } from '../../src/resources/world-map'
import { Vector } from '../../src/spatial'
import { characterCreators } from '../../src/assets/characters'
import { Entity } from '../../src/ecs/entity'
import { World } from '../../src/ecs/world'
import { TakeTurnComponent } from '../../src/components/rounds'
import { Random } from '../../src/random'
import { Uniform } from '../../src/random/distributions'
import { placeCharacter } from '../../src/component-reducers/place-character'
import { Queries } from '../../src/renderer/queries'
import { Path } from '../../src/renderer/astar'
import { SelectedActionComponent } from '../../src/components/action'
import { actions } from '../../src/assets/actions'
import { EffectComponent } from '../../src/components/effects'

describe('AiRoundControl', () => {
  let world: TlbWorld
  let guard: Entity
  let player: Entity
  let control: AiRoundControl
  let queries: Queries
  beforeEach(() => {
    world = new World()
    registerComponents(world)

    world.registerResource(new ViewportResource(new Vector([4, 4])))
    world.registerResource(new WorldMapResource(4))
    mockLog(world)

    queries = mockQueries()
    control = new AiRoundControl(queries, new Random(new Uniform('12')))

    guard = characterCreators.guard(world)
    placeCharacter(world, guard, 0, new Vector([0, 0]))
    world.editEntity(guard).withComponent<TakeTurnComponent>('take-turn', { actions: 5, movements: 4 })
  })

  describe('action selection', () => {
    describe('standing next to player', () => {
      beforeEach(() => {
        player = characterCreators.player(world)
        placeCharacter(world, player, 0, new Vector([1, 0]))
      })

      it('ends turn if cannot hit player', () => {
        control.update(world, guard)

        expect(world.hasComponent(guard, 'take-turn')).toBeFalsy()
        expect(world.hasComponent(guard, 'took-turn')).toBeTruthy()
      })

      it('selects attack action against player', () => {
        mockReturnValue<Path>(queries.ray, { path: [new Vector([1, 0])], cost: 1 })

        control.update(world, guard)

        const selectedAction = world.getComponent<SelectedActionComponent>(guard, 'selected-action')!
        expect(selectedAction.target).toEqual(player)
        expect(selectedAction.selection!.action.subActions.some(e => e.kind === 'attack')).toBeTruthy()
      })
    })

    describe('standing some tiles away from player', () => {
      beforeEach(() => {
        player = characterCreators.player(world)
        placeCharacter(world, player, 0, new Vector([3, 0]))
      })

      it('selects movement action towards player', () => {
        mockReturnValue<Path>(queries.ray, { path: [new Vector([1, 0])], cost: 1 })

        control.update(world, guard)

        const selectedAction = world.getComponent<SelectedActionComponent>(guard, 'selected-action')!
        expect(selectedAction.target).toEqual(player)
        expect(selectedAction.selection!.action.subActions.some(e => e.kind === 'movement')).toBeTruthy()
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
      world
        .editEntity(guard)
        .withComponent<SelectedActionComponent>('selected-action', { skippedActions: 0, currentSubAction: 0, selection, target: player })
      mockReturnValue<Path>(queries.ray, { path: [new Vector([1, 0])], cost: 1 })

      control.update(world, guard)

      expect(world.getStorage<EffectComponent>('effect').size()).toEqual(1)
      world.getStorage<EffectComponent>('effect').foreach((_, effect) => {
        expect(effect.source).toEqual(guard)
        expect(effect.target).toEqual(player)
      })
      expect(world.getComponent<SelectedActionComponent>(guard, 'selected-action')!.currentSubAction).toEqual(1)
    })
  })

  describe('move action', () => {
    beforeEach(() => {
      player = characterCreators.player(world)
      placeCharacter(world, player, 0, new Vector([1, 0]))
    })

    it('creates script and increases subaction', () => {
      const selection = { entity: 42, action: actions.longMove }
      world
        .editEntity(guard)
        .withComponent<SelectedActionComponent>('selected-action', { skippedActions: 0, currentSubAction: 0, selection, target: player })
      mockReturnValue<Path>(queries.shortestPath, { path: [new Vector([1, 0])], cost: 1 })

      control.update(world, guard)

      expect(world.hasComponent(guard, 'script')).toBeTruthy()
      expect(world.getComponent<SelectedActionComponent>(guard, 'selected-action')!.currentSubAction).toEqual(1)
    })
  })

  describe('AP and MP consumption', () => {
    it('actions credited', () => {
      const selection = { entity: 42, action: actions.hitAndRun }
      world
        .editEntity(guard)
        .withComponent<SelectedActionComponent>('selected-action', { skippedActions: 1, currentSubAction: 2, selection })

      control.update(world, guard)

      expect(world.getComponent<TakeTurnComponent>(guard, 'take-turn')).toEqual({ actions: 2, movements: 1 })
    })

    it('cost all actions are fully credited', () => {
      const selection = { entity: 42, action: actions.rush }
      world
        .editEntity(guard)
        .withComponent<SelectedActionComponent>('selected-action', { skippedActions: 0, currentSubAction: 1, selection })

      control.update(world, guard)

      expect(world.getComponent<TakeTurnComponent>(guard, 'take-turn')).toEqual({ actions: 0, movements: 0 })
    })
  })
})
