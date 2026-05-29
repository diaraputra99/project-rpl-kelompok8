import React from "react";
import "./OrderDetailScreen.css";

// ===================== DATA DUMMY =====================
const DUMMY_ORDER = {
  id: "SRYNPHT12438ND",
  status: "Selesai",
  type: "Makan di tempat",
  table: "7",
  items: [
    { name: "Kopi Susu",   qty: 1, price: 8000  },
    { name: "Nasi Goreng", qty: 1, price: 13000 },
    { name: "Mie Rebus",   qty: 1, price: 10000 },
  ],
};

// ===================== SUB-COMPONENTS =====================

function OrderCodeCard({ order }) {
  const total = order.items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="code-card">
      <div className="code-label">Kode Pesanan</div>
      <div className="code-value">#{order.id}</div>

      <div className="badge-row">
        <span className="badge badge-success">✅ {order.status}</span>
        <span className="badge badge-muted">{order.type}</span>
        <span className="badge badge-muted">Meja {order.table}</span>
      </div>
    </div>
  );
}

function OrderItemsCard({ items }) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="items-card">
      <div className="items-title">Item Pesanan</div>

      {items.map((item, idx) => (
        <div key={idx} className="item-row">
          <span className="item-name">
            {item.qty}× {item.name}
          </span>
          <span className="item-price">
            Rp{(item.price * item.qty).toLocaleString("id")}
          </span>
        </div>
      ))}

      <div className="item-row total-row">
        <span>Total</span>
        <span className="total-price">
          Rp{total.toLocaleString("id")}
        </span>
      </div>
    </div>
  );
}

// ===================== MAIN SCREEN =====================

export default function OrderDetailScreen({
  order = DUMMY_ORDER,
  onBack,
  onReorder,
}) {
  return (
    <div className="order-detail-screen">

      {/* TOP BAR */}
      <div className="topbar">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2>Detail Pesanan</h2>
      </div>

      {/* CONTENT */}
      <div className="scroll-content">
        <div className="content-padding">
          <OrderCodeCard order={order} />
          <OrderItemsCard items={order.items} />

          <button
            className="reorder-btn"
            onClick={onReorder}
          >
            Pesan Lagi
          </button>
        </div>
      </div>

    </div>
  );
}
