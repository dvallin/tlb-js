import { Overview } from '../../src/ui/overview'
import { World } from '../../src/ecs/world'
import { TlbWorld } from '../../src/tlb'
import { mockInput, mockComponent, mockReturnValue, mockImplementation } from '../mocks'
import { Vector } from '../../src/spatial'
import { InventoryComponent, ItemComponent, EquipedItemsComponent } from '../../src/components/items'
import { Storage } from '../../src/ecs/storage'
import { Entity } from '../../src/ecs/entity'
import { Input } from '../../src/resources/input'
import { CharacterStatsComponent, createCharacterStatsComponent } from '../../src/components/character-stats'
import { ActiveEffectsComponent } from '../../src/components/effects'
import { TakeTurnComponent } from '../../src/components/rounds'
import { FeatureComponent } from '../../src/components/feature'
import { takeSnapshot, MockRenderer, createMockRenderer, clear } from './mock-display'
import { features } from '../../src/assets/features'

const mockItems: { [idx: number]: ItemComponent } = {
  2: { type: 'bandages' },
  3: { type: 'deathPill' },
}
const mockFeatures: { [idx: number]: FeatureComponent } = {
  4: { feature: () => features['eliteGuard'] },
  5: { feature: () => features['guard'] },
}

describe('ActionSelector', () => {
  let inventory: Storage<InventoryComponent>
  let item: Storage<ItemComponent>
  let equiped: Storage<EquipedItemsComponent>

  let stats: Storage<CharacterStatsComponent>
  let features: Storage<FeatureComponent>
  let activeEffects: Storage<ActiveEffectsComponent>

  let takeTurn: Storage<TakeTurnComponent>
  let tookTurn: Storage<{}>
  let waitTurn: Storage<{}>

  let overview: Overview
  let world: TlbWorld
  let renderer: MockRenderer
  let input: Input
  beforeEach(() => {
    overview = new Overview(0, 1, new Vector([0, 0]), 30)
    world = new World()
    input = mockInput(world)

    stats = mockComponent(world, 'character-stats')
    features = mockComponent(world, 'feature')
    activeEffects = mockComponent(world, 'active-effects')

    takeTurn = mockComponent(world, 'take-turn')
    tookTurn = mockComponent(world, 'took-turn')
    waitTurn = mockComponent(world, 'wait-turn')

    inventory = mockComponent(world, 'inventory')
    mockReturnValue<InventoryComponent>(inventory.get, { content: [] })
    renderer = createMockRenderer()
    item = mockComponent(world, 'item')
    equiped = mockComponent(world, 'equiped-items')
  })

  it('displays inventory', () => {
    mockReturnValue<InventoryComponent>(inventory.get, { content: [2, 3] })
    mockReturnValue<EquipedItemsComponent>(equiped.get, { equipment: [{ entity: 2, bodyParts: ['head', 'torso'] }] })
    mockImplementation(item.get, (e: Entity) => mockItems[e])

    overview.update(world)
    overview.render(renderer.renderer)

    takeSnapshot(renderer)
  })

  it('collapses inventory', () => {
    mockReturnValue<InventoryComponent>(inventory.get, { content: [2, 3] })
    mockReturnValue<EquipedItemsComponent>(equiped.get, { equipment: [{ entity: 2, bodyParts: ['head', 'torso'] }] })
    mockImplementation(item.get, (e: Entity) => mockItems[e])

    input.position = { x: 3, y: 0 }
    input.mousePressed = true
    overview.update(world)
    overview.render(renderer.renderer)

    clear(renderer)
    overview.update(world)
    overview.render(renderer.renderer)

    takeSnapshot(renderer)
  })

  it('displays body parts', () => {
    mockReturnValue<CharacterStatsComponent>(stats.get, createCharacterStatsComponent('player'))
    mockReturnValue<ActiveEffectsComponent>(activeEffects.get, {
      effects: [
        { effect: { type: 'bleed', global: false, negated: false }, bodyPart: 'torso' },
        { effect: { type: 'confuse', global: true, negated: false } },
      ],
    })

    overview.update(world)
    overview.render(renderer.renderer)

    takeSnapshot(renderer)
  })

  it('displays turn info', () => {
    mockReturnValue<CharacterStatsComponent>(stats.get, createCharacterStatsComponent('player'))
    mockReturnValue<ActiveEffectsComponent>(activeEffects.get, { effects: [] })
    mockReturnValue<TakeTurnComponent>(takeTurn.get, { movements: 1, actions: 2 })
    mockImplementation(features.get, (e: Entity) => mockFeatures[e])
    mockImplementation(waitTurn.foreach, (f: (entity: Entity) => void) => {
      f(4)
    })
    mockImplementation(tookTurn.foreach, (f: (entity: Entity) => void) => {
      f(5)
    })

    overview.update(world)
    overview.render(renderer.renderer)

    takeSnapshot(renderer)
  })
})
