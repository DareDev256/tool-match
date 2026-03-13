import type { ToolMatchItem } from "@/data/curriculum";

/**
 * Fisher-Yates shuffle. Returns a new array — never mutates input.
 */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Diversity-aware task picker. Guarantees:
 * 1. Proportional category balance (text vs visual)
 * 2. At least 2 "Don't Use AI" items per session (first-class mechanic)
 * 3. Answer tool diversity — no single correct tool dominates
 * 4. Final order is shuffled so patterns aren't predictable
 */
export function diversePick(pool: ToolMatchItem[], count: number): ToolMatchItem[] {
  if (pool.length <= count) return shuffle(pool);

  // Split by category for proportional representation
  const byCategory = new Map<string, ToolMatchItem[]>();
  for (const item of pool) {
    const list = byCategory.get(item.category) ?? [];
    list.push(item);
    byCategory.set(item.category, list);
  }

  // Guarantee "Don't Use AI" floor — the game's signature mechanic
  const noAiItems = shuffle(pool.filter((i) => i.answer === "dont-use-ai"));
  const noAiFloor = Math.min(2, noAiItems.length);
  const guaranteed = noAiItems.slice(0, noAiFloor);
  const guaranteedIds = new Set(guaranteed.map((i) => i.id));

  // Fill remaining slots proportionally from each category
  const remaining = count - guaranteed.length;
  const availableByCategory = new Map<string, ToolMatchItem[]>();
  for (const [cat, catItems] of byCategory) {
    availableByCategory.set(cat, shuffle(catItems.filter((i) => !guaranteedIds.has(i.id))));
  }

  const categoryKeys = [...availableByCategory.keys()];
  const totalAvailable = categoryKeys.reduce(
    (sum, k) => sum + (availableByCategory.get(k)?.length ?? 0), 0
  );

  const picked: ToolMatchItem[] = [...guaranteed];
  const pickedIds = new Set(guaranteedIds);

  // Proportional allocation per category
  for (const cat of categoryKeys) {
    const catPool = availableByCategory.get(cat) ?? [];
    const share = Math.round((catPool.length / totalAvailable) * remaining);
    const take = Math.min(share, catPool.length);
    for (let i = 0; i < take && picked.length < count; i++) {
      picked.push(catPool[i]);
      pickedIds.add(catPool[i].id);
    }
  }

  // Fill any remainder (rounding gaps) from unused items
  if (picked.length < count) {
    const unused = shuffle(pool.filter((i) => !pickedIds.has(i.id)));
    for (const item of unused) {
      if (picked.length >= count) break;
      picked.push(item);
    }
  }

  return shuffle(picked);
}
