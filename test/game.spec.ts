import { Game } from '../src/game'
import { World } from '../src/ecs/world'
import { ComponentName, ResourceName, SystemName } from '../src/tlb'
import { Running } from '../src/game-states/running'

describe('Game', () => {
  let game: Game
  let world: World<ComponentName, SystemName, ResourceName>
  beforeEach(() => {
    jest.useFakeTimers()
    world = new World()
    game = new Game(world)
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

  it('creates a starting region', () => {
    game.execute()
    expect(world.getComponent(0, 'region')).toBeDefined()
    expect(world.getComponent(0, 'root')).toBeDefined()
    expect(game.states[0]).toBeInstanceOf(Running)
  })
})
