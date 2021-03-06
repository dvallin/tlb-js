import { Storage } from '../src/ecs/storage'
import { WorldMapResource, Level } from '../src/resources/world-map'
import { Renderer } from '../src/renderer/renderer'
import { ComponentName, TlbWorld, ResourceName } from '../src/tlb'
import { Random } from '../src/random'
import { Queries } from '../src/renderer/queries'
import { Space, Vector } from '../src/spatial'
import { Entity } from '../src/ecs/entity'
import { SetSpace } from '../src/spatial/set-space'
import { Rectangle } from '../src/geometry/rectangle'
import { Input } from '../src/resources/input'
import { UI } from '../src/resources/ui'
import { Viewport, ViewportResource } from '../src/resources/viewport'
import { Log, LogResource } from '../src/resources/log'

export function mockComponent<T>(world: TlbWorld, component: ComponentName): Storage<T> {
  const storage = {
    insert: jest.fn(),
    get: jest.fn(),
    remove: jest.fn(),
    has: jest.fn(),
    foreach: jest.fn(),
    first: jest.fn(),
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
  return new SetSpace(2)
}

export function mockMap(world: TlbWorld): WorldMapResource {
  const level: Level = {
    boundary: new Rectangle(0, 0, 0, 0),
    tiles: mockSpace<Entity>(),
    characters: mockSpace<Entity>(),
    structures: mockSpace<Entity>(),
    visible: mockSetSpace(),
    discovered: mockSetSpace(),

    setStructure: jest.fn(),
    getStructure: jest.fn(),

    setTile: jest.fn(),
    getTile: jest.fn(),
    removeTile: jest.fn(),

    setCharacter: jest.fn(),
    getCharacter: jest.fn(),
    removeCharacter: jest.fn(),

    isDiscovered: jest.fn(),
    isVisible: jest.fn(),

    isBlocking: jest.fn(),
    isLightBlocking: jest.fn(),

    tileMatches: jest.fn(),
    characterMatches: jest.fn(),
    featureMatches: jest.fn(),

    isShapeFree: jest.fn(),
    isShapeBlocked: jest.fn(),
    shapeHasAll: jest.fn(),
    shapeHasSome: jest.fn(),
  }
  const map: WorldMapResource = {
    kind: 'map' as ResourceName,
    update: jest.fn(),
    width: 0,
    levels: [level],
  }
  world.registerResource(map)
  return map
}

export function mockInput(world: TlbWorld): Input {
  const input = {
    kind: 'input' as ResourceName,
    update: jest.fn(),

    position: { x: 0, y: 0 },
    mouseDown: false,
    mousePressed: false,
    mouseReleased: false,

    numericActive: jest.fn(),
    isActive: jest.fn(),

    createMovementDelta: jest.fn(),
  }
  world.registerResource(input)
  return input
}

export function mockUi(world: TlbWorld): UI {
  const ui = {
    kind: 'ui' as ResourceName,
    isModal: false,
    update: jest.fn(),
    hasElement: jest.fn(),
    render: jest.fn(),

    reset: jest.fn(),

    showInventoryTransferModal: jest.fn(),
    inventoryTransferModalShowing: jest.fn(),
    hideInventoryTransferModal: jest.fn(),

    showMultipleChoiceModal: jest.fn(),
    selectedModalOption: jest.fn(),
    multipleChoiceModalShowing: jest.fn(),
    hideMultipleChoiceModal: jest.fn(),

    showDialogModal: jest.fn(),
    dialogResult: jest.fn(),
    dialogShowing: jest.fn(),
    hideDialogModal: jest.fn(),

    hideSelectors: jest.fn(),

    showActionSelector: jest.fn(),
    selectedAction: jest.fn(),

    showMovementSelector: jest.fn(),
    selectedMovement: jest.fn(),

    showAttackSelector: jest.fn(),
    selectedAttack: jest.fn(),

    showMultipleChoiceSelector: jest.fn(),
    selectedOption: jest.fn(),

    createTabs: jest.fn(),
  }
  world.registerResource(ui)
  return ui
}

export function mockViewport(world: TlbWorld): Viewport {
  const viewport: ViewportResource = {
    kind: 'viewport' as ResourceName,
    update: jest.fn(),
    fromDisplay: jest.fn(),
    collectRenderables: jest.fn(),
    toDisplay: jest.fn(),
    focus: jest.fn(),
    addLayer: jest.fn(),

    boundaries: new Vector([0, 1]),

    gridLocked: false,
    topLeft: new Vector([0, 0]),
    level: 0,
    layers: [],
  }
  world.registerResource(viewport)
  return viewport
}

export function mockLog(world: TlbWorld): Log {
  const log: LogResource = {
    kind: 'log' as ResourceName,
    update: jest.fn(),
    getEntries: jest.fn(),
    effectApplied: jest.fn(),
    owner: jest.fn(),
    text: jest.fn(),
    died: jest.fn(),
    missed: jest.fn(),
    attack: jest.fn(),
    render: jest.fn(),
    verbify: jest.fn(),
    entries: [],
    getName: jest.fn(),
  }
  world.registerResource(log)
  return log
}

export function mockQueries(): Queries {
  return {
    fov: jest.fn(),
    explore: jest.fn(),
    shortestPath: jest.fn(),
    los: jest.fn(),
  }
}

export function mockRenderer(): Renderer {
  return {
    boundaries: new Vector([0, 1]),
    render: jest.fn(),
    clear: jest.fn(),
    eventToPosition: jest.fn(),
    character: jest.fn(),
    text: jest.fn(),
    flowText: jest.fn(),
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
    pickIndex: jest.fn(),
    insideRectangle: jest.fn(),
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

export function mockImplementation3<T, T2, T3, O>(o: object, f: (input: T, input2: T2, input3: T3) => O): void {
  const mock = o as jest.Mock
  mock.mockImplementation(f)
}

export function mockImplementation4<T, T2, T3, T4, O>(o: object, f: (input: T, input2: T2, input3: T3, input4: T4) => O): void {
  const mock = o as jest.Mock
  mock.mockImplementation(f)
}

export function mockImplementation5<T, T2, T3, T4, T5, O>(
  o: object,
  f: (input: T, input2: T2, input3: T3, input4: T4, input5: T5) => O
): void {
  const mock = o as jest.Mock
  mock.mockImplementation(f)
}

export function callArgument<T>(o: object, call: number, argument: number): T {
  const mock = o as jest.Mock<{}>
  return mock.mock.calls[call][argument]
}
