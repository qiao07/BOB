import { useState, useEffect, useRef } from 'react'
import { useTypewriter } from '@/hooks/useTypewriter'
import type { ProblemAnalysis } from '@/types'

interface AnalysisRevealProps {
  analysis: ProblemAnalysis
  onBuildPrototype: () => void
  onReset: () => void
}

function TerminalBlock({
  label,
  content,
  color = 'green',
  enabled = true,
  onDone,
}: {
  label: string
  content: string
  color?: 'green' | 'amber'
  enabled?: boolean
  onDone?: () => void
}) {
  const { displayed, done } = useTypewriter(content, 4, enabled)

  if (onDone && done) {
    // Call after render cycle
    setTimeout(onDone, 80)
  }

  if (!enabled) return null

  return (
    <div className="animate-fadeIn">
      <div
        className={`text-xs font-mono tracking-widest uppercase mb-2 ${
          color === 'amber' ? 'text-terminal-amber glow-amber' : 'text-terminal-green/60'
        }`}
      >
        // {label}
      </div>
      <div
        className={`font-mono text-sm leading-relaxed ${
          color === 'amber' ? 'text-terminal-amber' : 'text-terminal-green'
        }`}
      >
        {displayed}
        {!done && (
          <span className="inline-block w-2 h-4 bg-current ml-0.5 animate-blink align-text-bottom" />
        )}
      </div>
    </div>
  )
}

export default function AnalysisReveal({
  analysis,
  onBuildPrototype,
  onReset,
}: AnalysisRevealProps) {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0)
  const [skipped, setSkipped] = useState(false)

  // Phase 0 → pain point typing
  // Phase 1 → solution typing
  // Phase 2 → user flow revealed
  // Phase 3 → all done, show button

  const effectivePhase = skipped ? 3 : phase

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 pt-24 pb-16">
      <div className="w-full max-w-2xl">

        {/* Back link */}
        <button
          onClick={onReset}
          className="text-terminal-green/40 hover:text-terminal-green/70 font-mono text-xs tracking-widest uppercase mb-8 flex items-center gap-2 transition-colors"
        >
          ← RESTART
        </button>

        {/* Problem echo */}
        <div className="border-l-2 border-terminal-green/20 pl-4 mb-10">
          <p className="text-terminal-green/30 text-xs font-mono mb-1">// INPUT</p>
          <p className="text-terminal-green/60 font-mono text-sm leading-relaxed">
            "{analysis.rawProblem}"
          </p>
        </div>

        {/* Analysis sections */}
        <div className="space-y-8">
          {/* Section 1: Pain Point */}
          <div className="border border-terminal-green/15 bg-terminal-surface/50 p-5">
            <TerminalBlock
              label="01 / Core Pain Point"
              content={analysis.painPoint}
              color="amber"
              enabled={effectivePhase >= 0}
              onDone={phase === 0 && !skipped ? () => setPhase(1) : undefined}
            />
          </div>

          {/* Section 2: Solution */}
          {effectivePhase >= 1 && (
            <div className="border border-terminal-green/15 bg-terminal-surface/50 p-5 animate-slideUp">
              <TerminalBlock
                label="02 / Proposed Solution"
                content={analysis.solution}
                color="green"
                enabled={effectivePhase >= 1}
                onDone={phase === 1 && !skipped ? () => setPhase(2) : undefined}
              />
            </div>
          )}

          {/* Section 3: User Flow */}
          {effectivePhase >= 2 && (
            <div className="border border-terminal-green/15 bg-terminal-surface/50 p-5 animate-slideUp">
              <div className="text-xs font-mono tracking-widest uppercase mb-4 text-terminal-green/60">
                // 03 / User Flow
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {analysis.userFlow.map((step, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 animate-fadeIn"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  >
                    <div className="border border-terminal-green/30 bg-terminal-dark px-3 py-2 min-w-0">
                      <span className="text-terminal-green/40 text-xs font-mono block">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-terminal-green text-xs font-mono leading-snug">
                        {step}
                      </span>
                    </div>
                    {i < analysis.userFlow.length - 1 && (
                      <span className="text-terminal-amber/60 font-mono text-sm shrink-0">
                        →
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {/* Trigger phase 3 after a delay */}
              {phase === 2 && !skipped && (
                <PhaseAdvancer onReady={() => setPhase(3)} delay={300} />
              )}
            </div>
          )}
        </div>

        {/* Build Prototype CTA — always visible, skip button during animation */}
        {effectivePhase >= 3 ? (
          <div className="mt-10 flex flex-col items-center gap-4 animate-slideUp">
            <div className="text-terminal-green/40 text-xs font-mono tracking-widest">
              ─────── ANALYSIS COMPLETE ───────
            </div>
            <button
              onClick={onBuildPrototype}
              className="btn-terminal text-base px-12 py-4 tracking-[0.2em]"
              style={{
                animation: 'pulseGlow 2s ease-in-out infinite',
                boxShadow: '0 0 20px rgba(0, 255, 65, 0.3), 0 0 60px rgba(0, 255, 65, 0.1)',
              }}
            >
              BUILD PROTOTYPE →
            </button>
            <p className="text-terminal-green/30 text-xs font-mono">
              AI will generate an interactive prototype based on this analysis
            </p>
          </div>
        ) : (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setSkipped(true)}
              className="text-terminal-green/40 hover:text-terminal-green/70 font-mono text-xs tracking-widest uppercase flex items-center gap-2 transition-colors border border-terminal-green/20 hover:border-terminal-green/50 px-5 py-2"
            >
              SKIP ANIMATION → BUILD PROTOTYPE
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper to advance phase after a delay without a useEffect in the parent
function PhaseAdvancer({ onReady, delay }: { onReady: () => void; delay: number }) {
  const called = useRef(false)
  useEffect(() => {
    if (called.current) return
    called.current = true
    const t = setTimeout(onReady, delay)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}
