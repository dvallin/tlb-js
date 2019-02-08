import { FreeModeControl } from '../../src/systems/free-mode-control'
import { TlbWorld } from '../../src/tlb'
import { World } from '../../src/ecs/world'
import { Input } from '../../src/resources/input'
import { VectorStorage } from '../../src/ecs/storage'
import { Vector } from '../../src/spatial'
import { PositionComponent } from '../../src/components/position'
import { mockInput } from '../mocks'

describe('FreeModeControl', () => {
  let system: FreeModeControl
  let world: TlbWorld
  let input: Input
  beforeEach(() => {
    system = new FreeModeControl()
    world = new World()
    input = mockInput(world)
    world.registerComponentStorage('position', new VectorStorage<PositionComponent>())
    world.createEntity().withComponent('position', { position: new Vector(2, 3) })
  })

  it('adds delta', () => {
    input.createMovementDelta = jest.fn().mockReturnValue(new Vector(-1, 0))
    system.update(world, 0)
    expect(world.getComponent(0, 'position')).toEqual({ position: new Vector(1, 3) })
  })
})
