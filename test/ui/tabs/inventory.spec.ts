import { Inventory } from '../../../src/ui/tabs/inventory'
import { Rectangle } from '../../../src/geometry/rectangle'
import { World } from '../../../src/ecs/world'
import { registerComponents, TlbWorld } from '../../../src/tlb'
import { WorldMapResource } from '../../../src/resources/world-map'
import { Entity } from '../../../src/ecs/entity'
import { characterCreators } from '../../../src/assets/characters'
import { mockInput, mockReturnValue, mockImplementation } from '../../mocks'
import { stringRenderer } from '../../render'
import { Input, NumericKeyboardCommand, KeyboardCommand } from '../../../src/resources/input'
import { EquipedItemsComponent } from '../../../src/components/items'

describe('FullInventoryView', () => {
  let world: TlbWorld
  let player: Entity
  let inventory: Inventory
  let input: Input
  beforeEach(() => {
    world = new World()
    registerComponents(world)
    world.registerResource(new WorldMapResource(4))
    world.getResource<WorldMapResource>('map')

    player = characterCreators.player(world)

    inventory = new Inventory(player)
    inventory.setFull(new Rectangle(0, 0, 20, 8))

    input = mockInput(world)
  })

  it('displays inventory', () => {
    inventory.full!.update(world)

    const { renderer, getDisplay } = stringRenderer()
    inventory.full!.render(renderer)
    expect(getDisplay()).toMatchSnapshot()
  })

  it('displays description of selection', () => {
    mockReturnValue<NumericKeyboardCommand>(input.numericActive, 2)
    inventory.full!.update(world)

    const { renderer, getDisplay } = stringRenderer()
    inventory.full!.render(renderer)
    expect(getDisplay()).toMatchSnapshot()
  })

  it('unequips selection', () => {
    toggleNailGun()
    expect(world.getComponent<EquipedItemsComponent>(player, 'equiped-items')!.equipment).toHaveLength(1)
  })

  it('does not equip if not possible', () => {
    toggleSniperRifle()
    expect(world.getComponent<EquipedItemsComponent>(player, 'equiped-items')!.equipment).toHaveLength(2)
  })

  it('equips after unequiping', () => {
    toggleNailGun()
    goBack()
    toggleSniperRifle()
    expect(world.getComponent<EquipedItemsComponent>(player, 'equiped-items')!.equipment).toHaveLength(2)
  })

  function toggleItem(command: NumericKeyboardCommand) {
    mockReturnValue<NumericKeyboardCommand>(input.numericActive, command)
    inventory.full!.update(world)
    mockImplementation<KeyboardCommand, boolean>(input.isActive, k => k === 0)
    inventory.full!.update(world)
  }

  function toggleNailGun(): void {
    toggleItem(4)
  }

  function toggleSniperRifle(): void {
    toggleItem(2)
  }

  function goBack(): void {
    mockImplementation<KeyboardCommand, boolean>(input.isActive, k => k === 'cancel')
    inventory.full!.update(world)
  }
})

describe('MinimizedInventoryView', () => {
  let world: TlbWorld
  let player: Entity
  let inventory: Inventory
  beforeEach(() => {
    world = new World()
    registerComponents(world)
    world.registerResource(new WorldMapResource(4))
    world.getResource<WorldMapResource>('map')

    player = characterCreators.player(world)

    inventory = new Inventory(player)
    inventory.setMinimized(new Rectangle(0, 0, 20, 8))
  })

  it('displays inventory', () => {
    inventory.minimized!.update(world)

    const { renderer, getDisplay } = stringRenderer()
    inventory.minimized!.render(renderer)
    expect(getDisplay()).toMatchSnapshot()
  })
})
