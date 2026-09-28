import { useState, useRef, useEffect } from 'react'

const EXAMPLE_HINTS = [
  'I forget to drink water during work hours',
  'Finding parking near my office takes forever',
  'Splitting bills with roommates is always awkward',
  'I lose track of which subscriptions I\'m paying for',
]

interface ProblemInputProps {
  onSubmit: (problem: string) => void
}

export default function ProblemInput({ onSubmit }: ProblemInputProps) {
  const [problem, setProblem] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && problem.trim()) {
      e.preventDefault()
      onSubmit(problem.trim())
    }
  }

  function handleHintClick(hint: string) {
    setProblem(hint)
    textareaRef.current?.focus()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-20 pb-12">
      <div className="w-full max-w-2xl animate-slideUp">

        {/* Header label */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 text-terminal-green/50 text-xs font-mono tracking-widest uppercase mb-4">
            <span className="w-8 h-px bg-terminal-green/30" />
            <span>AI Product Generator</span>
            <span className="w-8 h-px bg-terminal-green/30" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-mono font-bold text-terminal-green glow-text leading-tight">
            What problem<br />
            <span className="text-terminal-amber glow-amber">needs solving?</span>
          </h1>
          <p className="mt-4 text-terminal-green/50 font-mono text-sm leading-relaxed max-w-md mx-auto">
            Describe a real frustration you face. Our AI will identify the core issue,
            propose a solution, and build you an interactive prototype — instantly.
          </p>
        </div>

        {/* Terminal input box */}
        <div className="relative border border-terminal-green/30 bg-terminal-surface scanline-overlay hover:border-terminal-green/50 transition-colors duration-300">
          {/* Prompt prefix */}
          <div className="flex items-start gap-3 p-4">
            <span className="text-terminal-green font-mono text-sm mt-1 shrink-0 glow-text">{'>'}</span>
            <textarea
              ref={textareaRef}
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. I always forget to take my medication on time..."
              rows={4}
              className="flex-1 bg-transparent text-terminal-green font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-terminal-green/25"
              maxLength={500}
            />
          </div>

          {/* Bottom bar */}
          <div className="border-t border-terminal-green/15 px-4 py-2 flex items-center justify-between">
            <span className="text-terminal-green/30 text-xs font-mono">
              {problem.length}/500 chars · ↵ Enter to generate
            </span>
            <div className="flex items-center gap-1.5">
              {problem.trim() && (
                <span className="text-terminal-green/40 text-xs font-mono animate-blink">
                  ready
                </span>
              )}
              <span
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  problem.trim() ? 'bg-terminal-green animate-pulse' : 'bg-terminal-green/20'
                }`}
              />
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => problem.trim() && onSubmit(problem.trim())}
            disabled={!problem.trim()}
            className="btn-terminal w-full sm:w-auto px-10 py-4 text-base tracking-[0.2em] animate-pulse-glow"
            style={{
              boxShadow: problem.trim()
                ? '0 0 20px rgba(0, 255, 65, 0.3), 0 0 40px rgba(0, 255, 65, 0.1)'
                : 'none',
            }}
          >
            GENERATE PROTOTYPE →
          </button>
          <span className="text-terminal-green/30 text-xs font-mono">
            Powered by GPT-4o
          </span>
        </div>

        {/* Example hints */}
        <div className="mt-10">
          <p className="text-terminal-green/30 text-xs font-mono tracking-widest uppercase mb-3">
            // Try an example
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_HINTS.map((hint) => (
              <button
                key={hint}
                onClick={() => handleHintClick(hint)}
                className="text-xs font-mono px-3 py-1.5 border border-terminal-green/20 text-terminal-green/50 hover:border-terminal-green/50 hover:text-terminal-green/80 transition-all duration-200 text-left"
              >
                {hint}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
