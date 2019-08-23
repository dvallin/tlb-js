import { TlbWorld } from '../../src/tlb'
import { World } from '../../src/ecs/world'
import { mockComponent, mockReturnValue, mockMap, callArgument, mockImplementation, mockQueries, mockImplementation5 } from '../mocks'
import { FovComponent } from '../../src/components/fov'
import { Storage } from '../../src/ecs/storage'
import { PositionComponent } from '../../src/components/position'
import { Vector } from '../../src/spatial'
import { WorldMap } from '../../src/resources/world-map'
import { Light } from '../../src/systems/light'
import { LightComponent, LightingComponent } from '../../src/components/light'
import { Color } from '../../src/renderer/color'
import { Queries } from '../../src/renderer/queries'

describe('Light', () => {
  let world: TlbWorld

  let queries: Queries
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

    position = { level: 0, position: new Vector([1.2, 1.2]) }
    light = { color: new Color([180, 180, 180]) }

    mockReturnValue<PositionComponent>(positions.get, position)
    mockReturnValue<LightComponent>(lights.get, light)

    queries = mockQueries()
    mockImplementation5(
      queries.lighting,
      (_a: TlbWorld, _b: number, _c: Vector, _d: Color, callback: (pos: Vector, color: Color) => void) => {
        callback(new Vector([1, 1]), new Color([2, 2, 2]))
        callback(new Vector([0, 0]), new Color([1, 1, 1]))
      }
    )
  })

  it('adds computed light to tiles', () => {
    mockImplementation(map.levels[0].getTile, (position: Vector) => (position.key === '1,1' ? 42 : undefined))
    new Light(queries).update(world, 0)
    expect(callArgument(lightings.insert, 0, 0)).toEqual(42)
    expect(callArgument<LightingComponent>(lightings.insert, 0, 1).incomingLightInFrame.get(0)).toEqual(new Color([2, 2, 2]))
  })

  it('adds computed light to characters', () => {
    mockImplementation(map.levels[0].getCharacter, (position: Vector) => (position.key === '1,1' ? 42 : undefined))
    new Light(queries).update(world, 0)
    expect(callArgument(lightings.insert, 0, 0)).toEqual(42)
    expect(callArgument<LightingComponent>(lightings.insert, 0, 1).incomingLightInFrame.get(0)).toEqual(new Color([2, 2, 2]))
  })
})
