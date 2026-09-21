"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Emblem from "@/components/Emblem";
import { DIMENSIONS } from "@/games/climber-personality/dimensions";
import { results } from "@/games/climber-personality/results";
import { L, type Lang } from "@/lib/gameTypes";
import { spotArchetype, loadCollection } from "@/lib/collection";

// Client-side extras on a shared card (/c/[id]):
// 1. Marks the viewed archetype as SPOTTED in your collection (with a toast).
// 2. If you have your own card, shows the "matchup" — the quiz-era seed of
//    the real app's match-and-swap.
export default function SharedExtras({
  id,
  dnaValues,
  lang,
}: {
  id: string;
  dnaValues: number[];
  lang: Lang;
}) {
  const [spottedNew, setSpottedNew] = useState(false);
  const [ownedId, setOwnedId] = useState<string | null>(null);
  const [ownedDna, setOwnedDna] = useState<number[]>([]);

  useEffect(() => {
    const { isNew } = spotArchetype(id);
    setSpottedNew(isNew);
    const c = loadCollection();
    if (c.owned && c.owned !== id) {
      setOwnedId(c.owned);
      setOwnedDna(c.lastDna || []);
    }
  }, [id]);

  const viewed = results.find((x) => x.id === id) || results[0];
  const owned = ownedId ? results.find((x) => x.id === ownedId) : null;

  function topDimLabel(values: number[]): string {
    let bi = 0;
    values.forEach((v, i) => {
      if (v > (values[bi] || 0)) bi = i;
    });
    return L(DIMENSIONS[bi]?.label || DIMENSIONS[0].label, lang);
  }

  const matchupLine =
    owned && ownedDna.length > 0 && dnaValues.length > 0
      ? (() => {
          const a = topDimLabel(ownedDna);
          const b = topDimLabel(dnaValues);
          if (a === b)
            return lang === "zh" ? `双倍${a}能量。` : `Double ${a} energy.`;
          return lang === "zh"
            ? `你带来${a}，他们带来${b}。`
            : `You bring the ${a}, they bring the ${b}.`;
        })()
      : null;

  if (!spottedNew && !matchupLine) return null;

  return (
    <div className="mt-4 flex w-full max-w-sm flex-col gap-3">
      {spottedNew && (
        <div className="rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3 text-center">
          <p className="text-sm font-bold text-gold">
            {lang === "zh" ? "🃏 发现新卡片！" : "🃏 New card spotted!"}
          </p>
          <Link
            href="/collection"
            className="mt-1 inline-block text-sm font-semibold text-gold/90 underline underline-offset-2"
          >
            {lang === "zh" ? "去看看我的收藏 →" : "View my collection →"}
          </Link>
        </div>
      )}

      {owned && matchupLine && (
        <div className="rounded-3xl bg-white/[0.05] p-4 shadow-lg shadow-black/40 ring-1 ring-white/10">
          <p className="text-center text-xs font-bold tracking-[0.3em] text-white/50">
            {lang === "zh" ? "你们的组合" : "YOUR MATCHUP"}
          </p>
          <div className="mt-3 flex items-center justify-center gap-3">
            <Emblem id={owned.id} accent={owned.accent} size={64} />
            <span className="font-display text-2xl font-bold text-gold">×</span>
            <Emblem id={viewed.id} accent={viewed.accent} size={64} />
          </div>
          <p className="mt-3 text-center text-sm font-semibold text-[#F5EFE0]">
            {matchupLine}
          </p>
          <p className="mt-1 text-center text-xs text-white/45">
            {lang === "zh"
              ? "完整组队玩法即将在 Crux8 App 上线"
              : "Full crew matchups are coming to the Crux8 app"}
          </p>
        </div>
      )}
    </div>
  );
}
