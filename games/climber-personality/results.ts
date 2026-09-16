import type { ResultType } from "@/lib/gameTypes";

// Stats shown are illustrative "signature" profiles per type. The engine also
// computes live totals; the result screen blends the winning type's signature
// with the player's own emphasis for a personal-but-consistent feel.
export const results: ResultType[] = [
  {
    id: "send",
    name: "THE SEND MACHINE",
    emoji: "🔥",
    tagline: "You don't climb. You SEND.",
    secondary: "One more attempt is never actually one more attempt.",
    accent: "#FF6B6B",
    stats: [
      { key: "send", label: "SEND", value: 94 },
      { key: "beta", label: "BETA", value: 71 },
      { key: "social", label: "SOCIAL", value: 60 },
      { key: "chill", label: "CHILL", value: 38 },
    ],
  },
  {
    id: "social",
    name: "THE SOCIAL CLIMBER",
    emoji: "🤝",
    tagline: "You came for climbing. You stayed for the people.",
    secondary: "The crew is the crux.",
    accent: "#2C7A7B",
    stats: [
      { key: "social", label: "SOCIAL", value: 94 },
      { key: "chill", label: "CHILL", value: 82 },
      { key: "adventure", label: "ADVENTURE", value: 67 },
      { key: "send", label: "SEND", value: 54 },
    ],
  },
  {
    id: "beta",
    name: "THE BETA SCIENTIST",
    emoji: "🧪",
    tagline: "You don't fall. You collect data.",
    secondary: "Every move is a hypothesis.",
    accent: "#0F2D3A",
    stats: [
      { key: "beta", label: "BETA", value: 94 },
      { key: "send", label: "SEND", value: 70 },
      { key: "social", label: "SOCIAL", value: 58 },
      { key: "adventure", label: "ADVENTURE", value: 55 },
    ],
  },
  {
    id: "adventure",
    name: "THE ADVENTURER",
    emoji: "🏔️",
    tagline: "Gym? Crag? Random Tuesday adventure? You're down.",
    secondary: "New wall, new plan, no problem.",
    accent: "#F4B942",
    stats: [
      { key: "adventure", label: "ADVENTURE", value: 94 },
      { key: "social", label: "SOCIAL", value: 80 },
      { key: "send", label: "SEND", value: 62 },
      { key: "chill", label: "CHILL", value: 55 },
    ],
  },
];
