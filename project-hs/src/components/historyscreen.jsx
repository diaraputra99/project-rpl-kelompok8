import React, { useState, useEffect } from "react";
import "../styles/historyscreen.css";
import { supabase } from "../supabase";

function EmptyState({ icon, label }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <p>{label}</p>
    </div>
  );
}

function OrderCard({ order, onClick }) {
  const itemCount = order.order_items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const itemNames = order.order_items?.map(i => i.menus?.name).filter(Boolean).join(", ") || "";
  const tanggal   = new Date(order.created_at).toLocaleString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="order-card" onClick={onClick}>
      <div className="order-resto">Warkop HS Balio</div>
      <div className="order-total">
        Rp{Number(order.total_price).toLocaleString("id")}{" "}
        <span className="order-item-count">({itemCount} item)</span>
      </div>
      <div className="order-items">{itemNames}</div>
      <div className="order-code">#{order.id.slice(0, 8).toUpperCase()}</div>
      <div className="order-meta">
        <div>
          <div className="order-type">Meja {order.table_number} • Makan di tempat</div>
          <div className="order-date">{tanggal}</div>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20,
          background: order.status === "selesai" ? "#d4edda" : order.status === "pending" ? "#fff3cd" : "#f8d7da",
          color: order.status === "selesai" ? "#155724" : order.status === "pending" ? "#856404" : "#721c24",
        }}>
          {order.status === "selesai" ? "✓ Selesai" : order.status === "pending" ? "⏳ Diproses" : order.status}
        </span>
      </div>
    </div>
  );
}

export default function HistoryScreen({
  onBack,
  onGoToMenu,
  onGoToStore,
  onGoToProfile,
}) {
  const [activeTab, setActiveTab] = useState("pesan");
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(quantity, menus(name))")
        .order("created_at", { ascending: false })
        .limit(30);
      if (data) setOrders(data);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  return (
    <div className="history-screen">
      <div className="topbar">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2>Riwayat Pesanan</h2>
      </div>

      <div className="tab-switcher">
        <button className={`tab-btn ${activeTab === "pesan" ? "active" : ""}`} onClick={() => setActiveTab("pesan")}>Pesan</button>
        <button className={`tab-btn ${activeTab === "reservasi" ? "active" : ""}`} onClick={() => setActiveTab("reservasi")}>Reservasi</button>
      </div>

      <div className="scroll-content">
        {activeTab === "pesan" && (
          <>
            {loading ? (
              <div style={{ textAlign: "center", padding: 40, fontSize: 13, color: "#9A8A70" }}>Memuat riwayat...</div>
            ) : orders.length === 0 ? (
              <EmptyState icon="🛒" label="Anda belum memesan apa pun" />
            ) : (
              orders.map(order => (
                <OrderCard key={order.id} order={order} onClick={() => {}} />
              ))
            )}
          </>
        )}
        {activeTab === "reservasi" && (
          <EmptyState icon="📅" label="Anda belum memiliki reservasi" />
        )}
      </div>

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