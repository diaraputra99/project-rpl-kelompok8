import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../supabase";
import PaymentScreen from "./paymentscreen.jsx";
import QRISScreen from "./QRISscreen.jsx";

// ===================== HELPERS =====================
const formatRp = (n) => "Rp" + Number(n).toLocaleString("id-ID");

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
        <div style={{
          width: 110, height: 110,
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          background: "rgba(184,134,11,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, color: "#E8A020", fontWeight: 700 }}>HS</span>
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          color: "#fff", fontSize: 28,
          letterSpacing: 6, textAlign: "center", lineHeight: 1.3, margin: 0,
        }}>WARKOP<br />· HS ·</h1>

        <p style={{ color: "#E8A020", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", margin: 0 }}>
          Coffee &amp; Dining
        </p>

        <button
          onClick={onStart}
          style={{
            marginTop: 32, background: "#E8A020", color: "#1A1208",
            border: "none", borderRadius: 50, padding: "14px 48px",
            fontSize: 15, fontWeight: 800, cursor: "pointer",
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
      background: "#fff", borderRadius: 14, overflow: "hidden",
      border: "1px solid #E8DCC8", boxShadow: "0 2px 12px rgba(139,101,8,0.09)",
      transition: "transform 0.15s", cursor: "pointer",
    }}
      onMouseEnter={e => e.currentTarget.style.transform = "scale(0.98)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
    >
      <div style={{
        width: "100%", height: 110,
        background: "linear-gradient(135deg, #f5e6c8, #e8d4a0)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38,
      }}>
        {item.image_url
          ? <img src={item.image_url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : "🍽️"}
      </div>

      <div style={{ padding: "8px 10px 10px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#1A1208", marginBottom: 3, lineHeight: 1.3 }}>
          {item.name}
        </div>
        <div style={{ fontSize: 12, color: "#B8860B", fontWeight: 700, marginBottom: 6 }}>
          {formatRp(item.price)}
        </div>

        {!item.is_available ? (
          <span style={{ fontSize: 10, color: "#999" }}>Tidak tersedia</span>
        ) : qty === 0 ? (
          <button
            onClick={() => onAdd(item.id)}
            style={{
              width: "100%", border: "1.5px solid #B8860B", borderRadius: 8,
              background: "none", color: "#B8860B", fontSize: 11,
              fontWeight: 700, cursor: "pointer", padding: "5px 0",
              fontFamily: "'Nunito', sans-serif",
            }}
          >+ Tambah</button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "space-between" }}>
            <button onClick={() => onRemove(item.id)} style={{
              width: 26, height: 26, borderRadius: 7, border: "1.5px solid #E8DCC8",
              background: "none", fontSize: 16, fontWeight: 700, cursor: "pointer",
              color: "#1A1208", display: "flex", alignItems: "center", justifyContent: "center",
            }}>−</button>
            <span style={{ fontSize: 14, fontWeight: 800 }}>{qty}</span>
            <button onClick={() => onAdd(item.id)} style={{
              width: 26, height: 26, borderRadius: 7, border: "1.5px solid #B8860B",
              background: "#B8860B", fontSize: 16, fontWeight: 700, cursor: "pointer",
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            }}>+</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ===================== MENU SCREEN =====================
function MenuScreen({ cart, onAdd, onRemove, onCartClick, showToast }) {
  const [menuData, setMenuData]             = useState([]);
  const [categories, setCategories]         = useState([]);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery]       = useState("");
  const [loading, setLoading]               = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setLoading(true);
      const { data: cats } = await supabase.from("categories").select("*").order("name");
      const { data: menus } = await supabase
        .from("menus")
        .select("*, categories(name)")
        .order("name");
      if (!isMounted) return;
      // FIX: Dedup categories berdasarkan name
      if (cats) {
        const seen = new Set();
        const uniqueCats = cats.filter(c => {
          if (seen.has(c.name)) return false;
          seen.add(c.name);
          return true;
        });
        setCategories(uniqueCats);
      }
      if (menus) setMenuData(menus);
      setLoading(false);
    }
    fetchData();
    return () => { isMounted = false; };
  }, []);

  // FIX: Pakai Set untuk jaga-jaga duplikat nama kategori
  const allCategories = ["Semua", ...new Set(categories.map(c => c.name))];

  const filtered = menuData.filter(item => {
    const matchCat = activeCategory === "Semua" || item.categories?.name === activeCategory;
    const matchQ   = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQ;
  });

  const totalQty = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: "#fff", padding: "12px 16px 0", borderBottom: "1px solid #E8DCC8", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ background: "#F5E9C9", border: "1px solid #E8DCC8", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700, color: "#8B6508" }}>
            🪑 Meja 7
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1208" }}>Warkop HS Balio</span>
        </div>

        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", background: "#FAF3EC", border: "1px solid #E8DCC8", borderRadius: 10, padding: "8px 12px", marginBottom: 10, gap: 8 }}>
          <span>🔍</span>
          <input
            type="text"
            placeholder="Mau makan apa hari ini?"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ border: "none", background: "none", flex: 1, fontSize: 13, outline: "none", fontFamily: "'Nunito', sans-serif" }}
          />
        </div>

        {/* Category tabs */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 10, scrollbarWidth: "none" }}>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                flexShrink: 0, padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                cursor: "pointer", border: "none", transition: "all 0.15s",
                background: activeCategory === cat ? "#B8860B" : "#FAF3EC",
                color: activeCategory === cat ? "#fff" : "#5A4A30",
                fontFamily: "'Nunito', sans-serif",
              }}
            >{cat}</button>
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {filtered.map(item => (
              <MenuCard key={item.id} item={item} qty={cart[item.id] || 0} onAdd={onAdd} onRemove={onRemove} />
            ))}
          </div>
        )}
      </div>

      {/* Cart FAB */}
      {totalQty > 0 && (
        <button
          onClick={onCartClick}
          style={{
            position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)",
            background: "#B8860B", color: "#fff", border: "none", borderRadius: 50,
            padding: "12px 24px", fontSize: 14, fontWeight: 800, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap",
            boxShadow: "0 4px 20px rgba(184,134,11,0.4)", fontFamily: "'Nunito', sans-serif",
            zIndex: 10,
          }}
        >
          🛒 Lihat Keranjang
          <span style={{ background: "rgba(255,255,255,0.25)", borderRadius: 20, padding: "2px 10px", fontSize: 13 }}>
            {totalQty}
          </span>
        </button>
      )}
    </div>
  );
}

