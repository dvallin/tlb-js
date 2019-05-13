import { LightingComponent } from '../components/light'

export function calculateBrightness(lighting: LightingComponent): number {
  let brightness = 0
  lighting.incomingLight.forEach(incoming => {
    brightness = Math.max(brightness, incoming.brightness())
  })
  return Math.floor((brightness / 255) * 10)
}
