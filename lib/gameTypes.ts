// Reusable game-engine contract. Every game under /games implements this shape,
// so the core engine (components/GameEngine.tsx) can render any of them.

export type DimensionKey = string;

export interface DimensionMeta {
  key: DimensionKey;
  label: string; // "POWER"
  emoji: string;
}

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
  id: string;
  name: string; // "THE SEND MACHINE"
  emoji: string;
  tagline: string; // primary copy
  secondary?: string; // fun/jokable line
  accent: string; // hex used for gradients
  // signature DNA vector (0-1 weight per dimension) used for matching
  signature: Partial<Record<DimensionKey, number>>;
}

// A single player's computed DNA bar (0-100).
export interface DnaScore {
  key: DimensionKey;
  label: string;
  emoji: string;
  value: number;
}

export interface ScoreResult {
  resultId: string;
  totals: Record<DimensionKey, number>;
  dna: DnaScore[]; // player's own 0-100 breakdown, in dimension order
}

export interface GameDefinition {
  id: string;
  title: string;
  subtitle?: string;
  dimensions: DimensionMeta[];
  questions: Question[];
  results: ResultType[];
  // deterministic scoring: given answers (per question index) + seed -> result
  score: (answerIds: string[], seed: number) => ScoreResult;
}
