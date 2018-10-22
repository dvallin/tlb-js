import { TlbResource, ResourceName, TlbWorld } from "../tlb"
import { Position } from "../renderer/position"
import { Render } from "./render"

export class Input implements TlbResource {

    public readonly kind: ResourceName = "input"

    public position: Position = { x: 0, y: 0 }

    public mouseDown: boolean = false
    public mousePressed: boolean = false
    public mouseReleased: boolean = false

    public keyDown: Set<number> = new Set()
    public keyPressed: Set<number> = new Set()

    private mouseEvent: MouseEvent | undefined = undefined
    private keyEvents: KeyboardEvent[] = []

    public constructor() {
        document.addEventListener("mousedown", e => this.mouseEvent = e)
        document.addEventListener("mousemove", e => this.mouseEvent = e)
        document.addEventListener("keydown", e => this.keyEvents.push(e))
        document.addEventListener("keyup", e => this.keyEvents.push(e))
    }

    public update(world: TlbWorld): void {
        this.handleMouseEvent(world)
        this.handleKeyboardEvents()
    }

    private handleMouseEvent(world: TlbWorld): void {
        this.mouseReleased = false
        if (this.mouseEvent) {
            const render = world.resources.get("render") as Render
            const position = render.eventToPosition(this.mouseEvent)
            if (position) {
                const pressed = this.mouseEvent.buttons > 0
                if (pressed) {
                    if (!this.mouseDown) {
                        this.mouseDown = true
                        this.mousePressed = true
                    }
                } else {
                    this.mouseReleased = true
                }
            }
            this.mouseEvent = undefined
        }
    }

    private handleKeyboardEvents(): void {
        this.keyPressed.clear()
        for (const e of this.keyEvents) {
            if (e.type === "keydown") {
                if (!this.keyDown.has(e.keyCode)) {
                    this.keyPressed.add(e.keyCode)
                }
                this.keyDown.add(e.keyCode)
            } else {
                this.keyDown.delete(e.keyCode)
            }
        }
        this.keyEvents = []
    }
}
