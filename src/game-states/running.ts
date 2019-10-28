import { TlbWorld } from '../tlb'
import { PositionComponent } from '../components/position'
import { AbstractState, State } from './state'
import { WorldMap, WorldMapResource } from '../resources/world-map'
import { ViewportResource, Viewport } from '../resources/viewport'
import { UIResource } from '../resources/ui'
import { Entity } from '../ecs/entity'
import { MainMenu } from './main-menu'
import { characterCreators } from '../assets/characters'

export class Running extends AbstractState {
  public constructor() {
    super('running', ['fov', 'player-control', 'player-interaction', 'npc', 'trigger', 'free-mode-control', 'effect'])
  }

  public start(world: TlbWorld): void {
    super.start(world)
    if (world.components.get('viewport-focus')!.size() === 0) {
      this.createViewportFocus(world)
    }
    world.getResource<UIResource>('ui').reset()
  }

  public createViewportFocus(world: TlbWorld): void {
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    world.components.get('spawn')!.foreach(spawn => {
      this.spawnPlayer(world, map, spawn)
    })
    this.createUILayer(world)
  }

  public spawnPlayer(world: TlbWorld, map: WorldMap, spawn: Entity): void {
    const position = world.getComponent<PositionComponent>(spawn, 'position')!
    const player = characterCreators.player(world)
    world
      .editEntity(player)
      .withComponent('position', { ...position })
      .withComponent<{}>('viewport-focus', {})

    const ui = world.getResource<UIResource>('ui')
    ui.createTabs(world, player)

    map.levels[position.level].setCharacter(position.position, player)
  }

  public createUILayer(world: TlbWorld): void {
    const viewport: Viewport = world.getResource<ViewportResource>('viewport')
    viewport.addLayer({
      getRenderable: (world, _, position) => {
        const ui = world.getResource<UIResource>('ui')
        return { entity: undefined, opaque: !ui.hasElement(position), centered: true }
      },
      transformed: false,
    })
  }

  public update(world: TlbWorld, pushState: (state: State) => void): void {
    const player: Entity = world.getStorage('player').first()!
    if (world.hasComponent(player, 'dead')) {
      pushState(new MainMenu())
    }
  }

  public isFrameLocked(): boolean {
    return true
  }
}
