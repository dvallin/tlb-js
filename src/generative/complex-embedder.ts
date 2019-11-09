import { StructureType, StructureComponent } from '../components/region'
import { TlbWorld } from '../tlb'
import { Random } from '../random'

import { Solver, exactlyOne, atMostOne, or, not } from 'logic-solver'
import { indices } from '../array-utils'
import { Entity } from '../ecs/entity'
import { AssetType } from '../assets/assets'
import { ItemType } from '../assets/items'
import { retry } from './retry'

const splitter = '_'

export interface ComplexTemplate {
  structures: {
    description: StructureDescription
    restriction: Partial<StructureRestriction>
  }[]
}

export interface ComplexDescription {
  occurrence: Occurrence
  template: ComplexTemplate
}

export interface Occurrence {
  minimum: number
  maximum: number
}

export interface Spawn<T> {
  types: T[]
  occurrence: Occurrence
}

export interface StructureRestriction {
  kind: StructureType
  connects: number[]
  exact: boolean
  blocking: boolean
}

export interface CharacterCreator {
  (world: TlbWorld): Entity
}

export interface StructureDescription {
  decorations: Spawn<AssetType>[]
  containers: Spawn<AssetType>[]
  loots: Spawn<ItemType>[]
  npcs: Spawn<CharacterCreator>[]
  bosses: Spawn<CharacterCreator>[]
}

export function occur(min: number = 1, max?: number): Occurrence {
  const maximum = max === undefined ? min : max
  return { minimum: min, maximum }
}
export function optional(t: number = 1): Occurrence {
  return { minimum: 0, maximum: t }
}

export function spawn<T>(...types: T[]): Spawn<T> {
  return { types: types, occurrence: occur() }
}
export function spawnTimes<T>(type: T, t: number): Spawn<T> {
  return { types: [type], occurrence: occur(t) }
}
export function spawnOptional<T>(type: T, t?: number): Spawn<T> {
  return { types: [type], occurrence: optional(t) }
}

export interface ComplexEmbedding {
  structure: StructureDescription
  embedding: Entity
  blocking: boolean
}

type Label = 'blocked' | 'blocking' | 'exact' | 'restricted' | StructureType
interface Graph<T> {
  getData(v: number): T

  labels: Set<Label>[]

  V: number[]
  E: [number, number][]
}

export function embedComplexes(
  world: TlbWorld,
  random: Random,
  region: Entity,
  complexes: ComplexDescription[]
): ComplexEmbedding[] | undefined {
  if (complexes.length === 0) {
    return []
  }

  const G = buildG(world, region, [])

  const requiredComplexes = complexes
    .filter(c => c.occurrence.minimum > 0)
    .map(c => ({ occurrence: occur(c.occurrence.minimum), template: c.template }))
  const H = buildH(requiredComplexes)
  const successfulEmbeddings = calculateEmbedding(G, H)
  if (successfulEmbeddings.length === 0) {
    return undefined
  }

  const optionalComplexes: ComplexDescription[] = []
  complexes.forEach(c => {
    for (let i = 0; i < c.occurrence.maximum - c.occurrence.minimum; ++i) {
      optionalComplexes.push({ occurrence: occur(), template: c.template })
    }
  })

  retry(random, optionalComplexes, c => {
    const newG = buildG(world, region, successfulEmbeddings)
    const embedding = calculateEmbedding(newG, buildH([c]))
    if (embedding.length === 1) {
      successfulEmbeddings.push(embedding[0])
    }
    return embedding.length === 1
  })
  return successfulEmbeddings
}

function buildG(world: TlbWorld, region: Entity, knownEmbeddings: ComplexEmbedding[]): Graph<Entity> {
  const blocked = new Set(knownEmbeddings.filter(e => e.blocking).map(e => e.embedding))

  const availableStructures: Entity[] = []
  const availableStructuresLookup: Map<Entity, number> = new Map()
  world.getStorage<StructureComponent>('structure').foreach((entity, component) => {
    if (component.region === region) {
      availableStructuresLookup.set(entity, availableStructures.length)
      availableStructures.push(entity)
    }
  })

  const V = indices(availableStructures.length)
  const E: [number, number][] = []
  const labels: Set<Label>[] = []
  availableStructures.forEach((s, v) => {
    const structure = world.getComponent<StructureComponent>(s, 'structure')!

    labels[v] = new Set()
    labels[v].add(structure.kind)
    if (blocked.has(s)) {
      labels[v].add('blocked')
    }

    structure.connections.forEach(c => {
      const w = availableStructuresLookup.get(c)!
      const e = createEdge(v, w)
      if (e !== undefined) {
        E.push(e)
      }
    })
  })
  return { V, E, labels, getData: v => availableStructures[v] }
}

