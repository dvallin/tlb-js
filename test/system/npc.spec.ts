import { Npc } from '../../src/systems/npc'
import { TlbWorld, registerComponents } from '../../src/tlb'
import { Entity } from '../../src/ecs/entity'
import { WorldMap, WorldMapResource } from '../../src/resources/world-map'
import { Uniform } from '../../src/random/distributions'
import { Queries } from '../../src/renderer/queries'
import { Random } from '../../src/random'
import { characterCreators } from '../../src/assets/characters'
import { Vector } from '../../src/spatial'
import { placeCharacter } from '../../src/component-reducers/place-character'
import { World } from '../../src/ecs/world'
import { createFeatureFromType } from '../../src/components/feature'
import { mockUi, callArgument, mockReturnValue } from '../mocks'
import { StructureComponent, RegionComponent } from '../../src/components/region'
import { AiComponent } from '../../src/components/ai'
import { UI } from '../../src/resources/ui'
import { State } from '../../src/game-states/state'
import { AnswerType } from '../../src/assets/dialogs'

describe('Npc', () => {
  let world: TlbWorld
  let player: Entity
  let guard: Entity
  let map: WorldMap
  let region: Entity
  let pushState: () => void
  let system: Npc
  let ui: UI
  beforeEach(() => {
    world = new World()
    registerComponents(world)

    world.registerResource(new WorldMapResource(4))
    map = world.getResource<WorldMapResource>('map')
    ui = mockUi(world)

    const boundary = map.levels[0].boundary
    region = world.createEntity().withComponent<RegionComponent>('region', {
      type: 'red',
      shape: boundary,
      level: 0,
      authorized: new Set(),
      entry: new Vector([0, 0]),
    }).entity
    const room = world
      .createEntity()
      .withComponent<StructureComponent>('structure', { region, kind: 'room', shape: boundary, connections: [] }).entity
    boundary.foreach(p => {
      if (p.key === '0,1') {
        createFeatureFromType(world, 0, p, 'wall')
      } else {
        createFeatureFromType(world, 0, p, 'corridor')
        map.levels[0].setStructure(p, room)
      }
    })

    pushState = jest.fn()

    player = characterCreators.player(world)
    placeCharacter(world, player, 0, new Vector([0, 0]))

    system = new Npc(new Queries(), new Random(new Uniform('12')), pushState)
  })

  describe('if player is visible', () => {
    beforeEach(() => {
      guard = characterCreators.guard(world)
      placeCharacter(world, guard, 0, new Vector([1, 0]))
    })

    it('gets interest in player if he is visible', () => {
      system.update(world, guard)

      expect(world.getComponent<AiComponent>(guard, 'ai')!.interest).toEqual(player)
    })

    it('increases distrust', () => {
      system.update(world, guard)

      expect(world.getComponent<AiComponent>(guard, 'ai')!.distrust).toEqual(1)
    })

    it('sets distrust to zero if can authorize player', () => {
      system.update(world, guard)
      world.getComponent<RegionComponent>(region, 'region')!.authorized.add(player)
      system.update(world, guard)

      expect(world.getComponent<AiComponent>(guard, 'ai')!.interest).toBeUndefined()
      expect(world.getComponent<AiComponent>(guard, 'ai')!.distrust).toEqual(0)
    })

    it('confronts player if distrust is high', () => {
      world.getComponent<AiComponent>(guard, 'ai')!.interest = player
      world.getComponent<AiComponent>(guard, 'ai')!.distrust = 10

      system.update(world, guard)

      expect(ui.showDialogModal).toHaveBeenCalled()
      expect(callArgument<State>(pushState, 0, 0).name).toEqual('modal')
    })

    it('engages if dialog return unauthorized', () => {
      world.getComponent<AiComponent>(guard, 'ai')!.interest = player
      world.getComponent<AiComponent>(guard, 'ai')!.distrust = 10

      mockReturnValue<boolean>(ui.dialogShowing, true)
      mockReturnValue<AnswerType>(ui.dialogResult, 'close')

      system.update(world, guard)

      expect(world.hasComponent(guard, 'wait-turn')).toBeTruthy()
      expect(callArgument<State>(pushState, 0, 0).name).toEqual('fighting')
    })

    it('authorizes player', () => {
      world.getComponent<AiComponent>(guard, 'ai')!.interest = player
      world.getComponent<AiComponent>(guard, 'ai')!.distrust = 10

      mockReturnValue<boolean>(ui.dialogShowing, true)
      mockReturnValue<AnswerType>(ui.dialogResult, 'authorized')

      system.update(world, guard)

      expect(world.getComponent<RegionComponent>(region, 'region')!.authorized.has(player)).toBeTruthy()
      expect(world.getComponent<AiComponent>(guard, 'ai')!.interest).toBeUndefined()
      expect(world.getComponent<AiComponent>(guard, 'ai')!.distrust).toEqual(0)
    })
  })

  describe('if player is not visible', () => {
    beforeEach(() => {
      guard = characterCreators.guard(world)
      placeCharacter(world, guard, 0, new Vector([0, 2]))
    })

    it('gets interest in player if he is visible', () => {
      system.update(world, guard)

      expect(world.getComponent<AiComponent>(guard, 'ai')!.interest).toBeUndefined()
    })

    it('does not increase distrust', () => {
      system.update(world, guard)

      expect(world.getComponent<AiComponent>(guard, 'ai')!.distrust).toEqual(0)
    })
  })
})
