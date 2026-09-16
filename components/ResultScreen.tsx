"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import type { DnaScore, ResultType } from "@/lib/gameTypes";
import StatBar from "./StatBar";
import ShareCard from "./ShareCard";
import BackgroundFX from "./BackgroundFX";
import EmailCapture from "./EmailCapture";

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
    [r, g, b]
      .map((v) => Math.round(v * f).toString(16).padStart(2, "0"))
      .join("")
  );
}

export default function ResultScreen({
  result,
  dna,
  siteLabel,
  crux8Url,
  onShareClick,
  onShareSuccess,
  onCta,
  onPlayAgain,
  onWaitlist,
}: {
  result: ResultType;
  dna: DnaScore[];
  siteLabel: string;
  crux8Url: string;
  onShareClick: () => void;
  onShareSuccess: () => void;
  onCta: () => void;
  onPlayAgain: () => void;
  onWaitlist: (email: string) => Promise<boolean>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  async function buildImage(): Promise<Blob | null> {
    if (!cardRef.current) return null;
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 1,
        width: 1080,
        height: 1920,
        cacheBust: true,
      });
      const res = await fetch(dataUrl);
      return await res.blob();
    } catch {
      return null;
    }
  }

  async function handleShare() {
    onShareClick();
    setBusy(true);
    setNote(null);
    const blob = await buildImage();
    setBusy(false);

    const shareText = `I'm ${result.name} on Crux8 Play 🧗 What's your Climber DNA?`;
    const nav = navigator as Navigator & { canShare?: (d?: ShareData) => boolean };

    if (blob) {
      const file = new File([blob], "crux8-climber-dna.png", { type: "image/png" });
      if (nav.canShare && nav.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], text: shareText, title: "Crux8 Play" });
          onShareSuccess();
          return;
        } catch {
          /* cancelled — fall through to download */
        }
      }
      downloadBlob(blob);
      onShareSuccess();
      setNote("Saved your DNA card — send it to your climbing partner 👀");
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({ text: shareText, title: "Crux8 Play" });
        onShareSuccess();
        return;
      } catch {
        /* ignore */
      }
    }
    setNote("Screenshot this screen to share your result 📸");
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

  // Darken light accent colors so the archetype name stays readable on cream.
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
        <p className="text-sm font-semibold tracking-[0.3em] text-ink/50">YOU ARE</p>
        <motion.div
          className="my-2 text-6xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.15 }}
        >
          {result.emoji}
        </motion.div>
        <h1 className="text-3xl font-bold leading-tight" style={{ color: accentText }}>
          {result.name}
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-lg font-semibold text-ink">
          “{result.tagline}”
        </p>
        {result.secondary && (
          <p className="mt-2 text-sm text-ink/60">{result.secondary}</p>
        )}
      </motion.div>

      <div className="mt-6">
        <p className="mb-3 text-center text-sm font-semibold tracking-[0.2em] text-ink/50">
          YOUR CLIMBER DNA 🧬
        </p>
        <div className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-lg shadow-ink/5 ring-1 ring-ink/5">
          {dna.map((s, i) => (
            <StatBar
              key={s.key}
              label={`${s.emoji} ${s.label}`}
              value={s.value}
              delay={0.3 + i * 0.12}
            />
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-ink/60">
        Send this to your climbing partner 👀
      </p>

      <div className="mt-3 flex flex-col gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleShare}
          disabled={busy}
          className="tap-target w-full rounded-2xl bg-gradient-to-r from-gold to-coral py-4 text-lg font-bold text-white shadow-lg shadow-coral/25 disabled:opacity-70"
        >
          {busy ? "Building DNA card…" : "SHARE MY CLIMBER DNA"}
        </motion.button>

        {note && <p className="text-center text-sm font-medium text-teal">{note}</p>}

        <EmailCapture onSubmit={onWaitlist} />

        <div className="rounded-2xl border border-teal/30 bg-teal/10 p-4 text-center">
          <p className="text-base font-semibold text-ink">
            Be the first to follow Crux8 Climbing and stay tuned for the app.
          </p>
          <p className="mt-1 text-sm text-ink/60">
            Finding climbing buddies and events never got easier.
          </p>
          <motion.a
            whileTap={{ scale: 0.97 }}
            href={crux8Url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onCta}
            className="tap-target mt-3 inline-flex w-full items-center justify-center rounded-xl bg-tealdeep py-3 text-base font-bold text-white"
          >
            Follow Crux8 Climbing →
          </motion.a>
        </div>

        <button
          onClick={onPlayAgain}
          className="tap-target w-full rounded-2xl py-3 text-base font-medium text-ink/50 hover:text-ink"
        >
          Play again
        </button>
      </div>

      {/* Off-screen DNA card for capture */}
      <ShareCard ref={cardRef} result={result} dna={dna} siteLabel={siteLabel} />
    </div>
  );
}
