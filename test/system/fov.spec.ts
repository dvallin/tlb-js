import { Fov } from '../../src/systems/fov'
import { TlbWorld } from '../../src/tlb'
import { World } from '../../src/ecs/world'
import { mockComponent, mockRayCaster, mockReturnValue, mockImplementation3, callArgument } from '../mocks'
import { FovComponent } from '../../src/components/fov'
import { Storage } from '../../src/ecs/storage'
import { PositionComponent } from '../../src/components/position'
import { RayCaster } from '../../src/renderer/ray-caster'
import { Vector } from '../../src/spatial'

describe('Fov', () => {
  let world: TlbWorld

  let rayCaster: RayCaster
  let fov: FovComponent
  let position: PositionComponent
  beforeEach(() => {
    world = new World()

    const positions: Storage<PositionComponent> = mockComponent<PositionComponent>(world, 'position')
    const fovs: Storage<FovComponent> = mockComponent<FovComponent>(world, 'fov')

    position = { position: new Vector(1.2, 1.2) }
    fov = { fov: [] }

    mockReturnValue<PositionComponent>(positions.get, position)
    mockReturnValue<FovComponent>(fovs.get, fov)

    rayCaster = mockRayCaster()
    mockImplementation3(rayCaster.fov, ({}, {}, callback: (pos: Vector, distance: number) => void) => {
      callback(new Vector(1, 1), 2)
      callback(new Vector(0, 0), 1)
    })

    new Fov(rayCaster).update(world, 0)
  })

  it('pushes all fov cells', () => {
    expect(fov.fov).toEqual([{ position: new Vector(1, 1), distance: 2 }, { position: new Vector(0, 0), distance: 1 }])
  })

  it('floors position', () => {
    expect(callArgument(rayCaster.fov, 0, 1)).toEqual(new Vector(1, 1))
  })
})
