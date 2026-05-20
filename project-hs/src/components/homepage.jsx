import React from "react";
import "../styles/homepage.css";

export default function SplashScreen({ onStart }) {
  return (
    <div className="splash-screen">
      <div className="splash-logo">
        {/* Logo hexagon */}
        <div className="splash-hex">
          <span className="splash-hs">HS</span>
        </div>

        {/* Nama resto */}
        <h1 className="splash-title">
          WARKOP
          <br />
          · HS ·
        </h1>

        <p className="splash-tagline">Coffee &amp; Dining</p>

        {/* Tombol mulai */}
        <button
          className="splash-btn"
          onClick={onStart}
        >
          Mulai Memesan ☕
        </button>
      </div>
    </div>
  );
}