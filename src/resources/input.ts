import { TlbResource, ResourceName, TlbWorld } from "../tlb"
import { Position } from "../renderer/position"
import { Render } from "./render"

export class Input implements TlbResource {

    public readonly kind: ResourceName = "input"

    public position: Position | undefined = undefined

    public mouseDown: boolean = false
    public mousePressed: boolean = false
    public mouseReleased: boolean = false

    public keyDown: Set<number> = new Set()
    public keyPressed: Set<number> = new Set()
    public keyReleased: Set<number> = new Set()

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
        this.mousePressed = false
        if (this.mouseEvent) {
            const render = world.resources.get("render") as Render
            this.position = render.eventToPosition(this.mouseEvent)
            const pressed = this.mouseEvent.buttons > 0
            if (pressed) {
                if (this.position) {
                    this.mousePressed = true
                    this.mouseDown = true
                }
            } else {
                this.mouseDown = false
                this.mouseReleased = true
            }
            this.mouseEvent = undefined
        }
    }

    private handleKeyboardEvents(): void {
        this.keyPressed.clear()
        this.keyReleased.clear()
        for (const e of this.keyEvents) {
            if (e.type === "keydown") {
                this.keyPressed.add(e.keyCode)
                this.keyDown.add(e.keyCode)
            } else {
                this.keyReleased.add(e.keyCode)
                this.keyDown.delete(e.keyCode)
            }
        }
        this.keyEvents = []
    }
}
