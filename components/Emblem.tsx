"use client";

// A bespoke "badge" per archetype: a gradient medallion in the type's accent
// color, with a soft glow, radiating rays, a white ring, the icon, and sparkles.
// Pure CSS/SVG — lightweight and on-brand (no generic bare emoji).
export default function Emblem({
  emoji,
  accent,
  size = 132,
}: {
  emoji: string;
  accent: string;
  size?: number;
}) {
  const rays = 12;
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }} aria-hidden>
      {/* soft glow */}
      <div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{ background: accent, opacity: 0.4 }}
      />
      {/* radiating rays */}
      <div className="absolute inset-0">
        {Array.from({ length: rays }).map((_, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              height: size * 0.05,
              width: size * 0.12,
              background: accent,
              opacity: 0.45,
              transform: `translate(-50%,-50%) rotate(${(360 / rays) * i}deg) translateX(${size * 0.52}px)`,
            }}
          />
        ))}
      </div>
      {/* medallion */}
      <div
        className="absolute inset-[10%] flex items-center justify-center rounded-full ring-4 ring-white"
        style={{
          background: `radial-gradient(circle at 32% 26%, rgba(255,255,255,0.55), ${accent} 72%)`,
          boxShadow: `0 12px 30px ${accent}59`,
        }}
      >
        <span style={{ fontSize: size * 0.42, lineHeight: 1 }}>{emoji}</span>
      </div>
      {/* sparkles */}
      <span className="absolute -right-0.5 top-1 text-lg">✨</span>
      <span className="absolute -left-0.5 bottom-2 text-sm">✨</span>
    </div>
  );
}