function buildH(complexes: ComplexDescription[]): Graph<StructureDescription> {
  const E: [number, number][] = []
  const requiredFlattenedStructures: StructureDescription[] = []
  const labels: Set<Label>[] = []
  complexes.forEach(c => {
    indices(c.occurrence.minimum).forEach(() => {
      const offset = requiredFlattenedStructures.length
      c.template.structures.forEach(s => {
        const v = requiredFlattenedStructures.length
        labels[v] = new Set()
        if (s.restriction.blocking === undefined || s.restriction.blocking) {
          labels[v].add('blocking')
        }
        if (s.restriction.exact) {
          labels[v].add('exact')
        }
        if (s.restriction.kind) {
          labels[v].add('restricted')
          labels[v].add(s.restriction.kind)
        }
        const restrictions = s.restriction.connects || []
        restrictions.forEach(i => {
          const w = offset + i
          const e = createEdge(v, w)
          if (e !== undefined) {
            E.push(e)
          }
        })
        requiredFlattenedStructures.push(s.description)
      })
    })
  })
  const V = indices(requiredFlattenedStructures.length)
  return { V, E, labels, getData: v => requiredFlattenedStructures[v] }
}

function createEdge(v: number, w: number): [number, number] | undefined {
  if (v < w) {
    return [v, w]
  }
  return undefined
}

function calculateEmbedding(G: Graph<Entity>, H: Graph<StructureDescription>) {
  var solver = new Solver()

  // each w in W on exactly one v in V
  H.V.forEach(w => {
    const Cvw = G.V.map(v => createLabel(v, w))
    solver.require(exactlyOne(...Cvw))
  })

  // each v in V can map to at most one blocking w in W
  G.V.forEach(v => {
    const Cvw = H.V.filter(w => H.labels[w].has('blocking')).map(w => createLabel(v, w))
    solver.require(atMostOne(...Cvw))
  })

  // all neighbours in H are mapped to neighbours in G
  // if Cvw then
  //   each j reachable through w is mapped to some i reachable through v
  // => &j -Cvw or |i Cij
  H.V.forEach(w => {
    G.V.forEach(v => {
      const Cvw = createLabel(v, w)
      H.E.forEach(e => {
        const j = traverseEdge(e, w)
        if (j !== undefined) {
          const Cij: string[] = []
          G.E.forEach(f => {
            const i = traverseEdge(f, v)
            if (i !== undefined) {
              Cij.push(createLabel(i, j))
            }
          })
          solver.require(or(not(Cvw), ...Cij))
        }
      })
    })
  })

  H.V.forEach(w => {
    G.V.forEach(v => {
      const Cvw = createLabel(v, w)

      let kindsAreDifferent = false
      G.labels[v].forEach(l => {
        if (!H.labels[w].has(l)) {
          kindsAreDifferent = true
        }
      })
      const isRestricted = H.labels[w].has('restricted')
      const isExact = H.labels[w].has('exact')
      const isBlocked = G.labels[v].has('blocked')

      if (kindsAreDifferent && isRestricted) {
        // forbid all non matching node pairs
        solver.require(not(Cvw))
      } else if (isBlocked) {
        solver.require(not(Cvw))
      } else if (isExact) {
        // for exact nodes
        // all neighbours in G are mapped to neighbours in H
        G.E.forEach(f => {
          const i = traverseEdge(f, v)
          if (i !== undefined) {
            const Cij: string[] = []
            H.E.forEach(e => {
              const j = traverseEdge(e, w)
              if (j !== undefined) {
                Cij.push(createLabel(i, j))
              }
            })
            solver.require(or(not(Cvw), ...Cij))
          }
        })
      }
    })
  })

  const solution = solver.solve()
  const result: ComplexEmbedding[] = []
  if (solution !== null) {
    solution.getTrueVars().forEach(label => {
      const [v, w] = parseLabel(label)
      result.push({
        structure: H.getData(w),
        embedding: G.getData(v),
        blocking: H.labels[w].has('blocking'),
      })
    })
  }
  return result
}

function parseLabel(label: string): [number, number] {
  const splits = label.split(splitter)
  return [Number.parseInt(splits[0]), Number.parseInt(splits[1])]
}

function createLabel(v: number, w: number): string {
  return `${v}${splitter}${w}`
}

export function traverseEdge(e: [number, number], from: number): number | undefined {
  if (e[0] === from) {
    return e[1]
  } else if (e[1] === from) {
    return e[0]
  }
  return undefined
}
