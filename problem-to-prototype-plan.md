# Problem → Prototype: AI-Powered Product Generator

## Top-Level Overview

Build a greenfield Vite + React + TypeScript + Tailwind CSS single-page application (SPA) called **Problem → Prototype**. Users describe a real-world problem in natural language; the app calls OpenAI GPT-4o twice — first to analyze the problem (pain point, solution, user flow), then to generate a self-contained interactive React prototype. The prototype is rendered live inside a sandboxed iframe. The entire shell uses a futuristic terminal aesthetic: dark background, green/amber monospace text, and canvas particle effects.

**Stack:** Vite · React 18 · TypeScript · Tailwind CSS · OpenAI API (browser-side, `VITE_OPENAI_API_KEY`) · iframe + Blob URL for prototype rendering

**Three progressive app stages:**
1. `input` — User describes their problem
2. `analysis` — AI-analyzed pain point, solution, and user flow revealed via typewriter animation
3. `prototype` — AI-generated React JSX rendered live in a sandboxed iframe

---

## Sub-Tasks

---

### Sub-Task 1 — Project Scaffolding & Tooling

**Intent:** Bootstrap the project with the correct stack, folder structure, and config so every subsequent sub-task has a clean, working foundation.

**Expected Outcomes:**
- `npm run dev` starts a working Vite dev server
- Tailwind CSS utility classes work in components
- TypeScript strict mode enabled
- `.env.example` documents the required env var
- ESLint configured

**Todo List:**
1. Initialise a Vite + React + TypeScript project (`npm create vite@latest`)
2. Install dependencies: `tailwindcss`, `postcss`, `autoprefixer`, `openai`, `clsx`
3. Initialise Tailwind (`npx tailwindcss init -p`), configure `content` paths
4. Set Tailwind base/components/utilities in `src/index.css`
5. Configure `tsconfig.json` with strict mode and path aliases
6. Create `.env.example` with `VITE_OPENAI_API_KEY=your_key_here`
7. Create `.gitignore` (node_modules, dist, .env)
8. Set up folder structure: `src/components/`, `src/hooks/`, `src/lib/`, `src/types/`
9. Verify `npm run dev` runs with no errors

**Relevant Context:**
- Root: `README.md` (currently a placeholder — update with project description)
- No existing code; pure greenfield

**Status:** `[ ] pending`

---

### Sub-Task 2 — OpenAI API Client & Types

**Intent:** Centralise all AI logic so the UI components remain clean and the prompt engineering is in one place.

**Expected Outcomes:**
- `src/lib/openai.ts` exports two functions: `analyzeProblem` and `generatePrototype`
- `src/types/index.ts` defines `ProblemAnalysis` and `AppStage` TypeScript types
- Both functions use structured JSON output (OpenAI `response_format: { type: "json_object" }`)
- API key read from `import.meta.env.VITE_OPENAI_API_KEY`

**Todo List:**
1. Create `src/types/index.ts`:
   - `AppStage = "input" | "analysis" | "prototype"`
   - `ProblemAnalysis { painPoint: string; solution: string; userFlow: string[]; rawProblem: string }`
2. Create `src/lib/openai.ts`:
   - Initialise OpenAI client with the Vite env var
   - `analyzeProblem(problem: string): Promise<ProblemAnalysis>` — system prompt instructs GPT-4o to return `{ painPoint, solution, userFlow }` as JSON
   - `generatePrototype(analysis: ProblemAnalysis): Promise<string>` — system prompt instructs GPT-4o to return a single self-contained React functional component as a JSX string (no imports needed; React available as global)
3. Write clear, opinionated system prompts that produce consistent, usable output
4. Handle API errors gracefully (throw with a user-readable message)

**Relevant Context:**
- `src/types/index.ts` — new file
- `src/lib/openai.ts` — new file
- OpenAI JS SDK `openai` package installed in Sub-Task 1

**Status:** `[ ] pending`

---

### Sub-Task 3 — App Shell, State Machine & Layout

**Intent:** Build the top-level app container that owns all state, drives stage transitions, and provides the dark terminal shell layout with animated canvas particle background.

**Expected Outcomes:**
- `src/App.tsx` manages stage (`input | analysis | prototype`), problem text, analysis data, and prototype JSX string
- Canvas particle animation fills the full background (subtle matrix-style green dots/lines)
- A persistent header bar shows the app name and current stage breadcrumb
- Stage transitions are smooth (fade/slide)
- Loading states (spinner + terminal-style status messages) shown during API calls

