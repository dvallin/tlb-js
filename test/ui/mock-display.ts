import { mockRenderer, mockImplementation2, mockImplementation4 } from '../mocks'
import { Color } from '../../src/renderer/color'
import { Position } from '../../src/renderer/position'
import { Renderer } from '../../src/renderer/renderer'

export function takeSnapshot(renderer: MockRenderer) {
  let rendered = ''
  for (let y = 0; y <= renderer.maxY; ++y) {
    const row = renderer.display[y] || []
    for (let x = 0; x <= renderer.maxX; ++x) {
      rendered += row[x] || ' '
    }
    rendered += '\n'
  }
  expect(rendered).toMatchSnapshot()
}
export function clear(renderer: MockRenderer) {
  renderer.maxX = 0
  renderer.maxY = 0
  renderer.display = []
}

export type MockRenderer = { renderer: Renderer; display: string[][]; maxX: number; maxY: number }
export function createMockRenderer(): MockRenderer {
  const state: MockRenderer = {
    renderer: mockRenderer(),
    display: [],
    maxX: 0,
    maxY: 0,
  }
  mockImplementation2(state.renderer.character, (c: string, p: Position) => {
    if (state.display[p.y] === undefined) {
      state.display[p.y] = []
    }
    state.display[p.y][p.x] = c
    state.maxX = Math.max(p.x, state.maxX)
    state.maxY = Math.max(p.y, state.maxY)
  })
  mockImplementation4(state.renderer.text, (c: string, p: Position, fg: Color, bg?: Color) => {
    for (let idx = 0; idx < c.length; idx++) {
      state.renderer.character(c[idx], { x: p.x + idx, y: p.y }, fg, bg)
    }
  })
  return state
}
