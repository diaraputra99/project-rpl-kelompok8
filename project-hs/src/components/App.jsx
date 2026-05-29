import { useState, useEffect, useRef, useCallback } from "react";

// ===================== DATA MENU =====================
const menuData = [
  { id: 1, name: "Kopi Hitam", price: 8000, category: "Minuman", emoji: "☕" },
  { id: 2, name: "Good Day Freeze", price: 8000, category: "Minuman", emoji: "🥤" },
  { id: 3, name: "Cappuccino", price: 9000, category: "Minuman", emoji: "☕" },
  { id: 4, name: "Air Putih", price: 4000, category: "Minuman", emoji: "💧" },
  { id: 5, name: "Susu Jahe", price: 8000, category: "Minuman", emoji: "🫖" },
  { id: 6, name: "Es Teh Manis", price: 5000, category: "Minuman", emoji: "🧋" },
  { id: 7, name: "Kopi Susu", price: 8000, category: "Minuman", emoji: "🍵" },
  { id: 8, name: "Teh Tarik", price: 7000, category: "Minuman", emoji: "🧉" },
  { id: 9, name: "Nasi Kubu", price: 4000, category: "Minuman", emoji: "🥛" },
  { id: 10, name: "Barcino", price: 9000, category: "Minuman", emoji: "🍫" },
  { id: 11, name: "Soda Kubu", price: 4000, category: "Minuman", emoji: "🫧" },
  { id: 12, name: "Byju", price: 4000, category: "Minuman", emoji: "🥤" },
  { id: 13, name: "Pancong Lumer Keju Coklat", price: 12000, category: "Pancong", emoji: "🧇" },
  { id: 14, name: "Pancong Susu Oreo", price: 12000, category: "Pancong", emoji: "🧇" },
  { id: 15, name: "Pancong Lumer Matcha", price: 12000, category: "Pancong", emoji: "🧇" },
  { id: 16, name: "Pancong Coklat", price: 12000, category: "Pancong", emoji: "🧇" },
  { id: 17, name: "Pancong Tiramisu", price: 10000, category: "Pancong", emoji: "🧇" },
  { id: 18, name: "Pancong Choco Crunchy", price: 14000, category: "Pancong", emoji: "🧇" },
  { id: 19, name: "Nasi Putih", price: 5000, category: "Nasi", emoji: "🍚" },
  { id: 20, name: "Nasi Ayom Geprek", price: 15000, category: "Nasi", emoji: "🍗" },
  { id: 21, name: "Nasi Dadar Telor", price: 9000, category: "Nasi", emoji: "🍳" },
  { id: 22, name: "Nasi Goreng Maberga", price: 15000, category: "Nasi", emoji: "🍳" },
  { id: 23, name: "Nasi Goreng Maberga Istimewa", price: 19000, category: "Nasi", emoji: "🍳" },
  { id: 24, name: "Nasi + Omlete", price: 16500, category: "Nasi", emoji: "🍳" },
  { id: 25, name: "Nasi + Ormlote Sapi", price: 22000, category: "Nasi", emoji: "🥩" },
  { id: 26, name: "Nasi + Goreng Sapi", price: 22000, category: "Nasi", emoji: "🥩" },
  { id: 27, name: "Nasi + Drenso Ayam", price: 22000, category: "Nasi", emoji: "🍗" },
  { id: 28, name: "Nasi + Drenso + Gibasi", price: 23000, category: "Nasi", emoji: "🍗" },
  { id: 29, name: "Nasi Saur Telor", price: 16000, category: "Nasi", emoji: "🥚" },
  { id: 30, name: "Nasi Ayam Sariniding", price: 18000, category: "Nasi", emoji: "🍗" },
  { id: 31, name: "Magelangan", price: 18000, category: "Magelangan", emoji: "🍜" },
  { id: 32, name: "Magelangan Extra Nasi", price: 20000, category: "Magelangan", emoji: "🍜" },
  { id: 33, name: "Magelangan Bakso", price: 21000, category: "Magelangan", emoji: "🍜" },
  { id: 34, name: "Magelangan Ayam Sair", price: 25000, category: "Magelangan", emoji: "🍜" },
  { id: 35, name: "Magelangan Sirkuit", price: 24000, category: "Magelangan", emoji: "🍜" },
  { id: 36, name: "Magelangan Kornet", price: 20000, category: "Magelangan", emoji: "🍜" },
  { id: 37, name: "Magelangan Nugget", price: 25000, category: "Magelangan", emoji: "🍜" },
  { id: 38, name: "Magelangan Telur Dadar", price: 21000, category: "Magelangan", emoji: "🍜" },
  { id: 39, name: "Magelangan Telur Ceplok", price: 21000, category: "Magelangan", emoji: "🍜" },
  { id: 40, name: "Magelangan Telur Crok Arik", price: 21000, category: "Magelangan", emoji: "🍜" },
  { id: 41, name: "Indomie Rebus", price: 9000, category: "Mie Rebus", emoji: "🍜" },
  { id: 42, name: "Indomie Rebus Double", price: 12000, category: "Mie Rebus", emoji: "🍜" },
  { id: 43, name: "Indomie Rebus Bakso", price: 11000, category: "Mie Rebus", emoji: "🍜" },
  { id: 44, name: "Indomie Rebus Ayam Sair", price: 14000, category: "Mie Rebus", emoji: "🍜" },
  { id: 45, name: "Indomie Rebus Kisa", price: 10000, category: "Mie Rebus", emoji: "🍜" },
  { id: 46, name: "Indonesia Goreng Telor", price: 9000, category: "Indonesia", emoji: "🍳" },
  { id: 47, name: "Indonesia Goreng Double", price: 11000, category: "Indonesia", emoji: "🍳" },
  { id: 48, name: "Indonesia Goreng Relo", price: 12500, category: "Indonesia", emoji: "🍳" },
  { id: 49, name: "Indonesia Goreng Kido", price: 10000, category: "Indonesia", emoji: "🍳" },
  { id: 50, name: "Indonesia Goreng", price: 12999, category: "Indonesia", emoji: "🍳" },
  { id: 51, name: "Nasi Goreng", price: 13000, category: "Nasi", emoji: "🍚" },
  { id: 52, name: "Nasi Ayom Degetek", price: 13000, category: "Nasi", emoji: "🍗" },
  { id: 53, name: "Bubur Kacang Hijau", price: 10000, category: "Bubur", emoji: "🫙" },
  { id: 54, name: "Mie Rebus", price: 10000, category: "Mie Rebus", emoji: "🍜" },
  { id: 55, name: "Pisang Keju Coklat", price: 14000, category: "Pisang Bakar", emoji: "🍌" },
];

