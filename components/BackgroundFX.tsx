"use client";

import { motion } from "framer-motion";

// Lightweight, SVG-only ambient visual — no images, no video.
// Soft pastel glows + floating climbing-hold shapes + a faint boulder,
// all behind the content on the bright cream background.

const HOLD_PATH =
  "M50 5 C73 5 95 20 95 45 C95 73 77 97 50 97 C25 97 6 75 6 47 C6 22 27 5 50 5 Z";

function Hold({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <path d={HOLD_PATH} fill={color} />
      {/* bolt hole */}
      <circle cx="54" cy="44" r="7" fill="#FFF7EF" opacity="0.9" />
    </svg>
  );
}

export default function BackgroundFX() {
  // soft color glows
  const glows = [
    { top: "10%", left: "6%", size: 150, color: "#1FA39C", delay: 0 },
    { top: "70%", left: "72%", size: 180, color: "#FFB627", delay: 1.2 },
    { top: "42%", left: "82%", size: 100, color: "#FF6B6B", delay: 0.6 },
  ];
  // climbing-hold shapes
  const holds = [
    { top: "16%", left: "78%", size: 54, color: "#FF6B6B", rot: -18, delay: 0.2, o: 0.16 },
    { top: "58%", left: "6%", size: 68, color: "#1FA39C", rot: 24, delay: 1.0, o: 0.16 },
    { top: "80%", left: "68%", size: 46, color: "#A88FD0", rot: -8, delay: 1.6, o: 0.16 },
    { top: "34%", left: "12%", size: 40, color: "#FFB627", rot: 40, delay: 0.7, o: 0.18 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {glows.map((g, i) => (
        <motion.div
          key={`g${i}`}
          className="absolute rounded-[42%] blur-3xl"
          style={{
            top: g.top,
            left: g.left,
            width: g.size,
            height: g.size,
            background: g.color,
            opacity: 0.16,
          }}
          animate={{ y: [0, -16, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: g.delay }}
        />
      ))}

      {holds.map((h, i) => (
        <motion.div
          key={`h${i}`}
          className="absolute"
          style={{ top: h.top, left: h.left, width: h.size, height: h.size, opacity: h.o }}
          animate={{ y: [0, -12, 0], rotate: [h.rot, h.rot + 6, h.rot] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: h.delay }}
        >
          <Hold color={h.color} />
        </motion.div>
      ))}

      {/* faint boulder silhouette anchored bottom-center */}
      <svg
        className="absolute -bottom-6 left-1/2 h-40 w-[130%] -translate-x-1/2"
        viewBox="0 0 400 140"
        preserveAspectRatio="xMidYMax meet"
        aria-hidden
      >
        <path
          d="M0 140 L20 74 L70 96 L118 40 L165 92 L210 54 L262 100 L310 62 L360 104 L400 78 L400 140 Z"
          fill="#17323B"
          opacity="0.05"
        />
      </svg>
    </div>
  );
}
