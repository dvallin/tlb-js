import { registerComponents, TlbWorld } from '../../src/tlb'
import { Entity } from '../../src/ecs/entity'
import { World } from '../../src/ecs/world'
import { characterCreators } from '../../src/assets/characters'
import { Trigger } from '../../src/systems/trigger'
import { Uniform } from '../../src/random/distributions'
import { Random } from '../../src/random'
import { addDialog, AnswerType } from '../../src/assets/dialogs'
import { mockUi, mockReturnValue, callArgument, mockLog } from '../mocks'
import { UI } from '../../src/resources/ui'
import { State } from '../../src/game-states/state'
import { TriggeredByComponent } from '../../src/components/trigger'
import { createAssetFromShape, createAsset } from '../../src/components/asset'
import { Rectangle } from '../../src/geometry/rectangle'
import { WorldMapResource, WorldMap } from '../../src/resources/world-map'
import { createFeatureFromType } from '../../src/components/feature'
import { Log } from '../../src/resources/log'
import { renderMap } from '../render'
import { Vector } from '../../src/spatial'
import { PositionComponent } from '../../src/components/position'

describe('Trigger', () => {
  let world: TlbWorld
  let player: Entity
  let guard: Entity
  let ui: UI
  let log: Log
  let map: WorldMap
  let pushState: () => void
  let system: Trigger
  beforeEach(() => {
    world = new World()
    registerComponents(world)
    world.registerResource(new WorldMapResource(4))
    map = world.getResource<WorldMapResource>('map')
    ui = mockUi(world)
    log = mockLog(world)

    player = characterCreators.player(world)
    guard = characterCreators.guard(world)
    world
      .editEntity(player)
      .withComponent('start-turn', {})
      .withComponent('position', { level: 0, position: new Vector([1, 0]) })
    pushState = jest.fn()

    system = new Trigger(new Random(new Uniform('1')), pushState)
  })

  describe('dialog triggers', () => {
    it('opens a dialog modal', () => {
      addDialog(world, guard, 'randomRemarks')
      world.editEntity(guard).withComponent<TriggeredByComponent>('triggered-by', { entity: player })

      system.update(world, guard)

      expect(ui.showDialogModal).toHaveBeenCalled()
      expect((callArgument(pushState, 0, 0) as State).name).toEqual('modal')
    })

    it('closes dialog', () => {
      mockReturnValue<boolean>(ui.dialogShowing, true)
      mockReturnValue<AnswerType>(ui.dialogResult, 'close')
      addDialog(world, guard, 'randomRemarks')
      world.editEntity(guard).withComponent<TriggeredByComponent>('triggered-by', { entity: player })

      system.update(world, guard)

      expect(world.hasComponent(guard, 'active')).toBeFalsy()
      expect(world.hasComponent(guard, 'triggered-by')).toBeFalsy()
    })

    it('handles attack result', () => {
      mockReturnValue<boolean>(ui.dialogShowing, true)
      mockReturnValue<AnswerType>(ui.dialogResult, 'attack')
      addDialog(world, guard, 'randomRemarks')
      world.editEntity(guard).withComponent<TriggeredByComponent>('triggered-by', { entity: player })

      system.update(world, guard)

      expect(world.hasComponent(guard, 'wait-turn')).toBeTruthy()
      expect(world.hasComponent(player, 'start-turn')).toBeTruthy()
    })
  })

  describe('asset triggers', () => {
    describe('door', () => {
      it('opens', () => {
        map.levels[0].boundary.foreach(p => createFeatureFromType(world, 0, p, 'corridor'))
        const door = createAssetFromShape(world, 0, new Rectangle(1, 1, 3, 1), 'door')

        world.editEntity(door).withComponent<TriggeredByComponent>('triggered-by', { entity: player })
        system.update(world, door)

        expect(renderMap(world)).toMatchSnapshot()
      })

      it('opens and then closes', () => {
        map.levels[0].boundary.foreach(p => createFeatureFromType(world, 0, p, 'corridor'))
        const door = createAssetFromShape(world, 0, new Rectangle(1, 1, 3, 1), 'door')

        world.editEntity(door).withComponent<TriggeredByComponent>('triggered-by', { entity: player })
        system.update(world, door)
        world.editEntity(door).withComponent<TriggeredByComponent>('triggered-by', { entity: player })
        system.update(world, door)

        expect(renderMap(world)).toMatchSnapshot()
      })
    })

    describe('loot', () => {
      it('lootable opens dialog and pushes modal state', () => {
        map.levels[0].boundary.foreach(p => createFeatureFromType(world, 0, p, 'corridor'))
        const loot = createAssetFromShape(world, 0, new Rectangle(1, 1, 1, 1), 'loot')

        world.editEntity(loot).withComponent<TriggeredByComponent>('triggered-by', { entity: player })
        system.update(world, loot)

        expect(ui.showInventoryTransferModal).toHaveBeenCalled()
        expect((callArgument(pushState, 0, 0) as State).name).toEqual('modal')
      })

      it('removes lootable if it is empty after close', () => {
        ui.isModal = true
        mockReturnValue<boolean>(ui.inventoryTransferModalShowing, false)
        map.levels[0].boundary.foreach(p => createFeatureFromType(world, 0, p, 'corridor'))
        const loot = createAssetFromShape(world, 0, new Rectangle(1, 1, 1, 1), 'loot')

        world.editEntity(loot).withComponent<TriggeredByComponent>('triggered-by', { entity: player })
        system.update(world, loot)

        expect(ui.isModal).toBeFalsy()
        expect(world.hasEntity(loot)).toBeFalsy()
      })
    })

    describe('container', () => {
      it('lootable opens dialog and pushes modal state', () => {
        map.levels[0].boundary.foreach(p => createFeatureFromType(world, 0, p, 'corridor'))
        const loot = createAssetFromShape(world, 0, new Rectangle(1, 1, 1, 1), 'table')

        world.editEntity(loot).withComponent<TriggeredByComponent>('triggered-by', { entity: player })
        system.update(world, loot)

        expect(ui.showInventoryTransferModal).toHaveBeenCalled()
        expect((callArgument(pushState, 0, 0) as State).name).toEqual('modal')
      })

      it('does not remove lootable if it is empty after close', () => {
        ui.isModal = true
        mockReturnValue<boolean>(ui.inventoryTransferModalShowing, false)
        map.levels[0].boundary.foreach(p => createFeatureFromType(world, 0, p, 'corridor'))
        const loot = createAssetFromShape(world, 0, new Rectangle(1, 1, 1, 1), 'trash')

        world.editEntity(loot).withComponent<TriggeredByComponent>('triggered-by', { entity: player })
        system.update(world, loot)

        expect(ui.isModal).toBeFalsy()
        expect(world.hasEntity(loot)).toBeTruthy()
      })
    })

    describe('generator', () => {
      it('logs a noise', () => {
        const shape = new Rectangle(0, 0, 2, 2)
        shape.foreach(p => createFeatureFromType(world, 0, p, 'corridor'))
        const generator = createAssetFromShape(world, 0, shape, 'generator')

        world.editEntity(generator).withComponent<TriggeredByComponent>('triggered-by', { entity: player })
        system.update(world, generator)

        expect(log.text).toHaveBeenCalledWith('clonck')
      })
    })

    describe('elevator', () => {
      it('opens a dialog modal', () => {
        map.levels[0].boundary.foreach(p => createFeatureFromType(world, 0, p, 'corridor'))
        const elevator = createAsset(world, 0, new Vector([0, 0]), 'up', 'elevator')

        world.editEntity(elevator).withComponent<TriggeredByComponent>('triggered-by', { entity: player })
        system.update(world, elevator)

        expect(ui.showDialogModal).toHaveBeenCalled()
        expect((callArgument(pushState, 0, 0) as State).name).toEqual('modal')
      })

      it('moves up', () => {
        mockReturnValue<boolean>(ui.dialogShowing, true)
        mockReturnValue<AnswerType>(ui.dialogResult, 'move_level_up')
        map.levels[0].boundary.foreach(p => createFeatureFromType(world, 0, p, 'corridor'))
        map.levels[1].boundary.foreach(p => createFeatureFromType(world, 1, p, 'corridor'))

        const elevator = createAsset(world, 0, new Vector([0, 0]), 'up', 'elevator')

        world.editEntity(elevator).withComponent<TriggeredByComponent>('triggered-by', { entity: player })
        system.update(world, elevator)

        expect(world.getComponent<PositionComponent>(player, 'position')!.level).toEqual(1)
        expect(world.hasComponent(elevator, 'active')).toBeFalsy()
        expect(world.hasComponent(elevator, 'triggered-by')).toBeFalsy()
      })

      it('moves down', () => {
        mockReturnValue<boolean>(ui.dialogShowing, true)
        mockReturnValue<AnswerType>(ui.dialogResult, 'move_level_down')
        map.levels[0].boundary.foreach(p => createFeatureFromType(world, 0, p, 'corridor'))
        map.levels[1].boundary.foreach(p => createFeatureFromType(world, 1, p, 'corridor'))
        world.getComponent<PositionComponent>(player, 'position')!.level = 1

        const elevator = createAsset(world, 0, new Vector([0, 0]), 'up', 'elevator')

        world.editEntity(elevator).withComponent<TriggeredByComponent>('triggered-by', { entity: player })
        system.update(world, elevator)

        expect(world.getComponent<PositionComponent>(player, 'position')!.level).toEqual(0)
        expect(world.hasComponent(elevator, 'active')).toBeFalsy()
        expect(world.hasComponent(elevator, 'triggered-by')).toBeFalsy()
      })
    })
  })
})
