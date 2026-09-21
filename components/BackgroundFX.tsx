"use client";

// Mysterious night-sky ambience: deep-space base, drifting gold/teal/violet
// nebula glows, twinkling stars, faint floating climbing holds, moon glow.
// Pure CSS/SVG — no images, no video.

const HOLD_PATH =
  "M50 5 C73 5 95 20 95 45 C95 73 77 97 50 97 C25 97 6 75 6 47 C6 22 27 5 50 5 Z";

function Hold({ color, opacity }: { color: string; opacity: number }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <path d={HOLD_PATH} fill={color} opacity={opacity} />
      <circle cx="54" cy="44" r="7" fill="#070708" opacity={0.85} />
    </svg>
  );
}

// Deterministic pseudo-random from index — stable across renders.
function prand(i: number, salt: number): number {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export default function BackgroundFX() {
  const stars = Array.from({ length: 46 }, (_, i) => ({
    top: `${prand(i, 1) * 100}%`,
    left: `${prand(i, 2) * 100}%`,
    size: 1 + prand(i, 3) * 2.2,
    delay: `${(prand(i, 4) * 3.6).toFixed(2)}s`,
    dur: `${(2.6 + prand(i, 5) * 3).toFixed(2)}s`,
  }));

  const nebulae = [
    { top: "-8%", left: "8%", size: 300, color: "rgba(217,166,46,0.16)", delay: "0s" },
    { top: "52%", left: "68%", size: 340, color: "rgba(31,163,156,0.10)", delay: "-5s" },
    { top: "78%", left: "-10%", size: 280, color: "rgba(122,90,200,0.12)", delay: "-9s" },
    { top: "30%", left: "80%", size: 200, color: "rgba(255,107,107,0.07)", delay: "-3s" },
  ];

  const holds = [
    { top: "14%", left: "76%", size: 60, rot: -18, o: 0.14 },
    { top: "56%", left: "4%", size: 74, rot: 24, o: 0.12 },
    { top: "82%", left: "66%", size: 50, rot: -8, o: 0.14 },
    { top: "36%", left: "10%", size: 44, rot: 40, o: 0.16 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* deep-space base + vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, #101014 0%, #070708 55%, #040405 100%)",
        }}
      />
      {/* moon glow */}
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          top: "-70px",
          right: "-50px",
          width: 220,
          height: 220,
          background: "rgba(246,212,124,0.14)",
        }}
      />
      {nebulae.map((n, i) => (
        <div
          key={`n${i}`}
          className="nebula"
          style={{
            top: n.top,
            left: n.left,
            width: n.size,
            height: n.size,
            background: n.color,
            animationDelay: n.delay,
          }}
        />
      ))}
      {stars.map((s, i) => (
        <span
          key={`s${i}`}
          className="star"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            animationDuration: s.dur,
          }}
        />
      ))}
      {holds.map((h, i) => (
        <div
          key={`h${i}`}
          className="absolute"
          style={{
            top: h.top,
            left: h.left,
            width: h.size,
            height: h.size,
            transform: `rotate(${h.rot}deg)`,
            animation: `drift ${11 + i * 2.4}s ease-in-out infinite`,
            animationDelay: `${-i * 2.7}s`,
          }}
        >
          <Hold color="#D9A62E" opacity={h.o} />
        </div>
      ))}
      {/* floor vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
}
