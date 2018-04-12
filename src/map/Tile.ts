import { primary, gray } from "@/palettes"
import { strangeSymbols } from "@/symbols"
import { uniformInteger } from "@/random"
import { Drawable } from "@/Drawable"

export class Tile implements Drawable {
    public constructor(
        public character: string,
        public color: string,
        public room: number | undefined
    ) { }
}

export function wallTile(): Tile {
    return new Tile("#", gray[3], undefined)
}

export function corridorTile(room: number): Tile {
    return new Tile(".", gray[0], room)
}

export function roomTile(room: number): Tile {
    return new Tile(".", primary[1], room)
}

export function hubTile(room: number): Tile {
    return new Tile(".", primary[0], room)
}

export function doorTile(): Tile {
    return new Tile("+", primary[2], undefined)
}

export function tunnelerTile(): Tile {
    return new Tile("T", "red", -1)
}

export function randomWeapon(): Drawable {
    return { color: primary[3], character: strangeSymbols[uniformInteger(0, strangeSymbols.length)] }
}

function asset(data: string[], colors: string[], palette: string[], room: number): (Tile | undefined)[] {
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
                result.push(new Tile(character, color, room))
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
        primary, room)
}
