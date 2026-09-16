"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Question } from "@/lib/gameTypes";

const LETTERS = ["A", "B", "C", "D"];

export default function QuestionCard({
  question,
  onAnswer,
}: {
  question: Question;
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
      <div className="rounded-3xl bg-white p-6 shadow-lg shadow-ink/5 ring-1 ring-ink/5">
        <h2 className="text-2xl font-bold leading-snug text-ink">{question.prompt}</h2>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {question.answers.map((a, i) => {
          const isSel = selected === a.id;
          const dim = selected && !isSel;
          return (
            <motion.button
              key={a.id}
              whileTap={{ scale: 0.97 }}
              animate={{
                scale: isSel ? 1.02 : 1,
                opacity: dim ? 0.4 : 1,
              }}
              onClick={() => handle(a.id)}
              aria-pressed={isSel}
              className={`tap-target flex items-center gap-4 rounded-2xl border px-4 py-4 text-left shadow-sm transition-colors ${
                isSel
                  ? "border-gold bg-gold/15"
                  : "border-ink/10 bg-white hover:border-teal/40"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  isSel ? "bg-gold text-white" : "bg-ink/5 text-teal"
                }`}
              >
                {isSel ? "✓" : LETTERS[i]}
              </span>
              <span className="text-base font-medium text-ink">{a.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
