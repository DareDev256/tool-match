# TOOL MATCH

**Right Tool, Right Job** — *Not Everything Needs AI*

An educational browser game that teaches practical AI tool selection through drag-match gameplay. Part of the [Passionate Learning](https://github.com/DareDev256) series (Game 5/6).

## What You Learn

Match real-world tasks to the right AI tool — or recognize when AI shouldn't be used at all. The "Don't Use AI" option is a first-class answer, not an afterthought.

## Tools Library

| Tool | Best For |
|------|----------|
| ChatGPT/Claude | Text generation, summarization, analysis |
| Midjourney/DALL-E | Image generation, visual concepts |
| GitHub Copilot | Code completion, refactoring |
| Whisper | Transcription, speech-to-text |
| Google Search | Current events, real-time data |
| Spreadsheets | Calculations, data visualization |
| Human Expert | Legal, medical, emotional support |
| **Don't Use AI** | When AI causes more harm than good |

## Features

- Workshop/toolbench themed UI with blueprint-style task cards
- Tap-to-select tool matching (mobile-first)
- Speed bonus scoring (react faster = more points)
- "Don't Use AI" bonus XP for recognizing AI limitations
- Combo multiplier for consecutive correct answers
- Rich enrichment feedback explaining *why* each answer is correct
- 15 curriculum items across Text Tasks and Visual Tasks
- Sound effects via Web Audio API (zero external files)
- FSRS spaced repetition for long-term retention
- Fully offline — no API keys required

## Tech Stack

- Next.js 16 + React 19 + TypeScript (strict)
- Tailwind CSS v4 (CSS-first `@theme inline`)
- Framer Motion for animations
- localStorage persistence (SSR-safe)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
npm run dev    # Development server
npm run build  # Production build
npm run lint   # ESLint check
```

## Scoring

| Action | Points |
|--------|--------|
| Correct match | +10 |
| Correct "Don't Use AI" | +15 |
| Speed bonus | +1 to +5 |
| Combo multiplier | up to 4x |
| Wrong match | -5 |
| Wrong "Don't Use AI" | -3 |

## Categories

1. **Text Tasks** — Writing, editing, summarizing, translating (8 items)
2. **Visual Tasks** — Design, images, presentations, mockups (7 items)
3. *Code Tasks* — Coming soon
4. *Data Tasks* — Coming soon
5. *Creative Tasks* — Coming soon
6. *Risky Tasks* — Coming soon
7. *Workflow Design* — Coming soon
8. *Anti-Patterns* — Coming soon

## License

MIT

---

Built by [DareDev256](https://github.com/DareDev256) — Passionate Learning Series
