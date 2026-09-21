"use client";

import { motion } from "framer-motion";
import type { Lang } from "@/lib/gameTypes";
import { tr } from "@/lib/i18n";

// The quiz as a climbing route: one hold per question, lighting up gold
// as you ascend. Replaces the generic thin progress bar.
export default function RouteProgress({
  current,
  total,
  lang,
}: {
  current: number; // 1-based index of the question being answered
  total: number;
  lang: Lang;
}) {
  const W = 360;
  const H = 64;
  const pts = Array.from({ length: total }, (_, i) => ({
    x: 22 + i * ((W - 44) / (total - 1)),
    y: i % 2 === 0 ? 44 : 20,
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  return (
    <div className="w-full" role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total}>
      <div className="mb-1 flex items-center justify-between text-xs font-bold tracking-[0.25em] text-white/45">
        <span>{tr("routeLabel", lang)}</span>
        <span className="text-sm tracking-normal text-white/70">
          {current}
          <span className="text-white/35"> / {total}</span>
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden>
        <path
          d={line}
          fill="none"
          stroke="#F5EFE0"
          strokeOpacity={0.14}
          strokeWidth={3}
          strokeDasharray="2 7"
          strokeLinecap="round"
        />
        {pts.map((p, i) => {
          const done = i < current - 1;
          const active = i === current - 1;
          return (
            <g key={i}>
              {active && (
                <motion.circle
                  cx={p.x}
                  cy={p.y}
                  r={13}
                  fill="none"
                  stroke="#FFB627"
                  strokeWidth={2}
                  initial={{ opacity: 0.9, scale: 0.8 }}
                  animate={{ opacity: [0.9, 0.2, 0.9], scale: [0.85, 1.25, 0.85] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                />
              )}
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={10}
                initial={false}
                animate={{
                  scale: active ? 1.25 : 1,
                  fillOpacity: 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                fill={done ? "#FFB627" : active ? "#FFFFFF" : "#F5EFE0"}
                fillOpacity={done ? 1 : active ? 1 : 0.08}
                stroke={done ? "#E09A12" : "#FFB627"}
                strokeOpacity={done ? 1 : active ? 1 : 0.35}
                strokeWidth={2.5}
              />
              {done && (
                <path
                  d={`M${p.x - 4.5},${p.y} l3,3 l6,-6.5`}
                  fill="none"
                  stroke="#1a1206"
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              {active && (
                <text
                  x={p.x}
                  y={p.y + 4}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={800}
                  fill="#1a1206"
                >
                  {current}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
