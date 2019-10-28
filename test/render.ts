import { TlbWorld } from '../src/tlb'
import { Rectangle } from '../src/geometry/rectangle'
import { WorldMap, WorldMapResource } from '../src/resources/world-map'
import { FeatureComponent } from '../src/components/feature'
import { Renderer } from '../src/renderer/renderer'
import { mockRenderer } from './mocks'
import { Position } from '../src/renderer/position'

export function renderMap(world: TlbWorld, shape: Rectangle): string {
  const map: WorldMap = world.getResource<WorldMapResource>('map')

  let render = ''
  let currentLine = shape.top
  shape.foreach(p => {
    if (currentLine != p.y) {
      render += '\n'
      currentLine = p.y
    }

    const character = map.levels[0].characters.get(p)
    const visibleFeature = character !== undefined ? character : map.levels[0].tiles.get(p)

    if (visibleFeature !== undefined) {
      const f = world.getComponent<FeatureComponent>(visibleFeature, 'feature')!.feature()
      render += f.character
    } else {
      render += ' '
    }
  })
  return render
}

export function displayerRenderer(): { renderer: Renderer; getDisplay: () => string } {
  const display: string[][] = []
  const renderer = mockRenderer()
  renderer.text = (text, position) => pushToDisplay(text, position, display)
  renderer.flowText = (text, position) => {
    pushToDisplay(text, position, display)
    return 1
  }
  return {
    renderer,
    getDisplay: () => display.map(line => line.join('')).join('\n'),
  }
}

function pushToDisplay(text: string, position: Position, display: string[][]) {
  if (display[position.y] === undefined) {
    const line = Array(20)
    display[position.y] = line.fill(' ')
  }
  for (let i = 0; i < text.length; i++) {
    display[position.y][position.x + i] = text[i]
  }
}
