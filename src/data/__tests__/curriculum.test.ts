import { describe, it, expect } from "vitest";
import { items, tools, categories, getToolById, getItemsByCategory, getItemsByLevel } from "@/data/curriculum";

// ─── Data Integrity ───

describe("curriculum data integrity", () => {
  it("every item has a non-empty id, prompt, answer, and category", () => {
    for (const item of items) {
      expect(item.id, `item missing id`).toBeTruthy();
      expect(item.prompt, `${item.id} missing prompt`).toBeTruthy();
      expect(item.answer, `${item.id} missing answer`).toBeTruthy();
      expect(item.category, `${item.id} missing category`).toBeTruthy();
    }
  });

  it("no duplicate item IDs", () => {
    const ids = items.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every item's answer references a valid tool ID", () => {
    const toolIds = new Set(tools.map((t) => t.id));
    for (const item of items) {
      expect(toolIds.has(item.answer), `${item.id} answer "${item.answer}" not in tools`).toBe(true);
    }
  });

  it("every item's toolOptions include its correct answer", () => {
    for (const item of items) {
      expect(
        item.toolOptions.includes(item.answer),
        `${item.id} toolOptions missing correct answer "${item.answer}"`
      ).toBe(true);
    }
  });

  it("every item's toolOptions reference valid tool IDs", () => {
    const toolIds = new Set(tools.map((t) => t.id));
    for (const item of items) {
      for (const opt of item.toolOptions) {
        expect(toolIds.has(opt), `${item.id} has invalid toolOption "${opt}"`).toBe(true);
      }
    }
  });

  it("every item belongs to a defined category", () => {
    const catIds = new Set(categories.map((c) => c.id));
    for (const item of items) {
      expect(catIds.has(item.category), `${item.id} category "${item.category}" not defined`).toBe(true);
    }
  });

  it("every level references existing item IDs", () => {
    const itemIds = new Set(items.map((i) => i.id));
    for (const cat of categories) {
      for (const level of cat.levels) {
        for (const id of level.items) {
          expect(itemIds.has(id), `Level ${cat.id}-${level.id} references missing item "${id}"`).toBe(true);
        }
      }
    }
  });

  it("no duplicate tool IDs", () => {
    const ids = tools.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("'dont-use-ai' tool exists — it's a first-class game mechanic", () => {
    expect(getToolById("dont-use-ai")).toBeDefined();
  });

  it("at least 2 items have 'dont-use-ai' as the correct answer", () => {
    const noAiItems = items.filter((i) => i.answer === "dont-use-ai");
    expect(noAiItems.length).toBeGreaterThanOrEqual(2);
  });

  it("every item has 3-5 tool options (prevents trivial guessing)", () => {
    for (const item of items) {
      expect(item.toolOptions.length).toBeGreaterThanOrEqual(3);
      expect(item.toolOptions.length).toBeLessThanOrEqual(5);
    }
  });
});

// ─── Query Functions ───

describe("getToolById", () => {
  it("returns correct tool for valid ID", () => {
    const tool = getToolById("chatgpt");
    expect(tool).toBeDefined();
    expect(tool!.name).toBe("ChatGPT");
  });

  it("returns undefined for invalid ID", () => {
    expect(getToolById("nonexistent")).toBeUndefined();
  });
});

describe("getItemsByCategory", () => {
  it("returns only items from the specified category", () => {
    const textItems = getItemsByCategory("text-tasks");
    expect(textItems.length).toBeGreaterThan(0);
    expect(textItems.every((i) => i.category === "text-tasks")).toBe(true);
  });

  it("returns empty array for nonexistent category", () => {
    expect(getItemsByCategory("fake-category")).toEqual([]);
  });
});

describe("getItemsByLevel", () => {
  it("returns items for a valid category+level", () => {
    const levelItems = getItemsByLevel("text-tasks", 1);
    expect(levelItems.length).toBeGreaterThan(0);
  });

  it("returns empty for nonexistent category", () => {
    expect(getItemsByLevel("fake", 1)).toEqual([]);
  });

  it("returns empty for nonexistent level", () => {
    expect(getItemsByLevel("text-tasks", 999)).toEqual([]);
  });
});
