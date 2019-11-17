import { SpacePartitioner, Corridor, Room, Hub } from '../../src/generative/space-partitioner'
import { Uniform } from '../../src/random/distributions'
import { Rectangle } from '../../src/geometry/rectangle'
import { Vector } from '../../src/spatial'

describe('SpacePartitioner', () => {
  let partitioner: SpacePartitioner
  beforeEach(() => {
    partitioner = new SpacePartitioner(new Uniform('1234'))
  })

  describe('planStructure', () => {
    it('returns empty room if it cannot partition', () => {
      const shape = new Rectangle(0, 0, 1, 1)
      const structure = partitioner.planStructure(shape, 1, 1, 1)
      expect(structure.kind).toEqual('room')
      expect(structure.shape).toEqual(shape)
      expect(structure.rooms).toEqual([])
      allShapesValid(structure)
    })

    it('splits rooms', () => {
      const shape = new Rectangle(0, 0, 5, 5)
      const structure = partitioner.planStructure(shape, 2, 3, 1)
      expect(structure.kind).toEqual('room')
      expect(structure.rooms.length).not.toBe(0)
      allShapesValid(structure)
    })

    it('creates corridors connecting rooms', () => {
      const shape = new Rectangle(0, 0, 7, 5)
      const structure = partitioner.planStructure(shape, 2, 3, 1)
      expect(structure.kind).toEqual('corridor')
      expect(structure.rooms.length).not.toBe(0)
      allShapesValid(structure)
    })
  })

  describe('planStructuresWithExit', () => {
    it('splits without exits', () => {
      const shape = new Rectangle(0, 0, 7, 5)
      const structure = partitioner.planStructureWithExits(shape, [], 2, 3, 1)
      expect(structure.kind).toEqual('corridor')
      expect(structure.rooms.length).not.toBe(0)
      allShapesValid(structure)
    })

    it('ensures first exit is contained in root structure', () => {
      const shape = new Rectangle(0, 0, 7, 5)
      const structure = partitioner.planStructureWithExits(shape, [new Vector([3, 0])], 2, 3, 1)
      expect(structure.shape.bounds().containsVector(new Vector([3, 0]))).toBeTruthy()
      allShapesValid(structure)
    })

    it('ensures second exit is contained', () => {
      const shape = new Rectangle(0, 0, 7, 5)
      const structure = partitioner.planStructureWithExits(shape, [new Vector([3, 0]), new Vector([6, 3])], 2, 3, 1) as Corridor
      expect(structure.exits.length).not.toBe(0)
      expect(structure.exits[0].shape.bounds().containsVector(new Vector([6, 3]))).toBeTruthy()
      allShapesValid(structure)
    })
  })
})

function allShapesValid(structure: Corridor | Room | Hub) {
  const shape = structure.shape.bounds()
  expect(shape.width).toBeGreaterThan(0)
  expect(shape.height).toBeGreaterThan(0)
  if (structure.kind === 'corridor') {
    structure.exits.forEach(allShapesValid)
    structure.hubs.forEach(allShapesValid)
    structure.rooms.forEach(allShapesValid)
  } else if (structure.kind === 'hub') {
    structure.exits.forEach(allShapesValid)
  } else if (structure.kind === 'room') {
    structure.rooms.forEach(allShapesValid)
  }
}
