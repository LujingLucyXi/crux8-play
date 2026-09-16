import type { DimensionMeta } from "@/lib/gameTypes";

// The 6 axes of your Climber DNA. Order here = display order on the DNA card.
export const DIMENSIONS: DimensionMeta[] = [
  { key: "power", label: "POWER", emoji: "💪" },
  { key: "beta", label: "BETA", emoji: "🧠" },
  { key: "social", label: "SOCIAL", emoji: "🤝" },
  { key: "adventure", label: "ADVENTURE", emoji: "🧭" },
  { key: "chill", label: "CHILL", emoji: "🧘" },
  { key: "stoke", label: "STOKE", emoji: "🔥" },
];

export const DIM_KEYS = DIMENSIONS.map((d) => d.key);
