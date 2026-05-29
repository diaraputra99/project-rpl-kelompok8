import React from "react";
import "./ProfileScreen.css";

// ===================== DATA =====================
const APP_VERSION = "1.0.0";

// ===================== SUB-COMPONENTS =====================

function UserRow({ onLogin }) {
  return (
    <div className="profile-user-row">
      <div className="avatar-circle">👤</div>
      <div className="user-text">
        <div className="user-name">Masuk sebagai tamu</div>
        <div className="user-sub">Masuk untuk akses lebih</div>
      </div>
      <button className="masuk-btn" onClick={onLogin}>
        Masuk
      </button>
    </div>
  );
}

function MenuItem({ icon, label, value, onClick }) {
  return (
    <div className="profile-menu-item" onClick={onClick}>
      <span className="pm-icon">{icon}</span>
      <span className="pm-label">{label}</span>
      <span className="pm-chevron">
        {value ? (
          <span className="pm-value">{value}</span>
        ) : (
          "›"
        )}
      </span>
    </div>
  );
}

// ===================== MAIN SCREEN =====================

export default function ProfileScreen({
  onGoToMenu,
  onGoToStore,
  onGoToHistory,
  onGoToLanguage,
  onLogin,
  onShowToast,
}) {
  return (
    <div className="profile-screen">

      {/* STATUS BAR */}
      <div className="status-bar">
        <span className="time">20:15</span>
        <div className="icons">📶 🔋</div>
      </div>

      {/* TOP BAR */}
      <div className="topbar">
        <h2>Profil</h2>
      </div>

      {/* CONTENT */}
      <div className="scroll-content">
        <div className="section-gap" />

        {/* Kartu user + menu utama */}
        <div className="profile-section">
          <UserRow onLogin={() => onShowToast("Fitur login segera hadir!")} />

          <MenuItem
            icon="📋"
            label="Riwayat Pesanan"
            onClick={onGoToHistory}
          />
          <MenuItem
            icon="🌐"
            label="Bahasa"
            onClick={onGoToLanguage}
          />
        </div>

        <div className="section-gap" />

        {/* Kartu tentang aplikasi */}
        <div className="profile-section">
          <MenuItem
            icon="ℹ️"
            label="Tentang RestoFlow"
            onClick={() => onShowToast("Tentang Aplikasi")}
          />
          <MenuItem
            icon="🔧"
            label="Versi Aplikasi"
            value={APP_VERSION}
            onClick={() => onShowToast(`Versi ${APP_VERSION}`)}
          />
        </div>

        <div className="section-gap" />
      </div>

      {/* BOTTOM NAV */}
      <div className="bottom-nav">
        <button className="nav-item" onClick={onGoToMenu}>
          <span className="nav-icon">🍽️</span>Menu
        </button>
        <button className="nav-item" onClick={onGoToStore}>
          <span className="nav-icon">🏪</span>Toko
        </button>
        <button className="nav-item" onClick={onGoToHistory}>
          <span className="nav-icon">📋</span>Pesanan
        </button>
        <button className="nav-item active">
          <span className="nav-icon">👤</span>Profil
        </button>
      </div>
    </div>
  );
}
