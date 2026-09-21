"use client";

import { archetypeArtDataUri } from "@/games/climber-personality/art";

// Renders the bespoke per-archetype flat-vector illustration.
// Same SVG art used on the server share card, so screen + card match exactly.
export default function Emblem({
  id,
  accent,
  size = 168,
}: {
  id: string;
  accent: string;
  size?: number;
}) {
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }} aria-hidden>
      <div
        className="absolute inset-[10%] rounded-full blur-2xl"
        style={{ background: accent, opacity: 0.28 }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={archetypeArtDataUri(id, accent)}
        width={size}
        height={size}
        alt=""
        className="relative"
        style={{ filter: "drop-shadow(0 10px 24px rgba(0,0,0,0.14))" }}
      />
    </div>
  );
}
