import type { AppStage } from '@/types'

const STAGES: { id: AppStage; label: string; num: string }[] = [
  { id: 'input', label: 'DEFINE', num: '01' },
  { id: 'analysis', label: 'ANALYZE', num: '02' },
  { id: 'prototype', label: 'PROTOTYPE', num: '03' },
]

interface HeaderProps {
  stage: AppStage
  onReset?: () => void
}

export default function Header({ stage, onReset }: HeaderProps) {
  const currentIdx = STAGES.findIndex((s) => s.id === stage)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-terminal-border bg-terminal-dark/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={onReset}
          className="flex items-center gap-3 group"
          title="Start over"
        >
          <div className="w-7 h-7 border border-terminal-green flex items-center justify-center">
            <span className="text-terminal-green text-xs font-bold">P</span>
          </div>
          <span className="text-terminal-green font-mono font-semibold text-sm tracking-widest glow-text hidden sm:block">
            PROBLEM<span className="text-terminal-amber mx-1">→</span>PROTOTYPE
          </span>
        </button>

        {/* Stage indicator */}
        <div className="flex items-center gap-1 sm:gap-3">
          {STAGES.map((s, idx) => {
            const isActive = idx === currentIdx
            const isDone = idx < currentIdx
            return (
              <div key={s.id} className="flex items-center gap-1 sm:gap-3">
                <div
                  className={`flex items-center gap-1.5 transition-all duration-300 ${
                    isActive
                      ? 'text-terminal-green'
                      : isDone
                      ? 'text-terminal-green/50'
                      : 'text-terminal-green/20'
                  }`}
                >
                  <span className={`text-xs font-mono ${isActive ? 'glow-text' : ''}`}>
                    {s.num}
                  </span>
                  <span className="text-xs font-mono tracking-wider hidden sm:block">
                    {s.label}
                  </span>
                  {isDone && <span className="text-xs text-terminal-green/50">✓</span>}
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-terminal-green rounded-full animate-pulse" />
                  )}
                </div>
                {idx < STAGES.length - 1 && (
                  <span className="text-terminal-green/20 text-xs mx-0.5">─</span>
                )}
              </div>
            )
          })}
        </div>

        {/* Version tag */}
        <span className="text-terminal-green/30 font-mono text-xs hidden md:block">
          v0.1.0-mvp
        </span>
      </div>
    </header>
  )
}
