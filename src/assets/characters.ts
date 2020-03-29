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
import { SetSpace } from '../spatial/set-space'
import { WorldMapResource } from '../resources/world-map'

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
    bodyParts: humanoidBodyParts(10, 5, 5),
    strength: 5,
    aim: 10,
  },
  guard: {
    bodyParts: humanoidBodyParts(3, 1, 1),
    strength: 5,
    aim: 6,
  },
  civilian: {
    bodyParts: humanoidBodyParts(3, 1, 1),
    strength: 4,
    aim: 3,
  },
  eliteGuard: {
    bodyParts: humanoidBodyParts(5, 3, 3),
    strength: 8,
    aim: 6,
  },
  boss: {
    bodyParts: humanoidBodyParts(8, 5, 5),
    strength: 10,
    aim: 8,
  },
}
export type CharacterStatsType = keyof typeof charactersStatsDefinition
export const characterStats: { [key in CharacterStatsType]: CharacterStats } = charactersStatsDefinition

const characterCreatorsDefinition = {
  player: (world: TlbWorld) => createPlayer(world),
  eliteGuard: (world: TlbWorld) => createGuard(world, 'some elite guard', 'eliteGuard', 'eliteGuard'),
  guard: (world: TlbWorld) => createGuard(world, 'some guard', 'guard', 'guard'),
  civilian: (world: TlbWorld) => createCivilian(world, 'some guy', 'civilian', 'civilian'),
}

export const defaultActions: ActionType[] = ['move', 'hit', 'rush', 'endTurn']

export function createPlayer(world: TlbWorld): Entity {
  const player = createCharacter(world, 'player', 'player', defaultActions)
  const width = world.getResource<WorldMapResource>('map').width
  world
    .editEntity(player)
    .withComponent<{}>('player', {})
    .withComponent<FovComponent>('fov', { fov: new SetSpace(width) })
    .withComponent<{}>('viewport-focus', {})

  take(world, player, 'idCard')
  take(world, player, 'rifle')
  take(world, player, 'sniperRifle')
  take(world, player, 'bootsOfStriding')
  equip(world, player, 'nailGun', ['leftArm'])
  equip(world, player, 'leatherJacket', ['torso', 'leftArm', 'rightArm'])
  return player
}

export function createCivilian(world: TlbWorld, name: string, statsType: CharacterStatsType, featureType: FeatureType): Entity {
  const npc = createEmptyNpc(world, name, statsType, featureType, defaultActions)
  addDialog(world, npc, 'civilianDialog')
  return npc
}

export function createGuard(world: TlbWorld, name: string, statsType: CharacterStatsType, featureType: FeatureType): Entity {
  const npc = createEmptyNpc(world, name, statsType, featureType, defaultActions)
  world.editEntity(npc).withComponent<AiComponent>('ai', { type: 'rushing', state: 'idle', interest: undefined, distrust: 0 })
  equip(world, npc, 'rifle', ['leftArm'])
  addDialog(world, npc, 'guardRandomRemarks')
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
    .withComponent<TriggersComponent>('triggers', { entities: [], type: 'dialog', name }).entity
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
