import { ActionGroup, ActionSelector } from '../../../src/ui/tabs/action-selector'
import { Rectangle } from '../../../src/geometry/rectangle'
import { actions } from '../../../src/assets/actions'
import { stringRenderer } from '../../render'
import { World } from '../../../src/ecs/world'
import { TlbWorld } from '../../../src/tlb'
import { mockInput, mockImplementation } from '../../mocks'
import { KeyboardCommand, Input } from '../../../src/resources/input'

describe('ActionSelectorFullView', () => {
  let actionGroups: ActionGroup[]
  let selector: ActionSelector
  let world: TlbWorld
  let input: Input
  beforeEach(() => {
    actionGroups = [actionGroup(1, true), actionGroup(2, false)]
    world = new World()
    input = mockInput(world)
    selector = new ActionSelector(actionGroups)
    selector.setFull(new Rectangle(0, 0, 20, 20))
  })

  it('displays action groups', () => {
    const { renderer, getDisplay } = stringRenderer()
    selector.full!.render(renderer)
    expect(getDisplay()).toMatchSnapshot()
  })

  it('displays actions', () => {
    mockImplementation<KeyboardCommand, boolean>(input.isActive, key => key === 'accept')
    const { renderer, getDisplay } = stringRenderer()
    selector.full!.update(world)
    selector.full!.render(renderer)
    expect(getDisplay()).toMatchSnapshot()
  })

  it('counts', () => {
    expect(selector.length).toEqual(2)
  })

  it('hovers actions', () => {
    mockImplementation<KeyboardCommand, boolean>(input.isActive, key => key === 'accept')
    selector.full!.update(world)

    expect(selector.hovered).toEqual({ action: actionGroups[0].items[0].action, entity: 1 })
  })

  it('selects actions', () => {
    mockImplementation<KeyboardCommand, boolean>(input.isActive, key => key === 'accept')

    selector.full!.update(world)
    selector.full!.update(world)

    expect(selector.selected).toEqual({ action: actionGroups[0].items[0].action, entity: 1 })
  })
})

describe('ActionSelectorFullView', () => {
  let actionGroups: ActionGroup[]
  let selector: ActionSelector
  beforeEach(() => {
    actionGroups = [actionGroup(1, true), actionGroup(2, false)]
    selector = new ActionSelector(actionGroups)
    selector.setMinimized(new Rectangle(0, 0, 20, 20))
  })

  it('displays action groups', () => {
    const { renderer, getDisplay } = stringRenderer()
    selector.minimized!.render(renderer)
    expect(getDisplay()).toMatchSnapshot()
  })
})

function actionGroup(id: number, available: boolean): ActionGroup {
  return {
    entity: id,
    name: `name${id}`,
    description: `desc${id}`,
    items: [
      {
        action: actions.hit,
        available,
      },
    ],
  }
}
