import { DiscreteSpace, Space, SubSpace } from "../../src/spatial/space"
import { Vector } from "../../src/spatial/vector"

describe("DiscreteSpace", () => {

    testSpace(new Vector(0, 2), () => new DiscreteSpace())
})

describe("SubSpace", () => {

    testSpace(new Vector(0), () => new SubSpace(new DiscreteSpace(), (v: Vector) => new Vector(v.x, 2)))
})

function testSpace(position: Vector, spaceBuilder: () => Space<string>): void {

    let space: Space<string>
    beforeEach(() => {
        space = spaceBuilder()
    })

    describe("get and set", () => {

        it("sets and gets cells", () => {
            space.set(position, "a")
            expect(space.get(position)).toEqual("a")
        })

        it("works for empty cells", () => {
            expect(space.get(position)).toBeUndefined()
        })
    })


    describe("remove", () => {

        it("retains values", () => {
            space.set(position, "a")
            const value = space.remove(position)
            expect(value).toEqual("a")
        })

        it("works for empty cells", () => {
            const value = space.remove(position)
            expect(value).toBeUndefined()
        })
    })
}
