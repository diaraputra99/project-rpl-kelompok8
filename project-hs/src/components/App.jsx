import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../supabase";
import PaymentScreen  from "./paymentscreen.jsx";
import QRISScreen     from "./QRISscreen.jsx";
import HistoryScreen  from "./historyscreen.jsx";
import StoreScreen    from "./storescreen.jsx";
import ProfileScreen  from "./profilescreen.jsx";

// ===================== HELPERS =====================
const formatRp = (n) => "Rp" + Number(n).toLocaleString("id-ID");

// ===================== TOAST =====================
function Toast({ message, visible }) {
  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
      background: "#1A1208", color: "#fff", padding: "10px 22px", borderRadius: 20,
      fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", zIndex: 9999,
      opacity: visible ? 1 : 0, transition: "opacity 0.22s", pointerEvents: "none",
      boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
    }}>
      {message}
    </div>
  );
}

// ===================== HAMBURGER DRAWER =====================
function HamburgerDrawer({ open, onClose, screen, onNavigate, cartQty }) {
  if (!open) return null;

  const items = [
    { icon: "🍽️", label: "Menu",            key: "menu" },
    { icon: "🛒", label: "Keranjang",        key: "cart",    badge: cartQty },
    { icon: "📋", label: "Riwayat Pesanan",  key: "history" },
    { icon: "🏪", label: "Info Toko",        key: "store" },
    { icon: "👤", label: "Profil",           key: "profile" },
  ];

  return (
    <>
      {/* overlay */}
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 400,
      }} />

      {/* drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: "min(288px, 82vw)", background: "#fff", zIndex: 401,
        display: "flex", flexDirection: "column",
        boxShadow: "-6px 0 32px rgba(0,0,0,0.18)",
        animation: "hsDrawerIn 0.22s ease",
      }}>
        <style>{`@keyframes hsDrawerIn { from{transform:translateX(100%)} to{transform:translateX(0)} }`}</style>

        {/* drawer header */}
        <div style={{ background: "linear-gradient(135deg,#1A0F04,#3D1F0A)", padding: "20px 20px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display',serif", color: "#E8A020", fontSize: 17, fontWeight: 700, letterSpacing: 2 }}>
                Warkop HS Balio
              </div>
              <div style={{ fontSize: 11, color: "rgba(232,160,32,0.65)", marginTop: 3 }}>🪑 Meja 7 · Buka 24 Jam</div>
            </div>
            <button onClick={onClose} style={{
              background: "rgba(255,255,255,0.12)", border: "none", color: "#fff",
              width: 30, height: 30, borderRadius: "50%", cursor: "pointer",
              fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
          </div>
        </div>

        {/* nav items */}
        <div style={{ flex: 1, padding: "8px 0", overflowY: "auto" }}>
          {items.map(item => {
            const isActive = screen === item.key;
            return (
              <button key={item.key} onClick={() => { onNavigate(item.key); onClose(); }}
                style={{
                  width: "100%", padding: "13px 20px",
                  background: isActive ? "#FAF3EC" : "none",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 14,
                  fontSize: 14, fontWeight: isActive ? 800 : 600,
                  color: isActive ? "#B8860B" : "#1A1208",
                  fontFamily: "'Nunito',sans-serif", textAlign: "left",
                  borderLeft: isActive ? "3px solid #B8860B" : "3px solid transparent",
                  transition: "background 0.12s",
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#FAF3EC"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "none"; }}
              >
                <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge > 0 && (
                  <span style={{ background: "#B8860B", color: "#fff", borderRadius: 20, padding: "1px 8px", fontSize: 11, fontWeight: 800 }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ padding: "12px 20px 20px", borderTop: "1px solid #E8DCC8", textAlign: "center", fontSize: 11, color: "#C8B89A" }}>
          RestoFlow · v1.0.0
        </div>
      </div>
    </>
  );
}

// ===================== TOPBAR WITH HAMBURGER =====================
function TopBar({ title, onBack, onHamburger, showBack = true }) {
  return (
    <div style={{
      background: "#fff", padding: "0 16px",
      display: "flex", alignItems: "center", gap: 10,
      borderBottom: "1px solid #E8DCC8", flexShrink: 0,
      height: 52,
    }}>
      {showBack && (
        <button onClick={onBack} style={{
          width: 32, height: 32, borderRadius: "50%", border: "none",
          background: "#FAF3EC", cursor: "pointer", fontSize: 18,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>←</button>
      )}
      <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1A1208", flex: 1, margin: 0 }}>{title}</h2>
      {onHamburger && (
        <button onClick={onHamburger} aria-label="Menu navigasi"
          style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "6px", borderRadius: 8, flexShrink: 0,
            display: "flex", flexDirection: "column", gap: 4,
            transition: "background 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#FAF3EC"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}
        >
          <span style={{ display: "block", width: 20, height: 2.5, background: "#1A1208", borderRadius: 2 }} />
          <span style={{ display: "block", width: 20, height: 2.5, background: "#1A1208", borderRadius: 2 }} />
          <span style={{ display: "block", width: 20, height: 2.5, background: "#1A1208", borderRadius: 2 }} />
        </button>
      )}
    </div>
  );
}

// ===================== SPLASH SCREEN =====================
function SplashScreen({ onStart }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(160deg,#1A0F04 0%,#3D1F0A 50%,#6B3F1E 100%)",
      position: "relative", overflow: "hidden", minHeight: "100dvh",
    }}>
      <div style={{ position: "absolute", width: "min(320px,80vw)", height: "min(320px,80vw)", borderRadius: "50%", border: "1px solid rgba(232,160,32,0.12)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: "min(220px,55vw)", height: "min(220px,55vw)", borderRadius: "50%", border: "1px solid rgba(232,160,32,0.18)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.7s cubic-bezier(0.25,0.46,0.45,0.94)", padding: "0 24px",
      }}>
        <div style={{ width: 110, height: 110, clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)", background: "rgba(184,134,11,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, color: "#E8A020", fontWeight: 700 }}>HS</span>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", color: "#fff", fontSize: "clamp(22px,5vw,28px)", letterSpacing: 6, textAlign: "center", lineHeight: 1.3, margin: 0 }}>WARKOP<br />· HS ·</h1>
        <p style={{ color: "#E8A020", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", margin: 0 }}>Coffee &amp; Dining</p>
        <button onClick={onStart} style={{
          marginTop: 32, background: "#E8A020", color: "#1A1208", border: "none", borderRadius: 50,
          padding: "14px 48px", fontSize: 15, fontWeight: 800, cursor: "pointer",
          fontFamily: "'Nunito',sans-serif", boxShadow: "0 4px 24px rgba(232,160,32,0.45)", transition: "transform 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >Mulai Memesan ☕</button>
      </div>
    </div>
  );
}

// ===================== MENU CARD =====================
function MenuCard({ item, qty, onAdd, onRemove }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #E8DCC8", boxShadow: "0 2px 12px rgba(139,101,8,0.09)", transition: "transform 0.15s", cursor: "pointer" }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div style={{ width: "100%", paddingTop: "65%", position: "relative", background: "linear-gradient(135deg,#f5e6c8,#e8d4a0)" }}>
        {item.image_url
          ? <img src={item.image_url} alt={item.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>🍽️</div>
        }
      </div>
      <div style={{ padding: "8px 10px 10px" }}>
        <div style={{ fontSize: "clamp(11px,1.5vw,13px)", fontWeight: 700, color: "#1A1208", marginBottom: 3, lineHeight: 1.3 }}>{item.name}</div>
        <div style={{ fontSize: "clamp(11px,1.5vw,12px)", color: "#B8860B", fontWeight: 700, marginBottom: 6 }}>{formatRp(item.price)}</div>
        {!item.is_available ? (
          <span style={{ fontSize: 10, color: "#999" }}>Tidak tersedia</span>
        ) : qty === 0 ? (
          <button onClick={() => onAdd(item.id)} style={{ width: "100%", border: "1.5px solid #B8860B", borderRadius: 8, background: "none", color: "#B8860B", fontSize: 11, fontWeight: 700, cursor: "pointer", padding: "5px 0", fontFamily: "'Nunito',sans-serif" }}>+ Tambah</button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "space-between" }}>
            <button onClick={() => onRemove(item.id)} style={{ width: 28, height: 28, borderRadius: 7, border: "1.5px solid #E8DCC8", background: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", color: "#1A1208", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
            <span style={{ fontSize: 14, fontWeight: 800 }}>{qty}</span>
            <button onClick={() => onAdd(item.id)} style={{ width: 28, height: 28, borderRadius: 7, border: "1.5px solid #B8860B", background: "#B8860B", fontSize: 16, fontWeight: 700, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ===================== MENU SCREEN =====================
function MenuScreen({ cart, onAdd, onRemove, onCartClick, onHamburger }) {
  const [menuData, setMenuData]             = useState([]);
  const [categories, setCategories]         = useState([]);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery]       = useState("");
  const [loading, setLoading]               = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setLoading(true);
      const { data: cats }  = await supabase.from("categories").select("*").order("name");
      const { data: menus } = await supabase.from("menus").select("*, categories(name)").order("name");
      if (!isMounted) return;
      if (cats) {
        const seen = new Set();
        setCategories(cats.filter(c => { if (seen.has(c.name)) return false; seen.add(c.name); return true; }));
      }
      if (menus) setMenuData(menus);
      setLoading(false);
    }
    fetchData();
    return () => { isMounted = false; };
  }, []);

  const allCategories = ["Semua", ...new Set(categories.map(c => c.name))];
  const filtered = menuData.filter(item => {
    const matchCat = activeCategory === "Semua" || item.categories?.name === activeCategory;
    const matchQ   = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQ;
  });
  const totalQty = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#FAF3EC" }}>
      {/* Header */}
      <div style={{ background: "#fff", padding: "12px 16px 0", borderBottom: "1px solid #E8DCC8", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ background: "#F5E9C9", border: "1px solid #E8DCC8", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700, color: "#8B6508" }}>🪑 Meja 7</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1208" }}>Warkop HS Balio</span>
          {/* HAMBURGER */}
          <button onClick={onHamburger} aria-label="Menu navigasi"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 6px", borderRadius: 8, display: "flex", flexDirection: "column", gap: 4, transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#FAF3EC"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            <span style={{ display: "block", width: 20, height: 2.5, background: "#1A1208", borderRadius: 2 }} />
            <span style={{ display: "block", width: 20, height: 2.5, background: "#1A1208", borderRadius: 2 }} />
            <span style={{ display: "block", width: 20, height: 2.5, background: "#1A1208", borderRadius: 2 }} />
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", background: "#FAF3EC", border: "1px solid #E8DCC8", borderRadius: 10, padding: "8px 12px", marginBottom: 10, gap: 8 }}>
          <span>🔍</span>
          <input type="text" placeholder="Mau makan apa hari ini?" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            style={{ border: "none", background: "none", flex: 1, fontSize: 13, outline: "none", fontFamily: "'Nunito',sans-serif" }} />
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 10, scrollbarWidth: "none" }}>
          {allCategories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              flexShrink: 0, padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700,
              cursor: "pointer", border: "none", transition: "all 0.15s",
              background: activeCategory === cat ? "#B8860B" : "#FAF3EC",
              color: activeCategory === cat ? "#fff" : "#5A4A30",
              fontFamily: "'Nunito',sans-serif",
            }}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", scrollbarWidth: "none" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#9A8A70", fontSize: 13 }}>Memuat menu...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#9A8A70", fontSize: 13 }}>Tidak ada menu ditemukan</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 12 }}>
            {filtered.map(item => (
              <MenuCard key={item.id} item={item} qty={cart[item.id] || 0} onAdd={onAdd} onRemove={onRemove} />
            ))}
          </div>
        )}
      </div>

      {totalQty > 0 && (
        <div style={{ padding: "12px 16px", background: "#FAF3EC", flexShrink: 0 }}>
          <button onClick={onCartClick} style={{
            width: "100%", background: "#B8860B", color: "#fff", border: "none", borderRadius: 12,
            padding: "13px 20px", fontSize: 15, fontWeight: 800, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            boxShadow: "0 4px 20px rgba(184,134,11,0.4)", fontFamily: "'Nunito',sans-serif",
          }}>
            <span>🛒 Lihat Keranjang</span>
            <span style={{ background: "rgba(255,255,255,0.25)", borderRadius: 20, padding: "2px 12px", fontSize: 13 }}>{totalQty}</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ===================== CART SCREEN =====================
function CartScreen({ cart, menuData, onAdd, onRemove, onBack, onCheckout, onHamburger }) {
  const cartArr  = Object.entries(cart).map(([id, qty]) => ({ ...menuData.find(m => m.id === Number(id)), qty })).filter(Boolean);
  const subtotal = cartArr.reduce((s, i) => s + Number(i.price) * i.qty, 0);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FAF3EC" }}>
      <TopBar title="Keranjang" onBack={onBack} onHamburger={onHamburger} />
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
              <div key={item.id} style={{ background: "#fff", margin: "0 16px 10px", borderRadius: 14, border: "1px solid #E8DCC8", padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 56, height: 56, borderRadius: 10, background: "linear-gradient(135deg,#f5e6c8,#e8d4a0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0, overflow: "hidden" }}>
                  {item.image_url ? <img src={item.image_url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "🍽️"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1208" }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: "#B8860B", fontWeight: 700 }}>{formatRp(item.price)}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                    <button onClick={() => onRemove(item.id)} style={{ width: 26, height: 26, borderRadius: 7, border: "1.5px solid #E8DCC8", background: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", color: "#1A1208", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                    <span style={{ fontSize: 14, fontWeight: 800, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => onAdd(item.id)} style={{ width: 26, height: 26, borderRadius: 7, border: "1.5px solid #B8860B", background: "#B8860B", fontSize: 16, fontWeight: 700, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#1A1208" }}>{formatRp(Number(item.price) * item.qty)}</div>
              </div>
            ))}
            <div style={{ background: "#fff", margin: "0 16px", borderRadius: 14, border: "1px solid #E8DCC8", padding: "14px 16px" }}>
              {[["Subtotal", formatRp(subtotal)], ["Biaya Layanan", "Rp0"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, color: "#5A4A30" }}>
                  <span>{k}</span><span>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 0", fontSize: 15, fontWeight: 800, color: "#1A1208", borderTop: "1px solid #E8DCC8", marginTop: 6 }}>
                <span>Total</span><span>{formatRp(subtotal)}</span>
              </div>
            </div>
            <div style={{ padding: "14px 16px 0" }}>
              <button onClick={() => onCheckout(cartArr, subtotal)} style={{
                width: "100%", background: "#B8860B", color: "#fff", border: "none", borderRadius: 12,
                padding: 15, fontSize: 15, fontWeight: 800, cursor: "pointer",
                fontFamily: "'Nunito',sans-serif", boxShadow: "0 4px 16px rgba(184,134,11,0.3)",
              }}>Lanjut Pembayaran →</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ===================== SUCCESS SCREEN =====================
function SuccessScreen({ orderCode, customerEmail, paymentMethod, onBackToMenu }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FAF3EC" }}>
      <div style={{ background: "#fff", padding: "12px 16px", borderBottom: "1px solid #E8DCC8" }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1A1208", margin: 0 }}>Pesanan Dikirim</h2>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", gap: 14, textAlign: "center" }}>
        <div style={{ fontSize: 72 }}>✅</div>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: "#2E7D52", margin: 0 }}>Pesanan Berhasil!</h3>
        <p style={{ fontSize: 13, color: "#9A8A70", maxWidth: 260, margin: 0, lineHeight: 1.6 }}>
          Pesanan kamu sedang diproses. Silakan tunggu di meja.
        </p>
        <div style={{ background: "#F5E9C9", border: "1px solid #B8860B", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 800, color: "#8B6508", fontFamily: "monospace" }}>
          {orderCode}
        </div>
        <div style={{ background: "#F5E9C9", borderRadius: 12, padding: "14px 20px", fontSize: 13, color: "#5A4A30", maxWidth: 280 }}>
          🪑 Meja <strong>7</strong> &nbsp;|&nbsp;
          {paymentMethod === "cash" ? "💵 Bayar di Kasir" : "💳 QRIS"}
        </div>
        {customerEmail && (
          <div style={{ fontSize: 12, color: "#9A8A70" }}>
            ✉️ Struk dikirim ke <strong>{customerEmail}</strong>
          </div>
        )}
        {paymentMethod === "cash" && (
          <div style={{ background: "#fff3cd", border: "1px solid #ffc107", borderRadius: 10, padding: "10px 16px", fontSize: 12, color: "#856404", maxWidth: 280 }}>
            ⚠️ Jangan lupa bayar ke kasir ya!
          </div>
        )}
      </div>
      <div style={{ padding: "0 16px 24px" }}>
        <button onClick={onBackToMenu} style={{
          width: "100%", background: "#B8860B", color: "#fff", border: "none", borderRadius: 12, padding: 15,
          fontSize: 15, fontWeight: 800, cursor: "pointer",
          fontFamily: "'Nunito',sans-serif", boxShadow: "0 4px 16px rgba(184,134,11,0.3)",
        }}>Kembali ke Menu</button>
      </div>
    </div>
  );
}

// ===================== APP =====================
export default function App() {
  const [screen, setScreen]           = useState("splash");
  const [cart, setCart]               = useState({});
  const [menuData, setMenuData]       = useState([]);
  const [toast, setToast]             = useState({ msg: "", visible: false });
  const [orderCode, setOrderCode]     = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [pendingCartArr, setPendingCartArr]   = useState([]);
  const [pendingSubtotal, setPendingSubtotal] = useState(0);
  const [customerInfo, setCustomerInfo]       = useState({});
  const toastTimer = useRef(null);

  useEffect(() => {
    supabase.from("menus").select("*, categories(name)").then(({ data }) => {
      if (data) setMenuData(data);
    });
  }, []);

  const showToast = useCallback((msg) => {
    setToast({ msg, visible: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2200);
  }, []);

  const addToCart    = useCallback((id) => setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 })), []);
  const removeFromCart = useCallback((id) => setCart(prev => {
    const next = { ...prev };
    if (next[id] > 1) next[id]--; else delete next[id];
    return next;
  }), []);

  const handleGoToPayment = useCallback((cartArr, subtotal) => {
    setPendingCartArr(cartArr);
    setPendingSubtotal(subtotal);
    setScreen("payment");
  }, []);

  // ===== SUBMIT ORDER — payment_status sesuai metode =====
  const handleCheckout = useCallback(async (paymentMethod = "online") => {
    setSubmitting(true);
    try {
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          table_number:   7,
          total_price:    pendingSubtotal,
          status:         "pending",
          // FIX: QRIS → "paid", kasir → "unpaid" (admin update manual)
          payment_status: paymentMethod === "online" ? "paid" : "unpaid",
          customer_name:  customerInfo.nama  || null,
          customer_phone: customerInfo.noHp  || null,
          customer_email: customerInfo.email || null,
        })
        .select()
        .single();
      if (orderErr) throw orderErr;

      const items = pendingCartArr.map(item => ({
        order_id: order.id,
        menu_id:  item.id,
        quantity: item.qty,
        subtotal: Number(item.price) * item.qty,
      }));
      const { error: itemsErr } = await supabase.from("order_items").insert(items);
      if (itemsErr) throw itemsErr;

      // Kirim struk email (opsional)
      if (customerInfo.email) {
        try {
          await supabase.functions.invoke("send-receipt", {
            body: {
              to:           customerInfo.email,
              customerName: customerInfo.nama || "Pelanggan",
              orderCode:    "#HS-" + order.id.slice(0, 8).toUpperCase(),
              tableNumber:  7,
              items: pendingCartArr.map(i => ({
                name: i.name, qty: i.qty,
                price: Number(i.price), subtotal: Number(i.price) * i.qty,
              })),
              total: pendingSubtotal,
            },
          });
        } catch (e) { console.warn("Email gagal:", e); }
      }

      setOrderCode("#HS-" + order.id.slice(0, 8).toUpperCase());
      setCart({});
      setPendingCartArr([]);
      setPendingSubtotal(0);
      setScreen("success");
    } catch (err) {
      console.error(err);
      showToast("Gagal memproses order. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }, [pendingCartArr, pendingSubtotal, customerInfo, showToast]);

  const handlePayMethodChosen = useCallback(({ method, nama, noHp, email }) => {
    setCustomerInfo({ nama, noHp, email, method });
    if (method === "online") setScreen("qris");
    else handleCheckout("cash");
  }, [handleCheckout]);

  // Navigasi dari hamburger
  const handleDrawerNav = useCallback((target) => {
    if (target === "cart" && Object.keys(cart).length === 0) {
      showToast("Keranjang kamu kosong");
      return;
    }
    setScreen(target);
  }, [cart, showToast]);

  const cartQty = Object.values(cart).reduce((a, b) => a + b, 0);
  const noHamburgerScreens = ["splash", "payment", "qris", "success"];
  const showHamburger = !noHamburgerScreens.includes(screen);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
        html,body{height:100%}
        body{background:#FAF3EC;font-family:'Nunito',sans-serif}
        ::-webkit-scrollbar{width:0;height:0}
        #root{min-height:100dvh;display:flex;flex-direction:column}
      `}</style>

      {/* Hamburger drawer — overlay di atas semua konten */}
      {showHamburger && (
        <HamburgerDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          screen={screen}
          onNavigate={handleDrawerNav}
          cartQty={cartQty}
        />
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100dvh" }}>

        {screen === "splash" && <SplashScreen onStart={() => setScreen("menu")} />}

        {screen === "menu" && (
          <MenuScreen
            cart={cart} onAdd={addToCart} onRemove={removeFromCart}
            onCartClick={() => setScreen("cart")}
            onHamburger={() => setDrawerOpen(true)}
          />
        )}

        {screen === "cart" && (
          <CartScreen
            cart={cart} menuData={menuData} onAdd={addToCart} onRemove={removeFromCart}
            onBack={() => setScreen("menu")}
            onCheckout={handleGoToPayment}
            onHamburger={() => setDrawerOpen(true)}
          />
        )}

        {screen === "payment" && (
          <PaymentScreen
            subtotal={pendingSubtotal}
            onBack={() => setScreen("cart")}
            onPay={handlePayMethodChosen}
          />
        )}

        {screen === "qris" && (
          <QRISScreen
            subtotal={pendingSubtotal}
            onBack={() => setScreen("payment")}
            onCheckStatus={() => handleCheckout("online")}
          />
        )}

        {screen === "success" && (
          <SuccessScreen
            orderCode={orderCode}
            customerEmail={customerInfo.email}
            paymentMethod={customerInfo.method}
            onBackToMenu={() => { setCustomerInfo({}); setScreen("menu"); }}
          />
        )}

        {/* Screens dari hamburger — pakai komponen asli */}
        {screen === "history" && (
          <HistoryScreen
            onBack={() => setScreen("menu")}
            onGoToMenu={() => setScreen("menu")}
            onGoToStore={() => setScreen("store")}
            onGoToProfile={() => setScreen("profile")}
          />
        )}

        {screen === "store" && (
          <StoreScreen
            onBack={() => setScreen("menu")}
            onShareLink={() => showToast("Link disalin!")}
            onGoToMenu={() => setScreen("menu")}
            onGoToHistory={() => setScreen("history")}
            onGoToProfile={() => setScreen("profile")}
          />
        )}

        {screen === "profile" && (
          <ProfileScreen
            onGoToMenu={() => setScreen("menu")}
            onGoToStore={() => setScreen("store")}
            onGoToHistory={() => setScreen("history")}
            onGoToLanguage={() => showToast("Fitur bahasa segera hadir!")}
            onShowToast={showToast}
          />
        )}

        {submitting && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500 }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: "20px 32px", fontSize: 14, fontWeight: 700, color: "#1A1208" }}>
              Memproses pesanan...
            </div>
          </div>
        )}

        <Toast message={toast.msg} visible={toast.visible} />
      </div>
    </>
  );
}