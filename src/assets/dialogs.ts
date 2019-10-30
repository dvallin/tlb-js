import { TlbWorld } from '../tlb'
import { Entity } from '../ecs/entity'
import { InventoryComponent, ItemComponent } from '../components/items'
import { ItemType } from './items'
import { TriggeredByComponent, TriggersComponent } from '../components/trigger'
import { DialogComponent } from '../components/dialog'

export type AnswerType = 'close' | 'attack' | 'authorized'
export type Check = (world: TlbWorld, player: Entity, npc: Entity) => boolean
export interface Answer {
  text: string
  navigation: number | AnswerType
  check?: Check
}
export interface Step {
  text: string[]
  answers: Answer[]
}
export interface Dialog {
  steps: Step[]
}

function answer(text: string, navigation: number | AnswerType, check?: Check): Answer {
  return { check, text, navigation }
}
function attack(): Answer {
  return answer('[attack]', 'attack')
}
const playerHasItem = (type: ItemType) => (world: TlbWorld, player: Entity) => {
  const inventory = world.getComponent<InventoryComponent>(player, 'inventory')!.content
  return inventory.some(i => world.getComponent<ItemComponent>(i, 'item')!.type === type)
}

const dialogDefinitions = {
  randomRemarks: {
    steps: [
      {
        text: [
          'we suspect that your sister controls the mutant rom chip and the frozen wand.',
          'I apoligize for this statement',
          'The CNT-FAI briefly considered joining the Comintern because they fetishized revolutionary upsurges and apparently knew nothing about politics or socialism',
          'Thinking about building a railgun',
          'Kinda want to hug, but like irl. for the propriocetive stimmy feels :P',
          'I am, at my core, a stubborn and frustrating human who only exists to be set in my ways.',
          "England are gonna win. And I'm gonna post so many garbage selfies tonight",
          'Love that my old man is spending his saturday swearing at remainers appearing on the news',
          "you think you do but you don't",
          'I reject nation states',
          'Woah I wish I could read',
          "What the hell is 'pajama'",
          'Always use protection',
          'Subsurface warfare is going to get lit',
          'Gracious wife, gracious life',
          'im about to nut these loads',
          'May biqueerplatonic people find success in their lives',
          'I hope hologender people are getting enough time to rest!',
          'Washing my chin',
          'I am still against full luxury automated communism. thats not what i aim for.',
          '#Javascript was a mistake.',
          'we had fun looking at all the medieval babies at the art gallery today',
          "Oh, me? I'm strictly chillin'",
          "It's a comfortable dusk in the city, and you are a comfortable salmon.",
          'adulthood is having your debit card declined, fashionably',
        ],
        answers: [answer('ok', 'close')],
      },
    ],
  },
  guardRandomRemarks: {
    steps: [
      {
        text: [
          'Do you want to cry now?',
          'Love a neurogender bitch, oh, it get my dick hard',
          "You ain't gonna let me fuck you and I feel you",
          "I'm icy bitch, don't look at my wrist.",
          'Fuck love. All I got for hoes is hard dick and bubblegum.',
          'I punched this transhumanist in the ripcage and kicked her in the stomach',
        ],
        answers: [answer('ok', 'close'), attack()],
      },
    ],
  },
  restrictedAreaCheck: {
    steps: [
      {
        text: ['Hey you, stop it right there. This is a restricted area.', 'Identify yourself'],
        answers: [attack(), answer('[show id card]', 1, playerHasItem('idCard'))],
      },
      {
        text: ['Ok, you can pass'],
        answers: [answer('ok', 'authorized')],
      },
    ],
  },
}
export type DialogType = keyof typeof dialogDefinitions
export const dialogs: { [key in DialogType]: Dialog } = dialogDefinitions

export function addDialog(world: TlbWorld, entity: Entity, type: DialogType): Entity {
  const dialog = world
    .createEntity()
    .withComponent<TriggeredByComponent>('triggered-by', { entity })
    .withComponent<DialogComponent>('dialog', { type }).entity
  world.getComponent<TriggersComponent>(entity, 'triggers')!.entities.push(dialog)
  return dialog
}
