"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { results } from "@/games/climber-personality/results";
import { L, type Lang } from "@/lib/gameTypes";
import BackgroundFX from "@/components/BackgroundFX";
import Emblem from "@/components/Emblem";
import {
  getCrewMembers,
  joinCrew,
  hasJoinedCrew,
  markJoinedCrew,
  setPendingCrew,
  type CrewMember,
} from "@/lib/crew";
import { loadCollection } from "@/lib/collection";

export default function CrewBoard({ code }: { code: string }) {
  const [lang, setLang] = useState<Lang>("en");
  const [members, setMembers] = useState<CrewMember[] | null>(null);
  const [joined, setJoined] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [ownedId, setOwnedId] = useState<string | null>(null);
  const [ownedDna, setOwnedDna] = useState<number[]>([]);

  const CODE = code.toUpperCase();

  const refresh = useCallback(async () => {
    const m = await getCrewMembers(CODE);
    setMembers(m);
  }, [CODE]);

  useEffect(() => {
    if (/^zh/i.test(navigator.language || "")) setLang("zh");
    const c = loadCollection();
    setOwnedId(c.owned);
    setOwnedDna(c.lastDna || []);
    setJoined(hasJoinedCrew(CODE));
    refresh();
  }, [CODE, refresh]);

  async function handleJoin() {
    if (!ownedId || busy) return;
    setBusy(true);
    const ok = await joinCrew(CODE, ownedId, ownedDna);
    setBusy(false);
    if (ok) {
      markJoinedCrew(CODE);
      setPendingCrew(null);
      setJoined(true);
      refresh();
    } else {
      setNote(lang === "zh" ? "加入失败，请再试一次" : "Couldn't join — try again");
    }
  }

  function handleTakeQuiz() {
    setPendingCrew(CODE);
  }

  async function handleShare() {
    const url = `${window.location.origin}/crew/${CODE}`;
    const text =
      lang === "zh" ? `加入我的攀岩小队 🧗 ${CODE}` : `Join my climbing crew 🧗 ${CODE}`;
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
      setNote(lang === "zh" ? "小队链接已复制 ✨" : "Crew link copied ✨");
    } catch {
      setNote(url);
    }
  }

  const zh = lang === "zh";

  return (
    <main className="relative flex min-h-dvh flex-col items-center px-6 pb-10 pt-10">
      <BackgroundFX />

      <p className="text-center text-xs font-bold tracking-[0.45em] text-gold">
        {zh ? "攀岩小队" : "CLIMBING CREW"}
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-[0.2em] text-[#F5EFE0]">
        {CODE}
      </h1>
      <p className="mt-1 text-sm font-medium text-white/50">
        {members === null
          ? "…"
          : zh
            ? `${members.length} 位队员`
            : `${members.length} climber${members.length === 1 ? "" : "s"} in`}
      </p>

      {/* Board */}
      <div className="mt-6 grid w-full max-w-sm grid-cols-3 gap-4">
        {(members || []).map((m) => {
          const r = results.find((x) => x.id === m.archetype_id);
          if (!r) return null;
          return (
            <div key={m.id} className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full shadow-[0_0_16px_rgba(232,184,58,0.3)] ring-2 ring-gold/60">
                <Emblem id={r.id} accent={r.accent} size={76} />
              </div>
              <p className="mt-2 text-[11px] font-bold leading-tight text-white/75">
                {L(r.name, lang)}
              </p>
            </div>
          );
        })}
      </div>
      {members !== null && members.length === 0 && (
        <p className="mt-6 max-w-xs text-center text-sm text-white/45">
          {zh ? "小队还是空的 — 成为第一个加入的人。" : "This crew is empty — be the first in."}
        </p>
      )}

      {/* Join / take quiz */}
      <div className="mt-8 w-full max-w-sm">
        {joined ? (
          <p className="rounded-2xl bg-gold/10 py-4 text-center text-lg font-bold text-gold ring-1 ring-gold/40">
            {zh ? "✓ 你已在小队中" : "✓ You're in the crew"}
          </p>
        ) : ownedId ? (
          <button
            onClick={handleJoin}
            disabled={busy}
            className="tap-target w-full rounded-2xl bg-gradient-to-r from-[#F6D47C] via-[#E8B83A] to-[#B9862A] py-4 text-lg font-bold text-[#1a1206] shadow-lg shadow-gold/25 disabled:opacity-50"
          >
            {busy ? "…" : zh ? "🪢 加入小队" : "🪢 Join the crew"}
          </button>
        ) : (
          <Link
            href="/"
            onClick={handleTakeQuiz}
            className="tap-target block w-full rounded-2xl bg-gradient-to-r from-[#F6D47C] via-[#E8B83A] to-[#B9862A] py-4 text-center text-lg font-bold text-[#1a1206] shadow-lg shadow-gold/25"
          >
            {zh ? "先测出你的人格再加入 🧗" : "Get your card to join 🧗"}
          </Link>
        )}
        {note && <p className="mt-3 text-center text-sm font-medium text-gold">{note}</p>}

        <button
          onClick={handleShare}
          className="tap-target mt-3 w-full rounded-2xl bg-white/10 py-4 text-lg font-bold text-white ring-1 ring-white/20"
        >
          {zh ? "📣 邀请朋友加入" : "📣 Invite friends"}
        </button>
        <Link
          href="/collection"
          className="tap-target mt-2 block w-full rounded-2xl py-3 text-center text-base font-medium text-white/50 hover:text-white"
        >
          {zh ? "← 我的卡片收藏" : "← My card collection"}
        </Link>
      </div>
    </main>
  );
}
