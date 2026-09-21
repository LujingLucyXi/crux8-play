"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { DnaScore, Lang, ResultType } from "@/lib/gameTypes";
import { L } from "@/lib/gameTypes";
import { tr } from "@/lib/i18n";
import StatBar from "./StatBar";
import BackgroundFX from "./BackgroundFX";
import EmailCapture from "./EmailCapture";
import Emblem from "./Emblem";

// Lightens a hex color if it's too dark to read on the near-black background.
function onDark(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  if (lum >= 0.45) return hex;
  const f = Math.min(0.45 + (0.45 - lum), 0.85);
  const mix = (v: number) => Math.round(v + (255 - v) * f);
  return (
    "#" +
    [r, g, b].map((v) => mix(v).toString(16).padStart(2, "0")).join("")
  );
}

// The card pull: the result starts face-down as a gold Crux8 card.
// One tap flips it to reveal your archetype — then the DNA + actions fade in.
export default function ResultScreen({
  result,
  dna,
  lang,
  onShareClick,
  onShareSuccess,
  onInvite,
  onPlayAgain,
  onWaitlist,
}: {
  result: ResultType;
  dna: DnaScore[];
  lang: Lang;
  onShareClick: () => void;
  onShareSuccess: () => void;
  onInvite: () => void;
  onPlayAgain: () => void;
  onWaitlist: (email: string) => Promise<boolean>;
}) {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [details, setDetails] = useState(false);

  // Server-rendered PNG (reliable on every device). Includes language.
  function cardUrl(): string {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const s = dna.map((d) => d.value).join(",");
    return `${origin}/api/card?r=${encodeURIComponent(result.id)}&s=${s}&l=${lang}`;
  }

  async function handleShare() {
    onShareClick();
    setBusy(true);
    setNote(null);
    const shareText =
      lang === "zh"
        ? `我在 Crux8 Play 的攀岩人格是「${L(result.name, "zh")}」🧗 你是哪种攀岩搭子？`
        : `I'm ${L(result.name, "en")} on Crux8 Play 🧗 What's your Climber DNA?`;
    const nav = navigator as Navigator & { canShare?: (d?: ShareData) => boolean };
    try {
      const res = await fetch(cardUrl());
      const blob = await res.blob();
      const file = new File([blob], "crux8-climber-dna.png", { type: "image/png" });
      setBusy(false);
      if (nav.canShare && nav.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text: shareText, title: "Crux8 Play" });
        onShareSuccess();
        return;
      }
      downloadBlob(blob);
      onShareSuccess();
      setNote(tr("savedShareNote", lang));
    } catch {
      setBusy(false);
      if (navigator.share) {
        try {
          await navigator.share({ text: shareText, url: window.location.origin });
          onShareSuccess();
          return;
        } catch {
          /* ignore */
        }
      }
      setNote(tr("screenshotNote", lang));
    }
  }

  async function handleDownload() {
    setNote(null);
    try {
      const res = await fetch(cardUrl());
      const blob = await res.blob();
      downloadBlob(blob);
      onShareSuccess();
      setNote(tr("savedNote", lang));
    } catch {
      window.open(cardUrl(), "_blank");
    }
  }

  async function handleInvite() {
    onInvite();
    const url = typeof window !== "undefined" ? window.location.origin : "https://play.crux8.app";
    const text =
      lang === "zh"
        ? "来测测你是哪种攀岩搭子 🧗 你的攀岩 DNA 是？"
        : "What's your Climber DNA? 🧗 Take the Crux8 quiz:";
    if (navigator.share) {
      try {
        await navigator.share({ title: "Crux8 Play", text, url });
        return;
      } catch {
        /* cancelled — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setNote(tr("inviteCopied", lang));
    } catch {
      setNote(url);
    }
  }

  function downloadBlob(blob: Blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "crux8-climber-dna.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const accentText = onDark(result.accent);

  return (
    <div className="relative flex flex-1 flex-col px-6 pb-8 pt-8">
      <BackgroundFX />

      <p className="text-center text-sm font-semibold tracking-[0.3em] text-white/50">
        {flipped ? tr("youAre", lang) : tr("yourCard", lang)}
      </p>

      {/* Card flip: gold back <-> archetype hero */}
      <div className="mt-4" style={{ perspective: 1200 }}>
        <motion.div
          className="relative"
          style={{ transformStyle: "preserve-3d" }}
          initial={false}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.3, 1] }}
          onAnimationComplete={() => {
            if (flipped) setDetails(true);
          }}
        >
          {/* Front: face-down gold card (taller face drives layout via back, so center it) */}
          <div className="absolute inset-0 flex items-center justify-center [backface-visibility:hidden]">
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setFlipped(true)}
              className="tap-target"
              aria-label={tr("revealTap", lang)}
            >
              <motion.div
                className="w-60 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#FFD97A] via-gold to-coral p-[3px] shadow-2xl shadow-gold/40"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="relative flex h-[330px] w-full flex-col items-center justify-between overflow-hidden rounded-[25px] bg-[#0d0d10] px-5 py-6">
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.16]"
                    style={{
                      background:
                        "repeating-linear-gradient(135deg, transparent 0 14px, rgba(255,255,255,0.9) 14px 16px)",
                    }}
                    aria-hidden
                  />
                  <div className="relative text-xs font-bold tracking-[0.45em] text-gold">
                    CRUX8
                  </div>
                  <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-gold/80">
                    <span className="font-display text-5xl font-bold text-gold">?</span>
                  </div>
                  <div className="relative text-[10px] font-semibold tracking-[0.5em] text-white/50">
                    PLAY
                  </div>
                </div>
              </motion.div>
            </motion.button>
          </div>

          {/* Back: the revealed archetype hero (in normal flow, sets height) */}
          <div className="[backface-visibility:hidden] [transform:rotateY(180deg)]">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 14 }}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.35 }}
              >
                <Emblem id={result.id} accent={result.accent} />
              </motion.div>
              <h1
                className="mt-2 font-display text-3xl font-bold leading-tight"
                style={{ color: accentText }}
              >
                {L(result.name, lang)}
              </h1>
              <p className="mx-auto mt-2 max-w-xs text-lg font-semibold text-[#F5EFE0]">
                “{L(result.tagline, lang)}”
              </p>
              {result.secondary && (
                <p className="mt-2 max-w-xs text-sm text-white/60">{L(result.secondary, lang)}</p>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {!flipped && (
        <motion.p
          className="mt-5 text-center text-sm font-bold tracking-[0.2em] text-gold"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          {tr("revealTap", lang)}
        </motion.p>
      )}

      {/* DNA + actions fade in after the flip */}
      <AnimatePresence>
        {details && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mt-6">
              <p className="mb-3 text-center text-sm font-semibold tracking-[0.2em] text-white/50">
                {tr("yourDna", lang)}
              </p>
              <div className="flex flex-col gap-3 rounded-3xl bg-white/[0.05] p-5 shadow-lg shadow-black/40 ring-1 ring-white/10">
                {dna.map((s, i) => (
                  <StatBar
                    key={s.key}
                    label={`${s.emoji} ${L(s.label, lang)}`}
                    value={s.value}
                    delay={0.2 + i * 0.12}
                  />
                ))}
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-white/60">{tr("sendToPartner", lang)}</p>

            <div className="mt-3 flex flex-col gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleShare}
                disabled={busy}
                className="tap-target w-full rounded-2xl bg-gradient-to-r from-[#F6D47C] via-[#E8B83A] to-[#B9862A] py-4 text-lg font-bold text-[#1a1206] shadow-lg shadow-gold/25 disabled:opacity-70"
              >
                {busy ? tr("building", lang) : tr("share", lang)}
              </motion.button>
              <p className="-mt-1 text-center text-xs text-white/45">{tr("shareHint", lang)}</p>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleDownload}
                className="tap-target w-full rounded-2xl border-2 border-white/15 bg-white/5 py-3.5 text-base font-bold text-[#F5EFE0]"
              >
                {tr("save", lang)}
              </motion.button>
              <p className="-mt-1 text-center text-xs text-white/45">{tr("saveHint", lang)}</p>

              {note && <p className="text-center text-sm font-medium text-gold">{note}</p>}

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleInvite}
                className="tap-target w-full rounded-2xl border-2 border-gold/50 bg-gold/10 py-3.5 text-base font-bold text-gold"
              >
                {tr("invite", lang)}
              </motion.button>

              <EmailCapture lang={lang} onSubmit={onWaitlist} />

              <button
                onClick={onPlayAgain}
                className="tap-target w-full rounded-2xl py-3 text-base font-medium text-white/50 hover:text-white"
              >
                {tr("playAgain", lang)}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
