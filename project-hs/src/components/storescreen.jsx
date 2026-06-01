import React, { useState, useEffect } from "react";
import "../styles/storescreen.css";
import { supabase } from "../supabase";

// ===================== DATA =====================
const DEFAULT_STORE = {
  name: "Warkop HS Balio",
  address: "Jl. Babakan Lor No.25, Bogor Barat, Bogor",
  phone: "08123456789",
  maps_url: "",
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

function StoreHero({ name, address }) {
  return (
    <div className="store-hero">
      <h2>{name || DEFAULT_STORE.name}</h2>
      <p>
        <span>📍</span> {address || DEFAULT_STORE.address}
      </p>
    </div>
  );
}

function StoreActions({ onCall, onMaps, isPhoneAvailable, isMapsAvailable }) {
  return (
    <div className="store-actions">
      <button 
        className="store-action-btn" 
        onClick={onCall}
        disabled={!isPhoneAvailable}
        style={!isPhoneAvailable ? { opacity: 0.5, cursor: "not-allowed" } : {}}
      >
        📞 Hubungi Toko
      </button>
      <button 
        className="store-action-btn" 
        onClick={onMaps}
        disabled={!isMapsAvailable}
        style={!isMapsAvailable ? { opacity: 0.5, cursor: "not-allowed" } : {}}
      >
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
  onGoToMenu,
  onGoToHistory,
  onGoToProfile,
}) {
  const [store, setStore] = useState(DEFAULT_STORE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStore() {
      setLoading(true);
      const { data } = await supabase
        .from("store_settings")
        .select("*")
        .eq("id", 1)
        .single();
      if (data) {
        setStore(data);
      }
      setLoading(false);
    }
    fetchStore();
  }, []);

  const handleCallWhatsApp = () => {
    if (store.phone) {
      // Format: https://wa.me/6281234567890 (remove leading 0, add country code 62)
      const phoneFormatted = store.phone.replace(/^0/, "62");
      const waLink = `https://wa.me/${phoneFormatted}`;
      window.open(waLink, "_blank");
    }
  };

  const handleOpenMaps = () => {
    if (store.maps_url) {
      window.open(store.maps_url, "_blank");
    }
  };

  return (
    <div className="store-screen">
      {/* TOP BAR */}
      <div className="topbar">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2>Informasi Toko</h2>
        <div style={{ width: 32 }} />
      </div>

      {/* CONTENT */}
      <div className="scroll-content">
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, fontSize: 13, color: "#9A8A70" }}>
            Memuat informasi toko...
          </div>
        ) : (
          <>
            <StoreHero name={store.name} address={store.address} />
            <StoreActions 
              onCall={handleCallWhatsApp}
              onMaps={handleOpenMaps}
              isPhoneAvailable={!!store.phone}
              isMapsAvailable={!!store.maps_url}
            />
            <ScheduleTable />
            <div className="spacer" />
          </>
        )}
      </div>
    </div>
  );
}