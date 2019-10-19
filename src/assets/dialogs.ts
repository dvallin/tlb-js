import { TlbWorld } from '../tlb'
import { Entity } from '../ecs/entity'
import { InventoryComponent, ItemComponent } from '../components/items'

export interface Answer {
  text: string
  navigation: number | string
  check?: (world: TlbWorld, player: Entity, npc: Entity) => boolean
}
export interface Step {
  text: string[]
  answers: Answer[]
}
export interface Dialog {
  steps: Step[]
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
          'Washing my chin',
          'I am still against full luxury automated communism. thats not what i aim for.',
          '#Javascript was a mistake.',
          'we had fun looking at all the medieval babies at the art gallery today',
          "Oh, me? I'm strictly chillin'",
          "It's a comfortable dusk in the city, and you are a comfortable salmon.",
          'adulthood is having your debit card declined, fashionably',
        ],
        answers: [
          {
            text: 'ok',
            navigation: 'close',
          },
        ],
      },
    ],
  },
  restrictedAreaCheck: {
    steps: [
      {
        text: ['Hey you, stop it right there. This is a restricted area.', 'Identify yourself'],
        answers: [
          {
            text: '[attack]',
            navigation: 'unauthorized',
          },
          {
            check: (world: TlbWorld, player: Entity) => {
              const inventory = world.getComponent<InventoryComponent>(player, 'inventory')!.content
              return inventory.some(i => world.getComponent<ItemComponent>(i, 'item')!.type === 'idCard')
            },
            text: '[show id card]',
            navigation: 1,
          },
        ],
      },
      {
        text: ['Ok, you can pass'],
        answers: [
          {
            text: 'ok',
            navigation: 'authorized',
          },
        ],
      },
    ],
  },
}
export type DialogType = keyof typeof dialogDefinitions
export const dialogs: { [key in DialogType]: Dialog } = dialogDefinitions
