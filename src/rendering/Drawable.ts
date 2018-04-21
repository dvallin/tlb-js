import { Color } from "@/rendering/Color"

export class Drawable {
    public color: Color
    public noLightColor: Color
    private lights: Map<number, Color>

    public constructor(public character: string, public diffuse: Color) {
        this.color = diffuse
        this.lights = new Map()
        this.noLightColor = this.color
    }

    public computeColor(ambientLight: Color): void {
        let totalLight = ambientLight
        this.lights.forEach(diffuseLight =>
            totalLight = totalLight.add(diffuseLight)
        )
        this.noLightColor = this.diffuse.multiply(ambientLight)
        this.color = this.diffuse.multiply(totalLight)
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
