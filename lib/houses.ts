import type { Loc } from "./gameTypes";

// The 5 Houses: 15 archetypes collapse into 5 teams for events,
// and into a persistent identity ("I'm Zen House") without sign-up.
export interface House {
  id: string;
  name: Loc;
  slogan: Loc;
  emoji: string;
  color: string; // banner accent
  members: string[]; // archetype ids
}

export const houses: House[] = [
  {
    id: "hype",
    name: { en: "Hype House", zh: "Hype House" },
    slogan: { en: "Where the party is, we are.", zh: "哪里有派对，哪里就有我们。" },
    emoji: "🎉",
    color: "#FF8A5C",
    members: ["social-butterfly", "hype-beast", "heartbreaker"],
  },
  {
    id: "send",
    name: { en: "Send House", zh: "Send House" },
    slogan: { en: "We don't go home till we top out.", zh: "不登顶，不回家。" },
    emoji: "🧗",
    color: "#FF6B6B",
    members: ["send-machine", "project-slayer", "competitor"],
  },
  {
    id: "zen",
    name: { en: "Zen House", zh: "Zen House" },
    slogan: { en: "Climb the mind.", zh: "爬的是心境。" },
    emoji: "🍃",
    color: "#6FCF97",
    members: ["zen-master", "chiller", "flow-state"],
  },
  {
    id: "beta",
    name: { en: "Beta House", zh: "Beta House" },
    slogan: { en: "Read it first, then send.", zh: "先看懂，再出手。" },
    emoji: "🧪",
    color: "#4EA8DE",
    members: ["beta-scientist", "sensei", "gym-rat"],
  },
  {
    id: "wild",
    name: { en: "Wild House", zh: "Wild House" },
    slogan: { en: "Rules are made to be broken.", zh: "规则就是用来打破的。" },
    emoji: "🤙",
    color: "#F4B942",
    members: ["wildcard", "dirtbag", "flex-lord"],
  },
];

export function getHouseForArchetype(archetypeId: string): House {
  return houses.find((h) => h.members.includes(archetypeId)) ?? houses[0];
}

export function getHouseById(id: string | null): House | null {
  if (!id) return null;
  return houses.find((h) => h.id === id) ?? null;
}

// Zero-friction identity keys (no sign-up needed).
export const NICKNAME_KEY = "crux8-nickname";
export const HOUSE_KEY = "crux8-house";
