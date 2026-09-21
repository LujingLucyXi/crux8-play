import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "What Type of Climber Are You? | Crux8 Play";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg,#070708 0%,#0e0c07 60%,#241a08 130%)",
          color: "#F5EFE0",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 32, letterSpacing: 12, color: "#F4B942", fontWeight: 700 }}>
          CRUX8 PLAY
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 84,
            fontWeight: 800,
            marginTop: 20,
            lineHeight: 1.05,
          }}
        >
          <span>What Type of</span>
          <span>Climber Are You? 🧗</span>
        </div>
        <div style={{ display: "flex", fontSize: 36, marginTop: 30, color: "#A68B3C" }}>
          Find your climbing personality in 60 seconds.
        </div>
      </div>
    ),
    { ...size }
  );
}
