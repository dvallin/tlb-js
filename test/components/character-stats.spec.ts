import { characterStats } from '../../src/components/character-stats'
import { features } from '../../src/components/feature'

describe('characterStats', () => {
  it('has a feature for each character', () => {
    Object.keys(characterStats).forEach(c => expect(features[c]).toBeDefined())
  })
})
