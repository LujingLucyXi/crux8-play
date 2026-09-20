import type { DimensionKey, ScoreResult } from "@/lib/gameTypes";
import { DIMENSIONS, DIM_KEYS } from "./dimensions";
import { questions } from "./questions";
import { results } from "./results";

// Sentinel pushed for a skipped question (contributes nothing).
export const SKIP = "SKIP";

// Characterful answers nudge directly toward a matching archetype, so memorable
// picks actually steer the result. Keyed by `${questionId}:${answerId}`.
const AFFINITY: Record<string, Partial<Record<string, number>>> = {
  "q2:B": { "project-slayer": 1 },
  "q4:D": { chiller: 1 },
  "q5:C": { "flex-lord": 2 },
  "q7:A": { "flex-lord": 1 },
  "q7:B": { "beta-scientist": 1 },
  "q8:A": { "flex-lord": 1 },
  "q8:B": { "zen-master": 1 },
  "q10:A": { "beta-scientist": 1 },
  "q11:A": { competitor: 2 },
  "q12:B": { dirtbag: 2 },
  "q13:A": { sensei: 1 },
  "q13:B": { "hype-beast": 1 },
  "q13:D": { chiller: 2 },
  "q15:A": { "flex-lord": 2 },
  "q15:C": { "project-slayer": 2 },
  "q15:D": { "beta-scientist": 1 },
  "q16:A": { heartbreaker: 2 },
  "q16:B": { "flex-lord": 2 },
  "q16:C": { "send-machine": 2 },
  "q16:D": { "social-butterfly": 1 },
};

const AFFINITY_SCALE = 0.02;

// Rarity calibration: a small ADDITIVE bonus to each archetype's match score
// (cosine is 0-1), so rare/fun types surface more and over-common ones less.
// Tuned via 3M-player simulation to a healthy 2-12% spread. 0 = neutral.
const BONUS: Record<string, number> = {
  "send-machine": 0.045,
  "social-butterfly": 0.0,
  "beta-scientist": -0.01,
  wildcard: -0.015,
  dirtbag: 0.0,
  "gym-rat": 0.0,
  "zen-master": 0.0,
  "hype-beast": 0.005,
  "project-slayer": 0.0,
  "flow-state": 0.015,
  sensei: -0.015,
  chiller: 0.035,
  competitor: 0.01,
  "flex-lord": 0.04,
  heartbreaker: 0.015,
};

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
  const affinity: Record<string, number> = {};

  answerIds.forEach((answerId, i) => {
    const q = questions[i];
    if (!q || answerId === SKIP) return; // skipped question contributes nothing
    const answer = q.answers.find((a) => a.id === answerId);
    if (!answer) return;
    for (const [dim, pts] of Object.entries(answer.scores)) {
      totals[dim] = (totals[dim] ?? 0) + (pts ?? 0);
    }
    const aff = AFFINITY[`${q.id}:${answerId}`];
    if (aff) {
      for (const [id, pts] of Object.entries(aff)) {
        affinity[id] = (affinity[id] ?? 0) + (pts ?? 0);
      }
    }
  });

  const dna = DIMENSIONS.map((d) => ({
    key: d.key,
    label: d.label,
    emoji: d.emoji,
    value: MAX_PER_DIM[d.key]
      ? Math.round((totals[d.key] / MAX_PER_DIM[d.key]) * 100)
      : 0,
  }));

  const player = DIM_KEYS.map((k) =>
    MAX_PER_DIM[k] ? totals[k] / MAX_PER_DIM[k] : 0
  );

  const EPS = 1e-9;
  let best = -1;
  const scored = results.map((r) => {
    const sig = DIM_KEYS.map((k) => r.signature[k] ?? 0);
    // final = cosine(shape) + rarity bonus + affinity nudge from your answers
    const s =
      cosine(player, sig) +
      (BONUS[r.id] ?? 0) +
      AFFINITY_SCALE * (affinity[r.id] ?? 0);
    if (s > best) best = s;
    return { id: r.id, s };
  });

  const tied = scored.filter((x) => Math.abs(x.s - best) < EPS).map((x) => x.id);
  const resultId = tied.length === 1 ? tied[0] : tied[seed % tied.length];

  return { resultId, totals, dna };
}
