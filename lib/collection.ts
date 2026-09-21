// Personal card collection ("dex") persisted in localStorage — no account needed.
// States per archetype: OWNED (your latest quiz result), SPOTTED (seen via a
// friend's /c/ link), UNKNOWN. Landing the same archetype 3x -> gold foil.
export type Collection = {
  owned: string | null;
  lastDna: number[];
  counts: Record<string, number>;
  spotted: string[];
};

const KEY = "crux8-collection-v1";

const EMPTY: Collection = { owned: null, lastDna: [], counts: {}, spotted: [] };

export function loadCollection(): Collection {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    const c = JSON.parse(raw) as Partial<Collection>;
    return {
      owned: typeof c.owned === "string" ? c.owned : null,
      lastDna: Array.isArray(c.lastDna) ? c.lastDna : [],
      counts: c.counts && typeof c.counts === "object" ? c.counts : {},
      spotted: Array.isArray(c.spotted) ? c.spotted.filter((x) => typeof x === "string") : [],
    };
  } catch {
    return { ...EMPTY };
  }
}

function save(c: Collection) {
  try {
    localStorage.setItem(KEY, JSON.stringify(c));
  } catch {
    /* private mode etc — collection just won't persist */
  }
}

// Call when a quiz result lands. Returns the updated collection.
export function recordResult(id: string, dnaValues: number[]): Collection {
  const c = loadCollection();
  c.owned = id;
  c.lastDna = dnaValues;
  c.counts[id] = (c.counts[id] || 0) + 1;
  c.spotted = c.spotted.filter((x) => x !== id);
  save(c);
  return c;
}

// Call when viewing a friend's shared card. Returns { isNew } for the toast.
export function spotArchetype(id: string): { isNew: boolean; collection: Collection } {
  const c = loadCollection();
  if (c.owned === id || c.spotted.includes(id)) return { isNew: false, collection: c };
  c.spotted.push(id);
  save(c);
  return { isNew: true, collection: c };
}

export function isFoil(c: Collection, id: string): boolean {
  return (c.counts[id] || 0) >= 3;
}

export function discoveredCount(c: Collection): number {
  const set = new Set<string>(c.spotted);
  if (c.owned) set.add(c.owned);
  return set.size;
}
