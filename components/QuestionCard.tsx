"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Lang, Question } from "@/lib/gameTypes";
import { L } from "@/lib/gameTypes";
import { tr } from "@/lib/i18n";

// Answers are "moves", not exam options: full-width tappable cards,
// no A/B/C/D letters. Tap a move, chalk flies, auto-advance.
export default function QuestionCard({
  question,
  lang,
  canSkip,
  onSkip,
  onAnswer,
}: {
  question: Question;
  lang: Lang;
  canSkip: boolean;
  onSkip: () => void;
  onAnswer: (answerId: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  function handle(answerId: string) {
    if (selected) return; // lock after first tap
    setSelected(answerId);
    // instant feedback, then auto-advance
    window.setTimeout(() => onAnswer(answerId), 450);
  }

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="flex flex-1 flex-col"
    >
      <h2 className="font-display text-[26px] font-bold leading-snug text-[#F5EFE0]">
        {L(question.prompt, lang)}
      </h2>

      <div className="mt-6 flex flex-col gap-3">
        {question.answers.map((a) => {
          const isSel = selected === a.id;
          const dim = selected && !isSel;
          return (
            <motion.button
              key={a.id}
              whileTap={{ scale: 0.97 }}
              animate={{
                scale: isSel ? 1.02 : 1,
                opacity: dim ? 0.35 : 1,
                y: dim ? 2 : 0,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              onClick={() => handle(a.id)}
              aria-pressed={isSel}
              className={`tap-target flex items-center gap-4 rounded-2xl px-5 py-4 text-left shadow-sm transition-colors ${
                isSel
                  ? "bg-gold/15 shadow-lg shadow-gold/20 ring-2 ring-gold"
                  : "bg-white/[0.06] ring-1 ring-white/10 hover:ring-gold/50"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                  isSel ? "bg-gold text-[#1a1206]" : "bg-white/10 text-gold"
                }`}
                aria-hidden
              >
                {isSel ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2.5 7.5l3.2 3.2L11.5 4"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span className="h-2.5 w-2.5 rounded-full bg-current opacity-60" />
                )}
              </span>
              <span className="text-[17px] font-medium leading-snug text-[#F5EFE0]">
                {L(a.label, lang)}
              </span>
            </motion.button>
          );
        })}
      </div>

      {canSkip && !selected && (
        <button
          onClick={onSkip}
          className="tap-target mx-auto mt-5 text-sm font-medium text-white/40 hover:text-white/70"
        >
          {tr("skip", lang)}
        </button>
      )}
    </motion.div>
  );
}
