"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { results } from "@/games/climber-personality/results";
import { L, type Lang } from "@/lib/gameTypes";
import BackgroundFX from "@/components/BackgroundFX";
import Emblem from "@/components/Emblem";
import {
  loadCollection,
  isFoil,
  discoveredCount,
  type Collection,
} from "@/lib/collection";
import { makeCrewCode, createCrew, markCreatedCrew } from "@/lib/crew";
import {
  MILESTONES,
  achievedMilestones,
  totalPoints,
  checkNewUnlocks,
  type Milestone,
} from "@/lib/milestones";

const T = {
  title: { en: "Card Collection", zh: "卡片收藏" },
  discovered: { en: "discovered", zh: "已发现" },
  yours: { en: "YOURS", zh: "你的" },
  spotted: { en: "SPOTTED", zh: "偶遇" },
  foil: { en: "✦ GOLD FOIL", zh: "✦ 金箔版" },
  unknown: { en: "???", zh: "???" },
  hint: {
    en: "Spot new archetypes by opening cards your friends share.",
    zh: "打开朋友分享的卡片，就能发现新的类型。",
  },
  shareCta: { en: "🃏 Share my card to be spotted", zh: "🃏 分享我的卡片" },
  almostThere: { en: "Only {n} to go!", zh: "还差 {n} 张！" },
  oneMore: { en: "One more card to complete the set!", zh: "再来一张就集齐了！" },
  fullSet: { en: "✦ FULL SET COMPLETE ✦", zh: "✦ 全套收集完成 ✦" },
  fullSetSub: {
    en: "All 15 climber cards. Legend of the wall.",
    zh: "15 张卡片全部集齐，你是岩壁传奇。",
  },
  shareFullSet: { en: "✦ Share my full set", zh: "✦ 分享我的全套收藏" },
  fullSetShared: { en: "Full set shared ✨", zh: "已分享 ✨" },
  cruxGold: { en: "Crux Gold", zh: "Crux 金币" },
  milestonesTitle: { en: "Milestones", zh: "成就" },
  unlockedNow: { en: "Milestone unlocked!", zh: "解锁新成就！" },
  startCrew: { en: "🪢 Start a climbing crew", zh: "🪢 创建攀岩小队" },
  crewFail: {
    en: "Couldn't create the crew — is the database set up?",
    zh: "创建失败 — 数据库设置好了吗？",
  },
  back: { en: "← Back to the quiz", zh: "← 返回测试" },
  copied: { en: "Link copied — go be spotted ✨", zh: "链接已复制 ✨" },
} as const;