const CATEGORIES = [
  "Semua", "Minuman", "Pancong", "Nasi", "Mie Rebus",
  "Magelangan", "Indonesia", "Bubur", "Pisang Bakar",
];

// ===================== HELPERS =====================
const formatRp = (n) => "Rp" + n.toLocaleString("id-ID");

// ===================== TOAST =====================
function Toast({ message, visible }) {
  return (
    <div style={{
      position: "absolute", bottom: 100, left: "50%",
      transform: "translateX(-50%)",
      background: "#1A1208", color: "#fff",
      padding: "10px 22px", borderRadius: 20,
      fontSize: 13, fontWeight: 600,
      whiteSpace: "nowrap", zIndex: 999,
      opacity: visible ? 1 : 0,
      transition: "opacity 0.22s",
      pointerEvents: "none",
      boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
    }}>
      {message}
    </div>
  );
}

// ===================== SPLASH SCREEN =====================
function SplashScreen({ onStart }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "linear-gradient(160deg, #1A0F04 0%, #3D1F0A 50%, #6B3F1E 100%)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Decorative circles */}
      <div style={{
        position: "absolute", width: 320, height: 320,
        borderRadius: "50%", border: "1px solid rgba(232,160,32,0.12)",
        top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: 220, height: 220,
        borderRadius: "50%", border: "1px solid rgba(232,160,32,0.18)",
        top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        pointerEvents: "none",
      }} />

      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.7s cubic-bezier(0.25,0.46,0.45,0.94)",
      }}>
        {/* Hexagon logo */}
        <div style={{
          width: 110, height: 110,
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          background: "rgba(184,134,11,0.18)",
          border: "3px solid #E8A020",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 38, color: "#E8A020", fontWeight: 700,
          }}>HS</span>
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          color: "#fff", fontSize: 28,
          letterSpacing: 6, textAlign: "center", lineHeight: 1.3,
          margin: 0,
        }}>WARKOP<br />· HS ·</h1>

        <p style={{
          color: "#E8A020", fontSize: 11,
          letterSpacing: 4, textTransform: "uppercase", margin: 0,
        }}>Coffee &amp; Dining</p>

        <button
          onClick={onStart}
          style={{
            marginTop: 32,
            background: "#E8A020", color: "#1A1208",
            border: "none", borderRadius: 50,
            padding: "14px 48px",
            fontSize: 15, fontWeight: 800,
            cursor: "pointer",
            fontFamily: "'Nunito', sans-serif",
            boxShadow: "0 4px 24px rgba(232,160,32,0.45)",
            transition: "transform 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          Mulai Memesan ☕
        </button>
      </div>
    </div>
  );
}

