import { blockSymbols, gridSymbols, strangeSymbols, arrows } from "./symbols"

describe("symbols", () => {
    it("has blockSymbols", () => expect(blockSymbols).toHaveLength(5))
    it("has gridSymbols", () => expect(gridSymbols).toHaveLength(40))
    it("has strangeSymbols", () => expect(strangeSymbols).toHaveLength(34))
    it("has arrows", () => expect(arrows).toHaveLength(9))
})