export default function CollectionPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [col, setCol] = useState<Collection | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [crewBusy, setCrewBusy] = useState(false);
  const [points, setPoints] = useState(0);
  const [newUnlocks, setNewUnlocks] = useState<Milestone[]>([]);
  const [achievedIds, setAchievedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (/^zh/i.test(navigator.language || "")) setLang("zh");
    setCol(loadCollection());
    setPoints(totalPoints());
    setNewUnlocks(checkNewUnlocks());
    setAchievedIds(new Set(achievedMilestones().map((m) => m.id)));
  }, []);

  const t = (k: keyof typeof T) => T[k][lang];
  const found = col ? discoveredCount(col) : 0;

  async function handleStartCrew() {
    if (!col?.owned || crewBusy) return;
    setCrewBusy(true);
    const code = makeCrewCode();
    const ok = await createCrew(code, col.owned, col.lastDna || []);
    setCrewBusy(false);
    if (ok) {
      markCreatedCrew(code);
      window.location.href = `/crew/${code}`;
    } else {
      setNote(t("crewFail"));
    }
  }

  async function handleShareFullSet() {
    const text =
      lang === "zh"
        ? `我集齐了全部 15 张 Crux8 攀岩人格卡片 ✦ 你是哪种？`
        : `I collected all 15 Crux8 climber cards ✦ What's your archetype?`;
    const url = window.location.origin;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Crux8 Play", text, url });
        return;
      } catch {
        /* cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setNote(t("fullSetShared"));
    } catch {
      setNote(`${text} ${url}`);
    }
  }

  async function handleShare() {
    if (!col?.owned) return;
    const s = (col.lastDna || []).join(",");
    const url = `${window.location.origin}/c/${col.owned}?s=${s}&l=${lang}`;
    const text =
      lang === "zh" ? `我的攀岩人格卡片 🧗 打开看看你是哪种？` : `My climber card 🧗 What's your archetype?`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Crux8 Play", text, url });
        return;
      } catch {
        /* cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setNote(t("copied"));
    } catch {
      setNote(url);
    }
  }

  return (
    <main className="relative flex min-h-dvh flex-col items-center px-6 pb-10 pt-10">
      <BackgroundFX />

      <p className="text-center text-xs font-bold tracking-[0.45em] text-gold">
        CRUX8 PLAY
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold text-[#F5EFE0]">
        {t("title")}
      </h1>

      {/* Crux Gold balance */}
      <div className="mt-3 flex items-center gap-2 rounded-full bg-gold/10 px-4 py-2 ring-1 ring-gold/40">
        <span className="text-lg">🪙</span>
        <span className="font-display text-lg font-bold text-gold">{points}</span>
        <span className="text-xs font-semibold tracking-wide text-gold/70">
          {t("cruxGold")}
        </span>
      </div>

      {/* Fresh milestone unlocks */}
      {newUnlocks.length > 0 && (
        <div className="mt-4 w-full max-w-sm rounded-3xl bg-gradient-to-br from-[#F6D47C]/25 via-gold/10 to-transparent p-4 text-center ring-1 ring-gold/50">
          <p className="text-sm font-bold tracking-wide text-gold">{t("unlockedNow")}</p>
          {newUnlocks.map((m) => (
            <p key={m.id} className="mt-1 text-sm font-semibold text-[#F5EFE0]">
              {m.icon} {m.name[lang]} <span className="text-gold">+{m.points} 🪙</span>
            </p>
          ))}
        </div>
      )}

      {/* Progress */}
      <div className="mt-4 w-full max-w-sm">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm font-semibold text-white/60">
            {found}/15 {t("discovered")}
          </span>
          <span className="font-display text-lg font-bold text-gold">
            {Math.round((found / 15) * 100)}%
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#8a6a1f] via-[#E8B83A] to-[#F6D47C] transition-all duration-700"
            style={{ width: `${(found / 15) * 100}%` }}
          />
        </div>
      </div>

      {/* Incentives: the itch, and the payoff */}
      {found < 15 ? (
        <p className="mt-3 text-sm font-semibold text-gold/90">
          {found === 14
            ? t("oneMore")
            : t("almostThere").replace("{n}", String(15 - found))}
        </p>
      ) : (
        <div className="mt-4 w-full max-w-sm rounded-3xl bg-gradient-to-br from-[#F6D47C]/25 via-gold/10 to-transparent p-5 text-center shadow-[0_0_30px_rgba(246,212,124,0.25)] ring-1 ring-gold/50">
          <p className="font-display text-lg font-bold tracking-wide text-gold">
            {t("fullSet")}
          </p>
          <p className="mt-1 text-sm text-white/60">{t("fullSetSub")}</p>
          <button
            onClick={handleShareFullSet}
            className="tap-target mt-3 w-full rounded-2xl bg-gradient-to-r from-[#F6D47C] via-[#E8B83A] to-[#B9862A] py-3 text-base font-bold text-[#1a1206] shadow-lg shadow-gold/25"
          >
            {t("shareFullSet")}
          </button>
        </div>
      )}

      {/* Dex grid */}
      <div className="mt-6 grid w-full max-w-sm grid-cols-3 gap-4">
        {results.map((r) => {
          const owned = col?.owned === r.id;
          const spotted = !!col?.spotted.includes(r.id);
          const foil = !!col && owned && isFoil(col, r.id);
          return (
            <div key={r.id} className="flex flex-col items-center text-center">
              <div
                className={[
                  "flex h-24 w-24 items-center justify-center rounded-full transition",
                  owned
                    ? foil
                      ? "shadow-[0_0_24px_rgba(246,212,124,0.55)] ring-2 ring-[#F6D47C]"
                      : "shadow-[0_0_16px_rgba(232,184,58,0.35)] ring-2 ring-gold/70"
                    : spotted
                      ? "opacity-70 saturate-[0.6] ring-1 ring-white/20"
                      : "bg-white/[0.04] ring-1 ring-white/10",
                ].join(" ")}
              >
                {owned || spotted ? (
                  <Emblem id={r.id} accent={r.accent} size={76} />
                ) : (
                  <span className="font-display text-3xl font-bold text-white/20">?</span>
                )}
              </div>
              <p
                className={`mt-2 text-[11px] font-bold leading-tight ${
                  owned ? "text-gold" : spotted ? "text-white/70" : "text-white/25"
                }`}
              >
                {owned || spotted ? L(r.name, lang) : t("unknown")}
              </p>
              <p
                className={`text-[10px] font-semibold tracking-[0.15em] ${
                  foil ? "text-[#F6D47C]" : owned ? "text-gold/80" : "text-white/30"
                }`}
              >
                {foil ? t("foil") : owned ? t("yours") : spotted ? t("spotted") : ""}
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-6 max-w-xs text-center text-xs text-white/45">{t("hint")}</p>

      {/* Milestones */}
      <p className="mt-8 text-center text-xs font-bold tracking-[0.3em] text-white/40">
        {t("milestonesTitle")}
      </p>
      <div className="mt-3 grid w-full max-w-sm grid-cols-2 gap-3">
        {MILESTONES.map((m) => {
          const done = achievedIds.has(m.id);
          return (
            <div
              key={m.id}
              className={[
                "rounded-2xl p-3 ring-1",
                done
                  ? "bg-gold/10 ring-gold/40"
                  : "bg-white/[0.03] ring-white/10 opacity-60",
              ].join(" ")}
            >
              <p className="text-lg">{done ? m.icon : "🔒"}</p>
              <p
                className={`mt-1 text-sm font-bold ${done ? "text-gold" : "text-white/60"}`}
              >
                {m.name[lang]}
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-white/45">
                {m.desc[lang]}
              </p>
              <p
                className={`mt-1 text-xs font-bold ${done ? "text-gold" : "text-white/35"}`}
              >
                +{m.points} 🪙
              </p>
            </div>
          );
        })}
      </div>

      {col?.owned && (
        <>
          <button
            onClick={handleShare}
            className="tap-target mt-4 w-full max-w-sm rounded-2xl bg-gradient-to-r from-[#F6D47C] via-[#E8B83A] to-[#B9862A] py-4 text-lg font-bold text-[#1a1206] shadow-lg shadow-gold/25"
          >
            {t("shareCta")}
          </button>
          <button
            onClick={handleStartCrew}
            disabled={crewBusy}
            className="tap-target mt-3 w-full max-w-sm rounded-2xl bg-white/10 py-4 text-lg font-bold text-white ring-1 ring-white/20 disabled:opacity-50"
          >
            {crewBusy ? "…" : t("startCrew")}
          </button>
        </>
      )}
      {note && <p className="mt-3 text-center text-sm font-medium text-gold">{note}</p>}

      <Link
        href="/"
        className="tap-target mt-6 rounded-2xl py-3 text-base font-medium text-white/50 hover:text-white"
      >
        {t("back")}
      </Link>
    </main>
  );
}
