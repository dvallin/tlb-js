import { InventoryTransferModal } from '../../src/ui/inventory-transfer-modal'
import { Rectangle } from '../../src/geometry/rectangle'
import { characterCreators } from '../../src/assets/characters'
import { WorldMapResource } from '../../src/resources/world-map'
import { registerComponents, TlbWorld } from '../../src/tlb'
import { World } from '../../src/ecs/world'
import { stringRenderer } from '../render'
import { mockInput, mockImplementation, mockReturnValue } from '../mocks'
import { Input, KeyboardCommand, NumericKeyboardCommand } from '../../src/resources/input'
import { InventoryComponent } from '../../src/components/items'
import { Entity } from '../../src/ecs/entity'

describe('InventoryTransferModal', () => {
  let world: TlbWorld
  let modal: InventoryTransferModal
  let input: Input
  let guard: Entity
  beforeEach(() => {
    world = new World()
    registerComponents(world)

    world.registerResource(new WorldMapResource(4))
    input = mockInput(world)

    const player = characterCreators.player(world)
    guard = characterCreators.guard(world)
    modal = InventoryTransferModal.build(new Rectangle(0, 0, 30, 10), player, 'player', guard, 'guard')
  })

  it('displays two inventories', () => {
    modal.update(world)

    const { renderer, getDisplay } = stringRenderer()
    modal.render(renderer)
    expect(getDisplay()).toMatchSnapshot()
  })

  it('highlights right inventory', () => {
    mockImplementation<KeyboardCommand, boolean>(input.isActive, key => key === 'right')

    modal.update(world)

    const { renderer, getDisplay } = stringRenderer()
    modal.render(renderer)
    expect(getDisplay()).toMatchSnapshot()
  })

  it('transfers items', () => {
    mockReturnValue<NumericKeyboardCommand>(input.numericActive, 0)

    modal.update(world)

    expect(world.getComponent<InventoryComponent>(guard, 'inventory')!.content).toHaveLength(2)
  })

  it('does not transfer equiped items', () => {
    mockReturnValue<NumericKeyboardCommand>(input.numericActive, 4)

    modal.update(world)

    expect(world.getComponent<InventoryComponent>(guard, 'inventory')!.content).toHaveLength(1)
  })
})
