import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { AssetComponent, removeAsset } from '../components/asset'
import { FeatureComponent } from '../components/feature'
import { GroundComponent } from '../components/ground'
import { Entity } from '../ecs/entity'
import { TriggersComponent, TriggeredByComponent } from '../components/trigger'
import { InventoryComponent } from '../components/items'
import { WorldMap, WorldMapResource } from '../resources/world-map'
import { State } from '../game-states/state'
import { UIResource, UI, runDialog } from '../resources/ui'
import { Modal } from '../game-states/modal'
import { LogResource, Log } from '../resources/log'
import { DialogComponent } from '../components/dialog'
import { Random } from '../random'
import { AiComponent } from '../components/ai'
import { engage } from '../component-reducers/ai'

export class Trigger implements TlbSystem {
  public readonly components: ComponentName[] = ['active', 'triggers']

  public constructor(public readonly random: Random, public readonly pushState: (state: State) => void) {}

  public update(world: TlbWorld, entity: Entity): void {
    let handled = true

    const triggers = world.getComponent<TriggersComponent>(entity, 'triggers')!
    switch (triggers.type) {
      case 'dialog':
        handled = this.handleDialog(world, entity, triggers)
        break
      case 'asset':
        handled = this.handleAsset(world, entity, triggers)
        break
    }

    if (handled) {
      world
        .editEntity(entity)
        .removeComponent('active')
        .removeComponent('triggered-by')
    }
  }

  public handleDialog(world: TlbWorld, entity: Entity, triggers: TriggersComponent): boolean {
    const dialog = world.getComponent<DialogComponent>(triggers.entities[0], 'dialog')!
    const triggeredBy = world.getComponent<TriggeredByComponent>(entity, 'triggered-by')!
    const result = runDialog(
      world.getResource<UIResource>('ui'),
      world,
      this.random,
      dialog.type,
      triggeredBy.entity,
      entity,
      this.pushState
    )
    if (result !== undefined) {
      if (result === 'attack') {
        const ai = world.getComponent<AiComponent>(entity, 'ai')
        if (ai !== undefined) {
          engage(world, entity, ai, this.pushState)
        }
      }
      return true
    }
    return false
  }

  public handleAsset(world: TlbWorld, entity: Entity, triggers: TriggersComponent): boolean {
    const asset = world.getComponent<AssetComponent>(entity, 'asset')!
    switch (asset.type) {
      case 'door':
        return this.door(world, triggers)
      case 'loot':
        return this.loot(world, entity, triggers, true)
      case 'trash':
      case 'locker':
      case 'table':
        return this.loot(world, entity, triggers, false)
      case 'generator':
        this.log(world, 'clonck')
        return true
    }
    return false
  }

  public door(world: TlbWorld, triggers: TriggersComponent): boolean {
    triggers.entities.forEach(doorPart => this.swapGroundAndFeature(world, doorPart))
    return true
  }

  public loot(world: TlbWorld, entity: Entity, triggers: TriggersComponent, remove: boolean): boolean {
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const ui: UI = world.getResource<UIResource>('ui')
    if (!ui.isModal) {
      const triggeredBy = world.getComponent<TriggeredByComponent>(entity, 'triggered-by')!
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

  public log(world: TlbWorld, text: string) {
    const log: Log = world.getResource<LogResource>('log')
    log.text(text)
  }

  public swapGroundAndFeature(world: TlbWorld, entity: Entity): void {
    const feature = world.getComponent<FeatureComponent>(entity, 'feature')!
    const ground = world.getComponent<GroundComponent>(entity, 'ground')!
    const f = feature.feature
    feature.feature = ground.feature
    ground.feature = f
  }
}
