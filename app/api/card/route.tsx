import { ImageResponse } from "next/og";
import { results } from "@/games/climber-personality/results";
import { DIMENSIONS } from "@/games/climber-personality/dimensions";

export const runtime = "edge";

// Server-rendered 1080x1920 "Climber DNA" share card.
// Reliable on every device (unlike client-side html-to-image, which can
// produce black/blank images on mobile Safari).
// Usage: /api/card?r=<resultId>&s=<v,v,v,v,v,v>  (values in DIMENSIONS order)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const r = searchParams.get("r") || results[0].id;
  const s = (searchParams.get("s") || "")
    .split(",")
    .map((n) => Math.max(0, Math.min(100, parseInt(n, 10) || 0)));
  const result = results.find((x) => x.id === r) || results[0];
  const dna = DIMENSIONS.map((d, i) => ({
    label: d.label,
    emoji: d.emoji,
    value: s[i] ?? 0,
  }));
  const accent = result.accent === "#0F2D3A" ? "#C7D9EB" : result.accent;
  const siteLabel = (process.env.NEXT_PUBLIC_SITE_URL || "play.crux8.com").replace(
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
            MY CLIMBER DNA 🧬
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ display: "flex", fontSize: 200, lineHeight: 1 }}>{result.emoji}</div>
          <div style={{ display: "flex", fontSize: 88, fontWeight: 800, marginTop: 24, color: accent, lineHeight: 1.05 }}>
            {result.name}
          </div>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 500, marginTop: 30, maxWidth: 860, textAlign: "center" }}>
            “{result.tagline}”
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
