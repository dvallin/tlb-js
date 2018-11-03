import { RoomGenerator } from "../../src/artifacts/room-generator"
import { Random } from "../../src/random"
import { Rectangle } from "../../src/geometry/rectangle"

import { mockRandom } from "../mocks"
import { Union } from "../../src/geometry/union";

describe("RoomGenerator", () => {

    let random: Random
    let roomGenerator: RoomGenerator
    beforeEach(() => {
        random = mockRandom()
        roomGenerator = new RoomGenerator(random)
    })

    describe("generate", () => {

        it("generates a rectangular if decided", () => {
            random.decision = jest.fn().mockReturnValue(false)
            roomGenerator.rectangularRoom = jest.fn().mockReturnValue({})
            roomGenerator.generate(new Rectangle(0, 0, 1, 1), "down")
            expect(roomGenerator.rectangularRoom).toHaveBeenCalled()
        })

        it("generates a lshaped room if decided", () => {
            random.decision = jest.fn().mockReturnValue(true)
            roomGenerator.lshapedRoom = jest.fn().mockReturnValue({})
            roomGenerator.generate(new Rectangle(0, 0, 1, 1), "down")
            expect(roomGenerator.lshapedRoom).toHaveBeenCalled()
        })

        it("regenerates a lshaped room up to four times, then falls back to rectangular", () => {
            random.decision = jest.fn().mockReturnValue(true)
            roomGenerator.rectangularRoom = jest.fn().mockReturnValue({})
            roomGenerator.lshapedRoom = jest.fn().mockReturnValue(undefined)
            roomGenerator.generate(new Rectangle(0, 0, 1, 1), "down")
            expect(roomGenerator.lshapedRoom).toHaveBeenCalledTimes(4)
            expect(roomGenerator.rectangularRoom).toHaveBeenCalled()
        })
    })

    describe("rectangularRoom", () => {

        beforeEach(() => {
            random.integerBetween = jest.fn()
                .mockReturnValueOnce(4)
                .mockReturnValueOnce(5)
        })

        describe("entry", () => {

            it("sets the entry", () => {
                random.weightedDecision = jest.fn().mockReturnValue(1)

                const room = roomGenerator.rectangularRoom(new Rectangle(0, 0, 1, 1), "down")

                expect(room.entries).toHaveLength(1)
                expect(room.entries[0].shape).toEqual(new Rectangle(0, 0, 1, 1))
            })

            describe("alignement", () => {

                it("aligns entry in the center", () => {
                    random.weightedDecision = jest.fn().mockReturnValue(1)

                    const room = roomGenerator.rectangularRoom(new Rectangle(0, 0, 1, 1), "down")

                    expect(room.shape).toEqual(new Rectangle(-1, 1, 4, 5))
                })

                it("aligns entry in the first third", () => {
                    random.weightedDecision = jest.fn().mockReturnValue(0)

                    const room = roomGenerator.rectangularRoom(new Rectangle(0, 0, 1, 1), "down")

                    expect(room.shape).toEqual(new Rectangle(-2, 1, 4, 5))
                })

                it("aligns entry in the second third", () => {
                    random.weightedDecision = jest.fn().mockReturnValue(2)

                    const room = roomGenerator.rectangularRoom(new Rectangle(0, 0, 1, 1), "down")

                    expect(room.shape).toEqual(new Rectangle(0, 1, 4, 5))
                })
            })
        })

        describe("room direction", () => {

            it("grows room in up direction", () => {
                random.weightedDecision = jest.fn().mockReturnValue(1)

                const room = roomGenerator.rectangularRoom(new Rectangle(0, 0, 1, 1), "up")

                expect(room.entries[0].direction).toEqual("up")
                expect(room.shape).toEqual(new Rectangle(-1, -5, 4, 5))
            })

            it("grows room in down direction", () => {
                random.weightedDecision = jest.fn().mockReturnValue(1)

                const room = roomGenerator.rectangularRoom(new Rectangle(0, 0, 1, 1), "down")

                expect(room.entries[0].direction).toEqual("down")
                expect(room.shape).toEqual(new Rectangle(-1, 1, 4, 5))
            })

            it("grows room in left direction", () => {
                random.weightedDecision = jest.fn().mockReturnValue(1)

                const room = roomGenerator.rectangularRoom(new Rectangle(0, 0, 1, 1), "left")

                expect(room.entries[0].direction).toEqual("left")
                expect(room.shape).toEqual(new Rectangle(-4, -2, 4, 5))
            })

            it("grows room in right direction", () => {
                random.weightedDecision = jest.fn().mockReturnValue(1)

                const room = roomGenerator.rectangularRoom(new Rectangle(0, 0, 1, 1), "right")

                expect(room.entries[0].direction).toEqual("right")
                expect(room.shape).toEqual(new Rectangle(1, -2, 4, 5))
            })
        })
    })

    describe("lshapedRoom", () => {

        beforeEach(() => {
            random.integerBetween = jest.fn()
                .mockReturnValueOnce(4)
                .mockReturnValueOnce(5)
        })

        describe("entry", () => {

            it("sets the entry", () => {
                random.weightedDecision = jest.fn().mockReturnValue(1)

                const room = roomGenerator.lshapedRoom(new Rectangle(0, 0, 1, 1), "down")!

                expect(room.entries).toHaveLength(1)
                expect(room.entries[0].shape).toEqual(new Rectangle(0, 0, 1, 1))
            })

            describe("alignement", () => {

                it("aligns entry in the center", () => {
                    random.shuffle = jest.fn().mockImplementation(a => {
                        a[0] = a[1]
                        a[2] = a[1]
                    })

                    const room = roomGenerator.lshapedRoom(new Rectangle(0, 0, 1, 1), "down")!

                    expect(room.shape).toEqual(new Union(new Rectangle(-2, 1, 4, 5), new Rectangle(-2, 1, 5, 4)))
                })

                it("aligns entry in the first third", () => {
                    random.shuffle = jest.fn().mockImplementation(a => {
                        a[1] = a[0]
                        a[2] = a[0]
                    })

                    const room = roomGenerator.lshapedRoom(new Rectangle(0, 0, 1, 1), "down")!

                    expect(room.shape).toEqual(new Union(new Rectangle(-2, 1, 4, 5), new Rectangle(-2, 1, 5, 4)))
                })

                it("aligns entry in the second third", () => {
                    random.shuffle = jest.fn().mockImplementation(a => {
                        a[0] = a[2]
                        a[1] = a[2]
                    })

                    const room = roomGenerator.lshapedRoom(new Rectangle(0, 0, 1, 1), "down")!

                    expect(room.shape).toEqual(new Union(new Rectangle(-1, 1, 4, 5), new Rectangle(-1, 1, 5, 4)))
                })
            })
        })

        describe("room direction", () => {

            it("grows room in up direction", () => {
                random.weightedDecision = jest.fn().mockReturnValue(1)

                const room = roomGenerator.lshapedRoom(new Rectangle(0, 0, 1, 1), "up")!

                expect(room.entries[0].direction).toEqual("up")
                expect(room.shape).toEqual(new Union(new Rectangle(-1, -5, 4, 5), new Rectangle(-1, -5, 5, 4)))
            })

            it("grows room in down direction", () => {
                random.weightedDecision = jest.fn().mockReturnValue(1)

                const room = roomGenerator.lshapedRoom(new Rectangle(0, 0, 1, 1), "down")!

                expect(room.entries[0].direction).toEqual("down")
                expect(room.shape).toEqual(new Union(new Rectangle(-2, 1, 4, 5), new Rectangle(-2, 1, 5, 4)))
            })

            it("grows room in left direction", () => {
                random.weightedDecision = jest.fn().mockReturnValue(1)

                const room = roomGenerator.lshapedRoom(new Rectangle(0, 0, 1, 1), "left")!

                expect(room.entries[0].direction).toEqual("left")
                expect(room.shape).toEqual(new Union(new Rectangle(-5, -1, 4, 5), new Rectangle(-5, -1, 5, 4)))
            })

            it("grows room in right direction", () => {
                random.weightedDecision = jest.fn().mockReturnValue(1)

                const room = roomGenerator.lshapedRoom(new Rectangle(0, 0, 1, 1), "right")!

                expect(room.entries[0].direction).toEqual("right")
                expect(room.shape).toEqual(new Union(new Rectangle(1, -2, 4, 5), new Rectangle(1, -2, 5, 4)))
            })
        })

        describe("room alignement", () => {

            it("aligns the room top left", () => {
                random.integerBetween = jest.fn()
                    .mockReturnValueOnce(4)
                    .mockReturnValueOnce(5)
                    .mockReturnValueOnce(0)

                const room = roomGenerator.lshapedRoom(new Rectangle(0, 0, 1, 1), "up")!

                expect(room.shape).toEqual(new Union(new Rectangle(-1, -5, 4, 5), new Rectangle(-1, -5, 5, 4)))
            })

            it("aligns the room top right", () => {
                random.integerBetween = jest.fn()
                    .mockReturnValueOnce(4)
                    .mockReturnValueOnce(5)
                    .mockReturnValueOnce(1)

                const room = roomGenerator.lshapedRoom(new Rectangle(0, 0, 1, 1), "up")!

                expect(room.shape).toEqual(new Union(new Rectangle(0, -5, 4, 5), new Rectangle(-1, -5, 5, 4)))
            })

            it("aligns the room bottom right", () => {
                random.integerBetween = jest.fn()
                    .mockReturnValueOnce(4)
                    .mockReturnValueOnce(5)
                    .mockReturnValueOnce(2)

                const room = roomGenerator.lshapedRoom(new Rectangle(0, 0, 1, 1), "up")!

                expect(room.shape).toEqual(new Union(new Rectangle(0, -5, 4, 5), new Rectangle(-1, -4, 5, 4)))
            })

            it("aligns the room bottom left", () => {
                random.integerBetween = jest.fn()
                    .mockReturnValueOnce(4)
                    .mockReturnValueOnce(5)
                    .mockReturnValueOnce(3)

                const room = roomGenerator.lshapedRoom(new Rectangle(0, 0, 1, 1), "up")!

                expect(room.shape).toEqual(new Union(new Rectangle(-1, -5, 4, 5), new Rectangle(-1, -4, 5, 4)))
            })
        })

        describe("room creation failures", () => {

            it("may fail to connect entry to very thin room", () => {
                random.integerBetween = jest.fn()
                    .mockReturnValueOnce(4)
                    // this will create a room too thin for the entry
                    .mockReturnValueOnce(1)
                    .mockReturnValueOnce(1)

                const room = roomGenerator.lshapedRoom(new Rectangle(0, 0, 1, 1), "right")!

                expect(room).toBeUndefined()
            })

            it("may fail to connect big entry to room", () => {
                random.integerBetween = jest.fn()
                    .mockReturnValueOnce(7)
                    // this will create a room too thin for the entry
                    .mockReturnValueOnce(3)
                    .mockReturnValueOnce(1)

                const room = roomGenerator.lshapedRoom(new Rectangle(0, 0, 1, 4), "right")!

                expect(room).toBeUndefined()
            })
        })
    })
})
