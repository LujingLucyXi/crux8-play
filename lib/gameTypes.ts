// Reusable game-engine contract. Every game under /games implements this shape,
// so the core engine (components/GameEngine.tsx) can render any of them.

export type Lang = "en" | "zh";

// A localized string: English + Chinese.
export interface Loc {
  en: string;
  zh: string;
}

export function L(loc: Loc, lang: Lang): string {
  return loc[lang] ?? loc.en;
}

export type DimensionKey = string;

export interface DimensionMeta {
  key: DimensionKey;
  label: Loc; // "POWER" / "力量"
  emoji: string;
}

export interface Answer {
  id: string; // "A" | "B" | ...
  label: Loc;
  scores: Partial<Record<DimensionKey, number>>;
}

export interface Question {
  id: string;
  prompt: Loc;
  answers: Answer[];
}

export interface ResultType {
  id: string;
  name: Loc; // "THE SEND MACHINE" / "冲线狂魔"
  emoji: string;
  tagline: Loc;
  secondary?: Loc;
  accent: string;
  signature: Partial<Record<DimensionKey, number>>;
}

// A single player's computed DNA bar (0-100).
export interface DnaScore {
  key: DimensionKey;
  label: Loc;
  emoji: string;
  value: number;
}

export interface ScoreResult {
  resultId: string;
  totals: Record<DimensionKey, number>;
  dna: DnaScore[];
}

export interface GameDefinition {
  id: string;
  title: Loc;
  subtitle?: Loc;
  dimensions: DimensionMeta[];
  questions: Question[];
  results: ResultType[];
  score: (answerIds: string[], seed: number) => ScoreResult;
}
