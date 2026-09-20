"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { DnaScore, Lang, ResultType } from "@/lib/gameTypes";
import { L } from "@/lib/gameTypes";
import { tr } from "@/lib/i18n";
import StatBar from "./StatBar";
import BackgroundFX from "./BackgroundFX";
import EmailCapture from "./EmailCapture";
import Emblem from "./Emblem";

// Darkens a hex color if it's too light to read on the cream background.
function readable(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  if (lum <= 0.6) return hex;
  const f = 0.52;
  return (
    "#" +
    [r, g, b].map((v) => Math.round(v * f).toString(16).padStart(2, "0")).join("")
  );
}

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

  const accentText = readable(result.accent);

  return (
    <div className="relative flex flex-1 flex-col px-6 pb-8 pt-8">
      <BackgroundFX />

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="text-sm font-semibold tracking-[0.3em] text-ink/50">
          {tr("youAre", lang)}
        </p>
        <motion.div
          className="my-3"
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.15 }}
        >
          <Emblem emoji={result.emoji} accent={result.accent} />
        </motion.div>
        <h1 className="text-3xl font-bold leading-tight" style={{ color: accentText }}>
          {L(result.name, lang)}
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-lg font-semibold text-ink">
          “{L(result.tagline, lang)}”
        </p>
        {result.secondary && (
          <p className="mt-2 text-sm text-ink/60">{L(result.secondary, lang)}</p>
        )}
      </motion.div>

      <div className="mt-6">
        <p className="mb-3 text-center text-sm font-semibold tracking-[0.2em] text-ink/50">
          {tr("yourDna", lang)}
        </p>
        <div className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-lg shadow-ink/5 ring-1 ring-ink/5">
          {dna.map((s, i) => (
            <StatBar
              key={s.key}
              label={`${s.emoji} ${L(s.label, lang)}`}
              value={s.value}
              delay={0.3 + i * 0.12}
            />
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-ink/60">{tr("sendToPartner", lang)}</p>

      <div className="mt-3 flex flex-col gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleShare}
          disabled={busy}
          className="tap-target w-full rounded-2xl bg-gradient-to-r from-gold to-coral py-4 text-lg font-bold text-white shadow-lg shadow-coral/25 disabled:opacity-70"
        >
          {busy ? tr("building", lang) : tr("share", lang)}
        </motion.button>
        <p className="-mt-1 text-center text-xs text-ink/45">{tr("shareHint", lang)}</p>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleDownload}
          className="tap-target w-full rounded-2xl border-2 border-ink/15 bg-white py-3.5 text-base font-bold text-ink"
        >
          {tr("save", lang)}
        </motion.button>
        <p className="-mt-1 text-center text-xs text-ink/45">{tr("saveHint", lang)}</p>

        {note && <p className="text-center text-sm font-medium text-teal">{note}</p>}

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleInvite}
          className="tap-target w-full rounded-2xl bg-tealdeep py-3.5 text-base font-bold text-white"
        >
          {tr("invite", lang)}
        </motion.button>

        <EmailCapture lang={lang} onSubmit={onWaitlist} />

        <button
          onClick={onPlayAgain}
          className="tap-target w-full rounded-2xl py-3 text-base font-medium text-ink/50 hover:text-ink"
        >
          {tr("playAgain", lang)}
        </button>
      </div>
    </div>
  );
}
