import React, { useState, useEffect, useRef } from "react";
import "../styles/QRISscreen.css";
import qrisImage from "/qris.jpeg";

// ===================== CONSTANTS =====================
const MERCHANT = {

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
const AUTO_BACK_SECONDS = 5;       // detik sebelum auto-back setelah expired

// ===================== HELPERS =====================
function formatTime(s) {
  return `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}

// ===================== SUB-COMPONENTS =====================
function CountdownBar({ remaining }) {
  const pct     = (remaining / COUNTDOWN_SECONDS) * 100;
  const isUrgent = remaining <= 60;
  return (
    <div className="countdown-bar">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="countdown-label">Selesaikan pembayaran dalam waktu</div>
        <div className={`countdown-timer ${isUrgent ? "urgent" : ""}`}>
          {remaining === 0 ? "Waktu Habis" : formatTime(remaining)}
        </div>
      </div>
      {/* progress bar */}
      <div style={{ marginTop: 6, height: 4, background: "#E8DCC8", borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 4,
          background: isUrgent ? "#c0392b" : "#B8860B",
          width: `${pct}%`,
          transition: "width 1s linear, background 0.3s",
        }} />
      </div>
    </div>
  );
}

function QRISCard({ canvasRef, subtotal, expired }) {
  const formatRp = (n) => "Rp" + Number(n).toLocaleString("id-ID");
  return (
    <div className="qris-card" style={{ position: "relative" }}>
      {expired && (
        <div style={{
          position: "absolute", inset: 0, background: "rgba(250,243,236,0.92)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          zIndex: 5, borderRadius: 12, gap: 6,
        }}>
          <div style={{ fontSize: 40 }}>⏰</div>
          <div style={{ fontWeight: 800, fontSize: 14, color: "#c0392b" }}>Sesi QRIS Berakhir</div>
        </div>
      )}
      <div className="qris-card-body">
        <div className="qr-canvas-wrap">
          <img ref={canvasRef} src={qrisImage} alt="QRIS Payment" style={{ width: "100%", height: "auto" }} />
        </div>
        {/* Nominal harga otomatis sesuai transaksi */}
        <div style={{
          marginTop: 10, padding: "10px 16px",
          background: "#FFF8EC", borderRadius: 10,
          border: "1.5px solid #B8860B",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: 13, color: "#5A4A30", fontWeight: 600 }}>Nominal Pembayaran</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#B8860B" }}>{formatRp(subtotal)}</span>
        </div>
        <div style={{ fontSize: 11, color: "#9A8A70", textAlign: "center", marginTop: 6 }}>
          Pastikan jumlah sesuai sebelum membayar
        </div>
      </div>
    </div>
  );
}

function PayPhoneTabs({ activePhone, onSwitch }) {
  return (
    <div className="pay-phone-tabs">
      <button className={`pphone-btn ${activePhone === "same" ? "active" : ""}`} onClick={() => onSwitch("same")}>
        📱 Bayar dengan<br />ponsel yang sama
      </button>
      <button className={`pphone-btn ${activePhone === "other" ? "active" : ""}`} onClick={() => onSwitch("other")}>
        📲 Bayar dengan<br />ponsel lain
      </button>
    </div>
  );
}

function PaySteps({ steps }) {
  return (
    <div className="pay-steps">
      {steps.map(step => (
        <div key={step.num} className="step-row">
          <div className="step-num">{step.num}</div>
          <div className="step-text">{step.text}</div>
        </div>
      ))}
    </div>
  );
}

// ===================== EXPIRED MODAL =====================
function ExpiredModal({ countdown, onBack }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 999, padding: 24,
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: "32px 28px",
        textAlign: "center", maxWidth: 320, width: "100%",
        boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
        animation: "qrisModalIn 0.2s ease",
      }}>
        <style>{`@keyframes qrisModalIn { from{transform:scale(0.9);opacity:0} to{transform:scale(1);opacity:1} }`}</style>
        <div style={{ fontSize: 56, marginBottom: 12 }}>⏰</div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "#c0392b", margin: "0 0 8px" }}>
          Waktu Pembayaran Habis
        </h3>
        <p style={{ fontSize: 13, color: "#888", lineHeight: 1.6, margin: "0 0 8px" }}>
          Sesi QRIS telah berakhir. Kamu akan kembali ke halaman pembayaran dalam
        </p>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#B8860B", marginBottom: 20 }}>{countdown}</div>
        <button onClick={onBack} style={{
          width: "100%", background: "#B8860B", color: "#fff", border: "none", borderRadius: 12,
          padding: "13px 0", fontSize: 14, fontWeight: 800, cursor: "pointer",
          fontFamily: "'Nunito',sans-serif",
        }}>
          Kembali Sekarang
        </button>
      </div>
    </div>
  );
}

// ===================== MAIN SCREEN =====================
export default function QRISScreen({ subtotal = 0, onBack, onCheckStatus }) {
  const [remaining, setRemaining]       = useState(COUNTDOWN_SECONDS);
  const [expired, setExpired]           = useState(false);
  const [backCountdown, setBackCountdown] = useState(AUTO_BACK_SECONDS);
  const [activePhone, setActivePhone]   = useState("same");
  const canvasRef = useRef(null);

  // Countdown utama
  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) { clearInterval(id); setExpired(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Auto-back 5 detik setelah expired
  useEffect(() => {
    if (!expired) return;
    if (backCountdown <= 0) { onBack(); return; }
    const t = setTimeout(() => setBackCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [expired, backCountdown, onBack]);

  // Gambar QR canvas
  useEffect(() => {
    if (canvasRef.current && subtotal >= 0) {
      // Image sudah dimuat, tidak perlu generate QR
    }
  }, [subtotal]);

  function handleDownloadQR() {
    const img = canvasRef.current;
    if (!img) return;

    // Buat canvas dari gambar QRIS
    const source = document.createElement("canvas");
    source.width  = img.naturalWidth  || 600;
    source.height = img.naturalHeight || 600;
    const sCtx = source.getContext("2d");
    sCtx.drawImage(img, 0, 0);

    // Canvas output: QRIS + header + harga
    const out    = document.createElement("canvas");
    const W      = source.width;
    const HEADER = Math.round(W * 0.13);  // ~13% tinggi untuk header
    const FOOTER = Math.round(W * 0.18);  // ~18% tinggi untuk harga
    out.width    = W;
    out.height   = source.height + HEADER + FOOTER;

    const ctx = out.getContext("2d");

    // Background putih
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, out.width, out.height);

    // Header — bar coklat gelap
    ctx.fillStyle = "#1A1208";
    ctx.fillRect(0, 0, W, HEADER);
    ctx.fillStyle = "#E8A020";
    ctx.font      = `bold ${Math.round(W * 0.05)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("Warkop HS Balio", W / 2, HEADER * 0.65);

    // Gambar QRIS di tengah
    ctx.drawImage(source, 0, HEADER, W, source.height);

    // Footer — nominal harga
    const fy = source.height + HEADER;
    ctx.fillStyle = "#FFF8EC";
    ctx.fillRect(0, fy, W, FOOTER);

    // Garis atas footer
    ctx.strokeStyle = "#B8860B";
    ctx.lineWidth   = Math.round(W * 0.005);
    ctx.beginPath();
    ctx.moveTo(0, fy); ctx.lineTo(W, fy);
    ctx.stroke();

    // Label "Nominal Pembayaran"
    ctx.fillStyle = "#5A4A30";
    ctx.font      = `${Math.round(W * 0.038)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("Nominal Pembayaran", W / 2, fy + FOOTER * 0.35);

    // Harga besar
    const harga = "Rp" + Number(subtotal).toLocaleString("id-ID");
    ctx.fillStyle = "#B8860B";
    ctx.font      = `bold ${Math.round(W * 0.07)}px sans-serif`;
    ctx.fillText(harga, W / 2, fy + FOOTER * 0.75);

    // Download
    const link    = document.createElement("a");
    link.download = `QRIS-WarkopHS-${Number(subtotal).toLocaleString("id-ID")}.png`;
    link.href     = out.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="qris-screen">
      {/* Modal expired */}
      {expired && <ExpiredModal countdown={backCountdown} onBack={onBack} />}

      {/* TOP BAR */}
      <div className="topbar">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2>Pembayaran QRIS</h2>
      </div>

      {/* COUNTDOWN */}
      <CountdownBar remaining={remaining} />

      {/* SCROLL CONTENT */}
      <div className="scroll-content">
        <div className="scroll-inner">
          <QRISCard canvasRef={canvasRef} subtotal={subtotal} expired={expired} />

          <div className="action-row">
            <button
              className="cek-status-btn"
              onClick={onCheckStatus}
              disabled={expired}
              style={expired ? { opacity: 0.4, cursor: "not-allowed" } : {}}
            >
              Cek Status Pembayaran
            </button>
            <button
              className="download-btn"
              onClick={handleDownloadQR}
              title="Download QR"
              disabled={expired}
              style={expired ? { opacity: 0.4, cursor: "not-allowed" } : {}}
            >
              ⬇️
            </button>
          </div>

          <div className="cara-bayar-card">
            <h4>Cara Pembayaran:</h4>
            <PayPhoneTabs activePhone={activePhone} onSwitch={setActivePhone} />
            <PaySteps steps={PAY_STEPS[activePhone]} />
          </div>
        </div>
      </div>
    </div>
  );
}