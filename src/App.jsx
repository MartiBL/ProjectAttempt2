
import './App.css'

import { useState, useCallback } from "react";

export default function App() {
  const [pos, setPos] = useState({ x: -999, y: -999 });
  const size = 320; // torch diameter

  const onMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const onTouchMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    setPos({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
    e.preventDefault();
  }, []);

  // The mask gradient mirrors the torch gradient exactly,
  // but capped at 1.0 (x*2 effect handled by using a steeper gradient).
  // Geometric decay: 1, 0.75, 0.56, 0.42, 0.32, 0.24, 0.18, 0.13, 0.10, 0.07, 0 
  // Doubled & clamped: 1, 1, 1, 0.84, 0.64, 0.48, 0.36, 0.26, 0.20, 0.14, 0
  const maskGradient = `radial-gradient(circle ${size / 2}px at ${pos.x}px ${pos.y}px,
    rgba(0,0,0,1)    0%,
    rgba(0,0,0,1)    10%,
    rgba(0,0,0,1)    20%,
    rgba(0,0,0,0.84) 30%,
    rgba(0,0,0,0.64) 40%,
    rgba(0,0,0,0.48) 50%,
    rgba(0,0,0,0.36) 60%,
    rgba(0,0,0,0.26) 70%,
    rgba(0,0,0,0.20) 80%,
    rgba(0,0,0,0.14) 90%,
    rgba(0,0,0,0)    100%
  )`;

  // Torch glow layer gradient (yellow light)
  const torchGradient = `radial-gradient(circle,
    rgba(255,220,50,1)    0%,
    rgba(255,220,50,0.75) 10%,
    rgba(255,220,50,0.56) 20%,
    rgba(255,220,50,0.42) 30%,
    rgba(255,220,50,0.32) 40%,
    rgba(255,220,50,0.24) 50%,
    rgba(255,220,50,0.18) 60%,
    rgba(255,220,50,0.13) 70%,
    rgba(255,220,50,0.10) 80%,
    rgba(255,220,50,0.07) 90%,
    rgba(255,220,50,0)    100%
  )`;

  return (
    <div
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        cursor: "none",
        userSelect: "none",
        background: "#0d0d0d",
      }}
    >
      {/* ── Layer 1: dark background ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: "#0d0d0d",
        zIndex: 0,
      }} />

      {/* ── Layer 2: picture / graphic — revealed by mask ── */}
      <div
        style={{
          position: "absolute", inset: 0,
          zIndex: 1,
          WebkitMaskImage: maskGradient,
          maskImage: maskGradient,
          // The "picture": a colourful SVG scene
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/*
          ── SWAP YOUR OWN IMAGE HERE ──────────────────────────────────────
          Replace everything from <svg ...> to </svg> below with any content
          you want revealed by the torch. For example, an image file:

            <img
              src="/your-image.jpg"
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover",
                       position: "absolute", inset: 0 }}
            />

          Or a regular <div> with text, a photo, a CSS background, etc.
          The mask will automatically cut out the torch shape from whatever
          is placed here — no other changes needed.
          ─────────────────────────────────────────────────────────────────
        */}
        {/* Inline SVG graphic that gets revealed */}
        <img
              src="/background.jpg"
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover",
                       position: "absolute", inset: 0 }}
            />
      </div>

      {/* ── Layer 3: torch glow overlay ── */}
      <div
        style={{
          position: "absolute",
          left: pos.x - size / 2,
          top: pos.y - size / 2,
          width: size,
          height: size,
          borderRadius: "50%",
          background: torchGradient,
          mixBlendMode: "screen",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
