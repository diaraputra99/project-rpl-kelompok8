import React from "react";
import "./OrderSuccessScreen.css";

// ===================== SUB-COMPONENTS =====================

function SuccessBadge({ orderCode, table, type }) {
  return (
    <div className="success-badge-wrap">
      <div className="order-num">{orderCode}</div>
      <div className="order-meta-badge">
        <span>🪑 Meja <strong>{table}</strong></span>
        <span className="divider">|</span>
        <span>🍽️ {type}</span>
      </div>
    </div>
  );
}

// ===================== MAIN SCREEN =====================

export default function OrderSuccessScreen({
  orderCode = "#RFW-20250422-007",
  table = "7",
  type = "Makan di tempat",
  onBackToMenu,
  onGoToHistory,
}) {
  return (
    <div className="order-success-screen">


      {/* TOP BAR */}
      <div className="topbar">
        <h2>Pesanan Dikirim</h2>
      </div>

      {/* CONTENT */}
      <div className="success-content">

        {/* Ilustrasi & pesan */}
        <div className="success-icon">✅</div>
        <h3 className="success-title">Pesanan Berhasil!</h3>
        <p className="success-desc">
          Pesanan kamu sedang diproses oleh dapur. Silakan tunggu di meja.
        </p>

        <SuccessBadge
          orderCode={orderCode}
          table={table}
          type={type}
        />
      </div>

      {/* ACTION BUTTONS */}
      <div className="action-wrap">
        <button className="btn-primary" onClick={onBackToMenu}>
          Kembali ke Menu
        </button>
        <button className="btn-secondary" onClick={onGoToHistory}>
          Lihat Riwayat Pesanan
        </button>
      </div>

    </div>
  );
}
