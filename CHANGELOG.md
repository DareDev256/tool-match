# Changelog

## [0.3.2] - 2026-03-13

### Fixed
- Removed duplicate `eslint-config-next/typescript` spread — `core-web-vitals` already bundles it, causing duplicate `@typescript-eslint` and `@next/next` plugin registrations
- Removed redundant `globalIgnores()` call — `core-web-vitals` already sets `.next/`, `out/`, `build/`, `next-env.d.ts` ignores
- Added `@typescript-eslint/consistent-type-imports` rule to enforce `import type` for type-only imports
- Auto-fixed 8 type-only import violations across 7 source files

## [0.3.1] - 2026-03-11

### Added
- Vitest + happy-dom test infrastructure with path alias support
- 41 tests across 3 suites: scoring formula, task picker algorithm, curriculum data integrity
- Scoring tests: speed bonus clamping, combo cap at 4x, "Don't Use AI" bonus (+15), wrong answer penalties, XP minimum floor
- Task picker tests: diversity guarantees (≥2 no-AI items), no duplicates, proportional category balance, edge cases (empty pool, single no-AI item)
- Curriculum tests: no duplicate IDs, every answer references valid tool, every item's toolOptions include correct answer, level→item referential integrity
- `npm run test` and `npm run test:watch` scripts

## [0.3.0] - 2026-03-09

### Changed
- Extracted `shuffle` and `diversePick` from play page into `src/lib/task-picker.ts` — pure functions now independently testable
- Extracted game state machine into `useGameEngine` hook (`src/hooks/useGameEngine.ts`) — scoring, combos, transitions, sound triggers
- Play page (`src/app/play/page.tsx`) reduced from 282 to 130 lines — now a pure presentation component
- Extracted magic numbers into named constants (`ROUND_SIZE`, `FEEDBACK_DELAY_MS`, `COMBO_CAP`)
- `handlePlayAgain` consolidated into hook instead of inline anonymous function

## [0.2.3] - 2026-03-08

### Fixed
- Task selection now uses diversity-aware picking instead of naive shuffle
- Guarantees proportional category balance (text vs visual tasks) each session
- Ensures at least 2 "Don't Use AI" items per round (game's signature mechanic)
- Fills remaining slots proportionally, preventing single-category dominance

## [0.2.2] - 2026-03-07

### Changed
- Rewrote README with persistence layer documentation (6 localStorage keys table), route/pages table, tech stack table format, and data flow diagram
- Added categories page to architecture tree
- Documented "Don't Use AI" as first-class answer design decision with scoring rationale
- Restructured visual design section as color token table with hex values and roles

## [0.2.1] - 2026-02-26

### Changed
- Rewrote README to portfolio-grade documentation with architecture diagram, data flow explanation, design decisions rationale, and enrichment-first philosophy
- Added curriculum roadmap table showing 15/320 items live with expansion plan
- Documented key design decisions (no API keys, Web Audio, FSRS, mastery gates, enrichment-first)
- Added visual design section with color palette and aesthetic rationale

## [0.2.0] - 2026-02-21

### Added
- Core game loop with tap-to-select tool matching mechanic
- Tool shelf UI with 8 AI tools (ChatGPT, Midjourney, Copilot, Whisper, Search, Sheets, Human Expert, Don't Use AI)
- Blueprint-styled task cards with corner marks and workshop aesthetic
- 15 curriculum items across Text Tasks (8) and Visual Tasks (7) categories
- Scoring engine: +10 correct, +15 for "Don't Use AI", speed bonus (+1 to +5), combo multiplier (up to 4x)
- Rich enrichment feedback after each answer (why it matters, pro tips)
- Combo counter with animated display
- Pegboard dot-grid background texture
- Victory screen with grade, accuracy, and XP breakdown
- Sound effects for correct/incorrect/celebration via Web Audio API
- README with game overview, scoring table, and tech stack

## [0.1.1] - 2026-02-21

### Fixed
- Added ESLint 9 flat config (eslint.config.mjs)

## [0.1.0] - 2026-02-20

### Added
- Initial scaffold from Passionate Learning template
