import React, { useState } from "react";
import "./PaymentScreen.css";

// ===================== SUB-COMPONENTS =====================

function OrdererForm() {
  return (
    <div className="form-section">
      <div className="form-title">Informasi Pemesan</div>

      <div className="form-field">
        <label>Nama Lengkap</label>
        <div className="field-wrap">
          <span className="field-icon">👤</span>
          <input type="text" placeholder="Nama Lengkap" />
        </div>
      </div>

      <div className="form-field">
        <label>Nomor Ponsel</label>
        <div className="field-wrap">
          <span className="field-icon">📞</span>
          <input type="tel" placeholder="Nomor Ponsel" />
        </div>
      </div>

      <div className="form-field">
        <label>Kirim struk ke email</label>
        <div className="field-wrap">
          <span className="field-icon">✉️</span>
          <input type="email" placeholder="Email" />
        </div>
      </div>

      <div className="form-field">
        <label>Nomor Meja</label>
        <div className="field-wrap">
          <span className="field-icon">🪑</span>
          <input
            type="text"
            value="7"
            readOnly
            className="input-readonly"
          />
        </div>
      </div>

      <div className="store-notice">
        Kamu pesan dari &nbsp;<strong>Warkop HS Balio</strong>
      </div>
    </div>
  );
}

function MethodSelector({ method, onSelect }) {
  return (
    <div className="method-wrap">
      <div className="method-label">Metode Pembayaran</div>
      <div className="method-selector">
        <button
          className={`method-btn ${method === "online" ? "active" : ""}`}
          onClick={() => onSelect("online")}
        >
          💳 Pembayaran Online
        </button>
        <button
          className={`method-btn ${method === "cash" ? "active" : ""}`}
          onClick={() => onSelect("cash")}
        >
          💵 Bayar di Kasir
        </button>
      </div>
    </div>
  );
}

function QRISOption({ agreed, onToggle }) {
  return (
    <div className="qris-option-wrap">
      {/* QRIS card selector */}
      <div className="qris-selector">
        <div className="qris-left">
          <div className="qris-logo-box">QRIS</div>
          <span className="qris-label">QRIS</span>
        </div>
        <div className="qris-check">✓</div>
      </div>

      {/* Syarat & ketentuan */}
      <div className="syarat-row">
        <input
          type="checkbox"
          id="syarat"
          checked={agreed}
          onChange={onToggle}
        />
        <label htmlFor="syarat">
          Saya setuju dengan{" "}
          <a href="#">Syarat &amp; Ketentuan</a> dan{" "}
          <a href="#">Kebijakan Privasi</a>
        </label>
      </div>
    </div>
  );
}

function CashInfo() {
  return (
    <div className="cash-info">
      🧾 Klik <strong>'Bayar di Kasir'</strong> lalu tunjukkan QR ke kasir
      untuk proses pembayaran tunai.
    </div>
  );
}

// ===================== MAIN SCREEN =====================

export default function PaymentScreen({
  subtotal = 0,
  onBack,
  onPay,
}) {
  const [method, setMethod]   = useState("online");
  const [agreed, setAgreed]   = useState(true);

  function handlePay() {
    if (method === "online" && !agreed) {
      alert("Harap setujui syarat & ketentuan terlebih dahulu.");
      return;
    }
    onPay({ method, agreed });
  }

  return (
    <div className="payment-screen">

      {/* STATUS BAR */}
      <div className="status-bar">
        <span className="time">20:15</span>
        <div className="icons">📶 🔋</div>
      </div>

      {/* TOP BAR */}
      <div className="topbar">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2>Pembayaran</h2>
      </div>

      {/* ORDER TYPE TABS */}
      <div className="order-type-tabs">
        <button className="ot-tab active">Tipe Pemesanan</button>
        <button className="ot-tab ot-tag">Makan di tempat 🍽️</button>
      </div>

      {/* SCROLL CONTENT */}
      <div className="scroll-content">
        <div className="scroll-inner">

          {/* Form pemesan */}
          <OrdererForm />

          {/* Pilih metode */}
          <MethodSelector method={method} onSelect={setMethod} />

          {/* Konten berdasarkan metode */}
          {method === "online" ? (
            <QRISOption
              agreed={agreed}
              onToggle={() => setAgreed((v) => !v)}
            />
          ) : (
            <CashInfo />
          )}

        </div>
      </div>

      {/* FOOTER TOTAL + BAYAR */}
      <div className="pay-footer">
        <div className="pay-footer-left">
          <div className="footer-label">Total Pembayaran</div>
          <div className="footer-amount">
            Rp{subtotal.toLocaleString("id")}
          </div>
        </div>
        <button className="pay-now-btn" onClick={handlePay}>
          Bayar
        </button>
      </div>

    </div>
  );
}
