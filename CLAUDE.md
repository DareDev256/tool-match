# CLAUDE.md — Tool Match

## Project: Passionate Learning Game #5
A web-based educational game that teaches practical AI tool selection through drag-match gameplay.

## Game Identity
- **Title**: TOOL MATCH
- **Subtitle**: Right Tool, Right Job
- **Tagline**: NOT EVERYTHING NEEDS AI
- **Storage key prefix**: `tool_match`

## Full Spec
Read `/Users/tdot/Documents/Projects/passionate-learning/specs/05-tool-match.md` for the complete game specification.

## Tech Stack
- Next.js 16 + React 19 + TypeScript (strict)
- Tailwind CSS v4 (CSS-first `@theme inline`)
- Framer Motion for animations
- localStorage persistence (SSR-safe)
- Deploy: Vercel

## Template
Scaffolded from Passionate Learning shared template at `/Users/tdot/Documents/Projects/passionate-learning/template/`.

## Theme Colors
```css
--game-primary: #3498db;   /* electric blue */
--game-secondary: #95a5a6; /* steel gray */
--game-accent: #e67e22;    /* copper */
--game-dark: #0a0f15;
```

## Core Mechanic
Task description appears → row of AI tool options → player drags/taps to match task to correct tool → speed bonus → "Don't Use AI" option earns bonus XP when correct.

## Build Priority
1. Landing page with workshop/toolbench theme
2. Tool shelf UI with labeled tool icons
3. Task card display
4. Drag-to-match mechanic (tap-to-select on mobile)
5. Scoring engine with speed bonus + "Don't Use AI" bonus
6. Combo counter for consecutive correct matches
7. Full curriculum (320 items across 8 categories)
8. Tool mastery bars visualization

## Quality Bar
- Production-grade. No placeholders.
- Zero API keys required.
- Mobile responsive — drag converts to tap-to-select.
- "Don't Use AI" is a first-class answer, not an afterthought.

## Commands
```bash
npm run dev    # Development server
npm run build  # Production build
npm run lint   # ESLint check
```
