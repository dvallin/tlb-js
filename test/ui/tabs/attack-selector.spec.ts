import { AttackSelector } from '../../../src/ui/tabs/attack-selector'
import { Queries } from '../../../src/renderer/queries'
import { createFeatureFromType } from '../../../src/components/feature'
import { WorldMapResource, WorldMap } from '../../../src/resources/world-map'
import { registerComponents, TlbWorld } from '../../../src/tlb'
import { World } from '../../../src/ecs/world'
import { Entity } from '../../../src/ecs/entity'
import { characterCreators } from '../../../src/assets/characters'
import { placeCharacter } from '../../../src/component-reducers/place-character'
import { Vector } from '../../../src/spatial'
import { Input } from '../../../src/resources/input'
import { mockInput } from '../../mocks'
import { Rectangle } from '../../../src/geometry/rectangle'
import { stringRenderer } from '../../render'
import { ViewportResource } from '../../../src/resources/viewport'

describe('AttackSelector', () => {
  let world: TlbWorld
  let player: Entity
  let guard: Entity
  let map: WorldMap
  let selector: AttackSelector
  let input: Input
  beforeEach(() => {
    world = new World()
    registerComponents(world)

    world.registerResource(new WorldMapResource(4))
    map = world.getResource<WorldMapResource>('map')

    world.registerResource(new ViewportResource(new Vector([0, 0])))
    input = mockInput(world)

    map.levels[0].boundary.foreach(p => {
      if (p.key === '0,1') {
        createFeatureFromType(world, 0, p, 'wall')
      } else {
        createFeatureFromType(world, 0, p, 'corridor')
      }
    })

    player = characterCreators.player(world)
    guard = characterCreators.guard(world)
    placeCharacter(world, guard, 0, new Vector([0, 0]))

    selector = new AttackSelector(player, new Queries(), 3)
    selector.setFull(new Rectangle(0, 0, 20, 8))
  })

  it('renders target feature', () => {
    input.position = new Vector([0, 0])
    placeCharacter(world, player, 0, new Vector([0, 2]))

    selector.full!.update(world)

    const { renderer, getDisplay } = stringRenderer()
    selector.full!.render(renderer)
    expect(getDisplay()).toMatchSnapshot()
  })

  it('selects attack ray', () => {
    map.levels[0].boundary.foreach(p => {
      map.levels[0].discovered.set(p)
    })
    input.mousePressed = true
    input.position = new Vector([0, 0])
    placeCharacter(world, player, 0, new Vector([1, 2]))

    selector.full!.update(world)

    const path = {
      cost: 2,
      path: [new Vector([1, 1]), new Vector([0, 0])],
    }
    expect(world.getStorage('overlay').size()).toEqual(path.path.length)
    expect(selector.selected).toEqual(path)
    expect(selector.hovered).toEqual(path)
  })

  it('does not select attack ray if not visible', () => {
    map.levels[0].boundary.foreach(p => {
      map.levels[0].discovered.set(p)
    })
    input.mousePressed = true
    input.position = new Vector([0, 0])
    placeCharacter(world, player, 0, new Vector([0, 2]))

    selector.full!.update(world)

    expect(world.getStorage('overlay').size()).toEqual(0)
    expect(selector.hovered).toBeUndefined()
    expect(selector.selected).toBeUndefined()
  })

  it('does not select attack ray out of range', () => {
    map.levels[0].boundary.foreach(p => {
      map.levels[0].discovered.set(p)
    })
    input.mousePressed = true
    input.position = new Vector([0, 0])
    placeCharacter(world, player, 0, new Vector([3, 2]))

    selector.full!.update(world)

    expect(world.getStorage('overlay').size()).toEqual(0)
    expect(selector.hovered).toBeUndefined()
    expect(selector.selected).toBeUndefined()
  })
})
