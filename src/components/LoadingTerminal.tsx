import { useEffect, useState } from 'react'

const ANALYZING_LINES = [
  '> Parsing natural language input...',
  '> Identifying core pain points...',
  '> Cross-referencing problem patterns...',
  '> Synthesizing product solution...',
  '> Mapping user journey...',
  '> Structuring output schema...',
]

const GENERATING_LINES = [
  '> Solution analysis complete ✓',
  '> Initializing prototype engine...',
  '> Generating component architecture...',
  '> Building interactive screens...',
  '> Compiling user interactions...',
  '> Rendering prototype...',
]

interface LoadingTerminalProps {
  mode: 'analyzing' | 'generating'
}

export default function LoadingTerminal({ mode }: LoadingTerminalProps) {
  const lines = mode === 'analyzing' ? ANALYZING_LINES : GENERATING_LINES
  const [visibleLines, setVisibleLines] = useState<string[]>([lines[0]])

  useEffect(() => {
    setVisibleLines([lines[0]])
    let idx = 1
    const interval = setInterval(() => {
      if (idx < lines.length) {
        setVisibleLines((prev) => [...prev, lines[idx]])
        idx++
      } else {
        clearInterval(interval)
      }
    }, 350)
    return () => clearInterval(interval)
  }, [mode]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <div className="w-full max-w-xl">
        {/* Terminal window chrome */}
        <div className="border border-terminal-green/30 bg-terminal-surface">
          <div className="border-b border-terminal-green/20 px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="ml-2 text-terminal-green/40 text-xs font-mono">
              ai-engine — {mode === 'analyzing' ? 'analysis' : 'codegen'}
            </span>
          </div>

          {/* Terminal body */}
          <div className="p-5 min-h-48 font-mono text-sm space-y-2">
            {visibleLines.map((line, i) => (
              <div
                key={i}
                className="text-terminal-green/80 animate-fadeIn"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {line}
              </div>
            ))}
            {/* Blinking cursor */}
            <div className="flex items-center gap-1 text-terminal-green">
              <span>{'>'}</span>
              <span className="w-2 h-4 bg-terminal-green animate-blink" />
            </div>
          </div>
        </div>

        {/* Spinner */}
        <div className="mt-6 flex items-center justify-center gap-3 text-terminal-green/60 text-sm font-mono">
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 bg-terminal-green rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <span className="tracking-widest uppercase text-xs">
            {mode === 'analyzing' ? 'Analyzing Problem' : 'Building Prototype'}
          </span>
        </div>
      </div>
    </div>
  )
}
