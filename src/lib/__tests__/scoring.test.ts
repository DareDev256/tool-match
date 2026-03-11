import { describe, it, expect } from "vitest";

// ─── Scoring Formula (extracted from useGameEngine.ts) ───
// Testing the pure math independently from React hooks.

const COMBO_CAP = 4;

/** Mirrors the scoring logic in useGameEngine.handleSelect */
function calculateScore(params: {
  isCorrect: boolean;
  isDontUseAi: boolean;
  selectedDontUseAi: boolean;
  elapsedSeconds: number;
  currentCombo: number;
}): { points: number; newCombo: number } {
  const { isCorrect, isDontUseAi, selectedDontUseAi, elapsedSeconds, currentCombo } = params;

  if (!isCorrect) {
    return {
      points: selectedDontUseAi ? -3 : -5,
      newCombo: 0,
    };
  }

  const base = isDontUseAi && selectedDontUseAi ? 15 : 10;
  const speedBonus = Math.max(1, Math.min(5, Math.ceil(6 - elapsedSeconds)));
  const comboMultiplier = Math.min(currentCombo + 1, COMBO_CAP);
  return {
    points: (base + speedBonus) * comboMultiplier,
    newCombo: currentCombo + 1,
  };
}

/** Mirrors the XP earned formula */
function calculateXP(score: number): number {
  return Math.max(10, Math.round(score / 5));
}

// ─── Tests ───

describe("scoring formula", () => {
  it("awards 10 base points for correct tool match", () => {
    const { points } = calculateScore({
      isCorrect: true,
      isDontUseAi: false,
      selectedDontUseAi: false,
      elapsedSeconds: 10, // slow = +1 speed bonus
      currentCombo: 0,    // first answer = 1x multiplier
    });
    expect(points).toBe(11); // (10 + 1) * 1
  });

  it("awards 15 base points for correct 'Don't Use AI'", () => {
    const { points } = calculateScore({
      isCorrect: true,
      isDontUseAi: true,
      selectedDontUseAi: true,
      elapsedSeconds: 10,
      currentCombo: 0,
    });
    expect(points).toBe(16); // (15 + 1) * 1
  });

  it("speed bonus: +5 for instant answer (0s), +1 for slow (6s+)", () => {
    const fast = calculateScore({
      isCorrect: true, isDontUseAi: false, selectedDontUseAi: false,
      elapsedSeconds: 0, currentCombo: 0,
    });
    const slow = calculateScore({
      isCorrect: true, isDontUseAi: false, selectedDontUseAi: false,
      elapsedSeconds: 10, currentCombo: 0,
    });
    expect(fast.points).toBe(15); // (10 + 5) * 1
    expect(slow.points).toBe(11); // (10 + 1) * 1
  });

  it("speed bonus clamps between 1 and 5", () => {
    // At 1 second: ceil(6-1) = 5 → clamped to 5
    const at1s = calculateScore({
      isCorrect: true, isDontUseAi: false, selectedDontUseAi: false,
      elapsedSeconds: 1, currentCombo: 0,
    });
    // At 5 seconds: ceil(6-5) = 1 → clamped to 1
    const at5s = calculateScore({
      isCorrect: true, isDontUseAi: false, selectedDontUseAi: false,
      elapsedSeconds: 5, currentCombo: 0,
    });
    expect(at1s.points).toBe(15); // (10 + 5) * 1
    expect(at5s.points).toBe(11); // (10 + 1) * 1
  });

  it("combo multiplier caps at 4x", () => {
    const combo3 = calculateScore({
      isCorrect: true, isDontUseAi: false, selectedDontUseAi: false,
      elapsedSeconds: 10, currentCombo: 3,
    });
    const combo10 = calculateScore({
      isCorrect: true, isDontUseAi: false, selectedDontUseAi: false,
      elapsedSeconds: 10, currentCombo: 10,
    });
    expect(combo3.points).toBe(44);  // (10 + 1) * 4
    expect(combo10.points).toBe(44); // still capped at 4x
  });

  it("max possible score: 'Don't Use AI' + instant + max combo", () => {
    const { points } = calculateScore({
      isCorrect: true,
      isDontUseAi: true,
      selectedDontUseAi: true,
      elapsedSeconds: 0,
      currentCombo: 3, // gives 4x (cap)
    });
    expect(points).toBe(80); // (15 + 5) * 4
  });

  it("wrong answer: -5 for wrong tool, -3 for wrong 'Don't Use AI'", () => {
    const wrongTool = calculateScore({
      isCorrect: false, isDontUseAi: false, selectedDontUseAi: false,
      elapsedSeconds: 1, currentCombo: 5,
    });
    const wrongNoAi = calculateScore({
      isCorrect: false, isDontUseAi: false, selectedDontUseAi: true,
      elapsedSeconds: 1, currentCombo: 5,
    });
    expect(wrongTool.points).toBe(-5);
    expect(wrongNoAi.points).toBe(-3);
    expect(wrongTool.newCombo).toBe(0);
  });

  it("wrong answer resets combo regardless of previous streak", () => {
    const { newCombo } = calculateScore({
      isCorrect: false, isDontUseAi: false, selectedDontUseAi: false,
      elapsedSeconds: 1, currentCombo: 99,
    });
    expect(newCombo).toBe(0);
  });
});

describe("XP calculation", () => {
  it("minimum XP is always 10, even with score 0", () => {
    expect(calculateXP(0)).toBe(10);
  });

  it("negative score still yields minimum 10 XP", () => {
    expect(calculateXP(-50)).toBe(10);
  });

  it("score 100 → 20 XP", () => {
    expect(calculateXP(100)).toBe(20);
  });

  it("score 49 → 10 XP (rounds to 10, below minimum)", () => {
    expect(calculateXP(49)).toBe(10);
  });
});
