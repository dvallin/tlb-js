import { ResourceName, TlbResource, TlbWorld } from '../tlb'
import { Renderer } from '../renderer/renderer'
import { EffectComponent } from '../components/effects'
import { getFeature } from '../components/feature'
import { Entity } from '../ecs/entity'
import { Action } from '../components/action'

export interface Log {
  getEntries(offset: number, limit: number): string[]

  text(text: string): void

  effectApplied(world: TlbWorld, effect: EffectComponent, bodyPart?: string): void
  died(world: TlbWorld, entity: Entity): void
  missed(world: TlbWorld, entity: Entity): void
  attack(world: TlbWorld, source: Entity, target: Entity, action: Action): void
}

export class LogResource implements TlbResource, Log {
  public readonly kind: ResourceName = 'log'

  entries: string[] = []

  public update({}: TlbWorld): void {}

  public render({}: Renderer): void {}

  public getEntries(offset: number, limit: number): string[] {
    const start = Math.max(0, this.entries.length + offset - limit)
    const end = Math.min(this.entries.length, start + limit)
    return this.entries.slice(start, end)
  }

  public effectApplied(world: TlbWorld, effectComponent: EffectComponent, bodyPart?: string): void {
    const { effect } = effectComponent
    const source = this.getName(world, effectComponent.source)
    const target = this.getName(world, effectComponent.target)
    const verb = this.verbify(source, effect.type)
    if (!effect.global) {
      const objectName = this.owner(target)
      const valueString = effect.value !== undefined ? `(${effect.value})` : ''
      this.entries.push(`${source} ${verb} ${objectName} ${bodyPart} ${valueString}`)
    } else {
      this.entries.push(`${source} ${verb} ${target}`)
    }
  }

  public text(text: string): void {
    this.entries.push(text)
  }

  public attack(world: TlbWorld, source: Entity, target: Entity, action: Action): void {
    const sourceName = this.getName(world, source)
    const targetName = this.getName(world, target)

    let verb = this.verbify(sourceName, 'try')
    const objectName = targetName

    this.entries.push(`${sourceName} ${verb} to ${action.name} ${objectName}`)
  }

  public died(world: TlbWorld, entity: Entity): void {
    const subject = this.getName(world, entity)!
    this.entries.push(`${subject} died`)
  }

  public missed(world: TlbWorld, entity: Entity): void {
    const subject = this.getName(world, entity)!
    this.entries.push(`${subject} missed`)
  }

  public getName(world: TlbWorld, entity: Entity): string {
    const feature = getFeature(world, entity)
    if (feature !== undefined) {
      return feature.name
    }
    return 'something'
  }

  public verbify(source: string, verb: string): string {
    if (source !== 'you') {
      if (verb === 'try') {
        return 'tries'
      }
      return verb + 's'
    }
    return verb
  }

  public owner(target: string): string {
    if (target === 'you') {
      return 'your'
    }
    return `${target}'s`
  }
}
