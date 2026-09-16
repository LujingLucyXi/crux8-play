"use client";

import { motion } from "framer-motion";

// Lightweight, CSS/SVG-only ambient visual — no images, no video.
// Abstract "climbing holds" drifting over a deep navy gradient.
export default function BackgroundFX() {
  const holds = [
    { top: "12%", left: "8%", size: 120, color: "#2C7A7B", delay: 0 },
    { top: "68%", left: "72%", size: 160, color: "#F4B942", delay: 1.2 },
    { top: "40%", left: "80%", size: 90, color: "#FF6B6B", delay: 0.6 },
    { top: "82%", left: "10%", size: 110, color: "#C7D9EB", delay: 1.8 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-gradient-to-b from-navy via-navy to-[#0a2029]">
      {holds.map((h, i) => (
        <motion.div
          key={i}
          className="absolute rounded-[42%] blur-2xl"
          style={{
            top: h.top,
            left: h.left,
            width: h.size,
            height: h.size,
            background: h.color,
            opacity: 0.22,
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
