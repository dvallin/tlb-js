import { attackTarget } from '../../src/component-reducers/attack-target'
import { World } from '../../src/ecs/world'
import { TlbWorld } from '../../src/tlb'
import { mockRandom, mockComponent, mockReturnValues, mockReturnValue, mockLog } from '../mocks'
import { Attack } from '../../src/components/action'
import { PositionComponent } from '../../src/components/position'
import { Storage } from '../../src/ecs/storage'
import { Vector } from '../../src/spatial'
import { LightingComponent } from '../../src/components/light'
import { gray } from '../../src/renderer/palettes'
import { Entity } from '../../src/ecs/entity'
import { Color } from '../../src/renderer/color'
import { CharacterStatsComponent, createCharacterStatsComponent } from '../../src/components/character-stats'
import { EffectComponent, damage, confuse, kill } from '../../src/components/effects'
import { Random } from '../../src/random'
import { Log } from '../../src/resources/log'

describe('attackTarget', () => {
  let world: TlbWorld = new World()
  let position: Storage<PositionComponent>
  let stats: Storage<CharacterStatsComponent>
  let lighting: Storage<LightingComponent>
  let effect: Storage<EffectComponent>
  let random: Random
  let log: Log
  beforeEach(() => {
    world = new World()
    position = mockComponent(world, 'position')
    stats = mockComponent(world, 'character-stats')
    lighting = mockComponent(world, 'lighting')
    effect = mockComponent(world, 'effect')
    mockReturnValue(stats.get, createCharacterStatsComponent('player'))
    mockReturnValues(position.get, { position: new Vector(0, 0) }, { position: new Vector(1, 1) })
    mockReturnValue(lighting.get, { incomingLight: new Map<Entity, Color>([[3, gray[0]], [4, gray[1]]]) })
    log = mockLog(world)
    random = mockRandom()
  })

  it('creates a damage effect on the target', () => {
    mockReturnValues(random.decision, true, false)
    const attack: Attack = { kind: 'attack', effects: [damage(3)], range: 2, accuracy: 4 }

    attackTarget(world, random, 0, 1, 'torso', attack)

    expect(random.decision).toHaveBeenCalledWith(0.9)
    expect(log.attack).toHaveBeenCalled()
    expect(effect.insert).toHaveBeenCalledWith(0, {
      bodyPart: 'torso',
      effect: { global: false, negated: false, type: 'damage', value: 3 },
      source: 0,
      target: 1,
    })
  })

  it('doubles the damage on critical hits', () => {
    mockReturnValues(random.decision, true, true)
    const attack: Attack = { kind: 'attack', effects: [damage(3)], range: 2, accuracy: 4 }

    attackTarget(world, random, 0, 1, 'head', attack)

    expect(random.decision).toHaveBeenCalledWith(0.7)
    expect(log.attack).toHaveBeenCalled()
    expect(effect.insert).toHaveBeenCalledWith(0, {
      bodyPart: 'head',
      effect: { global: false, negated: false, type: 'damage', value: 6 },
      source: 0,
      target: 1,
    })
  })

  it('creates effects for all effects', () => {
    mockReturnValues(random.decision, true, true)
    const attack: Attack = { kind: 'attack', effects: [kill(), confuse()], range: 2, accuracy: 4 }

    attackTarget(world, random, 0, 1, 'leftArm', attack)

    expect(random.decision).toHaveBeenCalledWith(0.8)
    expect(log.attack).toHaveBeenCalled()
    expect(effect.insert).toHaveBeenCalledWith(0, {
      bodyPart: 'leftArm',
      effect: { global: true, negated: false, type: 'kill' },
      source: 0,
      target: 1,
    })
    expect(effect.insert).toHaveBeenCalledWith(0, {
      bodyPart: 'leftArm',
      effect: { global: true, negated: false, type: 'kill' },
      source: 0,
      target: 1,
    })
  })
})
