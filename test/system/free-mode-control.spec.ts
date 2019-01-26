import { FreeModeControl } from '../../src/systems/free-mode-control'
import { TlbWorld } from '../../src/tlb'
import { World } from '../../src/ecs/world'
import { Input } from '../../src/resources/input'
import { VK_H, VK_L, VK_K, VK_J } from 'rot-js'
import { VectorStorage } from '../../src/ecs/storage'
import { Vector } from '../../src/spatial'
import { PositionComponent } from '../../src/components/position'

describe('FreeModeControl', () => {
  let system: FreeModeControl
  let world: TlbWorld
  let input: Input
  beforeEach(() => {
    system = new FreeModeControl()
    world = new World()
    input = new Input()
    world.registerResource(input)
    world.registerComponentStorage('position', new VectorStorage<PositionComponent>())
    world.createEntity().withComponent('position', { position: new Vector(2, 3) })
  })

  it('moves left on h', () => {
    input.keyDown.add(VK_H)
    system.update(world, 0)
    expect(world.getComponent(0, 'position')).toEqual({ position: new Vector(1, 3) })
  })

  it('moves right on l', () => {
    input.keyDown.add(VK_L)
    system.update(world, 0)
    expect(world.getComponent(0, 'position')).toEqual({ position: new Vector(3, 3) })
  })

  it('moves down on j', () => {
    input.keyDown.add(VK_J)
    system.update(world, 0)
    expect(world.getComponent(0, 'position')).toEqual({ position: new Vector(2, 4) })
  })

  it('moves up on k', () => {
    input.keyDown.add(VK_K)
    system.update(world, 0)
    expect(world.getComponent(0, 'position')).toEqual({ position: new Vector(2, 2) })
  })

  it('normalizes movement', () => {
    input.keyDown.add(VK_H)
    input.keyDown.add(VK_K)
    system.update(world, 0)
    expect(world.getComponent(0, 'position')).toEqual({
      position: new Vector(2, 3).add(new Vector(-1, -1).normalize()),
    })
  })

  it('cancels out movement', () => {
    input.keyDown.add(VK_H)
    input.keyDown.add(VK_L)
    input.keyDown.add(VK_J)
    system.update(world, 0)
    expect(world.getComponent(0, 'position')).toEqual({
      position: new Vector(2, 4),
    })
  })
})
