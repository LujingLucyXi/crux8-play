"use client";

import { forwardRef } from "react";
import type { DnaScore, ResultType } from "@/lib/gameTypes";

// Full-resolution (1080×1920) "CLIMBER DNA" story card. Rendered off-screen and
// captured to PNG via html-to-image. Contains NO app UI — pure branded content.
const ShareCard = forwardRef<
  HTMLDivElement,
  { result: ResultType; dna: DnaScore[]; siteLabel: string }
>(function ShareCard({ result, dna, siteLabel }, ref) {
  const accent = result.accent === "#0F2D3A" ? "#C7D9EB" : result.accent;
  return (
    <div
      ref={ref}
      style={{
        width: 1080,
        height: 1920,
        position: "absolute",
        left: -99999,
        top: 0,
        padding: "100px 90px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: `linear-gradient(160deg, #0F2D3A 0%, #0a2029 55%, ${result.accent}22 100%)`,
        color: "#fff",
        fontFamily: "var(--font-poppins), system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ letterSpacing: 16, fontSize: 38, fontWeight: 700, color: "#F4B942" }}>
          CRUX8 PLAY
        </div>
        <div style={{ marginTop: 40, fontSize: 46, fontWeight: 600, color: "#C7D9EB" }}>
          MY CLIMBER DNA 🧬
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <div style={{ fontSize: 180, lineHeight: 1 }}>{result.emoji}</div>
        <div style={{ marginTop: 20, fontSize: 84, fontWeight: 700, lineHeight: 1.05, color: accent }}>
          {result.name}
        </div>
        <div style={{ marginTop: 30, fontSize: 42, fontWeight: 500 }}>“{result.tagline}”</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {dna.map((s) => (
          <div key={s.key} style={{ display: "flex", flexDirection: "column", marginBottom: 28 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 38,
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              <span>
                {s.emoji} {s.label}
              </span>
              <span>{s.value}%</span>
            </div>
            <div style={{ display: "flex", height: 22, background: "rgba(255,255,255,0.12)", borderRadius: 999 }}>
              <div
                style={{
                  width: `${s.value}%`,
                  height: "100%",
                  borderRadius: 999,
                  background: "linear-gradient(90deg,#2C7A7B,#F4B942,#FF6B6B)",
                }}
              />
            </div>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 20, fontSize: 38, fontWeight: 600, color: "#C7D9EB" }}>
          {siteLabel}
        </div>
      </div>
    </div>
  );
});

export default ShareCard;
