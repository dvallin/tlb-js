import { BodyPart, CharacterStats, CharacterStatsComponent, createCharacterStatsComponent } from '../components/character-stats'
import { TlbWorld } from '../tlb'
import { features, FeatureType } from './features'
import { FeatureComponent } from '../components/feature'
import { FovComponent } from '../components/fov'
import { HasActionComponent } from '../components/action'
import { ItemComponent, InventoryComponent, EquipedItemsComponent } from '../components/items'
import { ActiveEffectsComponent } from '../components/effects'
import { CharacterCreator } from '../generative/complex-embedder'
import { Entity } from '../ecs/entity'
import { AiComponent } from '../components/ai'
import { ActionType } from './actions'
import { ItemType } from './items'
import { addDialog } from './dialogs'
import { TriggersComponent } from '../components/trigger'

function humanoidBodyParts(core: number, head: number, limp: number): { [key: string]: BodyPart } {
  return {
    head: { type: 'head', itemAttachments: ['helmet'], health: head },
    leftArm: { type: 'arm', itemAttachments: ['glove', 'weapon'], health: limp },
    rightArm: { type: 'arm', itemAttachments: ['glove', 'weapon'], health: limp },
    torso: { type: 'torso', itemAttachments: ['armor'], health: core },
    leftLeg: { type: 'leg', itemAttachments: ['pants', 'boots'], health: limp },
    rightLeg: { type: 'leg', itemAttachments: ['pants', 'boots'], health: limp },
  }
}

const charactersStatsDefinition = {
  player: {
    bodyParts: humanoidBodyParts(14, 5, 5),
    strength: 5,
    movement: 4,
    actions: 4,
    aim: 10,
  },
  guard: {
    bodyParts: humanoidBodyParts(3, 1, 1),
    strength: 5,
    movement: 3,
    actions: 3,
    aim: 6,
  },
  eliteGuard: {
    bodyParts: humanoidBodyParts(5, 3, 3),
    strength: 8,
    movement: 2,
    actions: 5,
    aim: 6,
  },
  boss: {
    bodyParts: humanoidBodyParts(8, 5, 5),
    strength: 10,
    movement: 3,
    actions: 9,
    aim: 8,
  },
}
export type CharacterStatsType = keyof typeof charactersStatsDefinition
export const characterStats: { [key in CharacterStatsType]: CharacterStats } = charactersStatsDefinition

const characterCreatorsDefinition = {
  player: (world: TlbWorld) => createPlayer(world),
  eliteGuard: (world: TlbWorld) => {
    const entity = createDefaultNpc(world, 'some elite guard', 'eliteGuard', 'eliteGuard')
    addDialog(world, entity, 'guardRandomRemarks')
    return entity
  },
  guard: (world: TlbWorld) => {
    const entity = createDefaultNpc(world, 'some guard', 'guard', 'guard')
    addDialog(world, entity, 'guardRandomRemarks')
    return entity
  },
}

export const defaultActions: ActionType[] = ['longMove', 'hit', 'rush', 'endTurn']

export function createPlayer(world: TlbWorld): Entity {
  const player = createCharacter(world, 'player', 'player', defaultActions)
  world
    .editEntity(player)
    .withComponent<{}>('player', {})
    .withComponent<FovComponent>('fov', { fov: [] })
    .withComponent<{}>('viewport-focus', {})

  take(world, player, 'idCard')
  take(world, player, 'rifle')
  take(world, player, 'sniperRifle')
  take(world, player, 'bootsOfStriding')
  equip(world, player, 'nailGun', ['leftArm'])
  equip(world, player, 'leatherJacket', ['torso', 'leftArm', 'rightArm'])
  return player
}

export function createDefaultNpc(world: TlbWorld, name: string, statsType: CharacterStatsType, featureType: FeatureType): Entity {
  const npc = createEmptyNpc(world, name, statsType, featureType, defaultActions)
  equip(world, npc, 'rifle', ['leftArm'])
  return npc
}

export function take(world: TlbWorld, entity: Entity, type: ItemType): Entity {
  const item = world.createEntity().withComponent<ItemComponent>('item', { type }).entity
  world.getComponent<InventoryComponent>(entity, 'inventory')!.content.push(item)
  return item
}

export function equip(world: TlbWorld, entity: Entity, type: ItemType, bodyParts: string[]): void {
  const item = take(world, entity, type)
  world.getComponent<EquipedItemsComponent>(entity, 'equiped-items')!.equipment.push({
    entity: item,
    bodyParts,
  })
}

export function createEmptyNpc(
  world: TlbWorld,
  name: string,
  statsType: CharacterStatsType,
  featureType: FeatureType,
  actions: ActionType[]
): Entity {
  const character = createCharacter(world, statsType, featureType, actions)
  return world
    .editEntity(character)
    .withComponent('npc', {})
    .withComponent<TriggersComponent>('triggers', { entities: [], type: 'dialog', name })
    .withComponent<AiComponent>('ai', { type: 'rushing', state: 'idle', interest: undefined, distrust: 0 }).entity
}

export function createCharacter(world: TlbWorld, statsType: CharacterStatsType, featureType: FeatureType, actions: ActionType[]): Entity {
  return world
    .createEntity()
    .withComponent<HasActionComponent>('has-action', { actions })
    .withComponent<InventoryComponent>('inventory', { content: [] })
    .withComponent<EquipedItemsComponent>('equiped-items', { equipment: [] })
    .withComponent<FeatureComponent>('feature', { feature: () => features[featureType] })
    .withComponent<CharacterStatsComponent>('character-stats', createCharacterStatsComponent(statsType))
    .withComponent<ActiveEffectsComponent>('active-effects', { effects: [] }).entity
}

export type CharacterCreatorType = keyof typeof characterCreatorsDefinition
export const characterCreators: { [key in CharacterCreatorType]: CharacterCreator } = characterCreatorsDefinition