// ===================== MENU CARD =====================
function MenuCard({ item, qty, onAdd, onRemove }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 14,
      overflow: "hidden",
      border: "1px solid #E8DCC8",
      boxShadow: "0 2px 12px rgba(139,101,8,0.09)",
      transition: "transform 0.15s",
      cursor: "pointer",
    }}
      onMouseEnter={e => e.currentTarget.style.transform = "scale(0.98)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
    >
      {/* Image area */}
      <div style={{
        width: "100%", height: 110,
        background: "linear-gradient(135deg, #f5e6c8, #e8d4a0)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 38,
      }}>
        {item.emoji}
      </div>

      {/* Info */}
      <div style={{ padding: "8px 10px 10px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#1A1208", marginBottom: 3, lineHeight: 1.3 }}>
          {item.name}
        </div>
        <div style={{ fontSize: 11, color: "#B8860B", fontWeight: 700, marginBottom: 8 }}>
          {formatRp(item.price)}
        </div>

        {qty === 0 ? (
          <button
            onClick={() => onAdd(item.id)}
            style={{
              width: "100%", background: "#fff",
              border: "1.5px solid #B8860B",
              borderRadius: 7, padding: "5px 0",
              fontSize: 12, fontWeight: 700, color: "#B8860B",
              cursor: "pointer", fontFamily: "'Nunito', sans-serif",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#B8860B"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#B8860B"; }}
          >
            + Tambah
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
            <button
              onClick={() => onRemove(item.id)}
              style={{
                width: 26, height: 26, borderRadius: 6,
                border: "1.5px solid #B8860B", background: "none",
                color: "#B8860B", fontSize: 16, fontWeight: 700,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >−</button>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#1A1208" }}>{qty}</span>
            <button
              onClick={() => onAdd(item.id)}
              style={{
                width: 26, height: 26, borderRadius: 6,
                border: "1.5px solid #B8860B", background: "#B8860B",
                color: "#fff", fontSize: 16, fontWeight: 700,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >+</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ===================== MENU SCREEN =====================
function MenuScreen({ cart, onAdd, onRemove, onCartClick, onStoreClick, showToast }) {
  const [category, setCategory] = useState("Semua");
  const [search, setSearch] = useState("");

  const filtered = menuData.filter(item => {
    const matchCat = category === "Semua" || item.category === category;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      background: "#FAF3EC", overflow: "hidden",
    }}>
      

      {/* Header */}
      <div style={{
        background: "#fff", padding: "12px 16px 0",
        borderBottom: "1px solid #E8DCC8", flexShrink: 0,
      }}>
        {/* Table badge + hamburger */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{
            background: "#F5E9C9", color: "#8B6508",
            fontSize: 12, fontWeight: 700,
            padding: "4px 12px", borderRadius: 20,
            border: "1px solid #B8860B",
          }}>🪑 Nomor Meja: 7</span>
          <button
            style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#5A4A30", padding: "4px 8px" }}
            onClick={() => showToast("Menu navigasi terbuka")}
          >☰</button>
        </div>

        {/* Store info */}
        <div
          onClick={onStoreClick}
          style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 0", borderBottom: "1px solid #E8DCC8", cursor: "pointer",
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1208" }}>Warkop HS Balio</div>
            <div style={{ fontSize: 11, color: "#2E7D52", fontWeight: 600 }}>Buka 24 Jam</div>
          </div>
          <span style={{ color: "#9A8A70", fontSize: 18 }}>›</span>
        </div>

        {/* Search */}
        <div style={{ position: "relative", margin: "10px 0" }}>
          <span style={{
            position: "absolute", left: 10, top: "50%",
            transform: "translateY(-50%)", fontSize: 14, color: "#9A8A70",
          }}>🔍</span>
          <input
            type="text"
            placeholder="Mau makan apa hari ini?"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", background: "#FAF3EC",
              border: "1px solid #E8DCC8", borderRadius: 10,
              padding: "9px 12px 9px 34px",
              fontSize: 13, color: "#1A1208",
              fontFamily: "'Nunito', sans-serif", outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Category tabs */}
        <div style={{
          display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10,
          scrollbarWidth: "none",
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                flexShrink: 0,
                background: category === cat ? "#B8860B" : "none",
                border: `1.5px solid ${category === cat ? "#B8860B" : "#E8DCC8"}`,
                borderRadius: 20,
                padding: "5px 14px",
                fontSize: 12, fontWeight: 700,
                color: category === cat ? "#fff" : "#5A4A30",
                cursor: "pointer",
                fontFamily: "'Nunito', sans-serif",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}
            >{cat}</button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 90, scrollbarWidth: "none" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#9A8A70", fontSize: 13 }}>
            Tidak ada menu ditemukan
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12, padding: "14px 16px",
          }}>
            {filtered.map(item => (
              <MenuCard
                key={item.id}
                item={item}
                qty={cart[item.id] || 0}
                onAdd={onAdd}
                onRemove={onRemove}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cart FAB */}
      {totalItems > 0 && (
        <button
          onClick={onCartClick}
          style={{
            position: "absolute",
            bottom: 72, left: "50%",
            transform: "translateX(-50%)",
            background: "#B8860B", color: "#fff",
            border: "none", borderRadius: 50,
            padding: "14px 24px",
            display: "flex", alignItems: "center", gap: 10,
            cursor: "pointer",
            fontFamily: "'Nunito', sans-serif",
            fontSize: 14, fontWeight: 700,
            boxShadow: "0 6px 24px rgba(184,134,11,0.45)",
            minWidth: 220, justifyContent: "space-between",
            zIndex: 10, transition: "all 0.2s",
            animation: "fabPop 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          <span>🛒 Lihat Keranjang</span>
          <span style={{
            background: "#fff", color: "#B8860B",
            width: 24, height: 24, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 800,
          }}>{totalItems}</span>
        </button>
      )}

      {/* Bottom Nav */}
      <div style={{
        background: "#fff", borderTop: "1px solid #E8DCC8",
        display: "flex", flexShrink: 0,
      }}>
        {[
          { icon: "🍽️", label: "Menu", active: true },
          { icon: "🏪", label: "Toko", active: false, onClick: onStoreClick },
          { icon: "📋", label: "Pesanan", active: false },
          { icon: "👤", label: "Profil", active: false },
        ].map((nav, i) => (
          <button
            key={i}
            onClick={nav.onClick || (() => showToast(`${nav.label} — segera hadir!`))}
            style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", padding: "10px 0 8px",
              border: "none", background: "none",
              fontFamily: "'Nunito', sans-serif",
              fontSize: 10, fontWeight: 600,
              color: nav.active ? "#B8860B" : "#9A8A70",
              cursor: "pointer", gap: 3, transition: "color 0.15s",
            }}
          >
            <span style={{ fontSize: 20 }}>{nav.icon}</span>
            {nav.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ===================== CART SCREEN =====================
function CartScreen({ cart, onAdd, onRemove, onBack, onCheckout, showToast }) {
  const cartArr = Object.entries(cart).map(([id, qty]) => ({
    ...menuData.find(m => m.id === Number(id)), qty,
  }));
  const subtotal = cartArr.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FAF3EC" }}>
      
      {/* Topbar */}
      <div style={{
        background: "#fff", padding: "12px 16px",
        display: "flex", alignItems: "center", gap: 10,
        borderBottom: "1px solid #E8DCC8", flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          style={{
            width: 32, height: 32, borderRadius: "50%",
            border: "none", background: "#FAF3EC",
            cursor: "pointer", fontSize: 18, display: "flex",
            alignItems: "center", justifyContent: "center",
          }}
        >←</button>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1A1208", flex: 1, margin: 0 }}>Keranjang</h2>
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 20, scrollbarWidth: "none" }}>
        <div style={{ height: 10 }} />

        {cartArr.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", gap: 12 }}>
            <div style={{ fontSize: 64, opacity: 0.3 }}>🛒</div>
            <p style={{ fontSize: 13, color: "#9A8A70", fontWeight: 600 }}>Keranjang kamu kosong</p>
          </div>
        ) : (
          <>
            {cartArr.map(item => (
              <div key={item.id} style={{
                background: "#fff", margin: "0 16px 10px",
                borderRadius: 14, border: "1px solid #E8DCC8",
                padding: "12px 14px", display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 10,
                  background: "linear-gradient(135deg,#f5e6c8,#e8d4a0)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, flexShrink: 0,
                }}>{item.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1208" }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: "#B8860B", fontWeight: 700 }}>{formatRp(item.price)}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                    <button onClick={() => onRemove(item.id)} style={{
                      width: 26, height: 26, borderRadius: 7,
                      border: "1.5px solid #E8DCC8", background: "none",
                      fontSize: 16, fontWeight: 700, cursor: "pointer", color: "#1A1208",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>−</button>
                    <span style={{ fontSize: 14, fontWeight: 800, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => onAdd(item.id)} style={{
                      width: 26, height: 26, borderRadius: 7,
                      border: "1.5px solid #B8860B", background: "#B8860B",
                      fontSize: 16, fontWeight: 700, cursor: "pointer", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>+</button>
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#1A1208" }}>
                  {formatRp(item.price * item.qty)}
                </div>
              </div>
            ))}

            {/* Summary */}
            <div style={{
              background: "#fff", margin: "0 16px",
              borderRadius: 14, border: "1px solid #E8DCC8",
              padding: "14px 16px",
            }}>
              {[["Subtotal", formatRp(subtotal)], ["Biaya Layanan", "Rp0"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, color: "#5A4A30" }}>
                  <span>{k}</span><span>{v}</span>
                </div>
              ))}
              <div style={{
                display: "flex", justifyContent: "space-between", padding: "10px 0 0",
                fontSize: 15, fontWeight: 800, color: "#1A1208",
                borderTop: "1px solid #E8DCC8", marginTop: 6,
              }}>
                <span>Total</span><span>{formatRp(subtotal)}</span>
              </div>
            </div>

            {/* Note */}
            <div style={{ padding: "0 16px" }}>
              <div style={{
                margin: "14px 0 6px", background: "#fff", borderRadius: 12,
                border: "1px solid #E8DCC8", padding: 14,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#9A8A70", marginBottom: 8 }}>CATATAN</div>
                <textarea
                  placeholder="Contoh: tanpa sambal, tambah es batu..."
                  style={{
                    width: "100%", border: "none", background: "none",
                    fontFamily: "'Nunito', sans-serif", fontSize: 13,
                    color: "#1A1208", resize: "none", outline: "none", height: 60,
                  }}
                />
              </div>
            </div>

            <button
              onClick={onCheckout}
              style={{
                margin: "0 16px", width: "calc(100% - 32px)",
                background: "#B8860B", color: "#fff",
                border: "none", borderRadius: 12, padding: 15,
                fontSize: 15, fontWeight: 800,
                cursor: "pointer", fontFamily: "'Nunito', sans-serif",
                boxShadow: "0 4px 16px rgba(184,134,11,0.3)",
                transition: "all 0.15s",
              }}
            >Lanjut Pembayaran →</button>
          </>
        )}
      </div>
    </div>
  );
}

// ===================== SUCCESS SCREEN =====================
function SuccessScreen({ orderCode, onBackToMenu, onHistory }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FAF3EC" }}>
      <div style={{
        height: 48, background: "#fff", display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 20px",
        borderBottom: "1px solid #E8DCC8",
      }}>
        <span style={{ fontSize: 15, fontWeight: 800 }}>
          {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
        </span>
        <div>📶 🔋</div>
      </div>
      <div style={{
        background: "#fff", padding: "12px 16px",
        borderBottom: "1px solid #E8DCC8",
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1A1208", margin: 0 }}>Pesanan Dikirim</h2>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", gap: 14, textAlign: "center" }}>
        <div style={{ fontSize: 72 }}>✅</div>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: "#2E7D52", margin: 0 }}>Pesanan Berhasil!</h3>
        <p style={{ fontSize: 13, color: "#9A8A70", maxWidth: 260, margin: 0, lineHeight: 1.6 }}>
          Pesanan kamu sedang diproses oleh dapur. Silakan tunggu di meja.
        </p>
        <div style={{
          background: "#F5E9C9", border: "1px solid #B8860B",
          borderRadius: 10, padding: "12px 24px",
          fontSize: 14, fontWeight: 800, color: "#8B6508", fontFamily: "monospace",
        }}>{orderCode}</div>
        <div style={{
          background: "#F5E9C9", borderRadius: 12, padding: "14px 20px",
          fontSize: 13, color: "#5A4A30", textAlign: "center", maxWidth: 280,
        }}>
          🪑 Meja <strong>7</strong> &nbsp;|&nbsp; 🍽️ Makan di tempat
        </div>
      </div>

      <div style={{ padding: "0 16px 24px" }}>
        <button
          onClick={onBackToMenu}
          style={{
            width: "100%", background: "#B8860B", color: "#fff",
            border: "none", borderRadius: 12, padding: 15,
            fontSize: 15, fontWeight: 800, cursor: "pointer",
            fontFamily: "'Nunito', sans-serif",
            boxShadow: "0 4px 16px rgba(184,134,11,0.3)",
          }}
        >Kembali ke Menu</button>
        <button
          onClick={onHistory}
          style={{
            width: "100%", background: "none",
            border: "1.5px solid #E8DCC8", borderRadius: 12,
            padding: 15, fontSize: 14, fontWeight: 700,
            cursor: "pointer", fontFamily: "'Nunito', sans-serif",
            marginTop: 10, color: "#5A4A30",
          }}
        >Lihat Riwayat Pesanan</button>
      </div>
    </div>
  );
}

// ===================== APP =====================
export default function App() {
  const [screen, setScreen] = useState("splash"); // splash | menu | cart | success
  const [cart, setCart] = useState({});
  const [toast, setToast] = useState({ msg: "", visible: false });
  const [orderCode, setOrderCode] = useState("");
  const toastTimer = useRef(null);

  const showToast = useCallback((msg) => {
    setToast({ msg, visible: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2200);
  }, []);

  const addToCart = useCallback((id) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart(prev => {
      const next = { ...prev };
      if (next[id] > 1) next[id]--;
      else delete next[id];
      return next;
    });
  }, []);

  const handleCheckout = () => {
    const code = "#RFW" + Date.now().toString().slice(-8);
    setOrderCode(code);
    setCart({});
    setScreen("success");
  };

  return (
    <div style={{
      background: "#E8DDD0",
      display: "flex", justifyContent: "center", alignItems: "center",
      minHeight: "100vh", padding: 20,
      fontFamily: "'Nunito', sans-serif",
    }}>
      {/* Inject fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        @keyframes fabPop {
          from { transform: translateX(-50%) scale(0.7); opacity: 0; }
          to   { transform: translateX(-50%) scale(1); opacity: 1; }
        }
        ::-webkit-scrollbar { width: 0; height: 0; }
      `}</style>

      {/* Device shell */}
      <div style={{
        width: 390, height: 844,
        background: "#FAF3EC",
        borderRadius: 44, overflow: "hidden",
        position: "relative",
        boxShadow: "0 30px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.1) inset",
        display: "flex", flexDirection: "column",
      }}>
        {/* Screens */}
        {screen === "splash" && (
          <SplashScreen onStart={() => setScreen("menu")} />
        )}

        {screen === "menu" && (
          <MenuScreen
            cart={cart}
            onAdd={addToCart}
            onRemove={removeFromCart}
            onCartClick={() => setScreen("cart")}
            onStoreClick={() => showToast("Info Toko — segera hadir!")}
            showToast={showToast}
          />
        )}

        {screen === "cart" && (
          <CartScreen
            cart={cart}
            onAdd={addToCart}
            onRemove={removeFromCart}
            onBack={() => setScreen("menu")}
            onCheckout={handleCheckout}
            showToast={showToast}
          />
        )}

        {screen === "success" && (
          <SuccessScreen
            orderCode={orderCode}
            onBackToMenu={() => setScreen("menu")}
            onHistory={() => showToast("Riwayat Pesanan — segera hadir!")}
          />
        )}

        {/* Toast */}
        <Toast message={toast.msg} visible={toast.visible} />
      </div>
    </div>
  );
}