import { CharacterStatsComponent } from '../components/character-stats'
import { ActiveEffectsComponent } from '../components/effects'
import { Renderer } from '../renderer/renderer'
import { primary } from '../renderer/palettes'
import { Vector } from '../spatial'
import { characterStats } from '../assets/characters'

export function renderBodyPartInfo(
  renderer: Renderer,
  position: Vector,
  key: string,
  stats: CharacterStatsComponent,
  activeEffects: ActiveEffectsComponent
): void {
  const currentValue = stats.current.bodyParts[key].health
  const maximumValue = characterStats[stats.type].bodyParts[key].health
  const bars = Math.ceil((5 * currentValue) / maximumValue)
  const bodyPartBar = `${key}${' '.repeat(8 - key.length)}${'|'.repeat(bars)}`
  const effects = activeEffects.effects.filter(e => e.bodyPart === key && !e.effect.global).map(e => e.effect.type[0])
  const color = effects.length > 0 || bars <= 2 ? primary[3] : primary[1]
  renderer.text(bodyPartBar, position, color)
  effects.forEach((name, index) => {
    renderer.text(name, position.add(new Vector([index + 14, 0])), primary[2])
  })
}

export function renderPercentage(renderer: Renderer, position: Vector, key: string, value: number): void {
  const percentage = Math.round(Math.min(100, value * 100))
  renderer.text(`${key} ${percentage}%`, position, percentage > 80 ? primary[1] : primary[0])
}