// ===================== CART SCREEN =====================
function CartScreen({ cart, menuData, onAdd, onRemove, onBack, onCheckout, showToast }) {
  const cartArr = Object.entries(cart)
    .map(([id, qty]) => ({ ...menuData.find(m => m.id === Number(id)), qty }))
    .filter(Boolean);
  const subtotal = cartArr.reduce((s, i) => s + Number(i.price) * i.qty, 0);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FAF3EC" }}>
      <div style={{
        background: "#fff", padding: "12px 16px",
        display: "flex", alignItems: "center", gap: 10,
        borderBottom: "1px solid #E8DCC8", flexShrink: 0,
      }}>
        <button onClick={onBack} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: "#FAF3EC", cursor: "pointer", fontSize: 18 }}>←</button>
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
                background: "#fff", margin: "0 16px 10px", borderRadius: 14,
                border: "1px solid #E8DCC8", padding: "12px 14px",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 10,
                  background: "linear-gradient(135deg,#f5e6c8,#e8d4a0)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, flexShrink: 0, overflow: "hidden",
                }}>
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

            {/* FIX: Sekarang navigasi ke payment screen, bukan langsung checkout */}
            <button
              onClick={() => onCheckout(cartArr, subtotal)}
              style={{
                margin: "14px 16px 0", width: "calc(100% - 32px)",
                background: "#B8860B", color: "#fff", border: "none", borderRadius: 12,
                padding: 15, fontSize: 15, fontWeight: 800, cursor: "pointer",
                fontFamily: "'Nunito', sans-serif", boxShadow: "0 4px 16px rgba(184,134,11,0.3)",
              }}
            >Lanjut Pembayaran →</button>
          </>
        )}
      </div>
    </div>
  );
}

// ===================== SUCCESS SCREEN =====================
function SuccessScreen({ orderCode, onBackToMenu }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FAF3EC" }}>
      <div style={{ background: "#fff", padding: "12px 16px", borderBottom: "1px solid #E8DCC8" }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1A1208", margin: 0 }}>Pesanan Dikirim</h2>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", gap: 14, textAlign: "center" }}>
        <div style={{ fontSize: 72 }}>✅</div>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: "#2E7D52", margin: 0 }}>Pesanan Berhasil!</h3>
        <p style={{ fontSize: 13, color: "#9A8A70", maxWidth: 260, margin: 0, lineHeight: 1.6 }}>
          Pesanan kamu sedang diproses oleh dapur. Silakan tunggu di meja.
        </p>
        <div style={{ background: "#F5E9C9", border: "1px solid #B8860B", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 800, color: "#8B6508", fontFamily: "monospace" }}>
          {orderCode}
        </div>
        <div style={{ background: "#F5E9C9", borderRadius: 12, padding: "14px 20px", fontSize: 13, color: "#5A4A30", maxWidth: 280 }}>
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
            fontFamily: "'Nunito', sans-serif", boxShadow: "0 4px 16px rgba(184,134,11,0.3)",
          }}
        >Kembali ke Menu</button>
      </div>
    </div>
  );
}

