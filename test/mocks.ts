import { Storage } from '../src/ecs/storage'
import { WorldMapResource } from '../src/resources/world-map'
import { Renderer } from '../src/renderer/renderer'
import { ComponentName, TlbWorld, ResourceName } from '../src/tlb'
import { Random } from '../src/random'
import { RayCaster } from '../src/renderer/ray-caster'
import { Space, StackedSpace } from '../src/spatial'
import { Entity } from '../src/ecs/entity'
import { SetSpace } from '../src/spatial/set-space'
import { Rectangle } from '../src/geometry/rectangle'
import { Input } from '../src/resources/input'

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

function mockSpace<T>(): Space<T> {
  return { get: jest.fn(), set: jest.fn(), setAll: jest.fn(), remove: jest.fn() }
}
function mockSetSpace(): SetSpace {
  return { has: jest.fn(), set: jest.fn(), setAll: jest.fn(), remove: jest.fn() }
}
function mockStackedSpace<T>(): StackedSpace<T> {
  return { get: jest.fn(), set: jest.fn(), add: jest.fn(), addAll: jest.fn(), retain: jest.fn() }
}

export function mockMap(world: TlbWorld): WorldMapResource {
  const map: WorldMapResource = {
    kind: 'map' as ResourceName,
    update: jest.fn(),

    boundaries: new Rectangle(0, 0, 0, 0),
    tiles: mockSpace<Entity>(),
    characters: mockSpace<Entity>(),
    visible: mockSetSpace(),
    discovered: mockSetSpace(),
    lights: mockStackedSpace<Entity>(),

    setTile: jest.fn(),
    getTile: jest.fn(),
    removeTile: jest.fn(),

    setCharacter: jest.fn(),
    getCharacter: jest.fn(),
    removeCharacter: jest.fn(),

    addLight: jest.fn(),

    isDiscovered: jest.fn(),
    isVisible: jest.fn(),

    isTileBlocking: jest.fn(),
    isLightBlocking: jest.fn(),

    tileMatches: jest.fn(),
    characterMatches: jest.fn(),
    featureMatches: jest.fn(),

    isShapeFree: jest.fn(),
    isShapeBlocked: jest.fn(),
    shapeHasAll: jest.fn(),
    shapeHasSome: jest.fn(),
  }
  world.registerResource(map)
  return map
}

export function mockInput(world: TlbWorld): Input {
  const input = {
    kind: 'input' as ResourceName,
    position: { x: 0, y: 0 },
    mouseDown: false,
    mousePressed: false,
    mouseReleased: false,
    keyDown: new Set(),
    keyPressed: new Set(),
    keyReleased: new Set(),
    mouseEvent: undefined,
    keyEvents: [],
    eventToPosition: jest.fn(),
    update: jest.fn(),
    handleKeyboardEvents: jest.fn(),
    handleMouseEvent: jest.fn(),
    createMovementDelta: jest.fn(),
  }
  world.registerResource(input)
  return input
}

export function mockRayCaster(): RayCaster {
  return {
    fov: jest.fn(),
    lighting: jest.fn(),
  }
}

export function mockRenderer(): Renderer {
  return {
    render: jest.fn(),
    clear: jest.fn(),
    eventToPosition: jest.fn(),
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
