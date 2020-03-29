import { calculateCover } from '../../src/component-reducers/cover'
import { World } from '../../src/ecs/world'
import { TlbWorld, registerComponents, registerResources } from '../../src/tlb'
import { Vector } from '../../src/spatial'
import { createFeatureFromType } from '../../src/components/feature'
import { mockRenderer } from '../mocks'
import { createAsset } from '../../src/components/asset'
import { Random } from '../../src/random'
import { Uniform } from '../../src/random/distributions'

describe('cover', () => {
  let world: TlbWorld
  beforeEach(() => {
    world = new World()
    registerComponents(world)
    registerResources(world, mockRenderer())

    createFeatureFromType(world, 0, new Vector([0, 0]), 'corridor')
    createFeatureFromType(world, 0, new Vector([0, 1]), 'wall')

    createFeatureFromType(world, 0, new Vector([1, 0]), 'corridor')
    createFeatureFromType(world, 0, new Vector([1, 1]), 'corridor')
    createAsset(world, new Random(new Uniform('cover')), 0, new Vector([1, 1]), 'up', 'table')
  })

  it('does not find cover if no cover exists', () => {
    expect(calculateCover(world, 0, new Vector([-1, 0]), new Vector([0, 0]))).toEqual('none')
  })

  it('finds cover behind full cover', () => {
    expect(calculateCover(world, 0, new Vector([1, 2]), new Vector([0, 0]))).toEqual('full')
  })

  it('finds cover behind partial cover', () => {
    expect(calculateCover(world, 0, new Vector([2, 0]), new Vector([0, 0]))).toEqual('partial')
  })

  it('finds best cover', () => {
    expect(calculateCover(world, 0, new Vector([2, 2]), new Vector([0, 0]))).toEqual('full')
  })
})
