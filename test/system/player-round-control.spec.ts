import { Uniform } from '../../src/random/distributions'
import { World } from '../../src/ecs/world'
import { TlbWorld, registerComponents } from '../../src/tlb'
import { mockQueries, mockUi, mockReturnValue, mockInput, mockLog, mockImplementation } from '../mocks'
import { PlayerRoundControl } from '../../src/systems/player-round-control'
import { Random } from '../../src/random'
import { characterCreators, take } from '../../src/assets/characters'
import { Vector } from '../../src/spatial'
import { TakeTurnComponent } from '../../src/components/rounds'
import { SelectedAction, SelectedActionComponent } from '../../src/components/action'
import { UI } from '../../src/resources/ui'
import { actions } from '../../src/assets/actions'
import { Entity } from '../../src/ecs/entity'
import { Path } from '../../src/renderer/astar'
import { placeCharacter } from '../../src/component-reducers/place-character'
import { EffectComponent } from '../../src/components/effects'
import { InventoryComponent } from '../../src/components/items'
import { WorldMapResource } from '../../src/resources/world-map'
import { Input, KeyboardCommand } from '../../src/resources/input'
import { ViewportResource } from '../../src/resources/viewport'

describe('PlayerRoundControl', () => {
  let world: TlbWorld
  let player: Entity
  let ui: UI
  let input: Input
  let control: PlayerRoundControl
  beforeEach(() => {
    world = new World()
    registerComponents(world)

    world.registerResource(new ViewportResource(new Vector([4, 4])))
    world.registerResource(new WorldMapResource(4))
    mockLog(world)
    ui = mockUi(world)
    input = mockInput(world)

    player = characterCreators.player(world)
    placeCharacter(world, player, 0, new Vector([0, 0]))
    world.editEntity(player).withComponent<TakeTurnComponent>('take-turn', { actions: 5, movements: 4 })

    control = new PlayerRoundControl(mockQueries(), new Random(new Uniform('12')))
  })

  it('initializes selected action and opens selector', () => {
    control.update(world, player)

    expect(world.hasComponent(player, 'selected-action')).toBeTruthy()
    expect(ui.showActionSelector).toHaveBeenCalledTimes(1)
  })

  it('sets selection and hides selector', () => {
    const selection = { entity: 42, action: actions.endTurn }
    mockReturnValue<SelectedAction>(ui.selectedAction, { entity: 42, action: actions.endTurn })
    world.editEntity(player).withComponent<SelectedActionComponent>('selected-action', { skippedActions: 0, currentSubAction: 0 })

    control.update(world, player)

    expect(world.getComponent<SelectedActionComponent>(player, 'selected-action')!.selection).toEqual(selection)
    expect(ui.hideSelectors).toHaveBeenCalledTimes(1)
  })

  describe('end turn action', () => {
    it('endTurn removes all AP and MP ', () => {
      const selection = { entity: player, action: actions.endTurn }
      world
        .editEntity(player)
        .withComponent<SelectedActionComponent>('selected-action', { skippedActions: 0, currentSubAction: 0, selection })

      control.update(world, player)

      expect(world.getComponent<TakeTurnComponent>(player, 'take-turn')).toEqual({ actions: 0, movements: 0 })
      expect(world.hasComponent(player, 'selected-action')).toBeFalsy()
    })
  })

  describe('move action', () => {
    it('shows move selector', () => {
      player
      const selection = { entity: player, action: actions.longMove }
      world
        .editEntity(player)
        .withComponent<SelectedActionComponent>('selected-action', { skippedActions: 0, currentSubAction: 0, selection })

      control.update(world, player)

      expect(ui.showMovementSelector).toHaveBeenCalledTimes(1)
    })

    it('creates movement script and increases subaction', () => {
      const selection = { entity: player, action: actions.longMove }
      const path = [new Vector([0, 1]), new Vector([0, 2])]
      mockReturnValue<Path>(ui.selectedMovement, { path, cost: 2 })
      world
        .editEntity(player)
        .withComponent<SelectedActionComponent>('selected-action', { skippedActions: 0, currentSubAction: 0, selection })

      control.update(world, player)

      expect(world.hasComponent(player, 'script')).toBeTruthy()
      expect(world.getComponent<SelectedActionComponent>(player, 'selected-action')!.currentSubAction).toEqual(1)
    })
  })

  describe('attack action', () => {
    it('shows attack selector', () => {
      player
      const selection = { entity: 42, action: actions.bolt }
      world
        .editEntity(player)
        .withComponent<SelectedActionComponent>('selected-action', { skippedActions: 0, currentSubAction: 0, selection })

      control.update(world, player)

      expect(ui.showAttackSelector).toHaveBeenCalledTimes(1)
    })

    it('selects first enemy on path', () => {
      const selection = { entity: 42, action: actions.bolt }
      mockReturnValue<Path>(ui.selectedAttack, { path: [new Vector([0, 1]), new Vector([0, 2])], cost: 2 })
      const firstEnemy = characterCreators.guard(world)
      const secondEnemy = characterCreators.guard(world)
      placeCharacter(world, firstEnemy, 0, new Vector([0, 1]))
      placeCharacter(world, secondEnemy, 0, new Vector([0, 2]))
      world
        .editEntity(player)
        .withComponent<SelectedActionComponent>('selected-action', { skippedActions: 0, currentSubAction: 0, selection })

      control.update(world, player)

      expect(world.getComponent<SelectedActionComponent>(player, 'selected-action')!.target).toEqual(firstEnemy)
    })

    it('applies effects and increases subaction', () => {
      const selection = { entity: 42, action: actions.bolt }
      const target = characterCreators.guard(world)
      placeCharacter(world, target, 0, new Vector([0, 1]))
      world
        .editEntity(player)
        .withComponent<SelectedActionComponent>('selected-action', { skippedActions: 0, currentSubAction: 0, selection, target })

      control.update(world, player)

      expect(world.getStorage<EffectComponent>('effect').size()).toEqual(2)
      world.getStorage<EffectComponent>('effect').foreach((_, effect) => {
        expect(effect.source).toEqual(player)
        expect(effect.target).toEqual(target)
      })
      expect(world.getComponent<SelectedActionComponent>(player, 'selected-action')!.currentSubAction).toEqual(1)
    })
  })

  describe('status action', () => {
    it('shows multiple choice selector', () => {
      const selection = { entity: 42, action: actions.healLimp }
      world
        .editEntity(player)
        .withComponent<SelectedActionComponent>('selected-action', { skippedActions: 0, currentSubAction: 0, selection })

      control.update(world, player)

      expect(ui.showMultipleChoiceSelector).toHaveBeenCalledTimes(1)
    })

    it('applies effect and increases subaction', () => {
      const selection = { entity: 42, action: actions.healLimp }
      mockReturnValue<Entity>(ui.selectedOption, 0)
      world
        .editEntity(player)
        .withComponent<SelectedActionComponent>('selected-action', { skippedActions: 0, currentSubAction: 0, selection })

      control.update(world, player)

      expect(ui.showMultipleChoiceSelector).toHaveBeenCalledTimes(1)

      expect(world.getStorage<EffectComponent>('effect').size()).toEqual(2)
      world.getStorage<EffectComponent>('effect').foreach((_, effect) => {
        expect(effect.source).toEqual(player)
        expect(effect.target).toEqual(player)
      })
      expect(world.getComponent<SelectedActionComponent>(player, 'selected-action')!.currentSubAction).toEqual(1)
    })

    it('consumes item', () => {
      const bandages = take(world, player, 'bandages')
      const selection = { entity: bandages, action: actions.healLimp }
      mockReturnValue<Entity>(ui.selectedOption, 0)
      world
        .editEntity(player)
        .withComponent<SelectedActionComponent>('selected-action', { skippedActions: 0, currentSubAction: 0, selection })

      control.update(world, player)

      expect(ui.showMultipleChoiceSelector).toHaveBeenCalledTimes(1)

      world.getComponent<InventoryComponent>(player, 'inventory')!.content.every(e => e !== bandages)
    })
  })

  describe('skip action', () => {
    it('increases subaction and skipped action', () => {
      const selection = { entity: 42, action: actions.healLimp }
      mockImplementation<KeyboardCommand, boolean>(input.isActive, key => key === 'cancel')
      world
        .editEntity(player)
        .withComponent<SelectedActionComponent>('selected-action', { skippedActions: 0, currentSubAction: 0, selection })

      control.update(world, player)

      expect(world.getComponent<SelectedActionComponent>(player, 'selected-action')!.currentSubAction).toEqual(1)
      expect(world.getComponent<SelectedActionComponent>(player, 'selected-action')!.skippedActions).toEqual(1)
    })
  })

  describe('AP and MP consumption', () => {
    it('actions are fully credited if not all subactions are skipped', () => {
      const selection = { entity: 42, action: actions.hitAndRun }
      world
        .editEntity(player)
        .withComponent<SelectedActionComponent>('selected-action', { skippedActions: 1, currentSubAction: 2, selection })

      control.update(world, player)

      expect(world.getComponent<TakeTurnComponent>(player, 'take-turn')).toEqual({ actions: 2, movements: 1 })
    })

    it('actions are not credited if all subactions are skipped', () => {
      const selection = { entity: 42, action: actions.hitAndRun }
      world
        .editEntity(player)
        .withComponent<SelectedActionComponent>('selected-action', { skippedActions: 2, currentSubAction: 2, selection })

      control.update(world, player)

      expect(world.getComponent<TakeTurnComponent>(player, 'take-turn')).toEqual({ actions: 5, movements: 4 })
    })

    it('cost all actions are fully credited', () => {
      const selection = { entity: 42, action: actions.rush }
      world
        .editEntity(player)
        .withComponent<SelectedActionComponent>('selected-action', { skippedActions: 0, currentSubAction: 1, selection })

      control.update(world, player)

      expect(world.getComponent<TakeTurnComponent>(player, 'take-turn')).toEqual({ actions: 0, movements: 0 })
    })
  })

  it('ends turn if no AP and MP left', () => {
    world.editEntity(player).withComponent<TakeTurnComponent>('take-turn', { actions: 0, movements: 0 })

    control.update(world, player)

    expect(world.hasComponent(player, 'took-turn')).toBeTruthy()
    expect(world.hasComponent(player, 'take-turn')).toBeFalsy()
  })
})
