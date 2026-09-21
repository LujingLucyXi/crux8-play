"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function StatBar({
  label,
  value,
  delay = 0,
}: {
  label: string;
  value: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm font-semibold">
        <span className="tracking-wide text-white/80">{label}</span>
        <motion.span
          className="tabular-nums text-[#F5EFE0]"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.4 }}
        >
          {value}%
        </motion.span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#8a6414] via-gold to-[#F6D47C]"
          initial={reduce ? false : { width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay, duration: 0.9, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
