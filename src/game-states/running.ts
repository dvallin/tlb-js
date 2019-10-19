import { TlbWorld } from '../tlb'
import { PositionComponent } from '../components/position'
import { AbstractState, State } from './state'
import { FeatureComponent } from '../components/feature'
import { WorldMap, WorldMapResource } from '../resources/world-map'
import { FovComponent } from '../components/fov'
import { CharacterStatsComponent, createCharacterStatsComponent } from '../components/character-stats'
import { ViewportResource, Viewport } from '../resources/viewport'
import { UIResource } from '../resources/ui'
import { HasActionComponent } from '../components/action'
import { InventoryComponent, ItemComponent, EquipedItemsComponent } from '../components/items'
import { Entity } from '../ecs/entity'
import { ActiveEffectsComponent } from '../components/effects'
import { features } from '../assets/features'
import { MainMenu } from './main-menu'

export class Running extends AbstractState {
  public constructor() {
    super(['fov', 'light', 'player-control', 'player-interaction', 'npc', 'trigger', 'free-mode-control', 'effect'])
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
    const stats = createCharacterStatsComponent('player')
    const nailgun = world.createEntity().withComponent<ItemComponent>('item', { type: 'nailGun' }).entity
    const sniperRifle = world.createEntity().withComponent<ItemComponent>('item', { type: 'sniperRifle' }).entity
    const rifle = world.createEntity().withComponent<ItemComponent>('item', { type: 'rifle' }).entity
    const boots = world.createEntity().withComponent<ItemComponent>('item', { type: 'bootsOfStriding' }).entity
    const jacket = world.createEntity().withComponent<ItemComponent>('item', { type: 'leatherJacket' }).entity

    const player = world
      .createEntity()
      .withComponent<{}>('player', {})
      .withComponent<{}>('viewport-focus', {})
      .withComponent<PositionComponent>('position', { ...position })
      .withComponent<FeatureComponent>('feature', { feature: () => features['player'] })
      .withComponent<FovComponent>('fov', { fov: [] })
      .withComponent<HasActionComponent>('has-action', { actions: ['longMove', 'hit', 'rush', 'endTurn'] })
      .withComponent<CharacterStatsComponent>('character-stats', stats)
      .withComponent<InventoryComponent>('inventory', { content: [nailgun, sniperRifle, rifle, jacket, boots] })
      .withComponent<ActiveEffectsComponent>('active-effects', { effects: [] })
      .withComponent<EquipedItemsComponent>('equiped-items', {
        equipment: [{ entity: nailgun, bodyParts: ['leftArm'] }, { entity: jacket, bodyParts: ['torso', 'leftArm', 'rightArm'] }],
      }).entity
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
