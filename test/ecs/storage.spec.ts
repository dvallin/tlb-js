import { VectorStorage, MapStorage, SetStorage } from "../../src/ecs/storage"

describe("VectorStorage", () => {

    it("inserts and gets values", () => {
        const storage = new VectorStorage<string>()
        storage.insert(2, "a")
        expect(storage.get(2)).toEqual("a")
    })

    it("gets undefined if value is missing", () => {
        const storage = new VectorStorage<string>()
        expect(storage.get(2)).toBeUndefined()
    })

    it("checks if value exists", () => {
        const storage = new VectorStorage<string>()
        storage.insert(2, "a")
        expect(storage.has(2)).toBeTruthy()
        expect(storage.has(3)).toBeFalsy()
    })

    it("removes values", () => {
        const storage = new VectorStorage<string>()
        storage.insert(2, "a")
        const value1 = storage.remove(2)
        const value2 = storage.remove(2)
        expect(storage.has(2)).toBeFalsy()
        expect(value1).toEqual("a")
        expect(value2).toBeUndefined()
    })

    it("clears storage", () => {
        const storage = new VectorStorage<string>()
        storage.insert(2, "a")
        storage.insert(3, "b")
        storage.clear()
        expect(storage.has(2)).toBeFalsy()
        expect(storage.has(3)).toBeFalsy()
    })

    it("iterates over elements", () => {
        const storage = new VectorStorage<string>()
        storage.insert(2, "a")
        storage.insert(3, "b")
        const entities = []
        const values = []
        storage.foreach((e, v) => {
            entities.push(e)
            values.push(v)
        })
        expect(entities).toEqual([2, 3])
        expect(values).toEqual(["a", "b"])
    })
})

describe("MapStorage", () => {

    it("inserts and gets values", () => {
        const storage = new MapStorage<string>()
        storage.insert(2, "a")
        expect(storage.get(2)).toEqual("a")
    })

    it("gets undefined if value is missing", () => {
        const storage = new MapStorage<string>()
        expect(storage.get(2)).toBeUndefined()
    })

    it("checks if value exists", () => {
        const storage = new MapStorage<string>()
        storage.insert(2, "a")
        expect(storage.has(2)).toBeTruthy()
        expect(storage.has(3)).toBeFalsy()
    })

    it("removes values", () => {
        const storage = new MapStorage<string>()
        storage.insert(2, "a")
        const value1 = storage.remove(2)
        const value2 = storage.remove(2)
        expect(storage.has(2)).toBeFalsy()
        expect(value1).toEqual("a")
        expect(value2).toBeUndefined()
    })

    it("clears storage", () => {
        const storage = new MapStorage<string>()
        storage.insert(2, "a")
        storage.insert(3, "b")
        storage.clear()
        expect(storage.has(2)).toBeFalsy()
        expect(storage.has(3)).toBeFalsy()
    })

    it("iterates over elements", () => {
        const storage = new MapStorage<string>()
        storage.insert(2, "a")
        storage.insert(3, "b")
        const entities = []
        const values = []
        storage.foreach((e, v) => {
            entities.push(e)
            values.push(v)
        })
        expect(entities).toEqual([2, 3])
        expect(values).toEqual(["a", "b"])
    })
})

describe("SetStorage", () => {

    it("inserts and gets values", () => {
        const storage = new SetStorage()
        storage.insert(2, {})
        expect(storage.get(2)).toEqual({})
    })

    it("gets undefined if value is missing", () => {
        const storage = new SetStorage()
        expect(storage.get(2)).toBeUndefined()
    })

    it("checks if value exists", () => {
        const storage = new SetStorage()
        storage.insert(2, {})
        expect(storage.has(2)).toBeTruthy()
        expect(storage.has(3)).toBeFalsy()
    })

    it("removes values", () => {
        const storage = new SetStorage()
        storage.insert(2, {})
        const value1 = storage.remove(2)
        const value2 = storage.remove(2)
        expect(storage.has(2)).toBeFalsy()
        expect(value1).toEqual({})
        expect(value2).toBeUndefined()
    })

    it("clears storage", () => {
        const storage = new SetStorage()
        storage.insert(2, {})
        storage.insert(3, {})
        storage.clear()
        expect(storage.has(2)).toBeFalsy()
        expect(storage.has(3)).toBeFalsy()
    })

    it("iterates over elements", () => {
        const storage = new SetStorage()
        storage.insert(2, {})
        storage.insert(3, {})
        const entities = []
        const values = []
        storage.foreach((e, v) => {
            entities.push(e)
            values.push(v)
        })
        expect(entities).toEqual([2, 3])
        expect(values).toEqual([{}, {}])
    })
})
