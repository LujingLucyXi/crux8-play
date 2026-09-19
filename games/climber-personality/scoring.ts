import type { DimensionKey, ScoreResult } from "@/lib/gameTypes";
import { DIMENSIONS, DIM_KEYS } from "./dimensions";
import { questions } from "./questions";
import { results } from "./results";

// Max points each dimension could earn if you picked its best answer every question.
// Used to normalize raw totals into fair 0-100 DNA bars.
const MAX_PER_DIM: Record<DimensionKey, number> = Object.fromEntries(
  DIM_KEYS.map((k) => [
    k,
    questions.reduce(
      (sum, q) => sum + Math.max(0, ...q.answers.map((a) => a.scores[k] ?? 0)),
      0
    ),
  ])
);

function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export function scoreClimber(answerIds: string[], seed: number): ScoreResult {
  const totals: Record<DimensionKey, number> = Object.fromEntries(
    DIM_KEYS.map((k) => [k, 0])
  );

  answerIds.forEach((answerId, i) => {
    const q = questions[i];
    if (!q) return;
    const answer = q.answers.find((a) => a.id === answerId);
    if (!answer) return;
    for (const [dim, pts] of Object.entries(answer.scores)) {
      totals[dim] = (totals[dim] ?? 0) + (pts ?? 0);
    }
  });

  // Normalized 0-100 DNA bars, in display order.
  const dna = DIMENSIONS.map((d) => ({
    key: d.key,
    label: d.label, // localized {en, zh}
    emoji: d.emoji,
    value: MAX_PER_DIM[d.key]
      ? Math.round((totals[d.key] / MAX_PER_DIM[d.key]) * 100)
      : 0,
  }));

  // Player vector (0-1) for archetype matching.
  const player = DIM_KEYS.map((k) =>
    MAX_PER_DIM[k] ? totals[k] / MAX_PER_DIM[k] : 0
  );

  const EPS = 1e-9;
  let best = -1;
  const scored = results.map((r) => {
    const sig = DIM_KEYS.map((k) => r.signature[k] ?? 0);
    const s = cosine(player, sig);
    if (s > best) best = s;
    return { id: r.id, s };
  });

  // Deterministic tie-break: among archetypes within EPS of the max,
  // the session seed selects one (order = results[] order).
  const tied = scored.filter((x) => Math.abs(x.s - best) < EPS).map((x) => x.id);
  const resultId = tied.length === 1 ? tied[0] : tied[seed % tied.length];

  return { resultId, totals, dna };
}
