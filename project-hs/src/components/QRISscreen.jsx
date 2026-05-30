import React, { useState, useEffect, useRef } from "react";
import "../styles/QRISscreen.css";

// ===================== CONSTANTS =====================
const MERCHANT = {
  name: "SYAARI, MAKANAN & MINUMAN",
  nmid: "NMID: 101234567891234",
};

const PAY_STEPS = {
  same: [
    { num: 1, text: <>Screenshot kode QRIS</> },
    { num: 2, text: <>Buka pembayaran QRIS di <strong>m-banking atau e-wallet</strong> kamu</> },
    { num: 3, text: <>Unggah gambar/hasil screenshot kode QRIS</> },
    { num: 4, text: <>Pastikan jumlah transaksimu dan lakukan pembayaran</> },
    { num: 5, text: <>Klik <strong>Cek Status Pembayaran</strong></> },
  ],
  other: [
    { num: 1, text: <>Minta teman scan kode QRIS dengan <strong>m-banking atau e-wallet</strong></> },
    { num: 2, text: <>Pastikan jumlah transaksi sesuai</> },
    { num: 3, text: <>Klik <strong>Cek Status Pembayaran</strong></> },
  ],
};

const COUNTDOWN_SECONDS = 10 * 60; // 10 menit

// ===================== HELPERS =====================
function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// Gambar QR simulasi di canvas (tanpa library eksternal)
function drawSimQR(canvas, amount) {
  const size   = 200;
  const modules = 25;
  const cell   = size / modules;

  canvas.width  = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, size, size);

  // Pseudo-random seeded dari amount
  let seed = amount + 12345;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  // Data modules
  ctx.fillStyle = "#1A1208";
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      const inFinder =
        (r < 8 && c < 8) ||
        (r < 8 && c > modules - 9) ||
        (r > modules - 9 && c < 8);
      const inTiming =
        (r === 6 && c > 7 && c < modules - 8) ||
        (c === 6 && r > 7 && r < modules - 8);
      if (inFinder || inTiming) continue;
      if (rand() > 0.5) {
        ctx.fillRect(c * cell, r * cell, cell - 0.5, cell - 0.5);
      }
    }
  }

  // Finder patterns (top-left, top-right, bottom-left)
  [[0, 0], [0, modules - 7], [modules - 7, 0]].forEach(([row, col]) => {
    ctx.fillStyle = "#1A1208";
    ctx.fillRect(col * cell, row * cell, 7 * cell, 7 * cell);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect((col + 1) * cell, (row + 1) * cell, 5 * cell, 5 * cell);
    ctx.fillStyle = "#1A1208";
    ctx.fillRect((col + 2) * cell, (row + 2) * cell, 3 * cell, 3 * cell);
  });

  // Timing patterns
  ctx.fillStyle = "#1A1208";
  for (let i = 8; i < modules - 8; i++) {
    if (i % 2 === 0) {
      ctx.fillRect(6 * cell, i * cell, cell, cell);
      ctx.fillRect(i * cell, 6 * cell, cell, cell);
    }
  }
}

// ===================== SUB-COMPONENTS =====================

function CountdownBar({ remaining }) {
  const isUrgent = remaining <= 60;
  return (
    <div className="countdown-bar">
      <div className="countdown-label">Selesaikan pembayaran dalam waktu</div>
      <div className={`countdown-timer ${isUrgent ? "urgent" : ""}`}>
        {formatTime(remaining)}
      </div>
    </div>
  );
}

function QRISCard({ canvasRef, subtotal }) {
  return (
    <div className="qris-card">
      {/* Header merah */}
      <div className="qris-card-header">
        <div className="qris-header-left">
          <span className="qris-title-text">QRIS</span>
          <span className="qris-subtitle">QR Code Standar Nasional Indonesia</span>
        </div>
        <div className="gpn-badge">GPN</div>
      </div>

      {/* Body */}
      <div className="qris-card-body">
        <div className="qris-merchant">
          <div className="merchant-name">{MERCHANT.name}</div>
          <div className="merchant-id">{MERCHANT.nmid}</div>
        </div>

        {/* Canvas QR */}
        <div className="qr-canvas-wrap">
          <canvas ref={canvasRef} id="qrisCanvas" />
        </div>
      </div>

      {/* Total */}
      <div className="qris-total-row">
        <span className="qt-label">Total Pembayaran</span>
        <span className="qt-amount">Rp{subtotal.toLocaleString("id")}</span>
      </div>
    </div>
  );
}

function PayPhoneTabs({ activePhone, onSwitch }) {
  return (
    <div className="pay-phone-tabs">
      <button
        className={`pphone-btn ${activePhone === "same" ? "active" : ""}`}
        onClick={() => onSwitch("same")}
      >
        📱 Bayar dengan<br />ponsel yang sama
      </button>
      <button
        className={`pphone-btn ${activePhone === "other" ? "active" : ""}`}
        onClick={() => onSwitch("other")}
      >
        📲 Bayar dengan<br />ponsel lain
      </button>
    </div>
  );
}

function PaySteps({ steps }) {
  return (
    <div className="pay-steps">
      {steps.map((step) => (
        <div key={step.num} className="step-row">
          <div className="step-num">{step.num}</div>
          <div className="step-text">{step.text}</div>
        </div>
      ))}
    </div>
  );
}

// ===================== MAIN SCREEN =====================

export default function QRISScreen({
  subtotal = 0,
  onBack,
  onCheckStatus,
}) {
  const [remaining, setRemaining] = useState(COUNTDOWN_SECONDS);
  const [activePhone, setActivePhone] = useState("same");
  const canvasRef = useRef(null);

  // Countdown timer
  useEffect(() => {
    if (remaining <= 0) return;
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Gambar QR saat canvas tersedia
  useEffect(() => {
    if (canvasRef.current && subtotal >= 0) {
      drawSimQR(canvasRef.current, subtotal || 54000);
    }
  }, [subtotal]);

  function handleDownloadQR() {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "QRIS-WarkopHS.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
  }

  return (
    <div className="qris-screen">

 
      {/* TOP BAR */}
      <div className="topbar">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2>Pembayaran</h2>
      </div>

      {/* COUNTDOWN */}
      <CountdownBar remaining={remaining} />

      {/* SCROLL CONTENT */}
      <div className="scroll-content">
        <div className="scroll-inner">

          {/* QR Card */}
          <QRISCard canvasRef={canvasRef} subtotal={subtotal} />

          {/* Tombol aksi */}
          <div className="action-row">
            <button className="cek-status-btn" onClick={onCheckStatus}>
              Cek Status Pembayaran
            </button>
            <button
              className="download-btn"
              onClick={handleDownloadQR}
              title="Download QR"
            >
              ⬇️
            </button>
          </div>

          {/* Cara bayar */}
          <div className="cara-bayar-card">
            <h4>Cara Pembayaran:</h4>
            <PayPhoneTabs
              activePhone={activePhone}
              onSwitch={setActivePhone}
            />
            <PaySteps steps={PAY_STEPS[activePhone]} />
          </div>

        </div>
      </div>
    </div>
  );
}