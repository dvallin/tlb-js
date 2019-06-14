import { ActionSelector, ActionGroup } from '../../src/ui/action-selector'
import { Rectangle } from '../../src/geometry/rectangle'
import { World } from '../../src/ecs/world'
import { TlbWorld } from '../../src/tlb'
import { mockInput } from '../mocks'
import { KEYS } from 'rot-js'

describe('ActionSelector', () => {
  describe('two uncollapsed groups', () => {
    const group1: ActionGroup = createGroup('1', '1', '2', '3')
    const group2: ActionGroup = createGroup('2', '1', '2')

    describe('hover', () => {
      let selector: ActionSelector
      beforeEach(() => {
        selector = ActionSelector.build(0, new Rectangle(0, 0, 10, 5), [group1, group2])
      })

      it('sets hovered by mouse position', () => {
        const world: TlbWorld = new World()
        const input = mockInput(world)
        input.position = { x: 3, y: 3 }

        selector.update(world)

        expect(selector.hovered).toEqual({
          action: group1.items[1].action,
          entity: group1.entity,
        })
      })

      it('hovers first row on initial down key', () => {
        const world: TlbWorld = new World()
        const input = mockInput(world)
        input.keyPressed.add(KEYS.VK_J)

        selector.update(world)

        expect(selector.groupSelector.hovered).toBeUndefined()
        expect(selector.hovered).toEqual({
          action: group1.items[0].action,
          entity: group1.entity,
        })
      })

      it('hovers second row on subsequent down key', () => {
        const world: TlbWorld = new World()
        const input = mockInput(world)
        input.keyPressed.add(KEYS.VK_J)

        selector.update(world)
        selector.update(world)

        expect(selector.hovered).toEqual({
          action: group1.items[1].action,
          entity: group1.entity,
        })
      })

      it('hovers first group initially', () => {
        const world: TlbWorld = new World()
        mockInput(world)

        selector.update(world)

        expect(selector.groupSelector.hovered).toEqual({ ...group1, collapsed: false })
        expect(selector.hovered).toBeUndefined()
      })

      it('hovers second group', () => {
        const world: TlbWorld = new World()
        const input = mockInput(world)
        input.keyPressed.add(KEYS.VK_J)

        selector.update(world)
        selector.update(world)
        selector.update(world)
        selector.update(world)

        expect(selector.groupSelector.hovered).toEqual({ ...group2, collapsed: false })
        expect(selector.actionSelector.hovered).toBeUndefined()
      })

      it('hovers first group on wrapping around', () => {
        const world: TlbWorld = new World()
        const input = mockInput(world)
        input.keyPressed.add(KEYS.VK_J)

        selector.update(world)
        selector.update(world)
        selector.update(world)
        selector.update(world)
        selector.update(world)
        selector.update(world)
        selector.update(world)

        expect(selector.groupSelector.hovered).toEqual({ ...group1, collapsed: false })
        expect(selector.actionSelector.hovered).toBeUndefined()
      })
    })
  })

  describe('two uncollapsed and one collapsed groups', () => {
    const group1: ActionGroup = createGroup('1', '1', '2', '3')
    const group2: ActionGroup = createGroup('2', '1', '2')
    const group3: ActionGroup = createGroup('3', '1', '2')

    describe('hover', () => {
      let selector: ActionSelector
      beforeEach(() => {
        selector = ActionSelector.build(0, new Rectangle(0, 0, 10, 5), [group1, group2, group3])
        clickAt(selector, 4)
      })

      it('sets hovered by mouse position', () => {
        const world: TlbWorld = new World()
        const input = mockInput(world)
        input.position = { x: 3, y: 3 }

        selector.update(world)

        expect(selector.groupSelector.hovered).toBeUndefined()
        expect(selector.hovered).toEqual({
          action: group1.items[1].action,
          entity: group1.entity,
        })
      })

      it('hovers first row on initial down key', () => {
        const world: TlbWorld = new World()
        const input = mockInput(world)
        input.keyPressed.add(KEYS.VK_J)

        selector.update(world)

        expect(selector.groupSelector.hovered).toBeUndefined()
        expect(selector.hovered).toEqual({
          action: group1.items[0].action,
          entity: group1.entity,
        })
      })

      it('hovers second row on subsequent down key', () => {
        const world: TlbWorld = new World()
        const input = mockInput(world)
        input.keyPressed.add(KEYS.VK_J)

        selector.update(world)
        selector.update(world)

        expect(selector.groupSelector.hovered).toBeUndefined()
        expect(selector.hovered).toEqual({
          action: group1.items[1].action,
          entity: group1.entity,
        })
      })

      it('hovers first group initially', () => {
        const world: TlbWorld = new World()
        mockInput(world)

        selector.update(world)

        expect(selector.groupSelector.hovered).toEqual({ ...group1, collapsed: false })
        expect(selector.actionSelector.hovered).toBeUndefined()
      })

      it('hovers second group', () => {
        const world: TlbWorld = new World()
        const input = mockInput(world)
        input.keyPressed.add(KEYS.VK_J)

        selector.update(world)
        selector.update(world)
        selector.update(world)
        selector.update(world)

        expect(selector.groupSelector.hovered).toEqual({ ...group2, collapsed: true })
        expect(selector.actionSelector.hovered).toBeUndefined()
      })

      it('hovers third group', () => {
        const world: TlbWorld = new World()
        const input = mockInput(world)
        input.keyPressed.add(KEYS.VK_J)

        selector.update(world)
        selector.update(world)
        selector.update(world)
        selector.update(world)
        selector.update(world)

        expect(selector.groupSelector.hovered).toEqual({ ...group3, collapsed: false })
        expect(selector.actionSelector.hovered).toBeUndefined()
      })

      it('hovers first group on wrapping around', () => {
        const world: TlbWorld = new World()
        const input = mockInput(world)
        input.keyPressed.add(KEYS.VK_J)

        selector.update(world)
        selector.update(world)
        selector.update(world)
        selector.update(world)
        selector.update(world)
        selector.update(world)
        selector.update(world)
        selector.update(world)

        expect(selector.groupSelector.hovered).toEqual({ ...group1, collapsed: false })
        expect(selector.actionSelector.hovered).toBeUndefined()
      })
    })

    describe('select', () => {
      let selector: ActionSelector
      beforeEach(() => {
        selector = ActionSelector.build(0, new Rectangle(0, 0, 10, 5), [group1, group2, group3])
        clickAt(selector, 4)
      })

      it('selects by mouse press', () => {
        const world: TlbWorld = new World()
        const input = mockInput(world)
        input.position = { x: 3, y: 3 }
        input.mousePressed = true

        selector.update(world)

        expect(selector.groupSelector.selected).toBeUndefined()
        expect(selector.selected).toEqual({
          action: group1.items[1].action,
          entity: group1.entity,
        })
      })

      it('selects first row on initial down key', () => {
        const world: TlbWorld = new World()
        const input = mockInput(world)
        input.keyPressed.add(KEYS.VK_J)
        input.keyPressed.add(KEYS.VK_RETURN)

        selector.update(world)

        expect(selector.groupSelector.selected).toBeUndefined()
        expect(selector.selected).toEqual({
          action: group1.items[0].action,
          entity: group1.entity,
        })
      })

      it('selects second row on subsequent down key', () => {
        const world: TlbWorld = new World()
        const input = mockInput(world)
        input.keyPressed.add(KEYS.VK_J)
        input.keyPressed.add(KEYS.VK_RETURN)

        selector.update(world)
        selector.update(world)

        expect(selector.groupSelector.selected).toBeUndefined()
        expect(selector.selected).toEqual({
          action: group1.items[1].action,
          entity: group1.entity,
        })
      })

      it('collapses first group initially', () => {
        const world: TlbWorld = new World()
        const input = mockInput(world)
        input.keyPressed.add(KEYS.VK_RETURN)

        selector.update(world)

        expect(selector.groupSelector.hovered).toEqual({ ...group1, collapsed: true })
        expect(selector.actionSelector.selected).toBeUndefined()
      })

      it('uncollapses second group', () => {
        const world: TlbWorld = new World()
        const input = mockInput(world)
        input.keyPressed.add(KEYS.VK_J)

        selector.update(world)
        selector.update(world)
        selector.update(world)

        input.keyPressed.add(KEYS.VK_RETURN)
        selector.update(world)

        expect(selector.groupSelector.hovered).toEqual({ ...group2, collapsed: false })
        expect(selector.actionSelector.selected).toBeUndefined()
      })

      it('collapses third group', () => {
        const world: TlbWorld = new World()
        const input = mockInput(world)
        input.keyPressed.add(KEYS.VK_J)

        selector.update(world)
        selector.update(world)
        selector.update(world)
        selector.update(world)

        input.keyPressed.add(KEYS.VK_RETURN)
        selector.update(world)

        expect(selector.groupSelector.hovered).toEqual({ ...group3, collapsed: true })
        expect(selector.actionSelector.hovered).toBeUndefined()
      })

      it('collapses first group on wrapping around', () => {
        const world: TlbWorld = new World()
        const input = mockInput(world)
        input.keyPressed.add(KEYS.VK_J)

        selector.update(world)
        selector.update(world)
        selector.update(world)
        selector.update(world)
        selector.update(world)
        selector.update(world)
        selector.update(world)

        input.keyPressed.add(KEYS.VK_RETURN)
        selector.update(world)

        expect(selector.groupSelector.hovered).toEqual({ ...group1, collapsed: true })
        expect(selector.actionSelector.hovered).toBeUndefined()
      })
    })
  })
})

function createGroup(id: string, ...actions: string[]): ActionGroup {
  return {
    entity: 1,
    description: `group${id}/description`,
    name: `group${id}/name1`,
    items: actions.map(actionId => ({
      action: { cost: { actions: 1, movement: 2 }, name: `group${id}/actions/${actionId}`, subActions: [] },
      available: true,
    })),
  }
}

function clickAt(selector: ActionSelector, index: number) {
  const world: TlbWorld = new World()
  const input = mockInput(world)
  input.keyPressed.add(KEYS.VK_J)
  for (let i = 0; i < index; i++) {
    selector.update(world)
  }
  expect(selector.groupSelector.hovered).toBeDefined()
  input.keyPressed.delete(KEYS.VK_J)
  input.keyPressed.add(KEYS.VK_RETURN)
  selector.update(world)
  input.keyPressed.delete(KEYS.VK_RETURN)
  input.keyPressed.add(KEYS.VK_K)
  for (let i = 0; i < index; i++) {
    selector.update(world)
  }
}
