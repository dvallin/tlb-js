import { TlbWorld } from '../tlb'
import { ActiveEffectsComponent } from '../components/effects'
import { Entity } from '../ecs/entity'

export function turnBasedEntities(world: TlbWorld): number {
  return (
    world.components.get('wait-turn')!.size() +
    world.components.get('start-turn')!.size() +
    world.components.get('take-turn')!.size() +
    world.components.get('took-turn')!.size()
  )
}

export function playerIsStruggling(world: TlbWorld): boolean {
  const player: Entity = world.getStorage('player').first()!
  const activeEffects = world.getComponent<ActiveEffectsComponent>(player, 'active-effects')!
  return activeEffects.effects.find(e => e.effect.type === 'bleed') !== undefined
}

export function playerIsDead(world: TlbWorld): boolean {
  const player: Entity = world.getStorage('player').first()!
  return world.hasComponent(player, 'dead')
}

export function clearTurnBased(world: TlbWorld) {
  world.components.get('wait-turn')!.clear()
  world.components.get('start-turn')!.clear()
  world.components.get('take-turn')!.clear()
  world.components.get('took-turn')!.clear()
}
