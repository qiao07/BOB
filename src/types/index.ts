export type AppStage = 'input' | 'analysis' | 'prototype'

export interface ProblemAnalysis {
  rawProblem: string
  painPoint: string
  solution: string
  userFlow: string[]
}
