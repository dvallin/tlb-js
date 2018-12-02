import { Rectangle } from "../../src/geometry/rectangle"
import { Shape } from "../../src/geometry/shape"

export function shapeTest(shape: Shape): void {

    describe("shape", () => {

        describe("contains", () => {

            it("is symmetrical", () => {
                expect(shape.contains(shape)).toBeTruthy()
            })

            it("happens to contain 1,1", () => {
                expect(shape.contains(new Rectangle(1, 1, 1, 1))).toBeTruthy()
            })

            it("happens to not contain 0,0", () => {
                expect(shape.contains(new Rectangle(0, 0, 1, 1))).toBeFalsy()
            })
        })
    })
}

