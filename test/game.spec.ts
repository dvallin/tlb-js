import { Game } from '../src/game'
import { World } from '../src/ecs/world'
import { ComponentName, ResourceName, SystemName } from '../src/tlb'
import { State } from '../src/game-states/state'

describe('Game', () => {
  let game: Game
  let world: World<ComponentName, SystemName, ResourceName>
  let mockState: State
  beforeEach(() => {
    jest.useFakeTimers()
    world = new World()
    game = new Game(world)
    mockState = {
      start: jest.fn(),
      isDone: jest.fn(),
      isFrameLocked: jest.fn(),
    }
    game.states.push(mockState)
  })

  it('counts frames and sets timing values', () => {
    game.execute()
    expect(game.frames).toEqual(1)
    expect(game.started).toBeGreaterThan(0)
    expect(game.compute).toBeGreaterThan(0)
    expect(game.fps).toBeGreaterThan(0)
    expect(game.mspf).toBeGreaterThan(0)

    jest.runOnlyPendingTimers()

    expect(game.frames).toEqual(2)
    expect(game.compute).toBeGreaterThan(0)
    expect(game.started).toBeGreaterThan(0)
    expect(game.fps).toBeGreaterThan(0)
    expect(game.mspf).toBeGreaterThan(0)
  })
})
