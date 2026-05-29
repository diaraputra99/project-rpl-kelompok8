import React from "react";
import "./PaymentSuccessScreen.css";

// ===================== SUB-COMPONENTS =====================

function BigCheck() {
  return (
    <div className="big-check">
      ✅
    </div>
  );
}

function ReceiptCard({ orderCode, method, time, table, total }) {
  const rows = [
    { label: "No. Order", value: orderCode },
    { label: "Metode",    value: method    },
    { label: "Waktu",     value: time      },
    { label: "Meja",      value: table     },
    { label: "Total",     value: `Rp${total.toLocaleString("id")}`, isTotal: true },
  ];

  return (
    <div className="receipt-card">
      {rows.map((row) => (
        <div
          key={row.label}
          className={`receipt-row ${row.isTotal ? "receipt-total" : ""}`}
        >
          <span className="receipt-key">{row.label}</span>
          <span className="receipt-val">{row.value}</span>
        </div>
      ))}
    </div>
  );
}

function ActionButtons({ onDownload, onGoToMenu }) {
  return (
    <div className="action-row">
      <button className="btn-download" onClick={onDownload}>
        ⬇️ Unduh Struk
      </button>
      <button className="btn-menu" onClick={onGoToMenu}>
        🍽️ Ke Menu
      </button>
    </div>
  );
}

// ===================== HELPERS =====================
function getNowString() {
  const now = new Date();
  const time = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = now.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return `${time}, ${date}`;
}

// ===================== MAIN SCREEN =====================

export default function PaymentSuccessScreen({
  orderCode = "#RFW00000000",
  method    = "QRIS",
  time      = getNowString(),
  table     = "7",
  total     = 0,
  onDownload,
  onGoToMenu,
}) {
  return (
    <div className="pay-success-screen">
      {/* TOP BAR */}
      <div className="topbar">
        <h2>ESB Order</h2>
      </div>

      {/* CONTENT */}
      <div className="success-content">

        <BigCheck />

        <h3 className="success-title">Pembayaran Berhasil!</h3>

        <div className="total-label">Total Pembayaran</div>
        <div className="total-amount">
          Rp{total.toLocaleString("id")}
        </div>

        <ReceiptCard
          orderCode={orderCode}
          method={method}
          time={time}
          table={table}
          total={total}
        />

        <ActionButtons
          onDownload={onDownload}
          onGoToMenu={onGoToMenu}
        />

      </div>
    </div>
  );
}
