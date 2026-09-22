"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Lang } from "@/lib/gameTypes";
import { tr } from "@/lib/i18n";
import BackgroundFX from "./BackgroundFX";

// Zero-friction identity: ask for a nickname before the quiz.
// Stored in localStorage — the House remembers you without sign-up.
export default function NicknameGate({
  lang,
  initial,
  onSubmit,
}: {
  lang: Lang;
  initial: string;
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState(initial);
  const trimmed = name.trim();

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center">
      <BackgroundFX />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xs"
      >
        <div className="text-5xl">🧗</div>
        <h1 className="mt-4 font-display text-3xl font-bold text-[#F5EFE0]">
          {tr("nicknameTitle", lang)}
        </h1>
        <p className="mt-2 text-base text-white/60">{tr("nicknameSub", lang)}</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
          placeholder={tr("nicknamePlaceholder", lang)}
          autoFocus
          enterKeyHint="go"
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit(trimmed);
          }}
          className="mt-6 w-full rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-center text-xl font-semibold text-[#F5EFE0] placeholder:text-white/30 focus:border-gold/60 focus:outline-none"
        />
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => onSubmit(trimmed)}
          className="tap-target mt-4 w-full rounded-2xl bg-gradient-to-r from-[#F6D47C] via-[#E8B83A] to-[#B9862A] py-4 font-display text-lg font-bold text-[#1a1206] shadow-xl shadow-gold/25"
        >
          {tr("nicknameStart", lang)}
        </motion.button>
        <button
          onClick={() => onSubmit("")}
          className="tap-target mt-3 w-full py-2 text-sm font-medium text-white/40 hover:text-white/70"
        >
          {tr("nicknameSkip", lang)}
        </button>
      </motion.div>
    </div>
  );
}
