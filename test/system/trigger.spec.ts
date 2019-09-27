import { TlbWorld } from '../../src/tlb'
import { World } from '../../src/ecs/world'
import { mockComponent, mockReturnValue, mockImplementation } from '../mocks'
import { Storage } from '../../src/ecs/storage'
import { AssetComponent } from '../../src/components/asset'
import { FeatureComponent } from '../../src/components/feature'
import { GroundComponent } from '../../src/components/ground'
import { Trigger } from '../../src/systems/trigger'
import { Entity } from '../../src/ecs/entity'
import { TriggersComponent } from '../../src/components/trigger'
import { features } from '../../src/assets/features'

describe('Trigger', () => {
  let world: TlbWorld

  let actives: Storage<{}>
  let assets: Storage<AssetComponent>
  let triggers: Storage<TriggersComponent>
  let featuresStorage: Storage<FeatureComponent>
  let grounds: Storage<GroundComponent>
  let triggeredBy: Storage<{}>
  beforeEach(() => {
    world = new World()

    actives = mockComponent(world, 'active')
    assets = mockComponent<AssetComponent>(world, 'asset')
    triggers = mockComponent<TriggersComponent>(world, 'triggers')
    featuresStorage = mockComponent<FeatureComponent>(world, 'feature')
    grounds = mockComponent<GroundComponent>(world, 'ground')
    triggeredBy = mockComponent<{}>(world, 'triggered-by')
  })

  it('deactives current entity', () => {
    new Trigger(jest.fn()).update(world, 42)
    expect(actives.remove).toHaveBeenCalledWith(42)
  })

  it('removes triggered by flag', () => {
    new Trigger(jest.fn()).update(world, 42)
    expect(triggeredBy.remove).toHaveBeenCalledWith(42)
  })

  describe('door trigger', () => {
    beforeEach(() => {
      mockReturnValue<AssetComponent>(assets.get, { type: 'door' })
    })

    it('swaps ground and feature of all triggers', () => {
      mockReturnValue<TriggersComponent>(triggers.get, { entities: [1, 2] })

      const featureComponents: FeatureComponent[] = [{ feature: () => features['door'] }, { feature: () => features['corridor'] }]
      const groundComponents: GroundComponent[] = [{ feature: () => features['corridor'] }, { feature: () => features['door'] }]
      mockImplementation(featuresStorage.get, (e: Entity) => featureComponents[e - 1])
      mockImplementation(grounds.get, (e: Entity) => groundComponents[e - 1])

      new Trigger(jest.fn()).update(world, 0)

      expect(featureComponents[0].feature()).toEqual(features['corridor'])
      expect(featureComponents[1].feature()).toEqual(features['door'])
      expect(groundComponents[0].feature()).toEqual(features['door'])
      expect(groundComponents[1].feature()).toEqual(features['corridor'])
    })
  })
})
