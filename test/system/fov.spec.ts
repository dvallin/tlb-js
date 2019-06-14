import { Fov } from '../../src/systems/fov'
import { TlbWorld } from '../../src/tlb'
import { World } from '../../src/ecs/world'
import { mockComponent, mockReturnValue, mockImplementation3, mockQueries } from '../mocks'
import { FovComponent } from '../../src/components/fov'
import { Storage } from '../../src/ecs/storage'
import { PositionComponent } from '../../src/components/position'
import { Vector } from '../../src/spatial'
import { Queries } from '../../src/renderer/queries'

describe('Fov', () => {
  let world: TlbWorld

  let queries: Queries
  let fov: FovComponent
  let position: PositionComponent
  beforeEach(() => {
    world = new World()

    const positions: Storage<PositionComponent> = mockComponent<PositionComponent>(world, 'position')
    const fovs: Storage<FovComponent> = mockComponent<FovComponent>(world, 'fov')

    position = { position: new Vector([1.2, 1.2]) }
    fov = { fov: [] }

    mockReturnValue<PositionComponent>(positions.get, position)
    mockReturnValue<FovComponent>(fovs.get, fov)

    queries = mockQueries()
    mockImplementation3(queries.fov, ({}, {}, callback: (pos: Vector, distance: number) => void) => {
      callback(new Vector([1, 1]), 2)
      callback(new Vector([0, 0]), 1)
    })

    new Fov(queries).update(world, 0)
  })

  it('pushes all fov cells', () => {
    expect(fov.fov).toEqual([{ position: new Vector([1, 1]), distance: 2 }, { position: new Vector([0, 0]), distance: 1 }])
  })
})
