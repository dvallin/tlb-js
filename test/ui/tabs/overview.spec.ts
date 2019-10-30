import { Rectangle } from '../../../src/geometry/rectangle'
import { World } from '../../../src/ecs/world'
import { registerComponents, TlbWorld } from '../../../src/tlb'
import { WorldMapResource } from '../../../src/resources/world-map'
import { Entity } from '../../../src/ecs/entity'
import { characterCreators } from '../../../src/assets/characters'
import { mockInput } from '../../mocks'
import { stringRenderer } from '../../render'
import { Overview } from '../../../src/ui/tabs/overview'
import { TakeTurnComponent } from '../../../src/components/rounds'

describe('Full', () => {
  let world: TlbWorld
  let player: Entity
  let guard: Entity
  let guard2: Entity
  let overview: Overview
  beforeEach(() => {
    world = new World()
    registerComponents(world)
    world.registerResource(new WorldMapResource(4))
    world.getResource<WorldMapResource>('map')

    player = characterCreators.player(world)
    guard = characterCreators.guard(world)
    guard2 = characterCreators.guard(world)

    overview = new Overview(player)
    overview.setFull(new Rectangle(0, 0, 20, 8))

    mockInput(world)
  })

  describe('free mode', () => {
    it('displays overview', () => {
      overview.full!.update(world)

      const { renderer, getDisplay } = stringRenderer()
      overview.full!.render(renderer)
      expect(getDisplay()).toMatchSnapshot()
    })
  })

  describe('turn based mode', () => {
    beforeEach(() => {
      world.editEntity(player).withComponent<TakeTurnComponent>('take-turn', { actions: 3, movements: 2 })
      world.editEntity(guard).withComponent('wait-turn', {})
      world.editEntity(guard2).withComponent('took-turn', {})
    })

    it('displays overview', () => {
      overview.full!.update(world)

      const { renderer, getDisplay } = stringRenderer()
      overview.full!.render(renderer)
      expect(getDisplay()).toMatchSnapshot()
    })
  })
})

describe('MinimizedOverview', () => {
  let world: TlbWorld
  let player: Entity
  let overview: Overview
  beforeEach(() => {
    world = new World()
    registerComponents(world)
    world.registerResource(new WorldMapResource(4))
    world.getResource<WorldMapResource>('map')

    player = characterCreators.player(world)

    overview = new Overview(player)
    overview.setMinimized(new Rectangle(0, 0, 20, 8))
  })

  it('displays overview', () => {
    overview.minimized!.update(world)

    const { renderer, getDisplay } = stringRenderer()
    overview.minimized!.render(renderer)
    expect(getDisplay()).toMatchSnapshot()
  })
})
