# TOOL MATCH

**Right Tool, Right Job** — *Not Everything Needs AI*

A workshop-themed educational game that teaches AI tool selection through rapid-fire matching. Built for the [Passionate Learning](https://github.com/DareDev256) series (Game 5/6).

> The core insight: knowing *when not to use AI* is as important as knowing which tool to pick.

## Why This Exists

Every AI course teaches you what tools can do. Almost none teach you when to **stop reaching for AI**. Tool Match fills that gap — "Don't Use AI" isn't a trick answer, it's a first-class option that earns bonus XP when you correctly identify tasks where human judgment, emotion, or authenticity matters more.

## How It Works

```
┌─────────────────────────────────────────────┐
│  TASK: "Write a sympathy card for a         │
│         coworker who lost a family member"   │
├─────────────────────────────────────────────┤
│                                             │
│   ⌘ ChatGPT    ◆ Midjourney                │
│   ◉ Google     ✕ Don't Use AI  ← correct   │
│                                             │
├─────────────────────────────────────────────┤
│  WHY: Genuine emotion can't be outsourced.  │
│  Using AI risks being discovered and        │
│  causing MORE hurt than saying nothing.     │
└─────────────────────────────────────────────┘
```

Every answer reveals **enrichment feedback** — not just "correct/wrong" but *why it matters*, a real-world example, and a pro tip. The game teaches through explanation, not repetition.

## Tools Library

| Tool | Icon | Best For |
|------|------|----------|
| ChatGPT / Claude | ⌘ | Text generation, summarization, analysis |
| Midjourney / DALL-E | ◆ | Image generation, visual concepts |
| GitHub Copilot | ▶ | Code completion, refactoring |
| Whisper | ◎ | Transcription, speech-to-text |
| Google Search | ◉ | Current events, real-time data |
| Spreadsheets | ▦ | Calculations, data visualization |
| Human Expert | ◈ | Legal, medical, emotional support |
| **Don't Use AI** | ✕ | When AI causes more harm than good |

## Scoring

| Action | Points | Notes |
|--------|--------|-------|
| Correct match | +10 | Base score |
| Correct "Don't Use AI" | +15 | Bonus for critical thinking |
| Speed bonus | +1 to +5 | React within 1–6 seconds |
| Combo multiplier | up to 4× | Consecutive correct answers |
| Wrong match | −5 | |
| Wrong "Don't Use AI" | −3 | Lighter penalty — we want you to try |

Grades: **S** (95%+) → **A** (90%+) → **B** (80%+) → **C** (70%+) → **D** (60%+) → **F**

## Architecture

```
src/
├── app/
│   ├── layout.tsx              Root layout, CRT overlay, metadata
│   ├── page.tsx                Landing — hero, streak badge, XP bar
│   └── play/
│       └── page.tsx            Game engine — scoring, feedback, enrichment
├── components/
│   ├── game/
│   │   ├── Timer.tsx           Countdown timer (for future timed modes)
│   │   └── VictoryScreen.tsx   End-of-round grades and stats
│   └── ui/
│       ├── Button.tsx          3 variants: primary, secondary, ghost
│       ├── Logo.tsx            Title with neon glow
│       ├── StreakBadge.tsx     Fire emoji streak counter
│       └── XPBar.tsx           Level + XP progress bar
├── data/
│   └── curriculum.ts           Tools definition + 15 task items
├── hooks/
│   ├── useGameStats.ts         Session tracking (correct/incorrect/time)
│   ├── useProgress.ts          XP, levels, streaks, mastery gates
│   └── useSoundEffects.ts      Web Audio API — zero external files
├── lib/
│   └── storage.ts              localStorage persistence + FSRS bridge
└── types/
    └── game.ts                 Shared interfaces
```

**Data flow:** Player taps tool → `handleSelect()` checks answer → `useGameStats` records result → `useProgress` awards XP → `storage.ts` persists to localStorage → enrichment panel reveals the *why*.

## Key Design Decisions

**No API keys.** Everything runs client-side. No backend, no accounts, no tracking. Open the page and play.

**Web Audio over audio files.** All sounds (correct chime, wrong buzz, celebration) are synthesized with oscillators. Zero `.mp3` assets = smaller bundle, no CORS issues, works offline.

**FSRS spaced repetition.** Scaffolded with `ts-fsrs` for research-grade scheduling. Items return after 7 days (2× XP) and 30 days (3× XP) to build genuine long-term retention.

**Mastery gates.** Kumon-inspired — you can't advance to the next level until you score ≥90% accuracy on the last 3 attempts. This prevents brute-forcing through content.

**Enrichment-first.** Every curriculum item carries `whyItMatters`, `realWorldExample`, and `proTip`. The game teaches *reasoning*, not memorization.

## Curriculum

| # | Category | Items | Difficulty | Status |
|---|----------|-------|------------|--------|
| 1 | Text Tasks | 8 | Easy | ✅ Live |
| 2 | Visual Tasks | 7 | Easy | ✅ Live |
| 3 | Code Tasks | 40 | Medium | Planned |
| 4 | Data Tasks | 40 | Medium | Planned |
| 5 | Creative Tasks | 40 | Medium | Planned |
| 6 | Risky Tasks | 40 | Hard | Planned |
| 7 | Workflow Design | 40 | Hard | Planned |
| 8 | Anti-Patterns | 40 | Hard | Planned |

Target: **320 items** across 8 categories, 5 levels each (8 items per level).

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
npm run dev    # Development server (Turbopack)
npm run build  # Production build
npm run lint   # ESLint 9 flat config
```

## Tech Stack

- **Next.js 16** + **React 19** + **TypeScript** (strict mode)
- **Tailwind CSS v4** — CSS-first config with `@theme inline`
- **Framer Motion** — Entrance animations, feedback transitions
- **ts-fsrs** — Spaced repetition scheduling (FSRS-4.5 algorithm)
- **Press Start 2P** — Pixel font for retro workshop aesthetic
- **Web Audio API** — Synthesized sound effects, no audio files

## Visual Design

Workshop/toolbench aesthetic with intentional constraint:

- **Electric blue** (`#3498db`) — Primary actions, tool highlights
- **Steel gray** (`#95a5a6`) — Secondary text, borders
- **Copper** (`#e67e22`) — Accents, combo counter, emphasis
- **Near-black** (`#0a0f15`) — Background
- **CRT overlay** — Subtle scanlines for retro depth
- **Pegboard dot-grid** — Background texture anchoring the workshop theme

## License

MIT

---

Built by [DareDev256](https://github.com/DareDev256) — Passionate Learning Series
