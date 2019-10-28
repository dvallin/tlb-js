import { digitalLine } from '../../src/renderer/digital-line'
import { Vector } from '../../src/spatial'

describe('digitalLine', () => {
  it('finds a line without obstacles', () => {
    const d = digitalLine(new Vector([0, 0]), new Vector([5, 2]), _ => false)!
    expect(d.map(c => c.key)).toEqual(['0,0', '1,0', '2,0', '3,1', '4,1', '5,2'])
  })

  it('finds a through obstacles', () => {
    const d = digitalLine(new Vector([0, 0]), new Vector([5, 2]), v => v.key === '3,1' || v.key === '4,1')!
    expect(d.map(c => c.key)).toEqual(['0,0', '1,1', '2,1', '3,2', '4,2', '5,2'])
  })

  it('returns undefined if no line exists', () => {
    const d = digitalLine(new Vector([0, 0]), new Vector([5, 2]), v => v.key === '3,2' || v.key === '3,1')!
    expect(d).toBeUndefined()
  })
})
