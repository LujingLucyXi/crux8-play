import type { DimensionMeta } from "@/lib/gameTypes";

// The 6 axes of your Climber DNA. Order here = display order on the DNA card.
export const DIMENSIONS: DimensionMeta[] = [
  { key: "power", label: { en: "POWER", zh: "力量" }, emoji: "💪" },
  { key: "beta", label: { en: "BETA", zh: "技术" }, emoji: "🧠" },
  { key: "social", label: { en: "SOCIAL", zh: "社交" }, emoji: "🤝" },
  { key: "adventure", label: { en: "ADVENTURE", zh: "冒险" }, emoji: "🧭" },
  { key: "chill", label: { en: "CHILL", zh: "佛系" }, emoji: "🧘" },
  { key: "stoke", label: { en: "STOKE", zh: "热情" }, emoji: "🔥" },
];

export const DIM_KEYS = DIMENSIONS.map((d) => d.key);
