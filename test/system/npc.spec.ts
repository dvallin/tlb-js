import { TlbWorld } from '../../src/tlb'
import { World } from '../../src/ecs/world'
import { mockComponent, mockReturnValue, mockImplementation } from '../mocks'
import { FovComponent } from '../../src/components/fov'
import { Storage } from '../../src/ecs/storage'
import { PositionComponent } from '../../src/components/position'
import { Vector } from '../../src/spatial'
import { Entity } from '../../src/ecs/entity'
import { Npc } from '../../src/systems/npc'
import { Fighting } from '../../src/game-states/fighting'

describe('Npc', () => {
  let world: TlbWorld

  let players: Storage<{}>
  let ai: Storage<{}>
  let positions: Storage<PositionComponent>
  let waitTurn: Storage<{}>
  beforeEach(() => {
    world = new World()

    positions = mockComponent<PositionComponent>(world, 'position')
    players = mockComponent<{}>(world, 'player')
    ai = mockComponent<{}>(world, 'ai')
    waitTurn = mockComponent<{}>(world, 'wait-turn')

    const fovs: Storage<FovComponent> = mockComponent<FovComponent>(world, 'fov')
    const fov = { fov: [{ position: new Vector(2, 3), distance: 3 }] }
    mockReturnValue<FovComponent>(fovs.get, fov)
  })

  it('does not push a state if player is not in sight', () => {
    mockImplementation(players.foreach, (callback: (entity: Entity) => void) => callback(42))
    mockReturnValue(positions.get, { position: new Vector(3, 3) })
    mockReturnValue(ai.get, { state: 'idle' })
    const pushState = jest.fn()
    new Npc(pushState).update(world, 0)
    expect(pushState).not.toHaveBeenCalled()
  })

  it('pushes fighting state and adds to wait turn if player is in sight', () => {
    mockImplementation(players.foreach, (callback: (entity: Entity) => void) => callback(42))
    mockReturnValue(positions.get, { position: new Vector(2.4, 3.3) })
    mockReturnValue(ai.get, { state: 'idle' })
    const pushState = jest.fn()

    new Npc(pushState).update(world, 0)

    expect(waitTurn.insert).toHaveBeenCalled()
    expect(pushState).toHaveBeenCalledWith(new Fighting())
  })
})
