import { RotRenderer } from "../../src/renderer/renderer"

import { Display } from "rot-js"
import * as rot from "rot-js"
import { getInstances } from "../mocks"
import { Color } from "../../src/renderer/color"
import { Drawable } from "../../src/renderer/drawable"


class C extends Color {

    public rgb: string

    constructor(color: [number, number, number]) {
        super(color)
        this.rgb = color.join()
    }
}

class D extends Drawable {

    constructor(character: string) {
        super(character, new C([255, 128, 0]))
    }
}

jest.mock("rot-js")
document.body.appendChild = jest.fn()
rot.Color.toRGB = jest.fn(c => c.join())

describe("RotRenderer", () => {

    let renderer: RotRenderer
    let display: Display
    beforeEach(() => {
        jest.resetAllMocks()
        renderer = new RotRenderer()
        display = getInstances<Display>(Display)[0]
    })

    it("creates a display and attaches it to the dom", () => {
        expect(Display).toHaveBeenCalledTimes(1)
        expect(document.body.appendChild).toHaveBeenCalledTimes(1)
    })

    it("clears the display", () => {
        renderer.clear()
        expect(display.clear).toHaveBeenCalledTimes(1)
    })

    it("maps events to display positions", () => {
        display.eventToPosition = jest.fn()
            .mockReturnValueOnce([1, 2])
            .mockReturnValueOnce(1)
            .mockReturnValueOnce(undefined)
        const event = new UIEvent("click", {})
        expect(renderer.eventToPosition(event)).toEqual({ x: 1, y: 2 })
        expect(renderer.eventToPosition(event)).toBeUndefined()
        expect(renderer.eventToPosition(event)).toBeUndefined()
    })

    describe("drawable", () => {

        it("without background", () => {
            renderer.drawable(new D("c"), { x: 1, y: 2 })
            expect(display.draw).toHaveBeenCalledTimes(1)
            expect(display.draw).toHaveBeenCalledWith(1, 2, "c", "255,128,0", undefined)
        })

        it("with background", () => {
            renderer.drawable(new D("c"), { x: 1, y: 2 }, new C([0, 1, 2]))
            expect(display.draw).toHaveBeenCalledTimes(1)
            expect(display.draw).toHaveBeenCalledWith(1, 2, "c", "255,128,0", "0,1,2")
        })

        it("draws only first character", () => {
            renderer.drawable(new D("cde"), { x: 1, y: 2 }, new C([0, 1, 2]))
            expect(display.draw).toHaveBeenCalledTimes(1)
            expect(display.draw).toHaveBeenCalledWith(1, 2, "c", "255,128,0", "0,1,2")
        })
    })

    describe("character", () => {

        it("without background", () => {
            renderer.character("c", { x: 1, y: 2 }, new C([255, 128, 0]))
            expect(display.draw).toHaveBeenCalledTimes(1)
            expect(display.draw).toHaveBeenCalledWith(1, 2, "c", "255,128,0", undefined)
        })

        it("with background", () => {
            renderer.character("c", { x: 1, y: 2 }, new C([255, 128, 0]), new C([0, 1, 2]))
            expect(display.draw).toHaveBeenCalledTimes(1)
            expect(display.draw).toHaveBeenCalledWith(1, 2, "c", "255,128,0", "0,1,2")
        })

        it("draws only first character", () => {
            renderer.character("cde", { x: 1, y: 2 }, new C([255, 128, 0]), new C([0, 1, 2]))
            expect(display.draw).toHaveBeenCalledTimes(1)
            expect(display.draw).toHaveBeenCalledWith(1, 2, "c", "255,128,0", "0,1,2")
        })
    })

    describe("text", () => {

        it("without background", () => {
            renderer.text("abc", { x: 1, y: 2 }, new C([255, 128, 0]))
            expect(display.draw).toHaveBeenCalledTimes(3)
            expect(display.draw).toHaveBeenCalledWith(1, 2, "a", "255,128,0", undefined)
            expect(display.draw).toHaveBeenCalledWith(2, 2, "b", "255,128,0", undefined)
            expect(display.draw).toHaveBeenCalledWith(3, 2, "c", "255,128,0", undefined)
        })

        it("with background", () => {
            renderer.text("abc", { x: 1, y: 2 }, new C([255, 128, 0]), new C([0, 1, 2]))
            expect(display.draw).toHaveBeenCalledTimes(3)
            expect(display.draw).toHaveBeenCalledWith(1, 2, "a", "255,128,0", "0,1,2")
            expect(display.draw).toHaveBeenCalledWith(2, 2, "b", "255,128,0", "0,1,2")
            expect(display.draw).toHaveBeenCalledWith(3, 2, "c", "255,128,0", "0,1,2")
        })
    })
})
