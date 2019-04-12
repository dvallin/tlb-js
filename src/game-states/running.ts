import { TlbWorld } from '../tlb'
import { PositionComponent } from '../components/position'
import { Vector } from '../spatial'
import { AbstractState } from './state'
import { FeatureComponent } from '../components/feature'
import { WorldMap, WorldMapResource } from '../resources/world-map'
import { FovComponent } from '../components/fov'
import { CharacterStatsComponent, createCharacterStatsComponent } from '../components/character-stats'
import { ViewportResource, Viewport } from '../resources/viewport'
import { UIResource } from '../resources/ui'

export class Running extends AbstractState {
  public constructor() {
    super(['fov', 'light', 'player-control', 'player-interaction', 'npc', 'trigger', 'free-mode-control', 'damage'])
  }

  public start(world: TlbWorld): void {
    super.start(world)
    const spawns = world.components.get('spawn')!
    if (spawns.size() === 1) {
      const map: WorldMap = world.getResource<WorldMapResource>('map')
      spawns.foreach(spawn => {
        const position = world.getComponent<PositionComponent>(spawn, 'position')!.position
        const player = world
          .createEntity()
          .withComponent<{}>('player', {})
          .withComponent<{}>('viewport-focus', {})
          .withComponent<PositionComponent>('position', { position })
          .withComponent<FeatureComponent>('feature', { type: 'player' })
          .withComponent<FovComponent>('fov', { fov: [] })
          .withComponent<CharacterStatsComponent>('character-stats', createCharacterStatsComponent('player')).entity
        map.setCharacter(position, player)

        const viewport: Viewport = world.getResource<ViewportResource>('viewport')
        viewport.addLayer({
          getRenderable: (world, position) => {
            const ui = world.getResource<UIResource>('ui')
            const p = position.floor()
            return { entity: undefined, opaque: !ui.hasElement(p), centered: true }
          },
          transformed: false,
        })
      })
    } else {
      const position = new Vector(20, 20)
      world
        .createEntity()
        .withComponent<{}>('free-mode-anchor', {})
        .withComponent<{}>('viewport-focus', {})
        .withComponent<PositionComponent>('position', { position })
    }
  }

  public update({  }: TlbWorld): void {}

  public isFrameLocked(): boolean {
    return true
  }
}
