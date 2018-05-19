import { primary, gray } from "@/rendering/palettes"
import { strangeSymbols } from "@/symbols"
import { uniformInteger } from "@/random"
import { Drawable } from "@/rendering/Drawable"
import { Color } from "@/rendering/Color"

export class Tile extends Drawable {
    public constructor(
        character: string,
        ambient: Color,
        public room: number | undefined,
        public blocking: boolean,
        public lightBlocking: boolean,
        public description: string
    ) {
        super(character, ambient)
    }
}

export function wallTile(): Tile {
    return new Tile("#", gray[3], undefined, true, true, "a wall")
}

export function corridorTile(room: number): Tile {
    return new Tile(".", gray[0], room, false, false, "a corridor")
}

export function roomTile(room: number): Tile {
    return new Tile(".", primary[1], room, false, false, "floor of a room")
}

export function hubTile(room: number): Tile {
    return new Tile(".", primary[0], room, false, false, "floor of a hub")
}

export function tunnelerTile(): Tile {
    return new Tile("T", Color.fromName("red"), -1, false, false, "a tunneler")
}

export function randomWeapon(): Drawable {
    return new Drawable(strangeSymbols[uniformInteger(0, strangeSymbols.length)], primary[3])
}

function asset(data: string[], colors: string[], palette: Color[], room: number, description: string): (Tile | undefined)[] {
    const result: (Tile | undefined)[] = []
    for (let line = 0; line < data.length; line++) {
        const dataLine = data[line]
        const colorLine = colors[line]
        for (let index = 0; index < data.length; index++) {
            const character = dataLine.charAt(index)
            if (character === " ") {
                result.push(undefined)
            } else {
                const color = palette[Number.parseInt(colorLine[index])]
                result.push(new Tile(character, color, room, true, false, description))
            }
        }
    }
    return result
}

export function machine(room: number): (Tile | undefined)[] {
    return asset(
        [
            " ╓– ",
            "│██╕",
            "╘██│",
            " –╜ "],
        [
            " 34 ",
            "4113",
            "3114",
            " 43 "],
        primary, room, "a machine")
}
