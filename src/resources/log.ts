import { ResourceName, TlbResource, TlbWorld } from '../tlb'
import { Renderer } from '../renderer/renderer'
import { EffectComponent } from '../components/effects'
import { getFeature } from '../components/feature'
import { Entity } from '../ecs/entity'
import { Attack } from '../components/action'

export interface Log {
  getEntries(offset: number, limit: number): string[]

  effectApplied(world: TlbWorld, effect: EffectComponent): void
  died(world: TlbWorld, entity: Entity): void
  missed(world: TlbWorld, entity: Entity): void
  attack(world: TlbWorld, source: Entity, target: Entity, bodyPart: string, attack: Attack): void
}

export class LogResource implements TlbResource, Log {
  public readonly kind: ResourceName = 'log'

  entries: string[] = []

  public update({  }: TlbWorld): void {}

  public render({  }: Renderer): void {}

  public getEntries(offset: number, limit: number): string[] {
    const start = Math.max(0, this.entries.length + offset - limit)
    const end = Math.min(this.entries.length, start + limit)
    return this.entries.slice(start, end)
  }

  public effectApplied(world: TlbWorld, effect: EffectComponent): void {
    const source = this.getName(world, effect.source)
    const target = this.getName(world, effect.target)

    const verb = this.verbify(source, effect.effect)
    const objectName = this.objectify(target)

    this.entries.push(`${source} ${verb} ${objectName} ${effect.bodyPart} (${effect.value})`)
  }

  public attack(world: TlbWorld, source: Entity, target: Entity, bodyPart: string, attack: Attack): void {
    const sourceName = this.getName(world, source)
    const targetName = this.getName(world, target)

    let verb = this.verbify(sourceName, 'try')
    const objectName = this.objectify(targetName)

    this.entries.push(`${source} ${verb} to ${attack.kind} ${objectName} ${bodyPart}`)
  }

  public died(world: TlbWorld, entity: Entity): void {
    const subject = this.getName(world, entity)!
    this.entries.push(`${subject} died`)
  }

  public missed(world: TlbWorld, entity: Entity): void {
    const subject = this.getName(world, entity)!
    this.entries.push(`${subject} missed`)
  }

  private getName(world: TlbWorld, entity: Entity): string {
    const feature = getFeature(world, entity)
    if (feature !== undefined) {
      return feature.name
    }
    return 'something'
  }

  private verbify(source: string, verb: string): string {
    if (source !== 'you') {
      if (verb === 'try') {
        return 'tries'
      }
      return verb + 's'
    }
    return verb
  }

  private objectify(target: string): string {
    if (target === 'you') {
      return 'your'
    }
    return `${target}'s`
  }
}
