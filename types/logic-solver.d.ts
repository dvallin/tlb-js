declare module 'logic-solver' {
  export type Label = string
  export interface Formula {}
  export type Statement = Label | Formula

  export class Solver {
    require(...statements: Statement[]): void
    solve(): Solution | null
  }

  export class Solution {
    getTrueVars(): Label[]
  }

  export function exactlyOne(...statements: Statement[]): Statement
  export function atMostOne(...statements: Statement[]): Statement
  export function implies(left: Statement, right: Statement): Statement
  export function not(statement: Statement): Statement
  export function or(...statements: Statement[]): Statement
}
