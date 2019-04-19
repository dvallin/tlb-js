import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { AssetComponent } from '../components/asset'
import { FeatureComponent } from '../components/feature'
import { GroundComponent } from '../components/ground'
import { Entity } from '../ecs/entity'
import { TriggersComponent } from '../components/trigger'

export class Trigger implements TlbSystem {
  public readonly components: ComponentName[] = ['active', 'trigger']

  public update(world: TlbWorld, entity: Entity): void {
    const asset = world.getComponent<AssetComponent>(entity, 'asset')
    if (asset !== undefined) {
      switch (asset.type) {
        case 'door': {
          this.door(world, entity)
        }
      }
    }
    world.editEntity(entity).removeComponent('active')
  }

  public door(world: TlbWorld, entity: Entity): void {
    const triggers = world.getComponent<TriggersComponent>(entity, 'triggers')!
    triggers.entities.forEach(doorPart => this.swapGroundAndFeature(world, doorPart))
  }

  public swapGroundAndFeature(world: TlbWorld, entity: Entity): void {
    const feature = world.getComponent<FeatureComponent>(entity, 'feature')!
    const ground = world.getComponent<GroundComponent>(entity, 'ground')!
    const featureType = feature.type
    feature.type = ground.feature
    ground.feature = featureType
  }
}
