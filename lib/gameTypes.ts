// Reusable game-engine contract. Every game under /games implements this shape,
// so the core engine (components/GameEngine.tsx) can render any of them.

export type DimensionKey = string;

export interface Answer {
  id: string; // "A" | "B" | ...
  label: string;
  // points contributed to each personality dimension
  scores: Partial<Record<DimensionKey, number>>;
}

export interface Question {
  id: string;
  prompt: string;
  answers: Answer[];
}

export interface ResultType {
  id: string; // matches a dimension key that this type "wins" on
  name: string; // "THE SOCIAL CLIMBER"
  emoji: string;
  tagline: string; // primary copy
  secondary?: string;
  // ordering of stat bars shown on the result, values 0-100
  stats: { key: DimensionKey; label: string; value: number }[];
  accent: string; // tailwind-ish hex used for gradients
}

export interface GameDefinition {
  id: string;
  title: string;
  subtitle?: string;
  dimensions: DimensionKey[];
  questions: Question[];
  results: ResultType[];
  // deterministic scoring: given answers (per question index) + seed -> result id
  score: (answerIds: string[], seed: number) => {
    resultId: string;
    totals: Record<DimensionKey, number>;
  };
}
