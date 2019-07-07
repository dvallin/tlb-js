import { UIElement } from './ui-element'
import { Renderer } from '../renderer/renderer'
import { Vector } from '../spatial'
import { Entity } from '../ecs/entity'
import { TlbWorld } from '../tlb'
import { CharacterStatsComponent } from '../components/character-stats'
import { TakeTurnComponent } from '../components/rounds'
import { LightingComponent } from '../components/light'
import { primary } from '../renderer/palettes'
import { InputResource, Input } from '../resources/input'
import { WindowDecoration } from './window-decoration'
import { Rectangle } from '../geometry/rectangle'
import { calculateBrightness } from '../component-reducers/brigthness'
import { FeatureType, FeatureComponent, features } from '../components/feature'
import { ActiveEffectsComponent } from '../components/effects'
import { renderBodyPartInfo } from './render-helpers'
import { InventoryComponent, ItemComponent, items, EquipedItemsComponent, EquipmentAttachement } from '../components/items'

export interface CharacterDescription {
  feature?: FeatureType
}

export interface State {
  bodyParts: WindowDecoration
  turn: WindowDecoration
  environment: WindowDecoration
  inventoryWindow: WindowDecoration

  focus: Entity

  stats?: CharacterStatsComponent
  activeEffects?: ActiveEffectsComponent
  takeTurn?: TakeTurnComponent
  enemies: CharacterDescription[]
  lighting?: LightingComponent
  inventory?: {
    item: ItemComponent
    equipment: EquipmentAttachement | undefined
  }[]
}

export class Overview implements UIElement {
  private readonly state: State

  public constructor(public readonly entity: Entity, focus: Entity, topLeft: Vector, width: number) {
    const bodyParts = new WindowDecoration(new Rectangle(topLeft.x, topLeft.y, width, 2), 'body parts')
    const turn = new WindowDecoration(new Rectangle(topLeft.x, topLeft.y + 1, width, 2), 'turn')
    const environment = new WindowDecoration(new Rectangle(topLeft.x, topLeft.y + 2, width, 2), 'environment')
    const inventoryWindow = new WindowDecoration(new Rectangle(topLeft.x, topLeft.y + 3, width, 2), 'inventory')
    this.state = {
      focus,
      bodyParts,
      inventoryWindow,
      turn,
      environment,
      enemies: [],
    }
  }

  public render(renderer: Renderer): void {
    if (this.state.stats !== undefined) {
      let y = 1

      if (!this.state.bodyParts.collapsed) {
        const stats = this.state.stats
        Object.keys(stats.current.bodyParts).forEach(key => {
          renderBodyPartInfo(renderer, this.state.bodyParts.topLeft.add(new Vector([1, y])), key, stats, this.state.activeEffects!)
          y++
        })

        this.state.bodyParts.setHeight(y + 2)
        const globalEffects = this.state
          .activeEffects!.effects.filter(e => e.effect.global)
          .map(e => e.effect.type[0])
          .join()
        renderer.text('effects', this.state.bodyParts.topLeft.add(new Vector([1, y])), primary[1])
        renderer.text(`${globalEffects}`, this.state.bodyParts.topLeft.add(new Vector([15, y])), primary[2])
      }
      this.state.bodyParts.render(renderer)
    } else {
      this.state.bodyParts.setHeight(0)
    }

    this.state.inventoryWindow.setY(this.state.bodyParts.bottom + 1)
    if (this.state.inventory !== undefined) {
      let y = 1
      if (!this.state.inventoryWindow.collapsed) {
        this.state.inventory.forEach(entry => {
          const item = items[entry.item.type]
          let bodyPart = ''
          if (entry.equipment !== undefined) {
            bodyPart = '@ ' + entry.equipment.bodyParts.join('&')
          }
          renderer.text(`${item.name} ${bodyPart}`, this.state.inventoryWindow.topLeft.add(new Vector([1, y])), primary[1])
          y++
        })
        this.state.inventoryWindow.setHeight(y + 1)
      }
      this.state.inventoryWindow.render(renderer)
    } else {
      this.state.inventoryWindow.setHeight(0)
    }

    this.state.turn.setY(this.state.inventoryWindow.bottom + 1)
    if (this.state.stats !== undefined && this.state.takeTurn !== undefined) {
      let y = 1

      if (!this.state.turn.collapsed) {
        const current = this.state.stats.current
        renderer.text(
          `${this.state.takeTurn.actions}/${current.actions} AP ${this.state.takeTurn.movements}/${current.movement} MP`,
          this.state.turn.topLeft.add(new Vector([1, y])),
          primary[1]
        )
        y++
        this.state.enemies.forEach(enemy => {
          if (enemy.feature !== undefined) {
            const feature = features[enemy.feature]
            renderer.character(feature.character, this.state.turn.topLeft.add(new Vector([1, y])), feature.diffuse)
            renderer.text(feature.name, this.state.turn.topLeft.add(new Vector([3, y])), primary[1])
            y++
          }
        })
        this.state.turn.setHeight(y + 1)
      }
      this.state.turn.render(renderer)
    } else {
      this.state.turn.setHeight(0)
    }

    this.state.environment.setY(this.state.turn.bottom + 1)
    if (this.state.lighting !== undefined) {
      let y = 1
      if (!this.state.environment.collapsed) {
        const brightness = calculateBrightness(this.state.lighting)
        renderer.text(`brightness: ${brightness}`, this.state.environment.topLeft.add(new Vector([1, y])), primary[1])
        y++
        this.state.environment.setHeight(y + 1)
      }
      this.state.environment.render(renderer)
    } else {
      this.state.environment.setHeight(0)
    }
  }

  public update(world: TlbWorld): void {
    const input: Input = world.getResource<InputResource>('input')
    this.state.bodyParts.update(input)
    this.state.inventoryWindow.update(input)
    this.state.turn.update(input)
    this.state.environment.update(input)

    this.state.takeTurn = world.getComponent<TakeTurnComponent>(this.state.focus, 'take-turn')
    this.state.enemies = []
    world.getStorage('took-turn').foreach(entity => {
      const feature = world.getComponent<FeatureComponent>(entity, 'feature') || { type: undefined }
      this.state.enemies.push({ feature: feature.type })
    })
    world.getStorage('wait-turn').foreach(entity => {
      const feature = world.getComponent<FeatureComponent>(entity, 'feature') || { type: undefined }
      this.state.enemies.push({ feature: feature.type })
    })
    this.state.activeEffects = world.getComponent<ActiveEffectsComponent>(this.state.focus, 'active-effects')
    this.state.stats = world.getComponent<CharacterStatsComponent>(this.state.focus, 'character-stats')
    this.state.lighting = world.getComponent<LightingComponent>(this.state.focus, 'lighting')

    const inventory = world.getComponent<InventoryComponent>(this.state.focus, 'inventory')!
    const equipped = world.getComponent<EquipedItemsComponent>(this.state.focus, 'equiped-items')!
    this.state.inventory = inventory.content.map(entity => {
      const item = world.getComponent<ItemComponent>(entity, 'item')!
      const equipment = equipped.equipment.find(e => e.entity === entity)
      return { item, equipment }
    })
  }

  public contains(position: Vector): boolean {
    return (
      this.state.turn.containsVector(position) ||
      this.state.bodyParts.containsVector(position) ||
      this.state.environment.containsVector(position) ||
      this.state.inventoryWindow.containsVector(position)
    )
  }
}
