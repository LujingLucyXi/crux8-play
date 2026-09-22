"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { results } from "@/games/climber-personality/results";
import { DIMENSIONS } from "@/games/climber-personality/dimensions";
import { L, type Lang } from "@/lib/gameTypes";
import BackgroundFX from "@/components/BackgroundFX";
import Emblem from "@/components/Emblem";
import StatBar from "@/components/StatBar";
import {
  getCrewMembers,
  joinCrewWithIdentity,
  hasJoinedCrew,
  markJoinedCrew,
  setPendingCrew,
  type CrewMember,
} from "@/lib/crew";
import { loadCollection } from "@/lib/collection";
import { saveWaitlist } from "@/lib/supabase";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function topDimIdx(values: number[]): number {
  let bi = 0;
  values.forEach((v, i) => {
    if (v > (values[bi] || 0)) bi = i;
  });
  return bi;
}

// 0-100 vibe match from mean absolute DNA distance.
function vibeMatch(a: number[], b: number[]): number | null {
  if (!a.length || !b.length || a.length !== b.length) return null;
  const mean = a.reduce((s, v, i) => s + Math.abs(v - b[i]), 0) / a.length;
  return Math.max(0, Math.round(100 - mean));
}

export default function CrewBoard({ code }: { code: string }) {
  const [lang, setLang] = useState<Lang>("en");
  const [members, setMembers] = useState<CrewMember[] | null>(null);
  const [joined, setJoined] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [ownedId, setOwnedId] = useState<string | null>(null);
  const [ownedDna, setOwnedDna] = useState<number[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [activeMember, setActiveMember] = useState<CrewMember | null>(null);

  const CODE = code.toUpperCase();
  const zh = lang === "zh";

  const refresh = useCallback(async () => {
    setMembers(await getCrewMembers(CODE));
  }, [CODE]);

  useEffect(() => {
    if (/^zh/i.test(navigator.language || "")) setLang("zh");
    const c = loadCollection();
    setOwnedId(c.owned);
    setOwnedDna(c.lastDna || []);
    setJoined(hasJoinedCrew(CODE));
    try {
      const savedEmail = localStorage.getItem("crux8-email") || "";
      if (savedEmail) setEmail(savedEmail);
    } catch {
      /* ignore */
    }
    refresh();
  }, [CODE, refresh]);

  const ownedResult = ownedId ? results.find((x) => x.id === ownedId) : null;

  function handleTakeQuiz() {
    setPendingCrew(CODE);
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!ownedId || busy) return;
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail && !EMAIL_RE.test(cleanEmail)) {
      setNote(zh ? "邮箱格式不对哦" : "That email doesn't look right");
      return;
    }
    setBusy(true);
    const displayName =
      name.trim() || (ownedResult ? L(ownedResult.name, lang) : ownedId);
    const ok = await joinCrewWithIdentity(CODE, {
      archetypeId: ownedId,
      dna: ownedDna,
      displayName,
      email: cleanEmail || null,
    });
    setBusy(false);
    if (!ok) {
      setNote(zh ? "加入失败，请再试一次" : "Couldn't join — try again");
      return;
    }
    markJoinedCrew(CODE);
    setPendingCrew(null);
    setJoined(true);
    setShowForm(false);
    setNote(null);
    if (cleanEmail) {
      try {
        localStorage.setItem("crux8-email", cleanEmail);
      } catch {
        /* ignore */
      }
      // Every crew join doubles as waitlist signup (dupes are safe).
      saveWaitlist({
        email: cleanEmail,
        session_id: `crew-${CODE}-${Date.now()}`,
        result_type: ownedId,
        dna: ownedDna,
      });
    }
    refresh();
  }

  async function handleShare() {
    const url = `${window.location.origin}/crew/${CODE}`;
    const text = zh ? `加入我的攀岩小队 🧗 ${CODE}` : `Join my climbing crew 🧗 ${CODE}`;
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
      setNote(zh ? "小队链接已复制 ✨" : "Crew link copied ✨");
    } catch {
      setNote(url);
    }
  }

  const memberResult = (m: CrewMember) =>
    results.find((x) => x.id === m.archetype_id);

  return (
    <main className="relative flex min-h-dvh flex-col items-center px-6 pb-10 pt-10">
      <BackgroundFX />

      {/* Invitation hero — the test entrance comes first */}
      <p className="text-center text-xs font-bold tracking-[0.45em] text-gold">
        {zh ? "你被邀请了" : "YOU'RE INVITED"}
      </p>
      <h1 className="mt-2 text-center font-display text-2xl font-bold text-[#F5EFE0]">
        {zh ? `加入攀岩小队` : `Join climbing crew`}
      </h1>
      <p className="mt-1 font-display text-3xl font-bold tracking-[0.2em] text-gold">
        {CODE}
      </p>
      <p className="mt-2 text-center text-sm font-medium text-white/50">
        {members === null
          ? "…"
          : members.length > 0
            ? zh
              ? `已有 ${members.length} 位队员 — 测出你的人格加入他们`
              : `${members.length} climber${members.length === 1 ? "" : "s"} already in — get your card and join them`
            : zh
              ? "还没有队员 — 成为第一个"
              : "No members yet — be the first"}
      </p>

      <div className="mt-5 w-full max-w-sm">
        {joined ? (
          <p className="rounded-2xl bg-gold/10 py-4 text-center text-lg font-bold text-gold ring-1 ring-gold/40">
            {zh ? "✓ 你已在小队中" : "✓ You're in the crew"}
          </p>
        ) : !ownedId ? (
          <Link
            href="/"
            onClick={handleTakeQuiz}
            className="tap-target block w-full rounded-2xl bg-gradient-to-r from-[#F6D47C] via-[#E8B83A] to-[#B9862A] py-4 text-center text-lg font-bold text-[#1a1206] shadow-lg shadow-gold/25"
          >
            {zh ? "🧗 先测试，再加入小队" : "🧗 Take the quiz & join"}
          </Link>
        ) : !showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="tap-target w-full rounded-2xl bg-gradient-to-r from-[#F6D47C] via-[#E8B83A] to-[#B9862A] py-4 text-lg font-bold text-[#1a1206] shadow-lg shadow-gold/25"
          >
            {zh ? "🪢 加入小队" : "🪢 Join the crew"}
          </button>
        ) : (
          <form
            onSubmit={handleJoin}
            className="rounded-3xl bg-white/[0.05] p-5 ring-1 ring-white/10"
          >
            <p className="text-center text-sm font-bold text-[#F5EFE0]">
              {zh ? "介绍一下你自己" : "Introduce yourself"}
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                zh
                  ? `名字（默认：${ownedResult ? L(ownedResult.name, lang) : ""}）`
                  : `Display name (default: ${ownedResult ? L(ownedResult.name, lang) : ""})`
              }
              maxLength={24}
              className="mt-3 w-full rounded-xl bg-black/40 px-4 py-3 text-base text-white placeholder:text-white/30 ring-1 ring-white/15 focus:outline-none focus:ring-gold/60"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={zh ? "邮箱（让你的最新成绩跟着你）" : "Email (keeps your latest card with you)"}
              inputMode="email"
              autoComplete="email"
              maxLength={80}
              className="mt-2 w-full rounded-xl bg-black/40 px-4 py-3 text-base text-white placeholder:text-white/30 ring-1 ring-white/15 focus:outline-none focus:ring-gold/60"
            />
            <button
              type="submit"
              disabled={busy}
              className="tap-target mt-3 w-full rounded-2xl bg-gradient-to-r from-[#F6D47C] via-[#E8B83A] to-[#B9862A] py-3.5 text-lg font-bold text-[#1a1206] shadow-lg shadow-gold/25 disabled:opacity-50"
            >
              {busy ? "…" : zh ? "加入 ✓" : "Join ✓"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="mt-2 w-full py-2 text-center text-sm font-medium text-white/40"
            >
              {zh ? "取消" : "Cancel"}
            </button>
          </form>
        )}
        {note && <p className="mt-3 text-center text-sm font-medium text-gold">{note}</p>}
      </div>

      {/* The board — social proof below the entrance */}
      <p className="mt-8 text-center text-xs font-bold tracking-[0.3em] text-white/40">
        {zh ? "小队成员" : "THE CREW"}
      </p>
      <div className="mt-4 grid w-full max-w-sm grid-cols-3 gap-4">
        {(members || []).map((m) => {
          const r = memberResult(m);
          if (!r) return null;
          return (
            <button
              key={m.id}
              onClick={() => setActiveMember(m)}
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-full shadow-[0_0_16px_rgba(232,184,58,0.3)] ring-2 ring-gold/60 transition active:scale-95">
                <Emblem id={r.id} accent={r.accent} size={76} />
              </div>
              <p className="mt-2 max-w-[7rem] truncate text-[11px] font-bold leading-tight text-white/80">
                {m.display_name || L(r.name, lang)}
              </p>
              <p className="text-[10px] font-medium text-white/40">{L(r.name, lang)}</p>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleShare}
        className="tap-target mt-8 w-full max-w-sm rounded-2xl bg-white/10 py-4 text-lg font-bold text-white ring-1 ring-white/20"
      >
        {zh ? "📣 邀请朋友加入" : "📣 Invite friends"}
      </button>
      <Link
        href="/collection"
        className="tap-target mt-2 block w-full max-w-sm rounded-2xl py-3 text-center text-base font-medium text-white/50 hover:text-white"
      >
        {zh ? "← 我的卡片收藏" : "← My card collection"}
      </Link>

      {/* Member detail modal — the matchup moment */}
      {activeMember &&
        (() => {
          const r = memberResult(activeMember);
          if (!r) return null;
          const theirDna = activeMember.dna || [];
          const match = vibeMatch(ownedDna, theirDna);
          const theirTop =
            theirDna.length > 0 ? L(DIMENSIONS[topDimIdx(theirDna)].label, lang) : null;
          const yourTop =
            ownedDna.length > 0 ? L(DIMENSIONS[topDimIdx(ownedDna)].label, lang) : null;
          const matchupLine =
            yourTop && theirTop
              ? yourTop === theirTop
                ? zh
                  ? `双倍${yourTop}能量。`
                  : `Double ${yourTop} energy.`
                : zh
                  ? `你带来${yourTop}，${activeMember.display_name || L(r.name, lang)}带来${theirTop}。`
                  : `You bring the ${yourTop}, ${activeMember.display_name || L(r.name, lang)} brings the ${theirTop}.`
              : null;
          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
              onClick={() => setActiveMember(null)}
            >
              <div
                className="w-full max-w-sm rounded-3xl bg-[#121214] p-6 shadow-2xl ring-1 ring-gold/30"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-4">
                  <Emblem id={r.id} accent={r.accent} size={72} />
                  <div>
                    <p className="font-display text-xl font-bold text-[#F5EFE0]">
                      {activeMember.display_name || L(r.name, lang)}
                    </p>
                    <p className="text-sm font-semibold text-gold">{L(r.name, lang)}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm italic text-white/60">
                  “{L(r.tagline, lang)}”
                </p>

                {theirDna.length > 0 && (
                  <div className="mt-4 flex flex-col gap-2">
                    {theirDna.map((v, i) => (
                      <StatBar
                        key={DIMENSIONS[i].key}
                        label={`${DIMENSIONS[i].emoji} ${L(DIMENSIONS[i].label, lang)}`}
                        value={v}
                      />
                    ))}
                  </div>
                )}

                {match !== null && matchupLine && (
                  <div className="mt-4 rounded-2xl bg-gold/10 p-4 ring-1 ring-gold/30">
                    <div className="flex items-baseline justify-between">
                      <p className="text-xs font-bold tracking-[0.2em] text-white/50">
                        {zh ? "和你的契合度" : "VIBE MATCH"}
                      </p>
                      <p className="font-display text-2xl font-bold text-gold">{match}%</p>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-[#F5EFE0]">{matchupLine}</p>
                  </div>
                )}

                <button
                  onClick={() => setActiveMember(null)}
                  className="tap-target mt-4 w-full rounded-2xl bg-white/10 py-3 text-base font-bold text-white"
                >
                  {zh ? "关闭" : "Close"}
                </button>
              </div>
            </div>
          );
        })()}
    </main>
  );
}
