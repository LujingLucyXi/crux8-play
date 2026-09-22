import { results } from "@/games/climber-personality/results";
import { loadCollection, discoveredCount, isFoil } from "./collection";
import { getCreatedCrews, getJoinedCrews } from "./crew";

// Crux Gold: the collection's points game. Points are fully DERIVED from
// collection state (no ledger to corrupt):
//   +50 per unique card discovered, +100 per gold foil,
//   + milestone bonuses below (one-time each).

export interface MilestoneContext {
  discovered: number; // unique cards owned or spotted
  spotted: number; // spotted via friends' links
  foils: number; // archetypes landed 3+ times
  crewsCreated: number;
  crewsJoined: number;
}

export interface Milestone {
  id: string;
  icon: string;
  name: { en: string; zh: string };
  desc: { en: string; zh: string };
  points: number;
  achieved: (ctx: MilestoneContext) => boolean;
}

export const MILESTONES: Milestone[] = [
  {
    id: "first-card",
    icon: "🌱",
    name: { en: "First Card", zh: "第一张卡" },
    desc: { en: "Own or spot your first card", zh: "拥有或发现第一张卡" },
    points: 25,
    achieved: (c) => c.discovered >= 1,
  },
  {
    id: "social-climber",
    icon: "👀",
    name: { en: "Social Climber", zh: "社交达人" },
    desc: { en: "Spot 3 cards from friends' links", zh: "通过朋友的链接发现 3 张卡" },
    points: 75,
    achieved: (c) => c.spotted >= 3,
  },
  {
    id: "explorer",
    icon: "🧭",
    name: { en: "Explorer", zh: "探险家" },
    desc: { en: "Discover 6 unique cards", zh: "发现 6 种不同的卡" },
    points: 100,
    achieved: (c) => c.discovered >= 6,
  },
  {
    id: "crew-mate",
    icon: "🪢",
    name: { en: "Crew Mate", zh: "小队成员" },
    desc: { en: "Join a climbing crew", zh: "加入一个攀岩小队" },
    points: 50,
    achieved: (c) => c.crewsJoined >= 1,
  },
  {
    id: "crew-founder",
    icon: "🏴",
    name: { en: "Crew Founder", zh: "小队创始人" },
    desc: { en: "Start a climbing crew", zh: "创建一个攀岩小队" },
    points: 100,
    achieved: (c) => c.crewsCreated >= 1,
  },
  {
    id: "gold-foil",
    icon: "✨",
    name: { en: "Gold Foil", zh: "金箔收藏家" },
    desc: { en: "Land the same card 3 times", zh: "同一张卡抽中 3 次" },
    points: 150,
    achieved: (c) => c.foils >= 1,
  },
  {
    id: "collector",
    icon: "💎",
    name: { en: "Collector", zh: "收藏家" },
    desc: { en: "Discover 10 unique cards", zh: "发现 10 种不同的卡" },
    points: 200,
    achieved: (c) => c.discovered >= 10,
  },
  {
    id: "completionist",
    icon: "👑",
    name: { en: "Completionist", zh: "全收集大师" },
    desc: { en: "Discover all 15 cards", zh: "发现全部 15 张卡" },
    points: 500,
    achieved: (c) => c.discovered >= 15,
  },
];

const UNLOCKED_KEY = "crux8-milestones-unlocked";

export function getMilestoneContext(): MilestoneContext {
  const col = loadCollection();
  return {
    discovered: discoveredCount(col),
    spotted: col.spotted.length,
    foils: results.filter((r) => isFoil(col, r.id)).length,
    crewsCreated: getCreatedCrews().length,
    crewsJoined: getJoinedCrews().length,
  };
}

export function achievedMilestones(ctx?: MilestoneContext): Milestone[] {
  const c = ctx || getMilestoneContext();
  return MILESTONES.filter((m) => m.achieved(c));
}

export function totalPoints(ctx?: MilestoneContext): number {
  const c = ctx || getMilestoneContext();
  const base = c.discovered * 50 + c.foils * 100;
  return base + achievedMilestones(c).reduce((s, m) => s + m.points, 0);
}

// Returns milestones unlocked since the last check (and persists the set).
export function checkNewUnlocks(): Milestone[] {
  let prev: string[] = [];
  try {
    prev = JSON.parse(localStorage.getItem(UNLOCKED_KEY) || "[]");
    if (!Array.isArray(prev)) prev = [];
  } catch {
    prev = [];
  }
  const achieved = achievedMilestones().map((m) => m.id);
  const fresh = achieved.filter((id) => !prev.includes(id));
  try {
    localStorage.setItem(UNLOCKED_KEY, JSON.stringify(achieved));
  } catch {
    /* ignore */
  }
  return MILESTONES.filter((m) => fresh.includes(m.id));
}
