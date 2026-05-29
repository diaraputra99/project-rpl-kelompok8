import React, { useState } from "react";
import "./HistoryScreen.css";

// ===================== DATA DUMMY =====================
const DUMMY_ORDERS = [
  {
    id: "SRYNPHT12438ND",
    resto: "Warkop HS Balio",
    total: 54000,
    items: [
      { name: "Kopi Susu",    qty: 1, price: 8000  },
      { name: "Nasi Goreng",  qty: 1, price: 13000 },
      { name: "Mie Rebus",    qty: 1, price: 10000 },
    ],
    type: "Makan di tempat",
    date: "22 Apr 2026, 20:34",
  },
];

// ===================== SUB-COMPONENTS =====================

function EmptyState({ icon, label }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <p>{label}</p>
    </div>
  );
}

function OrderCard({ order, onClick, onReorder }) {
  const itemCount = order.items.reduce((sum, i) => sum + i.qty, 0);
  const itemNames = order.items.map((i) => i.name).join(", ");

  return (
    <div className="order-card" onClick={onClick}>
      <div className="order-resto">{order.resto}</div>
      <div className="order-total">
        Rp{order.total.toLocaleString("id")}{" "}
        <span className="order-item-count">({itemCount} item)</span>
      </div>
      <div className="order-items">{itemNames}</div>
      <div className="order-code">#{order.id}</div>
      <div className="order-meta">
        <div>
          <div className="order-type">{order.type}</div>
          <div className="order-date">{order.date}</div>
        </div>
        <button
          className="pesan-lagi-btn"
          onClick={(e) => {
            e.stopPropagation();
            onReorder(order);
          }}
        >
          Pesan Lagi
        </button>
      </div>
    </div>
  );
}

// ===================== MAIN SCREEN =====================

export default function HistoryScreen({
  onBack,
  onGoToMenu,
  onGoToStore,
  onGoToProfile,
  onGoToOrderDetail,
  onReorder,
  onShowToast,
}) {
  const [activeTab, setActiveTab] = useState("pesan");

  return (
    <div className="history-screen">

      {/* STATUS BAR */}
      <div className="status-bar">
        <span className="time">20:15</span>
        <div className="icons">📶 🔋</div>
      </div>

      {/* TOP BAR */}
      <div className="topbar">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2>Riwayat Pesanan</h2>
      </div>

      {/* TAB SWITCHER */}
      <div className="tab-switcher">
        <button
          className={`tab-btn ${activeTab === "pesan" ? "active" : ""}`}
          onClick={() => setActiveTab("pesan")}
        >
          Pesan
        </button>
        <button
          className={`tab-btn ${activeTab === "reservasi" ? "active" : ""}`}
          onClick={() => setActiveTab("reservasi")}
        >
          Reservasi
        </button>
      </div>

      {/* CONTENT */}
      <div className="scroll-content">

        {/* Tab: Pesan */}
        {activeTab === "pesan" && (
          <>
            {DUMMY_ORDERS.length === 0 ? (
              <EmptyState icon="🛒" label="Anda belum memesan apa pun" />
            ) : (
              DUMMY_ORDERS.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClick={() => onGoToOrderDetail(order)}
                  onReorder={(o) => {
                    onReorder?.(o);
                    onShowToast?.("Item ditambahkan ke keranjang!");
                  }}
                />
              ))
            )}
          </>
        )}

        {/* Tab: Reservasi */}
        {activeTab === "reservasi" && (
          <EmptyState icon="📅" label="Anda belum memesan apa pun" />
        )}

      </div>

      {/* BOTTOM NAV */}
      <div className="bottom-nav">
        <button className="nav-item" onClick={onGoToMenu}>
          <span className="nav-icon">🍽️</span>Menu
        </button>
        <button className="nav-item" onClick={onGoToStore}>
          <span className="nav-icon">🏪</span>Toko
        </button>
        <button className="nav-item active">
          <span className="nav-icon">📋</span>Pesanan
        </button>
        <button className="nav-item" onClick={onGoToProfile}>
          <span className="nav-icon">👤</span>Profil
        </button>
      </div>
    </div>
  );
}
