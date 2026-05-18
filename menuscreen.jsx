import React, { useState, useMemo } from "react";
import "./MenuScreen.css";

// ===================== DATA MENU =====================
const menuData = [
  // Minuman
  { id: 1,  name: "Kopi Hitam",                    price: 8000,  category: "Minuman",      emoji: "☕" },
  { id: 2,  name: "Good Day Freeze",                price: 8000,  category: "Minuman",      emoji: "🥤" },
  { id: 3,  name: "Cappuccino",                     price: 9000,  category: "Minuman",      emoji: "☕" },
  { id: 4,  name: "Air Putih",                      price: 4000,  category: "Minuman",      emoji: "💧" },
  { id: 5,  name: "Susu Jahe",                      price: 8000,  category: "Minuman",      emoji: "🫖" },
  { id: 6,  name: "Es Teh Manis",                   price: 5000,  category: "Minuman",      emoji: "🧋" },
  { id: 7,  name: "Kopi Susu",                      price: 8000,  category: "Minuman",      emoji: "🍵" },
  { id: 8,  name: "Teh Tarik",                      price: 7000,  category: "Minuman",      emoji: "🧉" },
  { id: 9,  name: "Nasi Kubu",                      price: 4000,  category: "Minuman",      emoji: "🥛" },
  { id: 10, name: "Barcino",                        price: 9000,  category: "Minuman",      emoji: "🍫" },
  { id: 11, name: "Soda Kubu",                      price: 4000,  category: "Minuman",      emoji: "🫧" },
  { id: 12, name: "Byju",                           price: 4000,  category: "Minuman",      emoji: "🥤" },
  // Pancong
  { id: 13, name: "Pancong Lumer Keju Coklat",      price: 12000, category: "Pancong",      emoji: "🧇" },
  { id: 14, name: "Pancong Susu Oreo",              price: 12000, category: "Pancong",      emoji: "🧇" },
  { id: 15, name: "Pancong Lumer Matcha",           price: 12000, category: "Pancong",      emoji: "🧇" },
  { id: 16, name: "Pancong Coklat",                 price: 12000, category: "Pancong",      emoji: "🧇" },
  { id: 17, name: "Pancong Tiramisu",               price: 10000, category: "Pancong",      emoji: "🧇" },
  { id: 18, name: "Pancong Choco Crunchy",          price: 14000, category: "Pancong",      emoji: "🧇" },
  // Nasi
  { id: 19, name: "Nasi Putih",                     price: 5000,  category: "Nasi",         emoji: "🍚" },
  { id: 20, name: "Nasi Ayom Geprek",               price: 15000, category: "Nasi",         emoji: "🍗" },
  { id: 21, name: "Nasi Dadar Telor",               price: 9000,  category: "Nasi",         emoji: "🍳" },
  { id: 22, name: "Nasi Goreng Maberga",            price: 15000, category: "Nasi",         emoji: "🍳" },
  { id: 23, name: "Nasi Goreng Maberga Istimewa",   price: 19000, category: "Nasi",         emoji: "🍳" },
  { id: 24, name: "Nasi + Omlete",                  price: 16500, category: "Nasi",         emoji: "🍳" },
  { id: 25, name: "Nasi + Ormlote Sapi",            price: 22000, category: "Nasi",         emoji: "🥩" },
  { id: 26, name: "Nasi + Goreng Sapi",             price: 22000, category: "Nasi",         emoji: "🥩" },
  { id: 27, name: "Nasi + Drenso Ayam",             price: 22000, category: "Nasi",         emoji: "🍗" },
  { id: 28, name: "Nasi + Drenso + Gibasi",         price: 23000, category: "Nasi",         emoji: "🍗" },
  { id: 29, name: "Nasi Saur Telor",                price: 16000, category: "Nasi",         emoji: "🥚" },
  { id: 30, name: "Nasi Ayam Sariniding",           price: 18000, category: "Nasi",         emoji: "🍗" },
  { id: 51, name: "Nasi Goreng",                    price: 13000, category: "Nasi",         emoji: "🍚" },
  { id: 52, name: "Nasi Ayom Degetek",              price: 13000, category: "Nasi",         emoji: "🍗" },
  // Mie Rebus
  { id: 41, name: "Indomie Rebus",                  price: 9000,  category: "Mie Rebus",    emoji: "🍜" },
  { id: 42, name: "Indomie Rebus Double",           price: 12000, category: "Mie Rebus",    emoji: "🍜" },
  { id: 43, name: "Indomie Rebus Bakso",            price: 11000, category: "Mie Rebus",    emoji: "🍜" },
  { id: 44, name: "Indomie Rebus Ayam Sair",        price: 14000, category: "Mie Rebus",    emoji: "🍜" },
  { id: 45, name: "Indomie Rebus Kisa",             price: 10000, category: "Mie Rebus",    emoji: "🍜" },
  { id: 54, name: "Mie Rebus",                      price: 10000, category: "Mie Rebus",    emoji: "🍜" },
  // Magelangan
  { id: 31, name: "Magelangan",                     price: 18000, category: "Magelangan",   emoji: "🍜" },
  { id: 32, name: "Magelangan Extra Nasi",          price: 20000, category: "Magelangan",   emoji: "🍜" },
  { id: 33, name: "Magelangan Bakso",               price: 21000, category: "Magelangan",   emoji: "🍜" },
  { id: 34, name: "Magelangan Ayam Sair",           price: 25000, category: "Magelangan",   emoji: "🍜" },
  { id: 35, name: "Magelangan Sirkuit",             price: 24000, category: "Magelangan",   emoji: "🍜" },
  { id: 36, name: "Magelangan Kornet",              price: 20000, category: "Magelangan",   emoji: "🍜" },
  { id: 37, name: "Magelangan Nugget",              price: 25000, category: "Magelangan",   emoji: "🍜" },
  { id: 38, name: "Magelangan Telur Dadar",         price: 21000, category: "Magelangan",   emoji: "🍜" },
  { id: 39, name: "Magelangan Telur Ceplok",        price: 21000, category: "Magelangan",   emoji: "🍜" },
  { id: 40, name: "Magelangan Telur Crok Arik",     price: 21000, category: "Magelangan",   emoji: "🍜" },
  // Indonesia
  { id: 46, name: "Indonesia Goreng Telor",         price: 9000,  category: "Indonesia",    emoji: "🍳" },
  { id: 47, name: "Indonesia Goreng Double",        price: 11000, category: "Indonesia",    emoji: "🍳" },
  { id: 48, name: "Indonesia Goreng Relo",          price: 12500, category: "Indonesia",    emoji: "🍳" },
  { id: 49, name: "Indonesia Goreng Kido",          price: 10000, category: "Indonesia",    emoji: "🍳" },
  { id: 50, name: "Indonesia Goreng",               price: 12999, category: "Indonesia",    emoji: "🍳" },
  // Bubur
  { id: 53, name: "Bubur Kacang Hijau",             price: 10000, category: "Bubur",        emoji: "🫙" },
  // Pisang Bakar
  { id: 55, name: "Pisang Keju Coklat",             price: 14000, category: "Pisang Bakar", emoji: "🍌" },
];

