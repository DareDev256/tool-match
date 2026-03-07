# TOOL MATCH

**Right Tool, Right Job** — *Not Everything Needs AI*

A workshop-themed educational game that teaches AI tool selection through rapid-fire matching. Built for the [Passionate Learning](https://github.com/DareDev256) series (Game 5/6).

> The core insight: knowing *when not to use AI* is as important as knowing which tool to pick.

---

## Why This Exists

Every AI course teaches you what tools can do. Almost none teach you when to **stop reaching for AI**. Tool Match fills that gap — "Don't Use AI" isn't a trick answer, it's a first-class option that earns bonus XP when you correctly identify tasks where human judgment, emotion, or authenticity matters more.

## How It Plays

```
┌─────────────────────────────────────────────┐
│  TASK: "Write a sympathy card for a         │
│         coworker who lost a family member"   │
├─────────────────────────────────────────────┤
│                                             │
│   [⌘] ChatGPT    [◆] Midjourney            │
│   [◉] Search     [✕] Don't Use AI ← YES    │
│                                             │
├─────────────────────────────────────────────┤
│  WHY: Genuine emotion can't be outsourced.  │
│  Using AI risks being discovered and        │
│  causing MORE hurt than saying nothing.     │
│                                             │
│  💡 Ask: "Would they feel hurt if they      │
│     knew AI wrote this?" If yes, write it.  │
└─────────────────────────────────────────────┘
```

Every answer reveals **enrichment feedback** — not just "correct/wrong" but *why it matters*, a real-world example, and a pro tip. The game teaches through explanation, not repetition.

## Tools Library

| Tool | Icon | Best For |
|------|------|----------|
| ChatGPT / Claude | `⌘` | Text generation, summarization, analysis |
| Midjourney / DALL-E | `◆` | Image generation, visual concepts |
| GitHub Copilot | `▶` | Code completion, refactoring |
| Whisper | `◎` | Transcription, speech-to-text |
| Google Search | `◉` | Current events, real-time data |
| Spreadsheets | `▦` | Calculations, data visualization |
| Human Expert | `◈` | Legal, medical, emotional support |
| **Don't Use AI** | `✕` | When AI causes more harm than good |

## Scoring

| Action | Points | Notes |
|--------|--------|-------|
| Correct match | +10 | Base score |
| Correct "Don't Use AI" | +15 | Bonus for critical thinking |
| Speed bonus | +1 to +5 | React within 1–6 seconds |
| Combo multiplier | up to 4x | Consecutive correct answers |
| Wrong match | -5 | |
| Wrong "Don't Use AI" | -3 | Lighter penalty — we want you to try |

Grades: **S** (95%+) → **A** (90%+) → **B** (80%+) → **C** (70%+) → **D** (60%+) → **F**

## Architecture

```
src/
├── app/
│   ├── layout.tsx              Root layout, CRT overlay, metadata
│   ├── page.tsx                Landing — hero, streak badge, XP bar
│   ├── categories/
│   │   └── page.tsx            Category browser — expand/collapse levels
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
│   └── storage.ts              localStorage persistence layer (6 keys)
└── types/
    └── game.ts                 Shared interfaces
```

### Data Flow

```
Player taps tool
  → handleSelect() checks answer
  → useGameStats records result (session state)
  → Score computed: base + speed bonus × combo multiplier
  → On round end: useProgress awards XP → storage.ts persists
  → Enrichment panel reveals the WHY
```

### Persistence Layer

All state lives in `localStorage` under the `tool_match` namespace. Six storage keys, each SSR-safe with `typeof window` guards:

| Key | Purpose |
|-----|---------|
| `tool_match_progress` | XP, level, completed levels, item scores, streak |
| `tool_match_last_played` | Date string for streak calculation |
| `tool_match_mastery` | Last 5 accuracy attempts per level (Kumon gate) |
| `tool_match_fsrs_cards` | FSRS-4.5 spaced repetition card state |
| `tool_match_analytics` | Learning events (last 1000, ring buffer) |
| `tool_match_streak_freezes` | Reserved for streak protection system |

### Pages

| Route | Purpose |
|-------|---------|
| `/` | Landing — title, streak badge, XP bar, start/categories buttons |
| `/play` | Core game loop — 10 shuffled items, tap-to-select, enrichment |
| `/categories` | Browse categories with expand/collapse levels, completion %, mastery locks |

## Key Design Decisions

**No API keys.** Everything runs client-side. No backend, no accounts, no tracking. Open the page and play.

**Web Audio over audio files.** All sounds (correct chime, wrong buzz, celebration) are synthesized with oscillators. Zero `.mp3` assets = smaller bundle, no CORS issues, works offline.

**FSRS spaced repetition.** Scaffolded with `ts-fsrs` for research-grade scheduling. Items return after 7 days (2x XP) and 30 days (3x XP) to build genuine long-term retention — not cramming.

**Mastery gates.** Kumon-inspired progression — you can't advance to the next level until you score 90%+ accuracy on your last 3 attempts. This prevents brute-forcing through content and ensures genuine comprehension before moving on.

**Enrichment-first curriculum.** Every item carries `whyItMatters`, `realWorldExample`, and `proTip`. The game teaches *reasoning about tool selection*, not memorization of correct answers. The feedback panel is where the real learning happens.

**"Don't Use AI" as first-class answer.** Not a trick option or gotcha — it's weighted with +15 bonus points (vs +10 for correct tool matches) because recognizing AI's limits is harder and more valuable than knowing its capabilities.

## Curriculum

| # | Category | Items | Difficulty | Status |
|---|----------|-------|------------|--------|
| 1 | Text Tasks | 8 | Easy | Live |
| 2 | Visual Tasks | 7 | Easy | Live |
| 3 | Code Tasks | 40 | Medium | Planned |
| 4 | Data Tasks | 40 | Medium | Planned |
| 5 | Creative Tasks | 40 | Medium | Planned |
| 6 | Risky Tasks | 40 | Hard | Planned |
| 7 | Workflow Design | 40 | Hard | Planned |
| 8 | Anti-Patterns | 40 | Hard | Planned |

**15 live** / 320 target — across 8 categories, 5 levels each (8 items per level).

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No environment variables, no API keys, no database.

## Commands

```bash
npm run dev    # Development server (Turbopack)
npm run build  # Production build
npm run lint   # ESLint 9 flat config
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 + React 19 |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 (CSS-first `@theme inline`) |
| Animation | Framer Motion |
| Spaced Repetition | ts-fsrs (FSRS-4.5 algorithm) |
| Font | Press Start 2P (pixel aesthetic) |
| Audio | Web Audio API (synthesized, zero files) |
| Persistence | localStorage (6 namespaced keys) |
| Deploy | Vercel |

## Visual Design

Workshop/toolbench aesthetic with intentional constraint:

| Token | Hex | Role |
|-------|-----|------|
| `--game-primary` | `#3498db` | Electric blue — primary actions, tool highlights, neon glow |
| `--game-secondary` | `#95a5a6` | Steel gray — secondary text, borders, muted UI |
| `--game-accent` | `#e67e22` | Copper — combo counter, emphasis, warnings |
| `--game-dark` | `#0a0f15` | Near-black — background |

Additional visual layers: CRT scanline overlay for retro depth, pegboard dot-grid background texture, blueprint corner marks on all card elements.

## License

MIT

---

Built by [DareDev256](https://github.com/DareDev256) — Passionate Learning Series
