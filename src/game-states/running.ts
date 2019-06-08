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
import { HasActionComponent } from '../components/action'
import { InventoryComponent, ItemComponent, EquipedItemsComponent } from '../components/items'
import { Entity } from '../ecs/entity'
import { ActiveEffectsComponent } from '../components/effects'

export class Running extends AbstractState {
  public constructor() {
    super(['fov', 'light', 'player-control', 'player-interaction', 'npc', 'trigger', 'free-mode-control', 'effect'])
  }

  public start(world: TlbWorld): void {
    super.start(world)
    if (world.components.get('viewport-focus')!.size() === 0) {
      this.createViewportFocus(world)
    }
  }

  public createViewportFocus(world: TlbWorld): void {
    const spawns = world.components.get('spawn')!
    if (spawns.size() === 1) {
      const map: WorldMap = world.getResource<WorldMapResource>('map')
      spawns.foreach(spawn => {
        this.spawnPlayer(world, map, spawn)
      })
    } else {
      this.setupAnchor(world)
    }
    this.createUILayer(world)
  }

  public spawnPlayer(world: TlbWorld, map: WorldMap, spawn: Entity): void {
    const position = world.getComponent<PositionComponent>(spawn, 'position')!.position
    const stats = createCharacterStatsComponent('player')
    const nailgun = world.createEntity().withComponent<ItemComponent>('item', { type: 'nailGun' }).entity
    const rifle = world.createEntity().withComponent<ItemComponent>('item', { type: 'rifle' }).entity
    const jacket = world.createEntity().withComponent<ItemComponent>('item', { type: 'leatherJacket' }).entity

    const player = world
      .createEntity()
      .withComponent<{}>('player', {})
      .withComponent<{}>('viewport-focus', {})
      .withComponent<PositionComponent>('position', { position })
      .withComponent<FeatureComponent>('feature', { type: 'player' })
      .withComponent<FovComponent>('fov', { fov: [] })
      .withComponent<HasActionComponent>('has-action', { actions: ['longMove', 'hit', 'rush', 'endTurn'] })
      .withComponent<CharacterStatsComponent>('character-stats', stats)
      .withComponent<InventoryComponent>('inventory', { content: [nailgun, rifle] })
      .withComponent<ActiveEffectsComponent>('active-effects', { effects: [] })
      .withComponent<EquipedItemsComponent>('equiped-items', {
        equipment: [{ entity: nailgun, bodyParts: ['leftArm'] }, { entity: jacket, bodyParts: ['torso', 'leftArm', 'rightArm'] }],
      }).entity
    const ui = world.getResource<UIResource>('ui')
    ui.setOverview(world, player)
    ui.setLog(world)
    map.setCharacter(position, player)
  }

  public setupAnchor(world: TlbWorld): void {
    const position = new Vector([20, 20])
    world
      .createEntity()
      .withComponent<{}>('free-mode-anchor', {})
      .withComponent<{}>('viewport-focus', {})
      .withComponent<PositionComponent>('position', { position })
  }

  public createUILayer(world: TlbWorld): void {
    const viewport: Viewport = world.getResource<ViewportResource>('viewport')
    viewport.addLayer({
      getRenderable: (world, position) => {
        const ui = world.getResource<UIResource>('ui')
        const p = position.floor()
        return { entity: undefined, opaque: !ui.hasElement(p), centered: true }
      },
      transformed: false,
    })
  }

  public update({  }: TlbWorld): void {}

  public isFrameLocked(): boolean {
    return true
  }
}
