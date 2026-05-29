import React, { useState } from "react";
import "./CartScreen.css";

// ===================== SUB-COMPONENTS =====================

function EmptyCart() {
  return (
    <div className="empty-state">
      <div className="empty-icon">🛒</div>
      <p>Keranjang kamu kosong</p>
    </div>
  );
}

function CartItem({ item, onAdd, onRemove }) {
  const subtotal = item.price * item.qty;

  return (
    <div className="cart-item">
      <div className="ci-img">{item.emoji}</div>

      <div className="ci-info">
        <div className="ci-name">{item.name}</div>
        <div className="ci-price">Rp{item.price.toLocaleString("id")}</div>
        <div className="ci-qty">
          <button onClick={onRemove}>−</button>
          <span>{item.qty}</span>
          <button onClick={onAdd}>+</button>
        </div>
      </div>

      <div className="ci-subtotal">
        Rp{subtotal.toLocaleString("id")}
      </div>
    </div>
  );
}

function CartSummary({ subtotal }) {
  return (
    <div className="cart-summary">
      <div className="sum-row">
        <span>Subtotal</span>
        <span>Rp{subtotal.toLocaleString("id")}</span>
      </div>
      <div className="sum-row">
        <span>Biaya Layanan</span>
        <span>Rp0</span>
      </div>
      <div className="sum-row total">
        <span>Total</span>
        <span>Rp{subtotal.toLocaleString("id")}</span>
      </div>
    </div>
  );
}

function NoteInput({ value, onChange }) {
  return (
    <div className="note-box">
      <div className="note-label">CATATAN</div>
      <textarea
        placeholder="Contoh: tanpa sambal, tambah es batu..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// ===================== MAIN SCREEN =====================

export default function CartScreen({
  cart,
  menuData,
  onAddToCart,
  onRemoveFromCart,
  onBack,
  onCheckout,
}) {
  const [note, setNote] = useState("");

  // Gabungkan cart dengan data menu
  const cartItems = Object.entries(cart)
    .map(([id, qty]) => {
      const item = menuData.find((m) => m.id === Number(id));
      return item ? { ...item, qty } : null;
    })
    .filter(Boolean);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const isEmpty  = cartItems.length === 0;

  return (
    <div className="cart-screen">

      {/* STATUS BAR */}
      <div className="status-bar">
        <span className="time">20:15</span>
        <div className="icons">📶 🔋</div>
      </div>

      {/* TOP BAR */}
      <div className="topbar">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2>Keranjang</h2>
      </div>

      {/* CONTENT */}
      <div className="scroll-content">
        <div className="scroll-inner">

          {isEmpty ? (
            <EmptyCart />
          ) : (
            <>
              {/* Daftar item */}
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onAdd={() => onAddToCart(item.id)}
                  onRemove={() => onRemoveFromCart(item.id)}
                />
              ))}

              {/* Ringkasan harga */}
              <CartSummary subtotal={subtotal} />

              {/* Catatan */}
              <NoteInput value={note} onChange={setNote} />
            </>
          )}

        </div>
      </div>

      {/* CHECKOUT BUTTON */}
      {!isEmpty && (
        <div className="checkout-wrap">
          <button
            className="checkout-btn"
            onClick={() => onCheckout({ note, subtotal })}
          >
            Lanjut Pembayaran →
          </button>
        </div>
      )}

    </div>
  );
}
