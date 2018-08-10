import { Display } from "rot-js"

export function tileDisplay(img: string[][]): Display {
    return drawDisplay((x: number, y: number, character: string, { }: string) => {
        if (img[y] === undefined) {
            img[y] = []
        }
        img[y][x] = character
    })
}

export function lightDisplay(light: string[][]): Display {
    return drawDisplay((x: number, y: number, { }: string, fg: string) => {
        if (light[y] === undefined) {
            light[y] = []
        }
        const g = Number.parseInt(fg.split(",")[1])
        light[y][x] = (g / 256.0 * 9).toFixed(0)
    })
}

function drawDisplay(draw: (x: number, y: number, character: string, fg: string) => void): Display {
    return {
        DEBUG: jest.fn(),
        clear: jest.fn(),
        computeSize: jest.fn(),
        computeFontSize: jest.fn(),
        draw,
        drawText: jest.fn(),
        eventToPosition: jest.fn(),
        getContainer: () => window.document.body.cloneNode(),
        getOptions: jest.fn(),
        setOptions: jest.fn(),
    }
})
