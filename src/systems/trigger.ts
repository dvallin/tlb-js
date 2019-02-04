import { ComponentName, TlbSystem, TlbWorld } from '../tlb'
import { AssetComponent } from 'src/components/asset'
import { ChildrenComponent } from 'src/components/relation'
import { FeatureComponent } from 'src/components/feature'
import { GroundComponent } from 'src/components/ground'

export class Trigger implements TlbSystem {
  public readonly components: ComponentName[] = ['active', 'trigger']

  public update(world: TlbWorld, entity: number): void {
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

  public door(world: TlbWorld, entity: number): void {
    const children = world.getComponent<ChildrenComponent>(entity, 'children')!
    children.children.forEach(doorPart => this.swapGroundAndFeature(world, doorPart))
  }

  public swapGroundAndFeature(world: TlbWorld, entity: number): void {
    const feature = world.getComponent<FeatureComponent>(entity, 'feature')!
    const ground = world.getComponent<GroundComponent>(entity, 'ground')!
    const featureType = feature.type
    feature.type = ground.feature
    ground.feature = featureType
  }
}