// ===================== APP =====================
export default function App() {
  const [screen, setScreen]         = useState("splash");
  const [cart, setCart]             = useState({});
  const [menuData, setMenuData]     = useState([]);
  const [toast, setToast]           = useState({ msg: "", visible: false });
  const [orderCode, setOrderCode]   = useState("");
  const [submitting, setSubmitting] = useState(false);

  // FIX: State untuk menyimpan data sebelum masuk payment/QRIS screen
  const [pendingCartArr, setPendingCartArr] = useState([]);
  const [pendingSubtotal, setPendingSubtotal] = useState(0);

  const toastTimer = useRef(null);

  // Fetch menu global (dipakai CartScreen untuk nama item)
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

  // FIX: Cart → Payment screen (simpan dulu, jangan langsung submit)
  const handleGoToPayment = useCallback((cartArr, subtotal) => {
    setPendingCartArr(cartArr);
    setPendingSubtotal(subtotal);
    setScreen("payment");
  }, []);

  // ===================== SUBMIT ORDER KE SUPABASE =====================
  const handleCheckout = useCallback(async () => {
    setSubmitting(true);
    try {
      // 1. Buat order
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          table_number: 7,
          total_price: pendingSubtotal,
          status: "pending",
          payment_status: "unpaid",
        })
        .select()
        .single();

      if (orderErr) throw orderErr;

      // 2. Insert order_items
      const items = pendingCartArr.map(item => ({
        order_id: order.id,
        menu_id: item.id,
        quantity: item.qty,
        subtotal: Number(item.price) * item.qty,
      }));

      const { error: itemsErr } = await supabase.from("order_items").insert(items);
      if (itemsErr) throw itemsErr;

      // 3. Sukses
      const kode = "#HS-" + order.id.slice(0, 8).toUpperCase();
      setOrderCode(kode);
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
  }, [pendingCartArr, pendingSubtotal, showToast]);

  // Handler dari PaymentScreen: pilih metode lalu lanjut
  const handlePayMethodChosen = useCallback(({ method }) => {
    if (method === "online") {
      // QRIS → tampilkan QRIS screen
      setScreen("qris");
    } else {
      // Bayar di kasir → langsung submit order
      handleCheckout();
    }
  }, [handleCheckout]);

  return (
    <div style={{
      background: "#E8DDD0", display: "flex", justifyContent: "center",
      alignItems: "center", minHeight: "100vh", padding: 20,
      fontFamily: "'Nunito', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { width: 0; height: 0; }
      `}</style>

      <div style={{
        width: 390, height: 844, background: "#FAF3EC",
        borderRadius: 44, overflow: "hidden", position: "relative",
        boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
        display: "flex", flexDirection: "column",
      }}>
        {screen === "splash" && (
          <SplashScreen onStart={() => setScreen("menu")} />
        )}

        {screen === "menu" && (
          <MenuScreen
            cart={cart}
            onAdd={addToCart}
            onRemove={removeFromCart}
            onCartClick={() => setScreen("cart")}
            showToast={showToast}
          />
        )}

        {screen === "cart" && (
          <CartScreen
            cart={cart}
            menuData={menuData}
            onAdd={addToCart}
            onRemove={removeFromCart}
            onBack={() => setScreen("menu")}
            onCheckout={handleGoToPayment}
            showToast={showToast}
          />
        )}

        {/* FIX: Payment screen sekarang tampil */}
        {screen === "payment" && (
          <PaymentScreen
            subtotal={pendingSubtotal}
            onBack={() => setScreen("cart")}
            onPay={handlePayMethodChosen}
          />
        )}

        {/* FIX: QRIS screen sekarang tampil */}
        {screen === "qris" && (
          <QRISScreen
            subtotal={pendingSubtotal}
            onBack={() => setScreen("payment")}
            onCheckStatus={handleCheckout}
          />
        )}

        {screen === "success" && (
          <SuccessScreen
            orderCode={orderCode}
            onBackToMenu={() => setScreen("menu")}
          />
        )}

        {submitting && (
          <div style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 100,
          }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: "20px 32px", fontSize: 14, fontWeight: 700, color: "#1A1208" }}>
              Memproses pesanan...
            </div>
          </div>
        )}

        <Toast message={toast.msg} visible={toast.visible} />
      </div>
    </div>
  );
}