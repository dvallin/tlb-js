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

function humanoidBodyParts(health: number): { [key: string]: BodyPart } {
  return {
    head: { type: 'head', itemAttachments: ['helmet'], health },
    leftArm: { type: 'arm', itemAttachments: ['glove', 'weapon'], health },
    rightArm: { type: 'arm', itemAttachments: ['glove', 'weapon'], health },
    torso: { type: 'torso', itemAttachments: ['armor'], health },
    leftLeg: { type: 'leg', itemAttachments: ['pants', 'boots'], health },
    rightLeg: { type: 'leg', itemAttachments: ['pants', 'boots'], health },
  }
}

const charactersStatsDefinition = {
  player: {
    bodyParts: humanoidBodyParts(14),
    strength: 5,
    movement: 3,
    actions: 3,
    aim: 7,
  },
  guard: {
    bodyParts: humanoidBodyParts(8),
    strength: 5,
    movement: 3,
    actions: 3,
    aim: 3,
  },
  eliteGuard: {
    bodyParts: humanoidBodyParts(12),
    strength: 8,
    movement: 2,
    actions: 5,
    aim: 6,
  },
  boss: {
    bodyParts: humanoidBodyParts(12),
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
  eliteGuard: (world: TlbWorld) => createDefaultNpc(world, 'eliteGuard', 'eliteGuard'),
  guard: (world: TlbWorld) => createDefaultNpc(world, 'guard', 'guard'),
}

export const defaultActions: ActionType[] = ['longMove', 'hit', 'rush', 'endTurn']

export function createPlayer(world: TlbWorld): Entity {
  const player = createCharacter(world, 'player', 'player', defaultActions)
  world
    .editEntity(player)
    .withComponent<{}>('player', {})
    .withComponent<{}>('viewport-focus', {})

  take(world, player, 'rifle')
  take(world, player, 'bootsOfStriding')
  equip(world, player, 'nailGun', ['leftArm'])
  equip(world, player, 'leatherJacket', ['torso', 'leftArm', 'rightArm'])
  return player
}

export function createDefaultNpc(world: TlbWorld, statsType: CharacterStatsType, featureType: FeatureType): Entity {
  const npc = createEmptyNpc(world, statsType, featureType, defaultActions)
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

export function createEmptyNpc(world: TlbWorld, statsType: CharacterStatsType, featureType: FeatureType, actions: ActionType[]): Entity {
  const character = createCharacter(world, statsType, featureType, actions)
  return world
    .editEntity(character)
    .withComponent('npc', {})
    .withComponent<AiComponent>('ai', { type: 'rushing', state: 'idle' })
    .withComponent<InventoryComponent>('inventory', { content: [] })
    .withComponent<EquipedItemsComponent>('equiped-items', { equipment: [] }).entity
}

export function createCharacter(world: TlbWorld, statsType: CharacterStatsType, featureType: FeatureType, actions: ActionType[]): Entity {
  return world
    .createEntity()
    .withComponent<HasActionComponent>('has-action', { actions })
    .withComponent<FeatureComponent>('feature', { feature: () => features[featureType] })
    .withComponent<FovComponent>('fov', { fov: [] })
    .withComponent<CharacterStatsComponent>('character-stats', createCharacterStatsComponent(statsType))
    .withComponent<ActiveEffectsComponent>('active-effects', { effects: [] }).entity
}

export type CharacterCreatorType = keyof typeof characterCreatorsDefinition
export const characterCreators: { [key in CharacterCreatorType]: CharacterCreator } = characterCreatorsDefinition
