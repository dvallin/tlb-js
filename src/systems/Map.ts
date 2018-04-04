import { World } from "mogwai-ecs/lib"
import { Display } from "rot-js"

import { GameSystem, RenderLayer } from "@/systems/GameSystem"

import { foreach, RenderIterator } from "@/rendering"
import * as line from "@/rendering/line"
import * as rectangle from "@/rendering/rectangle"

import { Position } from "@/components/Position"
import { Rectangle } from "@/geometry/Rectangle"

export class Map implements GameSystem {

    public static NAME: string = "map"

    public renderLayer: RenderLayer = RenderLayer.Layer1

    public register(world: World): void {
        world.registerSystem(Map.NAME, this)
    }

    public build({ }: World): void {
        //
    }

    public execute({ }: World): void {
        //
    }

    public render({ }: World, display: Display): void {
        const p0 = new Position(0, 0)
        const p1 = new Position(0, 10)
        this.renderIterator(display, line.rasterize(p0, p1), ".")
        this.renderIterator(display, rectangle.rasterize(new Rectangle(3, 8, 0, 5), true), ".")
        this.renderIterator(display, rectangle.rasterize(new Rectangle(10, 15, 0, 5)), ".")
    }

    private renderIterator(display: Display, iterator: RenderIterator, char: string, color: string = "white"): void {
        foreach(iterator, position => display.draw(position.x, position.y, char, color))
    }
}
