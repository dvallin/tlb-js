import { RoomGenerator } from "../../src/assets/room-generator"
import { Random } from "../../src/random"
import { Rectangle } from "../../src/geometry/rectangle"

import { mockRandom } from "../mocks"
import { rectangular } from "../../src/assets/rooms"

describe("RoomGenerator", () => {

    let random: Random
    let roomGenerator: RoomGenerator
    beforeEach(() => {
        random = mockRandom()
        roomGenerator = new RoomGenerator(random)
    })

    describe("generate", () => {

        it("registers entry", () => {
            random.pick = jest.fn()
                .mockReturnValueOnce(rectangular)
                .mockReturnValueOnce(0)
            const room = roomGenerator.generate(new Rectangle(1, 2, 3, 4), "right")
            expect(room.entries).toHaveLength(1)
            expect(room.entries[0]).toEqual(new Rectangle(1, 2, 3, 4))
        })
    })
})
