import { TlbWorld, registerComponents } from '../../src/tlb'
import { Entity } from '../../src/ecs/entity'
import { WorldMap, WorldMapResource } from '../../src/resources/world-map'
import { Uniform } from '../../src/random/distributions'
import { characterCreators } from '../../src/assets/characters'
import { Vector } from '../../src/spatial'
import { placeCharacter } from '../../src/component-reducers/place-character'
import { World } from '../../src/ecs/world'
import { createFeatureFromType } from '../../src/components/feature'
import { StructureComponent, RegionComponent } from '../../src/components/region'
import { createAssetFromShape } from '../../src/components/asset'
import { Rectangle } from '../../src/geometry/rectangle'
import { Random } from '../../src/random'
import { dialogs } from '../../src/assets/dialogs'

describe('dialog', () => {
  describe('terminal', () => {
    let world: TlbWorld
    let player: Entity
    let terminal: Entity

    let map: WorldMap
    let region: Entity
    beforeEach(() => {
      world = new World()
      registerComponents(world)

      world.registerResource(new WorldMapResource(4))
      map = world.getResource<WorldMapResource>('map')

      const boundary = map.levels[0].boundary
      region = world.createEntity().withComponent<RegionComponent>('region', {
        type: 'red',
        shape: boundary,
        level: 0,
        authorized: new Set(),
        exits: [],
      }).entity
      const room = world
        .createEntity()
        .withComponent<StructureComponent>('structure', { region, kind: 'room', shape: boundary, connections: [] }).entity
      boundary.foreach(p => {
        createFeatureFromType(world, 0, p, 'corridor')
        map.levels[0].setStructure(p, room)
      })

      player = characterCreators.player(world)
      placeCharacter(world, player, 0, new Vector([0, 0]))

      const random = new Random(new Uniform('terminal'))
      terminal = createAssetFromShape(world, random, 0, new Rectangle(0, 1, 1, 1), 'terminal')
      createAssetFromShape(world, random, 0, new Rectangle(1, 0, 1, 1), 'door')
      createAssetFromShape(world, random, 0, new Rectangle(1, 1, 1, 1), 'door')
    })

    it('shows a main menu', () => {
      const steps = dialogs.terminal.steps(world, player, terminal)

      expect(steps[0]).toMatchSnapshot()
    })

    it('shows doors', () => {
      const steps = dialogs.terminal.steps(world, player, terminal)

      const doorControls = steps.find(s => s.text[0] === 'door controls')!
      expect(doorControls).toMatchSnapshot()
    })

    it('shows lore', () => {
      const steps = dialogs.terminal.steps(world, player, terminal)

      const lore = steps.find(s => s.text[0] === 'lore')!
      expect(lore).toMatchSnapshot()
    })
  })
})
