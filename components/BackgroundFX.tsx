"use client";

import { motion } from "framer-motion";

// Lightweight, CSS/SVG-only ambient visual — no images, no video.
// Soft pastel "climbing holds" drifting over the bright cream background.
export default function BackgroundFX() {
  const holds = [
    { top: "12%", left: "8%", size: 130, color: "#1FA39C", delay: 0 },
    { top: "66%", left: "70%", size: 170, color: "#FFB627", delay: 1.2 },
    { top: "38%", left: "80%", size: 100, color: "#FF6B6B", delay: 0.6 },
    { top: "82%", left: "8%", size: 120, color: "#A88FD0", delay: 1.8 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {holds.map((h, i) => (
        <motion.div
          key={i}
          className="absolute rounded-[42%] blur-3xl"
          style={{
            top: h.top,
            left: h.left,
            width: h.size,
            height: h.size,
            background: h.color,
            opacity: 0.2,
          }}
          animate={{ y: [0, -18, 0], scale: [1, 1.08, 1] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: h.delay,
          }}
        />
      ))}
    </div>
  );
}
