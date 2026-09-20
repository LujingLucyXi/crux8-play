"use client";

import { motion } from "framer-motion";
import type { GameDefinition, Lang } from "@/lib/gameTypes";
import { L } from "@/lib/gameTypes";
import { tr } from "@/lib/i18n";
import BackgroundFX from "./BackgroundFX";

export default function Landing({
  game,
  lang,
  onLang,
  playCount,
  onStart,
}: {
  game: GameDefinition;
  lang: Lang;
  onLang: (l: Lang) => void;
  playCount: string;
  onStart: () => void;
}) {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-between px-6 pb-10 pt-6 text-center">
      <BackgroundFX />

      {/* Language toggle */}
      <div className="flex w-full justify-end">
        <div className="inline-flex overflow-hidden rounded-full border border-ink/15 bg-white/70 text-sm font-semibold backdrop-blur">
          {(["en", "zh"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => onLang(l)}
              className={`tap-target px-4 ${
                lang === l ? "bg-ink text-white" : "text-ink/60"
              }`}
              aria-pressed={lang === l}
            >
              {l === "en" ? "EN" : "中文"}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="text-sm font-bold tracking-[0.4em] text-teal">CRUX8</div>
        <div className="mt-1 text-xs font-semibold tracking-[0.5em] text-ink/40">
          {tr("play", lang)}
        </div>

        <motion.div
          className="my-8 text-6xl"
          animate={{ rotate: [0, -8, 8, 0], y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        >
          🧗
        </motion.div>

        <h1 className="text-4xl font-bold leading-tight text-ink">
          {tr("heroLine1", lang)}
          <br />
          {tr("heroLine2", lang)}
        </h1>
        {game.subtitle && L(game.subtitle, lang) && (
          <p className="mt-3 text-lg font-medium text-teal">{L(game.subtitle, lang)}</p>
        )}
        <p className="mt-4 max-w-xs text-base text-ink/60">{tr("heroSub", lang)}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="w-full"
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onStart}
          className="tap-target w-full rounded-2xl bg-gradient-to-r from-gold to-coral py-5 text-xl font-bold text-white shadow-xl shadow-coral/25"
        >
          {tr("start", lang)}
        </motion.button>
        <p className="mt-6 text-sm font-semibold text-teal">{playCount}</p>
      </motion.div>
    </div>
  );
}
