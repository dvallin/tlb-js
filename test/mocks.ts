import { Vector } from '../src/spatial/vector'
import { Storage } from '../src/ecs/storage'
import { WorldMap } from '../src/resources/world-map'
import { Renderer } from '../src/renderer/renderer'
import { ComponentName, TlbWorld, ResourceName } from '../src/tlb'
import { Random } from '../src/random'

export function mockComponent(world: TlbWorld, component: ComponentName): Storage<{}> {
  const storage = {
    insert: jest.fn(),
    get: jest.fn(),
    remove: jest.fn(),
    has: jest.fn(),
    foreach: jest.fn(),
    clear: jest.fn(),
    size: jest.fn(),
  }
  world.registerComponentStorage(component, storage)
  return storage
}

export function mockMap(world: TlbWorld, boundary: Vector = new Vector(42, 41)): WorldMap {
  const map = {
    kind: 'map' as ResourceName,
    boundary,
    update: jest.fn(),
    isValid: jest.fn(),
    isShapeFree: jest.fn(),
    featureMatches: jest.fn(),
    shapeHasAll: jest.fn(),
    shapeHasSome: jest.fn(),
    tiles: {
      get: jest.fn(),
      set: jest.fn(),
      setAll: jest.fn(),
      remove: jest.fn(),
    },
    items: {
      get: jest.fn(),
      set: jest.fn(),
      add: jest.fn(),
      addAll: jest.fn(),
      retain: jest.fn(),
    },
  }
  world.registerResource(map)
  return map
}

export function mockRenderer(): Renderer {
  return {
    clear: jest.fn(),
    eventToPosition: jest.fn(),
    drawable: jest.fn(),
    character: jest.fn(),
    text: jest.fn(),
  }
}

export function mockRandom(): Random {
  return {
    distribution: { sample: jest.fn() },
    integerBetween: jest.fn(),
    floatBetween: jest.fn(),
    decision: jest.fn(),
    weightedDecision: jest.fn(),
    shuffle: jest.fn(),
    pick: jest.fn(),
  }
}

export function mockReturnValue<T>(o: object, value: T): void {
  ;(o as jest.Mock).mockReturnValue(value)
}

export function mockReturnValues<T>(o: object, ...values: T[]): void {
  const mock = o as jest.Mock
  for (const value of values) {
    mock.mockReturnValueOnce(value)
  }
}

export function mockImplementation<T, O>(o: object, f: (input: T) => O): void {
  const mock = o as jest.Mock
  mock.mockImplementation(f)
}

export function mockImplementation2<T, T2, O>(o: object, f: (input: T, input2: T2) => O): void {
  const mock = o as jest.Mock
  mock.mockImplementation(f)
}

export function getInstances<T>(o: object): T[] {
  const mock = o as jest.MockInstance<T>
  return mock.mock.instances
}
