import { registerComponents, TlbWorld } from '../../src/tlb'
import { World } from '../../src/ecs/world'
import { Vector } from '../../src/spatial'
import { Entity } from '../../src/ecs/entity'
import { PlayerControl } from '../../src/systems/player-control'
import { mockInput, mockReturnValue } from '../mocks'
import { Input } from '../../src/resources/input'
import { PositionComponent } from '../../src/components/position'
import { FreeModeControl } from '../../src/systems/free-mode-control'

describe('PlayerControl', () => {
  let world: TlbWorld
  let input: Input
  let system: PlayerControl
  let focus: Entity
  beforeEach(() => {
    world = new World()
    registerComponents(world)
    input = mockInput(world)

    focus = world
      .createEntity()
      .withComponent<PositionComponent>('position', { level: 0, position: new Vector([0, 0]) })
      .withComponent('free-mode-anchor', {}).entity

    system = new FreeModeControl()
  })

  it('does not move on zero delta', () => {
    mockReturnValue<Vector>(input.createMovementDelta, new Vector([0, 0]))
    system.update(world, focus)
    expect(world.getComponent<PositionComponent>(focus, 'position')!.position).toEqual(new Vector([0, 0]))
  })

  it('movs position', () => {
    mockReturnValue<Vector>(input.createMovementDelta, new Vector([1, 0]))
    system.update(world, focus)
    expect(world.getComponent<PositionComponent>(focus, 'position')!.position).toEqual(new Vector([1, 0]))
  })
})
