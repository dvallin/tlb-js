import { Random } from "../random"
import { Direction } from "../spatial/direction"
import { Rectangle } from "../geometry/rectangle"
import { rectangular, Room, Entry, largeRectangular, lShaped } from "./rooms"
import { findAll } from "../array-utils"
import { Shape } from "../geometry/shape"
import { Asset } from "../components/asset"

export class RoomGenerator {

    public constructor(
        public readonly random: Random
    ) { }

    public generate(doorShape: Rectangle, entryDirection: Direction): Room {
        const room = this.random.pick(
            [rectangular, largeRectangular, lShaped]
        )

        const possibleEntries = findAll(room.availableEntries, e => e.direction === entryDirection)
        const usedEntry = this.random.pick(possibleEntries)

        const doorPivot = doorShape.center
        const translation = doorPivot.minus(room.availableEntries[usedEntry].position)

        const shape = room.shape.translate(translation)
        const entries = [doorShape]
        const assets: Asset[] = []
        const availableAssets: Shape[] = []
        const availableEntries: Entry[] = []

        room.availableEntries.forEach((e, i) => {
            if (i !== usedEntry) {
                availableEntries.push({
                    position: e.position.add(translation),
                    direction: e.direction
                })
            }
        })

        return { shape, assets, entries, availableEntries, availableAssets }
    }
}
