"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import type { ResultType } from "@/lib/gameTypes";
import StatBar from "./StatBar";
import ShareCard from "./ShareCard";
import BackgroundFX from "./BackgroundFX";

export default function ResultScreen({
  result,
  siteLabel,
  crux8Url,
  onShareClick,
  onShareSuccess,
  onCta,
  onPlayAgain,
}: {
  result: ResultType;
  siteLabel: string;
  crux8Url: string;
  onShareClick: () => void;
  onShareSuccess: () => void;
  onCta: () => void;
  onPlayAgain: () => void;
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

    const shareText = `I'm ${result.name} on Crux8 Play 🧗 What type of climber are you?`;
    const nav = navigator as Navigator & {
      canShare?: (d?: ShareData) => boolean;
    };

    if (blob) {
      const file = new File([blob], "crux8-climbing-type.png", { type: "image/png" });
      // Try native share with the image (mobile Safari/Chrome)
      if (nav.canShare && nav.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], text: shareText, title: "Crux8 Play" });
          onShareSuccess();
          return;
        } catch {
          /* user cancelled or unsupported — fall through to download */
        }
      }
      // Fallback: download the image
      downloadBlob(blob);
      onShareSuccess();
      setNote("Saved image — share it with your climbing partner 👀");
      return;
    }

    // Image failed — fall back to text-only share
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
    a.download = "crux8-climbing-type.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const accentText = result.accent === "#0F2D3A" ? "#C7D9EB" : result.accent;

  return (
    <div className="relative flex flex-1 flex-col px-6 pb-8 pt-10">
      <BackgroundFX />

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="text-sm font-semibold tracking-[0.3em] text-sky/70">YOU ARE</p>
        <motion.div
          className="my-3 text-6xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.15 }}
        >
          {result.emoji}
        </motion.div>
        <h1 className="text-3xl font-bold leading-tight" style={{ color: accentText }}>
          {result.name}
        </h1>
        <p className="mx-auto mt-3 max-w-xs text-lg font-medium text-white">
          “{result.tagline}”
        </p>
        {result.secondary && (
          <p className="mt-2 text-sm text-white/60">{result.secondary}</p>
        )}
      </motion.div>

      <div className="mt-7 flex flex-col gap-4 rounded-3xl bg-white/[0.06] p-5 backdrop-blur">
        {result.stats.map((s, i) => (
          <StatBar key={s.key} label={s.label} value={s.value} delay={0.3 + i * 0.15} />
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-white/70">
        Send this to your climbing partner 👀
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleShare}
          disabled={busy}
          className="tap-target w-full rounded-2xl bg-gradient-to-r from-gold to-coral py-4 text-lg font-bold text-navy disabled:opacity-70"
        >
          {busy ? "Building card…" : "SHARE MY RESULT"}
        </motion.button>

        <motion.a
          whileTap={{ scale: 0.97 }}
          href={crux8Url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onCta}
          className="tap-target w-full rounded-2xl border border-teal bg-teal/20 py-4 text-center text-lg font-semibold text-white"
        >
          Find your climbing people →
        </motion.a>

        <button
          onClick={onPlayAgain}
          className="tap-target w-full rounded-2xl py-3 text-base font-medium text-white/60 hover:text-white"
        >
          Play again
        </button>
      </div>

      {note && <p className="mt-3 text-center text-sm text-gold">{note}</p>}

      {/* Off-screen share card for capture */}
      <ShareCard ref={cardRef} result={result} siteLabel={siteLabel} />
    </div>
  );
}
