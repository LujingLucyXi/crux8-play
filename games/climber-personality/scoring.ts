import type { DimensionKey } from "@/lib/gameTypes";
import { questions } from "./questions";

// Result dimensions map 1:1 to the 4 personality types.
// "chill" is a flavor dimension: it nudges social/adventure on ties.
export const RESULT_DIMENSIONS: DimensionKey[] = ["send", "social", "beta", "adventure"];

// Deterministic tie-break priority when scores are equal.
const TIE_PRIORITY: DimensionKey[] = ["send", "beta", "social", "adventure"];

export function scoreClimber(answerIds: string[], seed: number) {
  const totals: Record<DimensionKey, number> = {
    send: 0,
    social: 0,
    beta: 0,
    adventure: 0,
    chill: 0,
  };

  answerIds.forEach((answerId, i) => {
    const q = questions[i];
    if (!q) return;
    const answer = q.answers.find((a) => a.id === answerId);
    if (!answer) return;
    for (const [dim, pts] of Object.entries(answer.scores)) {
      totals[dim] = (totals[dim] ?? 0) + (pts ?? 0);
    }
  });

  // chill leans the player toward social/adventure without creating its own type
  const ranked = [...RESULT_DIMENSIONS].map((dim) => {
    let v = totals[dim] ?? 0;
    if (dim === "social" || dim === "adventure") v += (totals.chill ?? 0) * 0.5;
    return { dim, v };
  });

  const max = Math.max(...ranked.map((r) => r.v));
  const tied = ranked.filter((r) => r.v === max).map((r) => r.dim);

  let resultId: DimensionKey;
  if (tied.length === 1) {
    resultId = tied[0];
  } else {
    // deterministic tie-break: seed selects among tied, ordered by priority
    const orderedTied = TIE_PRIORITY.filter((d) => tied.includes(d));
    resultId = orderedTied[seed % orderedTied.length];
  }

  return { resultId, totals };
}
