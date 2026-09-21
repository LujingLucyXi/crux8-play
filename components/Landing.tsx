"use client";

import { motion } from "framer-motion";
import type { GameDefinition, Lang } from "@/lib/gameTypes";
import { L } from "@/lib/gameTypes";
import { tr } from "@/lib/i18n";
import BackgroundFX from "./BackgroundFX";
import Emblem from "./Emblem";
import { results } from "@/games/climber-personality/results";

// The gym door: a marquee of all 15 archetype emblems behind the pitch,
// CTA reframed as a card pull.
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
  const marquee = [...results, ...results];
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
        className="flex w-full flex-col items-center"
      >
        <div className="text-sm font-bold tracking-[0.4em] text-teal">CRUX8</div>
        <div className="mt-1 text-xs font-semibold tracking-[0.5em] text-ink/40">
          {tr("play", lang)}
        </div>

        {/* Archetype emblem marquee */}
        <div className="mt-6 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="animate-marquee flex w-max gap-3 py-2">
            {marquee.map((r, i) => (
              <Emblem key={`${r.id}-${i}`} id={r.id} accent={r.accent} size={76} />
            ))}
          </div>
        </div>

        <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-ink">
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
          className="tap-target w-full rounded-2xl bg-gradient-to-r from-gold to-coral py-5 font-display text-xl font-bold text-white shadow-xl shadow-coral/25"
        >
          {tr("start", lang)}
        </motion.button>
        <p className="mt-6 text-sm font-semibold text-teal">{playCount}</p>
      </motion.div>
    </div>
  );
}
