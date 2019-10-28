import { ActionSelectorFullView, ActionGroup } from '../../../src/ui/tabs/action-selector'
import { Rectangle } from '../../../src/geometry/rectangle'
import { actions } from '../../../src/assets/actions'
import { displayerRenderer } from '../../render'
import { World } from '../../../src/ecs/world'
import { TlbWorld } from '../../../src/tlb'
import { mockInput, mockImplementation } from '../../mocks'
import { KeyboardCommand, Input } from '../../../src/resources/input'

describe('ActionSelectorFullView', () => {
  let actionGroups: ActionGroup[]
  let view: ActionSelectorFullView
  let world: TlbWorld
  let input: Input
  beforeEach(() => {
    actionGroups = [actionGroup(1, true), actionGroup(2, false)]
    view = new ActionSelectorFullView(new Rectangle(0, 0, 20, 20), actionGroups)
    world = new World()
    input = mockInput(world)
  })

  it('displays action groups', () => {
    const { renderer, getDisplay } = displayerRenderer()
    view.render(renderer)
    expect(getDisplay()).toMatchSnapshot()
  })

  it('displays actions', () => {
    mockImplementation<KeyboardCommand, boolean>(input.isActive, key => key === 'accept')
    const { renderer, getDisplay } = displayerRenderer()
    view.update(world)
    view.render(renderer)
    expect(getDisplay()).toMatchSnapshot()
  })

  it('counts', () => {
    expect(view.length).toEqual(2)
  })

  it('hovers actions', () => {
    mockImplementation<KeyboardCommand, boolean>(input.isActive, key => key === 'accept')
    view.update(world)

    expect(view.hovered).toEqual({ action: actionGroups[0].items[0].action, entity: 1 })
  })

  it('selects actions', () => {
    mockImplementation<KeyboardCommand, boolean>(input.isActive, key => key === 'accept')

    view.update(world)
    view.update(world)

    expect(view.selected).toEqual({ action: actionGroups[0].items[0].action, entity: 1 })
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
