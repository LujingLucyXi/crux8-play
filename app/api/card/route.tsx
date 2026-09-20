import { ImageResponse } from "next/og";
import { results } from "@/games/climber-personality/results";
import { DIMENSIONS } from "@/games/climber-personality/dimensions";
import { L, type Lang } from "@/lib/gameTypes";

export const runtime = "edge";

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

function burstPath(cx: number, cy: number, spikes: number, outer: number, inner: number): string {
  const pts: string[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const isOuter = i % 2 === 0;
    const wobble = isOuter ? 1 + (i % 3) * 0.04 : 1 - (i % 2) * 0.05;
    const r = (isOuter ? outer : inner) * wobble;
    const a = (Math.PI / spikes) * i - Math.PI / 2;
    pts.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`);
  }
  return `M${pts.join("L")}Z`;
}

function stickerSvg(accent: string, ink: string): string {
  const c = 100;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">` +
    `<defs><radialGradient id="g" cx="34%" cy="28%" r="75%">` +
    `<stop offset="0%" stop-color="rgba(255,255,255,0.85)"/>` +
    `<stop offset="55%" stop-color="${accent}"/>` +
    `<stop offset="100%" stop-color="${ink}"/></radialGradient>` +
    `<pattern id="d" width="12" height="12" patternUnits="userSpaceOnUse">` +
    `<circle cx="3" cy="3" r="1.6" fill="rgba(255,255,255,0.35)"/></pattern></defs>` +
    `<g transform="rotate(-6 100 100)">` +
    `<path d="${burstPath(c, c, 16, 96, 66)}" fill="${accent}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>` +
    `<circle cx="100" cy="100" r="58" fill="#ffffff" stroke="${ink}" stroke-width="3"/>` +
    `<circle cx="100" cy="100" r="49" fill="url(#g)" stroke="${ink}" stroke-width="2"/>` +
    `<circle cx="100" cy="100" r="49" fill="url(#d)"/>` +
    `<g stroke="${ink}" stroke-width="3.5" stroke-linecap="round" fill="none">` +
    `<path d="M172 40 l0 14 M165 47 l14 0"/>` +
    `<path d="M30 150 l0 12 M24 156 l12 0"/>` +
    `<path d="M40 44 l7 7 M47 44 l-7 7" opacity="0.8"/>` +
    `<path d="M162 158 q8 -4 14 2" opacity="0.7"/></g></g></svg>`
  );
}

// Server-rendered 1080x1920 "Climber DNA" share card.
// Reliable on every device (unlike client-side html-to-image, which can
// produce black/blank images on mobile Safari).
// Usage: /api/card?r=<resultId>&s=<v,v,v,v,v,v>  (values in DIMENSIONS order)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const r = searchParams.get("r") || results[0].id;
  const lang: Lang = searchParams.get("l") === "zh" ? "zh" : "en";
  const s = (searchParams.get("s") || "")
    .split(",")
    .map((n) => Math.max(0, Math.min(100, parseInt(n, 10) || 0)));
  const result = results.find((x) => x.id === r) || results[0];
  const dna = DIMENSIONS.map((d, i) => ({
    label: L(d.label, lang),
    emoji: d.emoji,
    value: s[i] ?? 0,
  }));
  const heading = lang === "zh" ? "我的攀岩 DNA 🧬" : "MY CLIMBER DNA 🧬";
  const accent = result.accent === "#0F2D3A" ? "#C7D9EB" : result.accent;

  // Hand-drawn "die-cut sticker" badge, rendered as an SVG data-URI so it
  // survives Satori reliably. Spiky wobbly sunburst + white die-cut ring.
  const ink = darken(result.accent);
  const badgeSvg = stickerSvg(result.accent, ink);
  const badgeUri = `data:image/svg+xml;utf8,${encodeURIComponent(badgeSvg)}`;
  const siteLabel = (process.env.NEXT_PUBLIC_SITE_URL || "crux8-play.vercel.app").replace(
    /^https?:\/\//,
    ""
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "1080px",
          height: "1920px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "100px 90px",
          background: `linear-gradient(160deg, #0F2D3A 0%, #0a2029 55%, ${result.accent}33 100%)`,
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 38, fontWeight: 700, letterSpacing: 16, color: "#F4B942" }}>
            CRUX8 PLAY
          </div>
          <div style={{ display: "flex", fontSize: 46, fontWeight: 600, marginTop: 40, color: "#C7D9EB" }}>
            {heading}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div
            style={{
              display: "flex",
              position: "relative",
              width: 360,
              height: 360,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={badgeUri} width={360} height={360} alt="" style={{ position: "absolute" }} />
            <div
              style={{
                display: "flex",
                fontSize: 140,
                lineHeight: 1,
                transform: "rotate(0deg)",
              }}
            >
              {result.emoji}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 88, fontWeight: 800, marginTop: 24, color: accent, lineHeight: 1.05 }}>
            {L(result.name, lang)}
          </div>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 500, marginTop: 30, maxWidth: 860, textAlign: "center" }}>
            “{L(result.tagline, lang)}”
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {dna.map((d) => (
            <div key={d.label} style={{ display: "flex", flexDirection: "column", marginBottom: 26 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 40, fontWeight: 600, marginBottom: 12 }}>
                <div style={{ display: "flex" }}>
                  {d.emoji} {d.label}
                </div>
                <div style={{ display: "flex" }}>{d.value}%</div>
              </div>
              <div style={{ display: "flex", height: 24, width: "100%", background: "rgba(255,255,255,0.14)", borderRadius: 999 }}>
                <div
                  style={{
                    display: "flex",
                    width: `${d.value}%`,
                    height: "100%",
                    borderRadius: 999,
                    background: "linear-gradient(90deg,#2C7A7B,#F4B942,#FF6B6B)",
                  }}
                />
              </div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 24, fontSize: 40, fontWeight: 600, color: "#C7D9EB" }}>
            {siteLabel}
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1920, emoji: "twemoji" }
  );
}
