import { Script } from '../../src/systems/script'
import { registerComponents, TlbWorld } from '../../src/tlb'
import { World } from '../../src/ecs/world'
import { ScriptComponent } from '../../src/components/script'
import { Vector } from '../../src/spatial'
import { characterCreators } from '../../src/assets/characters'
import { placeCharacter } from '../../src/component-reducers/place-character'
import { WorldMapResource } from '../../src/resources/world-map'
import { Entity } from '../../src/ecs/entity'
import { PositionComponent } from '../../src/components/position'

describe('Npc', () => {
  let world: TlbWorld
  let system: Script
  let player: Entity
  beforeEach(() => {
    world = new World()
    registerComponents(world)
    world.registerResource(new WorldMapResource(4))

    player = characterCreators.player(world)
    placeCharacter(world, player, 0, new Vector([0, 0]))

    system = new Script()
  })

  it('removes script on empty path', () => {
    world.editEntity(player).withComponent<ScriptComponent>('script', { path: [] }).entity
    system.update(world, player)
    expect(world.hasComponent(player, 'script')).toBeFalsy()
  })

  it('moves character towards waypoint', () => {
    world.editEntity(player).withComponent<ScriptComponent>('script', { path: [new Vector([1, 0])] }).entity
    system.update(world, player)
    expect(world.getComponent<PositionComponent>(player, 'position')!.position).toMatchSnapshot()
  })

  it('removes waypoint on already reached position', () => {
    world.editEntity(player).withComponent<ScriptComponent>('script', { path: [new Vector([0, 0])] }).entity
    system.update(world, player)
    expect(world.getComponent<ScriptComponent>(player, 'script')!.path).toHaveLength(0)
  })

  it('removes waypoint on overshooting position', () => {
    world.editEntity(player).withComponent<ScriptComponent>('script', { path: [new Vector([0.01, 0])] }).entity
    system.update(world, player)
    expect(world.getComponent<ScriptComponent>(player, 'script')!.path).toHaveLength(0)
  })
})
