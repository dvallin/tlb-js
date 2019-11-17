import { registerComponents, TlbWorld } from '../../src/tlb'
import { World } from '../../src/ecs/world'
import { Vector } from '../../src/spatial'
import { characterCreators } from '../../src/assets/characters'
import { placeCharacter } from '../../src/component-reducers/place-character'
import { WorldMapResource } from '../../src/resources/world-map'
import { Entity } from '../../src/ecs/entity'
import { Fov } from '../../src/systems/fov'
import { Queries } from '../../src/renderer/queries'
import { Rectangle } from '../../src/geometry/rectangle'
import { createFeatureFromType } from '../../src/components/feature'
import { FovComponent } from '../../src/components/fov'

describe('Npc', () => {
  let world: TlbWorld
  let system: Fov
  let player: Entity
  beforeEach(() => {
    world = new World()
    registerComponents(world)
    world.registerResource(new WorldMapResource(4))

    player = characterCreators.player(world)
    placeCharacter(world, player, 0, new Vector([0, 0]))

    new Rectangle(0, 0, 2, 2).foreach(p => createFeatureFromType(world, 0, p, 'corridor'))

    system = new Fov(new Queries())
  })

  it('pushes fov', () => {
    system.update(world, player)
    expect(world.getComponent<FovComponent>(player, 'fov')!.fov.objects).toMatchSnapshot()
  })
})
