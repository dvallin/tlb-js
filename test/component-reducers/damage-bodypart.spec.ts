import { damageBodyPart } from '../../src/component-reducers/damage-bodypart'
import { World } from '../../src/ecs/world'
import { TlbWorld, registerComponents } from '../../src/tlb'
import { characterCreators, characterStats } from '../../src/assets/characters'
import { CharacterStatsComponent } from '../../src/components/character-stats'
import { Entity } from '../../src/ecs/entity'
import { EffectComponent } from '../../src/components/effects'
import { WorldMapResource } from '../../src/resources/world-map'
import { Vector } from '../../src/spatial'
import { placeCharacter } from '../../src/component-reducers/place-character'
import { createFeatureFromType } from '../../src/components/feature'
import { mockLog } from '../mocks'
import { AssetComponent } from '../../src/components/asset'
import { InventoryComponent } from '../../src/components/items'

describe('damageBodypart', () => {
  let world: TlbWorld
  let player: Entity
  let guard: Entity
  let stats: CharacterStatsComponent
  beforeEach(() => {
    world = new World()
    registerComponents(world)
    mockLog(world)

    world.registerResource(new WorldMapResource(1))
    player = characterCreators.player(world)
    guard = characterCreators.guard(world)
    createFeatureFromType(world, 0, new Vector([0, 0]), 'corridor')
    placeCharacter(world, guard, 0, new Vector([0, 0]))
    stats = world.getComponent<CharacterStatsComponent>(guard, 'character-stats')!
  })

  it('damages bodyparts', () => {
    damageBodyPart(world, player, guard, stats, 'torso', 2)
    expect(stats.current.bodyParts['torso'].health).toEqual(characterStats[stats.type].bodyParts['torso'].health - 2)
  })

  it('creates a bleeding effect on torso', () => {
    damageBodyPart(world, player, guard, stats, 'leftLeg', 200)
    const effect = world.getComponent<EffectComponent>(world.getStorage('effect').first()!, 'effect')!
    expect(effect.bodyParts).toEqual(['torso'])
    expect(effect.effect.type).toEqual('bleed')
    expect(effect.source).toEqual(player)
    expect(effect.target).toEqual(guard)
  })

  it('kills entity', () => {
    damageBodyPart(world, player, guard, stats, 'head', 200)

    expect(world.hasComponent(guard, 'dead')).toBeTruthy()
    expect(world.hasComponent(guard, 'position')).toBeFalsy()
  })

  it('replaces killed entity by loot', () => {
    damageBodyPart(world, player, guard, stats, 'head', 200)

    const asset = world.getStorage('asset').first()!
    expect(world.getComponent<AssetComponent>(asset, 'asset')!.type).toEqual('loot')
    expect(world.getComponent<InventoryComponent>(asset, 'inventory')!.content).toEqual(
      world.getComponent<InventoryComponent>(guard, 'inventory')!.content
    )
  })
})
