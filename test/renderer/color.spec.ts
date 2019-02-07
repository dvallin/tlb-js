import { Color } from '../../src/renderer/color'
import { gray } from '../../src/renderer/palettes'

describe('Color', () => {
  it('calculates the rgb value', () => {
    expect(new Color([0, 0, 0]).rgb).toEqual('rgb(0,0,0)')
    expect(new Color([128, 255, 257]).rgb).toEqual('rgb(128,255,255)')
  })

  it('adds colors', () => {
    expect(gray[0].add(gray[1]).color).toEqual([341, 344, 327])
  })

  it('multiplies colors', () => {
    expect(gray[0].multiply(gray[1]).color).toEqual([100, 103, 87])
  })
})
