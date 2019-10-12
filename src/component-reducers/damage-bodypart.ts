import { CharacterStatsComponent } from '../components/character-stats'
import { Entity } from '../ecs/entity'
import { WorldMap, WorldMapResource } from '../resources/world-map'
import { Log, LogResource } from '../resources/log'
import { PositionComponent } from '../components/position'
import { TlbWorld } from '../tlb'
import { EffectComponent } from '../components/effects'
import { InventoryComponent } from '../components/items'
import { characterStats } from '../assets/characters'
import { createAsset } from '../components/asset'

export function damageBodyPart(
  world: TlbWorld,
  source: Entity,
  target: Entity,
  stats: CharacterStatsComponent,
  bodyPartName: string,
  damage: number
): void {
  const bodyPart = stats.current.bodyParts[bodyPartName]
  bodyPart.health = Math.max(0, bodyPart.health - damage)

  if (bodyPart.health === 0) {
    const isLethal = bodyPart.type === 'torso' || bodyPart.type === 'head'
    if (isLethal) {
      kill(world, target)
    } else {
      world.createEntity().withComponent<EffectComponent>('effect', {
        effect: {
          type: 'bleed',
          negated: false,
          global: false,
        },
        bodyParts: ['torso'],
        source: source,
        target: target,
      })
    }
  }
}

export function healBodyPart(stats: CharacterStatsComponent, bodyPartName: string, damage: number): void {
  const bodyPart = stats.current.bodyParts[bodyPartName]
  const maximum = characterStats[stats.type].bodyParts[bodyPartName]
  bodyPart.health = Math.max(bodyPart.health + damage, maximum.health)
}

export function kill(world: TlbWorld, entity: Entity) {
  if (world.hasComponent(entity, 'position')) {
    const position = world.getComponent<PositionComponent>(entity, 'position')!
    const inventory = world.getComponent<InventoryComponent>(entity, 'inventory')!
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    map.levels[position.level].removeCharacter(position.position.floor())

    world
      .editEntity(entity)
      .withComponent('dead', {})
      .removeComponent('take-turn')
      .removeComponent('start-turn')
      .removeComponent('took-turn')
      .removeComponent('wait-turn')

    const loot = createAsset(world, map, position.level, position.position.floor(), 'up', 'loot')
    world.editEntity(loot).withComponent<InventoryComponent>('inventory', { ...inventory })

    const log: Log = world.getResource<LogResource>('log')
    log.died(world, entity)
  }
}
