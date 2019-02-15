import { TlbWorld } from '../../src/tlb'
import { World } from '../../src/ecs/world'
import { mockComponent, mockRayCaster, mockReturnValue, mockImplementation4, mockMap, callArgument, mockImplementation } from '../mocks'
import { FovComponent } from '../../src/components/fov'
import { Storage } from '../../src/ecs/storage'
import { PositionComponent } from '../../src/components/position'
import { RayCaster } from '../../src/renderer/ray-caster'
import { Vector } from '../../src/spatial'
import { WorldMap } from '../../src/resources/world-map'
import { Light } from '../../src/systems/light'
import { LightComponent, LightingComponent } from '../../src/components/light'
import { Color } from '../../src/renderer/color'

describe('Light', () => {
  let world: TlbWorld

  let rayCaster: RayCaster
  let light: LightComponent
  let lightings: Storage<LightingComponent>
  let position: PositionComponent
  let map: WorldMap
  beforeEach(() => {
    world = new World()
    map = mockMap(world)

    const positions: Storage<PositionComponent> = mockComponent<PositionComponent>(world, 'position')
    const lights: Storage<FovComponent> = mockComponent<FovComponent>(world, 'light')
    lightings = mockComponent<LightingComponent>(world, 'lighting')

    position = { position: new Vector(1.2, 1.2) }
    light = { color: new Color([180, 180, 180]) }

    mockReturnValue<PositionComponent>(positions.get, position)
    mockReturnValue<LightComponent>(lights.get, light)

    rayCaster = mockRayCaster()
    mockImplementation4(rayCaster.lighting, ({}, {}, {}, callback: (pos: Vector, color: Color) => void) => {
      callback(new Vector(1, 1), new Color([2, 2, 2]))
      callback(new Vector(0, 0), new Color([1, 1, 1]))
    })
  })

  it('adds computed light to tiles', () => {
    mockImplementation(map.getTile, (position: Vector) => (position.key === '1,1' ? 42 : undefined))
    new Light(rayCaster).update(world, 0)
    expect(callArgument(lightings.insert, 0, 0)).toEqual(42)
    expect(callArgument<LightingComponent>(lightings.insert, 0, 1).incomingLight.get(0)).toEqual(new Color([2, 2, 2]))
  })

  it('adds computed light to characters', () => {
    mockImplementation(map.getCharacter, (position: Vector) => (position.key === '1,1' ? 42 : undefined))
    new Light(rayCaster).update(world, 0)
    expect(callArgument(lightings.insert, 0, 0)).toEqual(42)
    expect(callArgument<LightingComponent>(lightings.insert, 0, 1).incomingLight.get(0)).toEqual(new Color([2, 2, 2]))
  })
})
