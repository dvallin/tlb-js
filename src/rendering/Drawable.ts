import { Color } from "@/rendering/Color"

export class Drawable {
    public color: Color

    public constructor(public character: string, public diffuse: Color) {
        this.color = diffuse
    }


    public computeColor(ambientLight: Color, diffuseLight?: Color): void {
        let totalLight = ambientLight
        if (diffuseLight !== undefined) {
            totalLight = totalLight.add(diffuseLight)
        }
        this.color = this.diffuse.multiply(totalLight)
    }
}
