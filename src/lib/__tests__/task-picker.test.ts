import { describe, it, expect } from "vitest";
import { shuffle, diversePick } from "@/lib/task-picker";
import { items } from "@/data/curriculum";
import type { ToolMatchItem, ToolId, ToolMatchCategoryId } from "@/data/curriculum";

// ─── Helpers ───

interface ItemOverride {
  id?: string;
  answer?: ToolId;
  category?: ToolMatchCategoryId;
}

function makeItems(overrides: ItemOverride[], base?: Partial<ToolMatchItem>): ToolMatchItem[] {
  return overrides.map((o, i) => ({
    id: `test-${i}`,
    prompt: `Task ${i}`,
    answer: "chatgpt" as ToolId,
    category: "text-tasks" as ToolMatchCategoryId,
    difficulty: "easy" as const,
    toolOptions: ["chatgpt", "dont-use-ai"] as ToolId[],
    ...base,
    ...o,
  }));
}

// ─── shuffle ───

describe("shuffle", () => {
  it("returns a new array — never mutates input", () => {
    const original = [1, 2, 3, 4, 5];
    const frozen = [...original];
    const result = shuffle(original);
    expect(original).toEqual(frozen); // not mutated
    expect(result).not.toBe(original); // new reference
    expect(result.sort()).toEqual(original.sort()); // same elements
  });

  it("handles single-element arrays", () => {
    expect(shuffle([42])).toEqual([42]);
  });

  it("handles empty arrays", () => {
    expect(shuffle([])).toEqual([]);
  });
});

// ─── diversePick ───

describe("diversePick", () => {
  it("returns exactly `count` items from a large pool", () => {
    const result = diversePick(items, 10);
    expect(result).toHaveLength(10);
  });

  it("returns all items (shuffled) when pool <= count", () => {
    const small = makeItems([{}, {}, {}]);
    const result = diversePick(small, 10);
    expect(result).toHaveLength(3);
    expect(new Set(result.map((r) => r.id))).toEqual(new Set(small.map((s) => s.id)));
  });

  it("guarantees at least 2 'Don't Use AI' items per round", () => {
    // Run 50 times to catch probabilistic failures
    for (let run = 0; run < 50; run++) {
      const result = diversePick(items, 10);
      const noAiCount = result.filter((i) => i.answer === "dont-use-ai").length;
      expect(noAiCount).toBeGreaterThanOrEqual(2);
    }
  });

  it("never duplicates items within a single pick", () => {
    for (let run = 0; run < 30; run++) {
      const result = diversePick(items, 10);
      const ids = result.map((i) => i.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("includes items from multiple categories when available", () => {
    for (let run = 0; run < 30; run++) {
      const result = diversePick(items, 10);
      const categories = new Set(result.map((i) => i.category));
      expect(categories.size).toBeGreaterThanOrEqual(2);
    }
  });

  it("handles pool with zero 'Don't Use AI' items gracefully", () => {
    const noNoAi = makeItems(
      Array.from({ length: 20 }, (_, i) => ({ id: `item-${i}`, answer: "chatgpt" as ToolId }))
    );
    const result = diversePick(noNoAi, 10);
    expect(result).toHaveLength(10);
    // No crash, just 0 no-AI items
    expect(result.filter((i) => i.answer === "dont-use-ai")).toHaveLength(0);
  });

  it("caps 'Don't Use AI' floor at available count when pool has only 1", () => {
    const pool = makeItems([
      { id: "noai-1", answer: "dont-use-ai" as ToolId },
      ...Array.from({ length: 15 }, (_, i) => ({ id: `reg-${i}`, answer: "chatgpt" as ToolId })),
    ]);
    const result = diversePick(pool, 10);
    expect(result).toHaveLength(10);
    const noAiCount = result.filter((i) => i.answer === "dont-use-ai").length;
    expect(noAiCount).toBeGreaterThanOrEqual(1);
  });

  it("proportionally represents categories — no single category hogs all slots", () => {
    // Create 10 text, 10 visual items
    const pool = makeItems([
      ...Array.from({ length: 10 }, (_, i) => ({ id: `text-${i}`, category: "text-tasks" as ToolMatchCategoryId })),
      ...Array.from({ length: 10 }, (_, i) => ({ id: `vis-${i}`, category: "visual-tasks" as ToolMatchCategoryId })),
    ]);
    // Over many runs, both categories should appear
    const textCounts: number[] = [];
    for (let run = 0; run < 30; run++) {
      const result = diversePick(pool, 8);
      textCounts.push(result.filter((i) => i.category === "text-tasks").length);
    }
    const avg = textCounts.reduce((a, b) => a + b, 0) / textCounts.length;
    // Should be roughly 4 ± 2 (proportional), never 0 or 8
    expect(avg).toBeGreaterThan(1);
    expect(avg).toBeLessThan(7);
  });
});
