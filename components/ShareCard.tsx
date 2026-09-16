"use client";

import { forwardRef } from "react";
import type { ResultType } from "@/lib/gameTypes";

// Full-resolution (1080×1920) story card. Rendered off-screen and captured
// to PNG via html-to-image. Contains NO app UI — pure branded content.
const ShareCard = forwardRef<HTMLDivElement, { result: ResultType; siteLabel: string }>(
  function ShareCard({ result, siteLabel }, ref) {
    const top3 = result.stats.slice(0, 3);
    return (
      <div
        ref={ref}
        style={{
          width: 1080,
          height: 1920,
          position: "absolute",
          left: -99999,
          top: 0,
          padding: "120px 90px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: `linear-gradient(160deg, #0F2D3A 0%, #0a2029 55%, ${result.accent}22 100%)`,
          color: "#fff",
          fontFamily: "var(--font-poppins), system-ui, sans-serif",
        }}
      >
        <div>
          <div style={{ letterSpacing: 18, fontSize: 40, fontWeight: 700, color: "#F4B942" }}>
            CRUX8
          </div>
          <div style={{ marginTop: 60, fontSize: 56, fontWeight: 600, color: "#C7D9EB" }}>
            WHAT&apos;S YOUR
            <br />
            CLIMBING TYPE?
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 200, lineHeight: 1 }}>{result.emoji}</div>
          <div
            style={{
              marginTop: 30,
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1.05,
              color: result.accent === "#0F2D3A" ? "#C7D9EB" : result.accent,
            }}
          >
            {result.name}
          </div>
          <div style={{ marginTop: 40, fontSize: 46, fontWeight: 500, color: "#fff" }}>
            “{result.tagline}”
          </div>
        </div>

        <div>
          {top3.map((s) => (
            <div key={s.key} style={{ marginBottom: 40 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 44,
                  fontWeight: 600,
                  marginBottom: 16,
                }}
              >
                <span>{s.label}</span>
                <span>{s.value}%</span>
              </div>
              <div style={{ height: 26, background: "rgba(255,255,255,0.12)", borderRadius: 999 }}>
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
          <div style={{ marginTop: 50, fontSize: 40, fontWeight: 600, color: "#C7D9EB", textAlign: "center" }}>
            {siteLabel}
          </div>
        </div>
      </div>
    );
  }
);

export default ShareCard;