**Todo List:**
1. Create `src/components/ParticleCanvas.tsx` — full-viewport canvas, animates floating green particles with connecting lines (requestAnimationFrame loop)
2. Create `src/components/Header.tsx` — fixed top bar, monospace font, shows `PROBLEM → PROTOTYPE` logo and stage indicator
3. Create `src/components/LoadingTerminal.tsx` — animated terminal output lines (e.g., `> Analyzing pain point...`, `> Generating solution...`) that simulate AI "thinking"
4. Update `src/App.tsx`:
   - State: `stage`, `problem`, `analysis`, `prototypeJSX`, `isLoading`, `error`
   - Renders `<ParticleCanvas />` as fixed background
   - Renders `<Header />` with current stage
   - Conditionally renders the three stage components (added in later sub-tasks)
   - Exposes `onAnalyze`, `onGeneratePrototype`, `onReset` handlers
5. Style `src/index.css` / `tailwind.config.js` with custom terminal color tokens: `terminal-green` (#00ff41), `terminal-amber` (#ffb000), `terminal-dark` (#0a0a0a), `terminal-surface` (#111111)

**Relevant Context:**
- `src/App.tsx` — modify scaffolded version
- `src/components/` — new directory
- Canvas particle pattern: draw dots, connect nearby dots with lines, use `terminal-green` at low opacity

**Status:** `[ ] pending`

---

### Sub-Task 4 — Stage 1: Problem Input Screen

**Intent:** Build the first user-facing screen — a dramatic, terminal-styled input that invites users to describe their problem and triggers the analysis flow.

**Expected Outcomes:**
- Full-screen centered layout with a large prompt label and glowing textarea
- Textarea styled as a terminal input (dark bg, green border glow, monospace font, cursor blink)
- A "GENERATE →" CTA button that is disabled while empty
- Character counter and a few example problem hints shown below
- Pressing Enter (with Shift for newline) or clicking the button submits

**Todo List:**
1. Create `src/components/ProblemInput.tsx`
2. Implement the textarea with Tailwind: `bg-terminal-dark border border-terminal-green/40 focus:border-terminal-green focus:ring-1 focus:ring-terminal-green text-terminal-green font-mono`
3. Add animated blinking cursor effect after the last character (CSS animation)
4. Implement "GENERATE →" button with a glowing green border and hover state
5. Add 3–4 example problem hints as clickable chips (clicking fills the textarea)
6. Wire `onSubmit` prop to call `onAnalyze` from `App.tsx`
7. Show a subtle scan-line overlay CSS effect on the textarea for depth

**Relevant Context:**
- `src/components/ProblemInput.tsx` — new file
- Receives props: `onSubmit: (problem: string) => void`
- Example hints: "I forget to drink water during work", "Finding a parking spot takes forever", "Splitting bills with roommates is awkward"

**Status:** `[ ] pending`

---

### Sub-Task 5 — Stage 2: Analysis Reveal Screen

**Intent:** Present the AI's structured analysis (pain point, solution, user flow) with a dramatic typewriter/terminal-reveal animation that makes it feel alive and intelligent.

**Expected Outcomes:**
- Three sections revealed sequentially: `PAIN POINT`, `PROPOSED SOLUTION`, `USER FLOW`
- Each section header types in first, then the content streams in character by character
- User flow is shown as a numbered terminal list (`01 → 02 → 03 ...`)
- A "BUILD PROTOTYPE →" button appears only after all content has finished animating
- A "← RESTART" link at top-left to go back to input

**Todo List:**
1. Create `src/hooks/useTypewriter.ts` — hook that takes a string and returns a progressively revealed substring, advancing on a configurable interval
2. Create `src/components/AnalysisReveal.tsx`
3. Implement sequential reveal: pain point first, then solution, then user flow steps (each triggered after the previous finishes)
4. Style sections as terminal "output blocks" with a `>` prompt prefix and amber accent color for section labels
5. Animate user flow steps as a horizontal flow diagram with `→` connectors
6. Show "BUILD PROTOTYPE →" button after final section is revealed; button has pulsing green glow animation
7. Wire props: `analysis: ProblemAnalysis`, `onBuildPrototype: () => void`, `onReset: () => void`

**Relevant Context:**
- `src/components/AnalysisReveal.tsx` — new file
- `src/hooks/useTypewriter.ts` — new file
- `src/types/index.ts` — uses `ProblemAnalysis` type

**Status:** `[ ] pending`

---

### Sub-Task 6 — Stage 3: Live Prototype Renderer

**Intent:** Take the AI-generated JSX string and render it as a fully interactive prototype inside a sandboxed iframe, giving users a real click-through experience.

**Expected Outcomes:**
- The AI-generated component renders correctly in the iframe with no console errors
- Iframe uses a Blob URL containing a self-contained HTML page that loads React + ReactDOM + Babel from CDN and evaluates the JSX
- Prototype panel has a browser-chrome mockup frame (address bar, dots) to make it feel like a real product
- A "← BACK TO ANALYSIS" button and a "↺ REGENERATE" button are shown above the iframe
- If prototype generation fails, a friendly error state is shown with a retry option

**Todo List:**
1. Create `src/lib/buildPrototypeHTML.ts` — takes JSX string, wraps it in a full HTML page string with:
   - React 18 + ReactDOM CDN scripts
   - Babel standalone CDN for JSX transform
   - A `<script type="text/babel">` block containing the component + `ReactDOM.createRoot(document.getElementById('root')).render(<App />)`
   - Minimal CSS reset and a clean white/light background inside the iframe
2. Create `src/components/PrototypeRenderer.tsx`:
   - Calls `buildPrototypeHTML(prototypeJSX)` to get the HTML string
   - Creates a `Blob` with `type: "text/html"` and `URL.createObjectURL(blob)` as the iframe `src`
   - Revokes the object URL on unmount
   - Renders the browser-chrome wrapper around the iframe
3. Add the "BACK" and "REGENERATE" buttons with appropriate handlers
4. Handle loading state while iframe initialises (show terminal spinner)
5. Add `sandbox="allow-scripts"` to the iframe for security

**Relevant Context:**
- `src/lib/buildPrototypeHTML.ts` — new file
- `src/components/PrototypeRenderer.tsx` — new file
- React 18 CDN: `https://unpkg.com/react@18/umd/react.development.js`
- ReactDOM 18 CDN: `https://unpkg.com/react-dom@18/umd/react-dom.development.js`
- Babel standalone: `https://unpkg.com/@babel/standalone/babel.min.js`

**Status:** `[ ] pending`

---

### Sub-Task 7 — Polish, Prompt Tuning & Final Integration

**Intent:** Wire all pieces together, tune the OpenAI prompts for reliable output quality, and apply final visual polish so the app is demo-ready.

**Expected Outcomes:**
- End-to-end flow works: problem input → analysis → prototype (no broken states)
- AI-generated prototypes are consistently functional React components
- All loading, error, and edge-case states are handled gracefully
- README updated with setup instructions and a screenshot placeholder
- `npm run build` produces a clean production bundle with no TypeScript errors

**Todo List:**
1. Integrate all stage components into `App.tsx` with correct prop wiring
2. Tune `analyzeProblem` prompt: emphasize concise pain point (1 sentence), actionable solution (2–3 sentences), 4–6 user flow steps
3. Tune `generatePrototype` prompt: require a functional React component named `App`, use inline styles or Tailwind CDN classes, include realistic placeholder data, ensure no imports/exports (globals only)
4. Add global error boundary component to catch prototype render crashes
5. Add a "share" feature — copy the analysis JSON to clipboard as a summary card
6. Apply final visual polish: consistent spacing, responsive layout for mobile, hover/focus states on all interactive elements
7. Update `README.md` with project description, setup steps (`npm install`, `cp .env.example .env`, `npm run dev`), and tech stack
8. Run `npm run build` and fix any TypeScript or build errors

**Relevant Context:**
- All previously created files
- Focus on prompt reliability: the prototype JSX string must be parseable by Babel standalone without imports

**Status:** `[ ] pending`

---

## Architecture Diagram (text)

```
src/
├── types/
│   └── index.ts              # AppStage, ProblemAnalysis
├── lib/
│   ├── openai.ts             # analyzeProblem(), generatePrototype()
│   └── buildPrototypeHTML.ts # Wraps JSX in full HTML blob
├── hooks/
│   └── useTypewriter.ts      # Progressive string reveal
├── components/
│   ├── ParticleCanvas.tsx    # Full-bg canvas animation
│   ├── Header.tsx            # Fixed top bar + stage indicator
│   ├── LoadingTerminal.tsx   # Animated "thinking" terminal lines
│   ├── ProblemInput.tsx      # Stage 1 — problem textarea
│   ├── AnalysisReveal.tsx    # Stage 2 — typewriter analysis reveal
│   └── PrototypeRenderer.tsx # Stage 3 — iframe prototype sandbox
└── App.tsx                   # State machine, stage routing, layout
```

## Key Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| AI rendering strategy | iframe + Blob URL + Babel CDN | Maximum prototype flexibility; no server needed |
| API key handling | `VITE_OPENAI_API_KEY` in `.env` | Acceptable for hackathon/demo scope |
| Styling | Tailwind CSS + custom terminal tokens | Fast iteration, consistent design language |
| Prototype eval | Babel standalone in iframe | Safe sandbox; no eval() in parent context |
| Animation | CSS + requestAnimationFrame | No animation library dependency |
