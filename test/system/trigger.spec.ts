import { TlbWorld } from '../../src/tlb'
import { World } from '../../src/ecs/world'
import { mockComponent, mockReturnValue, mockImplementation } from '../mocks'
import { Storage } from '../../src/ecs/storage'
import { AssetComponent } from '../../src/components/asset'
import { ChildrenComponent } from '../../src/components/relation'
import { FeatureComponent } from '../../src/components/feature'
import { GroundComponent } from '../../src/components/ground'
import { Trigger } from '../../src/systems/trigger'
import { Entity } from '../../src/ecs/entity'

describe('Trigger', () => {
  let world: TlbWorld

  let actives: Storage<{}>
  let assets: Storage<AssetComponent>
  let children: Storage<ChildrenComponent>
  let features: Storage<FeatureComponent>
  let grounds: Storage<GroundComponent>
  beforeEach(() => {
    world = new World()

    actives = mockComponent(world, 'active')
    assets = mockComponent<AssetComponent>(world, 'asset')
    children = mockComponent<ChildrenComponent>(world, 'children')
    features = mockComponent<FeatureComponent>(world, 'feature')
    grounds = mockComponent<GroundComponent>(world, 'ground')
  })

  it('deactives current entity', () => {
    new Trigger().update(world, 42)
    expect(actives.remove).toHaveBeenCalledWith(42)
  })

  describe('door trigger', () => {
    beforeEach(() => {
      mockReturnValue<AssetComponent>(assets.get, { type: 'door' })
    })

    it('swaps ground and feature of all children', () => {
      mockReturnValue<ChildrenComponent>(children.get, { children: [1, 2] })

      const featureComponents: FeatureComponent[] = [{ type: 'door' }, { type: 'corridor' }]
      const groundComponents: GroundComponent[] = [{ feature: 'corridor' }, { feature: 'door' }]
      mockImplementation(features.get, (e: Entity) => featureComponents[e - 1])
      mockImplementation(grounds.get, (e: Entity) => groundComponents[e - 1])

      new Trigger().update(world, 0)

      expect(featureComponents).toEqual([{ type: 'corridor' }, { type: 'door' }])
      expect(groundComponents).toEqual([{ feature: 'door' }, { feature: 'corridor' }])
    })
  })
})