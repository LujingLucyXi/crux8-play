"use client";

// Hand-drawn "die-cut sticker" badge per archetype.
// Viral/shareable look: a wobbly spiky sunburst in the type's accent color,
// a thick white sticker outline (die-cut), a halftone dot texture, the icon
// tilted like a hand-placed sticker, plus doodle sparkles + motion dashes.
// Pure SVG/CSS — lightweight, on-brand, works everywhere.

// Builds a slightly irregular (hand-drawn) spiky star path.
function burstPath(
  cx: number,
  cy: number,
  spikes: number,
  outer: number,
  inner: number
): string {
  const pts: string[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const isOuter = i % 2 === 0;
    // wobble the radius a touch so it feels drawn by hand, not generated
    const wobble = isOuter ? 1 + (i % 3) * 0.04 : 1 - (i % 2) * 0.05;
    const r = (isOuter ? outer : inner) * wobble;
    const a = (Math.PI / spikes) * i - Math.PI / 2;
    pts.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`);
  }
  return `M${pts.join("L")}Z`;
}

// Darken a hex color for the hand-drawn ink outline.
function darken(hex: string, f = 0.55): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (
    "#" +
    [r, g, b].map((v) => Math.round(v * f).toString(16).padStart(2, "0")).join("")
  );
}

export default function Emblem({
  emoji,
  accent,
  size = 148,
}: {
  emoji: string;
  accent: string;
  size?: number;
}) {
  const vb = 200;
  const c = vb / 2;
  const ink = darken(accent);
  const dotId = `dots-${accent.replace("#", "")}`;

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }} aria-hidden>
      {/* soft colored glow behind the sticker */}
      <div
        className="absolute inset-[8%] rounded-full blur-2xl"
        style={{ background: accent, opacity: 0.35 }}
      />

      <svg
        viewBox={`0 0 ${vb} ${vb}`}
        width={size}
        height={size}
        className="absolute inset-0"
        style={{ transform: "rotate(-6deg)" }}
      >
        <defs>
          <radialGradient id={`g-${dotId}`} cx="34%" cy="28%" r="75%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
            <stop offset="55%" stopColor={accent} />
            <stop offset="100%" stopColor={ink} />
          </radialGradient>
          <pattern id={dotId} width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.6" fill="rgba(255,255,255,0.35)" />
          </pattern>
        </defs>

        {/* spiky hand-drawn sunburst with ink outline */}
        <path
          d={burstPath(c, c, 16, 96, 66)}
          fill={accent}
          stroke={ink}
          strokeWidth={4}
          strokeLinejoin="round"
        />

        {/* die-cut white sticker ring */}
        <circle
          cx={c}
          cy={c}
          r={58}
          fill="#ffffff"
          stroke={ink}
          strokeWidth={3}
        />
        {/* accent medallion face */}
        <circle cx={c} cy={c} r={49} fill={`url(#g-${dotId})`} stroke={ink} strokeWidth={2} />
        {/* halftone texture on the face */}
        <circle cx={c} cy={c} r={49} fill={`url(#${dotId})`} />

        {/* hand-drawn doodle stars + motion dashes */}
        <g stroke={ink} strokeWidth={3.5} strokeLinecap="round">
          <path d="M172 40 l0 14 M165 47 l14 0" />
          <path d="M30 150 l0 12 M24 156 l12 0" />
          <path d="M40 44 l7 7 M47 44 l-7 7" opacity="0.8" />
          <path d="M162 158 q8 -4 14 2" fill="none" opacity="0.7" />
        </g>
      </svg>

      {/* emoji, tilted like a hand-placed sticker */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transform: "rotate(-6deg)" }}
      >
        <span
          style={{
            fontSize: size * 0.4,
            lineHeight: 1,
            transform: "rotate(6deg)",
            filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.18))",
          }}
        >
          {emoji}
        </span>
      </div>
    </div>
  );
}
