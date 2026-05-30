import React, { useState, useMemo, useEffect } from "react";
import "./MenuScreen.css";
import { supabase } from "../supabase";

// ===================== SUB-COMPONENTS =====================

function QtyControl({ qty, onAdd, onRemove }) {
  return (
    <div className="qty-control">
      <button onClick={onRemove}>−</button>
      <span className="qty-num">{qty}</span>
      <button onClick={onAdd}>+</button>
    </div>
  );
}

function MenuCard({ item, qty, onAdd, onRemove }) {
  return (
    <div className="menu-card">
      <div className="menu-img-placeholder">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          "🍽️"
        )}
      </div>
      <div className="menu-info">
        <div className="menu-name">{item.name}</div>
        <div className="menu-price">
          Rp{Number(item.price).toLocaleString("id")}
        </div>
        {!item.is_available ? (
          <span style={{ fontSize: 11, color: "#999", fontWeight: 600 }}>Tidak tersedia</span>
        ) : qty === 0 ? (
          <button className="tambah-btn" onClick={onAdd}>
            + Tambah
          </button>
        ) : (
          <QtyControl qty={qty} onAdd={onAdd} onRemove={onRemove} />
        )}
      </div>
    </div>
  );
}

function CartFAB({ totalQty, onPress }) {
  if (totalQty === 0) return null;
  return (
    <button className="cart-fab" onClick={onPress}>
      <span>🛒 Lihat Keranjang</span>
      <span className="cart-count">{totalQty}</span>
    </button>
  );
}

// ===================== MAIN SCREEN =====================

export default function MenuScreen({
  cart,
  onAddToCart,
  onRemoveFromCart,
  onGoToCart,
  onGoToStore,
  onGoToHistory,
  onGoToProfile,
  onOpenHamburger,
}) {
  const [menuData, setMenuData]           = useState([]);
  const [categories, setCategories]       = useState([]);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery]     = useState("");
  const [loading, setLoading]             = useState(true);

  // Fetch categories dan menu dari Supabase
  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      // Fetch categories
      const { data: cats } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      // Fetch menu (join categories)
      const { data: menus } = await supabase
        .from("menus")
        .select("*, categories(name)")
        .eq("is_available", true)
        .order("name");

      if (cats) setCategories(cats);
      if (menus) setMenuData(menus);
      setLoading(false);
    }
    fetchData();
  }, []);

  const allCategories = useMemo(() => ["Semua", ...categories.map(c => c.name)], [categories]);

  const filteredMenu = useMemo(() => {
    let data = menuData;
    if (activeCategory !== "Semua") {
      data = data.filter((item) => item.categories?.name === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter((item) => item.name.toLowerCase().includes(q));
    }
    return data;
  }, [menuData, activeCategory, searchQuery]);

  const totalQty = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="menu-screen">

      {/* HEADER */}
      <div className="menu-header">
        <div className="table-info">
          <span className="table-badge">🪑 Nomor Meja: 7</span>
          <button className="hamburger-btn" onClick={onOpenHamburger}>☰</button>
        </div>

        {/* Info toko */}
        <div className="resto-info-bar" onClick={onGoToStore}>
          <div>
            <div className="name">Warkop HS Balio</div>
            <div className="hours">Buka 24 Jam</div>
          </div>
          <span className="chevron">›</span>
        </div>

        {/* Search */}
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Mau makan apa hari ini?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category tabs */}
        <div className="category-tabs">
          {allCategories.map((cat) => (
            <button
              key={cat}
              className={`cat-tab ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* MENU GRID */}
      <div className="scroll-content">
        {loading ? (
          <div className="empty-search">Memuat menu...</div>
        ) : filteredMenu.length === 0 ? (
          <div className="empty-search">Tidak ada menu ditemukan</div>
        ) : (
          <div className="menu-grid">
            {filteredMenu.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                qty={cart[item.id] || 0}
                onAdd={() => onAddToCart(item.id)}
                onRemove={() => onRemoveFromCart(item.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* CART FAB */}
      <CartFAB totalQty={totalQty} onPress={onGoToCart} />

      {/* BOTTOM NAV */}
      <div className="bottom-nav">
        <button className="nav-item active">
          <span className="nav-icon">🍽️</span>Menu
        </button>
        <button className="nav-item" onClick={onGoToStore}>
          <span className="nav-icon">🏪</span>Toko
        </button>
        <button className="nav-item" onClick={onGoToHistory}>
          <span className="nav-icon">📋</span>Pesanan
        </button>
        <button className="nav-item" onClick={onGoToProfile}>
          <span className="nav-icon">👤</span>Profil
        </button>
      </div>
    </div>
  );
}