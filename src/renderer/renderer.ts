import * as ROT from "rot-js"

import { gray } from "./palettes"
import { Position } from "./position"
import { Color } from "./color"
import { Drawable } from "./drawable"

export interface Renderer {

    clear(): void
    eventToPosition(e: UIEvent): Position

    drawable(drawable: Drawable, position: Position, bg?: Color): void
    character(character: string, position: Position, fg: Color, bg?: Color): void
    text(text: string, position: Position, fg: Color, bg?: Color): void
}

export class RotRenderer implements Renderer {

    public readonly display: ROT.Display

    public constructor() {
        const displayOptions: ROT.DisplayOptions = {
            width: 60,
            height: 40,
            forceSquareRatio: true,
            fontSize: 17,
            fontFamily: "Lucida Console, Monaco, monospace",
            bg: gray[4].rgb
        }
        this.display = new ROT.Display(displayOptions)
        document.body.appendChild(this.display.getContainer())
    }

    public clear(): void {
        this.display.clear()
    }

    public eventToPosition(e: UIEvent): Position {
        const p = this.display.eventToPosition(e) as [number, number]
        return { x: p[0], y: p[1] }
    }

    public drawable(drawable: Drawable, position: Position, bg?: Color): void {
        const fgRgb = drawable.color
        const bgRgb = bg ? bg.rgb : undefined
        this.display.draw(position.x, position.y, drawable.character, fgRgb, bgRgb)
    }

    public character(character: string, position: Position, fg: Color, bg?: Color): void {
        const fgRgb = fg.rgb
        const bgRgb = bg ? bg.rgb : undefined
        this.display.draw(position.x, position.y, character, fgRgb, bgRgb)
    }

    public text(text: string, position: Position, fg: Color, bg?: Color): void {
        const fgRgb = fg.rgb
        const bgRgb = bg ? bg.rgb : undefined
        for (let idx = 0; idx < text.length; idx++) {
            this.display.draw(position.x + idx, position.y, text[idx], fgRgb, bgRgb)
        }
    }
}