const CATEGORIES = [
  "Semua", "Minuman", "Pancong", "Nasi",
  "Mie Rebus", "Magelangan", "Indonesia", "Bubur", "Pisang Bakar",
];

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
      <div className="menu-img-placeholder">{item.emoji}</div>
      <div className="menu-info">
        <div className="menu-name">{item.name}</div>
        <div className="menu-price">
          Rp{item.price.toLocaleString("id")}
        </div>
        {qty === 0 ? (
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
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery]       = useState("");

  const filteredMenu = useMemo(() => {
    let data = menuData;
    if (activeCategory !== "Semua") {
      data = data.filter((item) => item.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter((item) => item.name.toLowerCase().includes(q));
    }
    return data;
  }, [activeCategory, searchQuery]);

  const totalQty = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="menu-screen">

      {/* STATUS BAR */}
      <div className="status-bar">
        <span className="time">20:15</span>
        <div className="icons">📶 🔋</div>
      </div>

      {/* HEADER */}
      <div className="menu-header">
        <div className="table-info">
          <span className="table-badge">🪑 Nomor Meja: 7</span>
          <button className="hamburger-btn" onClick={onOpenHamburger}>☰</button>
        </div>

        {/* Info toko — klik ke StoreScreen */}
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
          {CATEGORIES.map((cat) => (
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
        {filteredMenu.length === 0 ? (
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
