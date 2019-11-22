import { TlbWorld } from '../tlb'
import { Entity } from '../ecs/entity'
import { InventoryComponent, ItemComponent } from '../components/items'
import { ItemType } from './items'
import { TriggeredByComponent, TriggersComponent } from '../components/trigger'
import { DialogComponent } from '../components/dialog'

export type AnswerType = 'close' | 'attack' | 'authorized' | 'move_level_up' | 'move_level_down'
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
function moveUp(): Answer {
  return answer('[move one level up]', 'move_level_up')
}
function moveDown(): Answer {
  return answer('[move one level down]', 'move_level_down')
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
  elevator: {
    steps: [
      {
        text: ['Elevator controls. Please select a level'],
        answers: [moveUp(), moveDown()],
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

/*
00:00 Right. You
00:21 know, and
00:26 everything crisp
00:31 and we
00:36 just we
00:41 figured it
00:46 out. Black
00:59 Ops 2.
01:24 Then the just one
01:31 more input test by
01:38 it's also rifle team
01:45 could not using machine
01:52 in. Yeah,
02:05 yeah. Here's
02:31 one. Select.
03:03 As I said, This
03:09 is the fight fire
03:15 unwilling to tag just
03:21 put up this soon.
03:37 The app submitted fish relative quotes for the motions to
03:45 plant life conversion of toolbar come on his income considers
03:53 timberwolf does Metcalf burden for also 2, 1/2 or
04:00 and he deep sea teams and after the hunger plant.
04:07 Often the underplanted with fewer number? What
04:11 is the accentor after grammars perfecting it.
04:24 That's funny farm, he
04:31 bought all we would
04:38 miss him for us.
04:56 Then give me another disaster on boarding fast,
05:02 so the largest bank.
05:07 What is
05:27 life?
05:38 But I
05:53 will
06:01 not. Probably.
*/
