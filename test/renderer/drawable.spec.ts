import { Color } from '../../src/renderer/color'
import { Drawable } from '../../src/renderer/drawable'
import { gray, primary } from '../../src/renderer/palettes'

describe('Drawable', () => {
  let drawable: Drawable
  beforeEach(() => {
    class D extends Drawable {
      constructor() {
        super('a', new Color([255, 128, 0]))
      }
    }
    drawable = new D()
  })

  it('adds light', () => {
    drawable.addLight(3, primary[0])
    expect(drawable.hasLight(3)).toBeTruthy()
  })

  it('removes light', () => {
    drawable.addLight(3, primary[0])
    drawable.removeLight(3)
    expect(drawable.hasLight(3)).toBeFalsy()
  })

  it('clears light', () => {
    drawable.addLight(3, primary[0])
    drawable.clearLight()
    expect(drawable.hasLight(3)).toBeFalsy()
  })

  it('computes color without light', () => {
    drawable.computeColor(gray[1])
    expect(drawable.color).toEqual('rgb(111,57,0)')
  })

  it('computes color with light', () => {
    drawable.addLight(3, primary[0])
    drawable.computeColor(gray[1])
    expect(drawable.color).toEqual('rgb(255,133,0)')
  })
})
