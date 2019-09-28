import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { AssetComponent, removeAsset } from '../components/asset'
import { FeatureComponent } from '../components/feature'
import { GroundComponent } from '../components/ground'
import { Entity } from '../ecs/entity'
import { TriggersComponent, TriggeredByComponent } from '../components/trigger'
import { InventoryComponent } from '../components/items'
import { WorldMap, WorldMapResource } from '../resources/world-map'
import { State } from '../game-states/state'
import { UIResource, UI } from '../resources/ui'
import { Modal } from '../game-states/modal'

export class Trigger implements TlbSystem {
  public readonly components: ComponentName[] = ['active', 'triggers']

  public constructor(public readonly pushState: (state: State) => void) {}

  public update(world: TlbWorld, entity: Entity): void {
    const asset = world.getComponent<AssetComponent>(entity, 'asset')
    let handled = true
    if (asset !== undefined) {
      switch (asset.type) {
        case 'door':
          handled = this.door(world, entity)
          break
        case 'loot':
          handled = this.loot(world, entity, true)
          break
        case 'trash':
        case 'locker':
        case 'table':
          handled = this.loot(world, entity, false)
          break
      }
    }
    if (handled) {
      world
        .editEntity(entity)
        .removeComponent('active')
        .removeComponent('triggered-by')
    }
  }

  public door(world: TlbWorld, entity: Entity): boolean {
    const triggers = world.getComponent<TriggersComponent>(entity, 'triggers')!
    triggers.entities.forEach(doorPart => this.swapGroundAndFeature(world, doorPart))
    return true
  }

  public loot(world: TlbWorld, entity: Entity, remove: boolean): boolean {
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const ui: UI = world.getResource<UIResource>('ui')
    if (!ui.isModal) {
      const triggeredBy = world.getComponent<TriggeredByComponent>(entity, 'triggered-by')!
      const triggers = world.getComponent<TriggersComponent>(entity, 'triggers')!
      const sourceFeature = world.getComponent<FeatureComponent>(triggers.entities[0], 'feature')!
      const targetFeature = world.getComponent<FeatureComponent>(triggeredBy.entity, 'feature')!
      const targetText = targetFeature.feature().name
      const sourceText = sourceFeature.feature().name
      ui.showInventoryTransferModal(world, entity, sourceText, triggeredBy.entity, targetText)
      this.pushState(new Modal(world.activeSystemsList()))
    } else if (!ui.inventoryTransferModalShowing()) {
      ui.isModal = false
      const inventory = world.getComponent<InventoryComponent>(entity, 'inventory')!
      if (remove && inventory.content.length === 0) {
        removeAsset(world, map, entity)
      }
      return true
    }
    return false
  }

  public swapGroundAndFeature(world: TlbWorld, entity: Entity): void {
    const feature = world.getComponent<FeatureComponent>(entity, 'feature')!
    const ground = world.getComponent<GroundComponent>(entity, 'ground')!
    const f = feature.feature
    feature.feature = ground.feature
    ground.feature = f
  }
}
