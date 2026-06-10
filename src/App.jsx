import './App.css'
import { useState, useCallback, useEffect, useRef } from "react";
import Hotspot from "./components/Hotspot";

export default function App() {
  const [pos, setPos] = useState({ x: -999, y: -999 });
  const size = 320;
  const [channel, setChannel] = useState('');
  const [inputVal, setInputVal] = useState('');
  const [connected, setConnected] = useState(false);
  const calibRef = useRef(null);
  const wsRef = useRef(null);
  const SENSITIVITY = 6;

  useEffect(() => {
    if (!channel) return;
    const ws = new WebSocket(`wss://gyro-cursor.martibl.partykit.dev/party/${channel}`);
    wsRef.current = ws;
    ws.onopen  = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type !== 'gyro') return;
        if (!calibRef.current) {
          calibRef.current = { beta: msg.beta, gamma: msg.gamma };
        }
        const dBeta  = msg.beta  - calibRef.current.beta;
        const dGamma = msg.gamma - calibRef.current.gamma;
        setPos({
          x: Math.max(0, Math.min(window.innerWidth,  window.innerWidth  / 2 + dGamma * SENSITIVITY)),
          y: Math.max(0, Math.min(window.innerHeight, window.innerHeight / 2 + dBeta  * SENSITIVITY)),
        });
      } catch (e) {}
    };
    return () => ws.close();
  }, [channel]);

  const connect = () => {
    const val = inputVal.trim().toUpperCase();
    if (val.length < 4) return;
    calibRef.current = null;
    setChannel(val);
  };

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

  // ── ADD YOUR ARTIFACTS HERE ──────────────────────────────
  const hotspots = [
    {
      src: "/ProjectAttempt2/artifact1.jpg",
      x: 200, y: 150, width: 120, height: 120,
      card: {
        name: "They eye of Horus",
        location: "Cairo",
        date: "456 BC",
        description: "The green-blue glaze and stylized eye shape in your image are very characteristic of Egyptian faience amulets dating anywhere from the Late Period through the Ptolemaic era, though precise dating would require archaeological context or expert examination. One interesting detail is the small projection at the top and bottom, which may indicate that this piece was designed to be attached to another object or strung as a pendant, rather than simply being a decorative plaque.",
      }
    },
    // copy the block above and paste it here for each new artifact
  ];
  // ────────────────────────────────────────────────────────

  return (
    <div
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      style={{
        width: "100vw", height: "100vh",
        position: "relative", overflow: "hidden",
        cursor: "none", userSelect: "none",
        background: "#0d0d0d",
      }}
    >
      {/* ── Channel connect overlay ── */}
      {!connected && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 99,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "#0d0d0dcc", backdropFilter: "blur(6px)",
          gap: 12, fontFamily: "monospace",
        }}>
          <p style={{ color: "#aaa", letterSpacing: "0.2em", fontSize: 12 }}>
            ENTER CHANNEL ID FROM PHONE
          </p>
          <input
            value={inputVal}
            onChange={e => setInputVal(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && connect()}
            maxLength={6} placeholder="ABC123"
            style={{
              background: "#111", color: "#fff", border: "1px solid #333",
              borderRadius: 8, padding: "10px 20px", fontSize: 20,
              letterSpacing: "0.3em", textAlign: "center",
              fontFamily: "monospace", outline: "none", width: 180,
            }}
          />
          <button onClick={connect} style={{
            background: "#222", color: "#fff", border: "1px solid #444",
            borderRadius: 8, padding: "8px 24px", cursor: "pointer",
            fontFamily: "monospace", letterSpacing: "0.15em",
          }}>
            Connect
          </button>
        </div>
      )}

      {/* ── Layer 1: dark background ── */}
      <div style={{ position: "absolute", inset: 0, background: "#0d0d0d", zIndex: 0 }} />

      {/* ── Layer 2: background image revealed by mask ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        WebkitMaskImage: maskGradient,
        maskImage: maskGradient,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <img
          src="/ProjectAttempt2/background.jpg"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
        />
      </div>

      {/* ── Layer 3: torch glow overlay ── */}
      <div style={{
        position: "absolute",
        left: pos.x - size / 2,
        top: pos.y - size / 2,
        width: size, height: size,
        borderRadius: "50%",
        background: torchGradient,
        mixBlendMode: "screen",
        zIndex: 2,
        pointerEvents: "none",
      }} />

      {/* ── Layer 4: hotspots ── */}
      {hotspots.map((h, i) => (
        <Hotspot
          key={i}
          {...h}
          torchX={pos.x}
          torchY={pos.y}
          torchRadius={size / 2}
        />
      ))}

      {/* ── Recalibrate button ── */}
      {connected && (
        <button
          onClick={() => { calibRef.current = null; }}
          style={{
            position: "absolute", bottom: 20, right: 20, zIndex: 10,
            padding: "8px 16px", background: "#222", color: "#fff",
            border: "1px solid #444", borderRadius: 8,
            cursor: "pointer", fontFamily: "monospace",
          }}
        >
          Recalibrate
        </button>
      )}

    </div>
  );
}