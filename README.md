# Problem → Prototype

> Turn any real-world problem into an instantly interactive AI-generated product prototype.

## What it does

Describe a problem in plain English. GPT-4o analyzes the core pain point, proposes a solution, maps the user flow, and generates a fully interactive React prototype you can click through — all in seconds.

## Tech Stack

- **Vite + React 18 + TypeScript** — fast SPA
- **Tailwind CSS** — utility-first styling with custom terminal tokens
- **OpenAI GPT-4o** — structured analysis + JSX code generation
- **iframe + Babel CDN** — sandboxed live prototype rendering

## Setup

```bash
# 1. Clone and install
npm install

# 2. Set your OpenAI API key
cp .env.example .env
# Edit .env and set VITE_OPENAI_API_KEY=sk-...

# 3. Run dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build

```bash
npm run build
npm run preview
```

## Notes

- The OpenAI API key is included in the browser bundle — acceptable for demo/hackathon use only
- Prototypes run inside a sandboxed `<iframe>` with `allow-scripts` only — no access to parent page
