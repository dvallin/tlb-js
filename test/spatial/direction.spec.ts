import { rightOf, leftOf, oppositeOf } from '../../src/spatial/direction'

describe('rightOf', () => {
  it('works', () => {
    expect(rightOf('up')).toEqual('right')
    expect(rightOf('right')).toEqual('down')
    expect(rightOf('down')).toEqual('left')
    expect(rightOf('left')).toEqual('up')
  })
})

describe('leftOf', () => {
  it('works', () => {
    expect(leftOf('up')).toEqual('left')
    expect(leftOf('right')).toEqual('up')
    expect(leftOf('down')).toEqual('right')
    expect(leftOf('left')).toEqual('down')
  })
})

describe('oppositeOf', () => {
  it('works', () => {
    expect(oppositeOf('up')).toEqual('down')
    expect(oppositeOf('right')).toEqual('left')
    expect(oppositeOf('down')).toEqual('up')
    expect(oppositeOf('left')).toEqual('right')
  })
})
