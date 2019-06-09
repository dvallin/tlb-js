import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { AssetComponent, removeAsset } from '../components/asset'
import { FeatureComponent } from '../components/feature'
import { GroundComponent } from '../components/ground'
import { Entity } from '../ecs/entity'
import { TriggersComponent, TriggeredByComponent } from '../components/trigger'
import { InventoryComponent } from '../components/items'
import { WorldMap, WorldMapResource } from '../resources/world-map'

export class Trigger implements TlbSystem {
  public readonly components: ComponentName[] = ['active', 'triggers']

  public update(world: TlbWorld, entity: Entity): void {
    const asset = world.getComponent<AssetComponent>(entity, 'asset')
    if (asset !== undefined) {
      switch (asset.type) {
        case 'door':
          this.door(world, entity)
          break
        case 'loot':
          this.loot(world, entity)
          break
      }
    }
    world
      .editEntity(entity)
      .removeComponent('active')
      .removeComponent('triggered-by')
  }

  public door(world: TlbWorld, entity: Entity): void {
    const triggers = world.getComponent<TriggersComponent>(entity, 'triggers')!
    triggers.entities.forEach(doorPart => this.swapGroundAndFeature(world, doorPart))
  }

  public loot(world: TlbWorld, entity: Entity): void {
    const map: WorldMap = world.getResource<WorldMapResource>('map')
    const triggeredBy = world.getComponent<TriggeredByComponent>(entity, 'triggered-by')!
    const triggerInventory = world.getComponent<InventoryComponent>(entity, 'inventory')
    const targetInventory = world.getComponent<InventoryComponent>(triggeredBy.entity, 'inventory')
    if (triggerInventory !== undefined && targetInventory !== undefined) {
      targetInventory.content = triggerInventory.content.concat(targetInventory.content)
    }
    removeAsset(world, map, entity)
  }

  public swapGroundAndFeature(world: TlbWorld, entity: Entity): void {
    const feature = world.getComponent<FeatureComponent>(entity, 'feature')!
    const ground = world.getComponent<GroundComponent>(entity, 'ground')!
    const featureType = feature.type
    feature.type = ground.feature
    ground.feature = featureType
  }
}
