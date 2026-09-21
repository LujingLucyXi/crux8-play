"use client";

// Renders the golden medallion emblem cropped from the archetype card art.
// Same file on the landing marquee, the result screen, and the server
// share card, so screen + card match exactly.
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
        className="absolute inset-[8%] rounded-full blur-2xl"
        style={{ background: accent, opacity: 0.35 }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/emblems/${id}.webp`}
        width={size}
        height={size}
        alt=""
        className="relative h-full w-full rounded-full object-cover"
        style={{ filter: "drop-shadow(0 10px 24px rgba(0,0,0,0.5))" }}
      />
    </div>
  );
}
