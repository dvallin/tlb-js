import { Color } from "./color"

export abstract class Drawable {

    public color: string
    private lights: Map<number, Color>

    public constructor(
        public readonly character: string,
        public readonly diffuse: Color
    ) {
        this.color = diffuse.rgb
        this.lights = new Map()
    }

    public computeColor(ambient: Color): void {
        let totalLight = ambient
        this.lights.forEach(diffuseLight =>
            totalLight = totalLight.add(diffuseLight)
        )
        this.color = this.diffuse.multiply(totalLight).rgb
    }

    public setLight(entity: number, light: Color): void {
        this.lights.set(entity, light)
    }

    public hasLight(entity: number): boolean {
        return this.lights.has(entity)
    }

    public removeLight(entity: number): void {
        this.lights.delete(entity)
    }

    public clearLight(): void {
        this.lights.clear()
    }
}
