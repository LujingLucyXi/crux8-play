"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { DnaScore, GameDefinition, ResultType } from "@/lib/gameTypes";
import {
  getPlayCount,
  recordSessionStart,
  saveWaitlist,
  updateSession,
} from "@/lib/supabase";
import { initAnalytics, track } from "@/lib/analytics";
import {
  getReferralSource,
  makeSessionId,
  seedFromSession,
} from "@/lib/session";
import Landing from "./Landing";
import QuestionCard from "./QuestionCard";
import ProgressBar from "./ProgressBar";
import ResultScreen from "./ResultScreen";
import BackgroundFX from "./BackgroundFX";

type Phase = "landing" | "playing" | "calculating" | "result";

// Seed baseline so the counter never reads as a fabricated exact headcount.
const SEED_COUNT = 1284;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://play.crux8.com";
const crux8Url = process.env.NEXT_PUBLIC_CRUX8_URL || "https://crux8.com";
const siteLabel = siteUrl.replace(/^https?:\/\//, "");

export default function GameEngine({ game }: { game: GameDefinition }) {
  const [phase, setPhase] = useState<Phase>("landing");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<ResultType | null>(null);
  const [dna, setDna] = useState<DnaScore[]>([]);
  const [liveCount, setLiveCount] = useState<number | null>(null);

  const sessionRef = useRef<string>("");
  const seedRef = useRef<number>(0);
  const startedAtRef = useRef<string>("");

  useEffect(() => {
    initAnalytics();
    track("page_view");
    getPlayCount().then((c) => setLiveCount(c));
  }, []);

  const playCountLabel = useMemo(() => {
    if (liveCount && liveCount > 0) {
      return `🔥 ${liveCount.toLocaleString()} climbers played`;
    }
    // No real data yet — invite rather than fabricate a headcount.
    return "Join the Crux8 climbing community";
  }, [liveCount]);

  function handleStart() {
    const sid = makeSessionId();
    sessionRef.current = sid;
    seedRef.current = seedFromSession(sid);
    startedAtRef.current = new Date().toISOString();
    setAnswers([]);
    setIndex(0);
    setResult(null);
    setPhase("playing");
    track("game_started", { session_id: sid });
    recordSessionStart({
      id: sid,
      game_id: game.id,
      started_at: startedAtRef.current,
      referral_source: getReferralSource(),
    });
  }

  function handleAnswer(answerId: string) {
    const next = [...answers, answerId];
    setAnswers(next);
    track("question_answered", {
      session_id: sessionRef.current,
      question_index: index + 1,
      answer_id: answerId,
    });

    if (next.length >= game.questions.length) {
      finish(next);
    } else {
      setIndex((i) => i + 1);
    }
  }

  function finish(finalAnswers: string[]) {
    const { resultId, dna: computedDna } = game.score(finalAnswers, seedRef.current);
    const r = game.results.find((x) => x.id === resultId) ?? game.results[0];
    setResult(r);
    setDna(computedDna);
    setPhase("calculating");
    track("game_completed", { session_id: sessionRef.current, result_type: r.id });

    updateSession(sessionRef.current, {
      completed_at: new Date().toISOString(),
      result_type: r.id,
    });

    window.setTimeout(() => {
      setPhase("result");
      track("result_viewed", { session_id: sessionRef.current, result_type: r.id });
    }, 1900);
  }

  return (
    <AnimatePresence mode="wait">
      {phase === "landing" && (
        <Landing
          key="landing"
          subtitle={game.subtitle}
          playCount={playCountLabel}
          onStart={handleStart}
        />
      )}

      {phase === "playing" && (
        <div key="playing" className="relative flex flex-1 flex-col px-6 pb-8 pt-10">
          <BackgroundFX />
          <div className="mb-6">
            <ProgressBar current={index + 1} total={game.questions.length} />
          </div>
          <AnimatePresence mode="wait">
            <QuestionCard
              key={game.questions[index].id}
              question={game.questions[index]}
              onAnswer={handleAnswer}
            />
          </AnimatePresence>
        </div>
      )}

      {phase === "calculating" && (
        <motion.div
          key="calculating"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative flex flex-1 flex-col items-center justify-center px-6 text-center"
        >
          <BackgroundFX />
          <motion.div
            className="text-6xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          >
            🧬
          </motion.div>
          <p className="mt-6 text-lg font-semibold tracking-[0.2em] text-teal">
            CALCULATING YOUR
            <br />
            CLIMBING DNA…
          </p>
        </motion.div>
      )}

      {phase === "result" && result && (
        <motion.div key="result" className="flex flex-1 flex-col">
          <ResultScreen
            result={result}
            dna={dna}
            siteLabel={siteLabel}
            crux8Url={crux8Url}
            onShareClick={() =>
              track("share_clicked", {
                session_id: sessionRef.current,
                result_type: result.id,
              })
            }
            onShareSuccess={() => {
              track("share_success", {
                session_id: sessionRef.current,
                result_type: result.id,
              });
              updateSession(sessionRef.current, { share_clicked: true });
            }}
            onCta={() => {
              track("crux8_cta_clicked", {
                session_id: sessionRef.current,
                result_type: result.id,
              });
              updateSession(sessionRef.current, { crux8_clicked: true });
            }}
            onPlayAgain={() => {
              track("play_again", { session_id: sessionRef.current });
              setPhase("landing");
            }}
            onWaitlist={async (email) => {
              track("waitlist_submitted", {
                session_id: sessionRef.current,
                result_type: result.id,
              });
              // Store email + DNA so the future app can restore this result.
              return saveWaitlist({
                email,
                session_id: sessionRef.current,
                result_type: result.id,
                dna,
              });
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
