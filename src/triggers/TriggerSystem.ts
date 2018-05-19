import { GameSystem, RenderLayer } from "@/systems/GameSystem"
import { World, MapStorage } from "mogwai-ecs/lib"
import { Display } from "rot-js"
import { Drawable } from "@/rendering/Drawable"
import { primary } from "@/rendering/palettes"

export class Trigger {
    constructor(public apply: (world: World, entity: number) => void) { }
}

export const doorTrigger: Trigger = new Trigger((world, entity) => {
    if (world.graph.V([entity]).hasLabel("blocking").some()) {
        world.entity(entity)
            .with("drawable", new Drawable(" ", primary[2]))
            .withOut("lightBlocking")
            .withOut("blocking")
            .close()
    } else {
        world.entity(entity)
            .with("drawable", new Drawable("+", primary[2]))
            .with("lightBlocking")
            .with("blocking")
    }
})

export class TriggerSystem implements GameSystem {

    public static NAME: string = "trigger"

    public renderLayer: RenderLayer = RenderLayer.None

    public register(world: World): void {
        world.registerSystem(TriggerSystem.NAME, this)
        world.registerComponent("triggered")
        world.registerComponent("trigger", new MapStorage<Trigger>())
    }

    public build({ }: World): void {
        //
    }

    public execute(world: World): void {
        world.fetch().on(t => t.hasLabel("triggered", "trigger"))
            .withComponents("trigger")
            .stream().each((target: { entity: number, trigger: Trigger }) => {
                target.trigger.apply(world, target.entity)
                world.entity(target.entity).withOut("triggered").close()
            })
    }

    public render({ }: World, { }: Display): void {
        //
    }

    public afterRender({ }: World): void {
        //
    }
}
