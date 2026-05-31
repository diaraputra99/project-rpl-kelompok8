import React from "react";
import "../styles/storescreen.css";

// ===================== DATA =====================
const STORE = {
  name: "Warkop HS Balio",
  address: "Jl. Babakan Lor No.25, Bogor Barat, Bogor",
  hours: "Buka 24 Jam",
};

const SCHEDULE = [
  { day: "SENIN",  jam: "Buka 24 Jam", todayIndex: 1 },
  { day: "SELASA", jam: "Buka 24 Jam", todayIndex: 1 },
  { day: "RABU",   jam: "Buka 24 Jam", todayIndex: 2 },
  { day: "KAMIS",  jam: "Buka 24 Jam", todayIndex: 3 },
  { day: "JUMAT",  jam: "Buka 24 Jam", todayIndex: 4 },
  { day: "SABTU",  jam: "Buka 24 Jam", todayIndex: 5 },
  { day: "MINGGU", jam: "Buka 24 Jam", todayIndex: 6 },
];

// Deteksi hari ini (0=Minggu, 1=Senin, dst.)
const JS_DAY = new Date().getDay();
// Konversi ke index array SCHEDULE (Senin=0 ... Minggu=6)
const TODAY_IDX = JS_DAY === 0 ? 6 : JS_DAY - 1;

// ===================== SUB-COMPONENTS =====================

function StoreHero() {
  return (
    <div className="store-hero">
      <h2>{STORE.name}</h2>
      <p>
        <span>📍</span> {STORE.address}
      </p>
    </div>
  );
}

function StoreActions({ onCall, onMaps }) {
  return (
    <div className="store-actions">
      <button className="store-action-btn" onClick={onCall}>
        📞 Hubungi Toko
      </button>
      <button className="store-action-btn" onClick={onMaps}>
        🗺️ Kunjungi Toko
      </button>
    </div>
  );
}

function ScheduleTable() {
  return (
    <div className="schedule-table">
      <div className="schedule-title">⏰ Jam Operasional</div>
      {SCHEDULE.map((row, idx) => (
        <div
          key={row.day}
          className={`schedule-row ${idx === TODAY_IDX ? "today" : ""}`}
        >
          <span className="day">{row.day}</span>
          <span className="jam">{row.jam}</span>
        </div>
      ))}
    </div>
  );
}

// ===================== MAIN SCREEN =====================

export default function StoreScreen({
  onBack,
  onShareLink,
  onGoToMenu,
  onGoToHistory,
  onGoToProfile,
}) {
  return (
    <div className="store-screen">



      {/* TOP BAR */}
      <div className="topbar">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2>Informasi Toko</h2>
        <button className="share-btn" onClick={onShareLink}>🔗</button>
      </div>

      {/* CONTENT */}
      <div className="scroll-content">
        <StoreHero />

        <StoreActions
          onCall={() => alert("Membuka telepon...")}
          onMaps={() => alert("Membuka Maps...")}
        />

        <ScheduleTable />

        <div className="spacer" />
      </div>

      {/* BOTTOM NAV */}
      <div className="bottom-nav">
        <button className="nav-item" onClick={onGoToMenu}>
          <span className="nav-icon">🍽️</span>Menu
        </button>
        <button className="nav-item active">
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