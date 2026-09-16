"use client";

import { motion } from "framer-motion";
import BackgroundFX from "./BackgroundFX";

export default function Landing({
  subtitle,
  playCount,
  onStart,
}: {
  subtitle?: string;
  playCount: string;
  onStart: () => void;
}) {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-between px-6 pb-10 pt-16 text-center">
      <BackgroundFX />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="text-sm font-semibold tracking-[0.4em] text-gold">CRUX8</div>
        <div className="mt-1 text-xs font-medium tracking-[0.5em] text-sky/70">PLAY</div>

        <motion.div
          className="my-8 text-6xl"
          animate={{ rotate: [0, -8, 8, 0], y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        >
          🧗
        </motion.div>

        <h1 className="text-4xl font-bold leading-tight">
          What Type of
          <br />
          Climber Are You?
        </h1>
        {subtitle && (
          <p className="mt-3 text-lg font-medium text-sky/80">{subtitle}</p>
        )}
        <p className="mt-4 max-w-xs text-base text-white/70">
          Find your climbing personality in 30 seconds.
        </p>
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
          className="tap-target w-full rounded-2xl bg-gradient-to-r from-gold to-coral py-5 text-xl font-bold text-navy shadow-lg shadow-coral/20"
        >
          START
        </motion.button>
        <p className="mt-4 text-sm text-white/50">No sign-up. Just climbing.</p>
        <p className="mt-6 text-sm font-medium text-teal">{playCount}</p>
      </motion.div>
    </div>
  );
}
