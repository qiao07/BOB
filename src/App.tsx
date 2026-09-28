import { useState } from 'react'
import type { AppStage, ProblemAnalysis } from '@/types'
import { analyzeProblem, generatePrototype } from '@/lib/openai'
import ParticleCanvas from '@/components/ParticleCanvas'
import Header from '@/components/Header'
import LoadingTerminal from '@/components/LoadingTerminal'
import ProblemInput from '@/components/ProblemInput'
import AnalysisReveal from '@/components/AnalysisReveal'
import PrototypeRenderer from '@/components/PrototypeRenderer'

export default function App() {
  const [stage, setStage] = useState<AppStage>('input')
  const [analysis, setAnalysis] = useState<ProblemAnalysis | null>(null)
  const [prototypeJSX, setPrototypeJSX] = useState<string | null>(null)
  const [loading, setLoading] = useState<'analyzing' | 'generating' | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleAnalyze(problem: string) {
    setError(null)
    setLoading('analyzing')
    try {
      const result = await analyzeProblem(problem)
      setAnalysis(result)
      setStage('analysis')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  async function handleGeneratePrototype() {
    if (!analysis) return
    setError(null)
    setLoading('generating')
    try {
      const jsx = await generatePrototype(analysis)
      setPrototypeJSX(jsx)
      setStage('prototype')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate prototype. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  async function handleRegenerate() {
    if (!analysis) return
    setPrototypeJSX(null)
    setError(null)
    setLoading('generating')
    try {
      const jsx = await generatePrototype(analysis)
      setPrototypeJSX(jsx)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to regenerate. Please try again.')
      setStage('analysis')
    } finally {
      setLoading(null)
    }
  }

  function handleReset() {
    setStage('input')
    setAnalysis(null)
    setPrototypeJSX(null)
    setError(null)
    setLoading(null)
  }

  function handleBackToAnalysis() {
    setStage('analysis')
    setError(null)
  }

  return (
    <div className="relative min-h-screen bg-terminal-dark text-terminal-green font-mono">
      {/* Particle background */}
      <ParticleCanvas />

      {/* Fixed header */}
      <Header stage={stage} onReset={handleReset} />

      {/* Main content */}
      <main className="relative z-10">
        {/* Error banner */}
        {error && !loading && (
          <div className="fixed top-14 left-0 right-0 z-50 bg-red-900/80 border-b border-red-500/40 px-6 py-3 flex items-center justify-between backdrop-blur-sm">
            <div className="flex items-center gap-3 text-red-300 font-mono text-sm">
              <span className="text-red-400">✗</span>
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-200 text-sm ml-4 transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && <LoadingTerminal mode={loading} />}

        {/* Stage: Input */}
        {!loading && stage === 'input' && (
          <ProblemInput onSubmit={handleAnalyze} />
        )}

        {/* Stage: Analysis */}
        {!loading && stage === 'analysis' && analysis && (
          <AnalysisReveal
            analysis={analysis}
            onBuildPrototype={handleGeneratePrototype}
            onReset={handleReset}
          />
        )}

        {/* Stage: Prototype — loading (regenerating) */}
        {loading === 'generating' && stage === 'prototype' && analysis && prototypeJSX && (
          <PrototypeRenderer
            jsxCode={prototypeJSX}
            analysis={analysis}
            onBack={handleBackToAnalysis}
            onRegenerate={handleRegenerate}
          />
        )}

        {/* Stage: Prototype */}
        {!loading && stage === 'prototype' && analysis && prototypeJSX && (
          <PrototypeRenderer
            jsxCode={prototypeJSX}
            analysis={analysis}
            onBack={handleBackToAnalysis}
            onRegenerate={handleRegenerate}
          />
        )}
      </main>
    </div>
  )
}
