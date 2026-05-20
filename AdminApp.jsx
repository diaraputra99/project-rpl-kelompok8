import { useState } from "react";
import "./App.css";
import "./globals.css";

import LoginScreen from "./loginscreen";
import DashboardScreen from "./dashboardscreen";
import KelolaMenuScreen from "./kelolamenuscreen";
import KelolaStokScreen from "./kelolastokscreen";
import LaporanScreen from "./laporanscreen";

const Sidebar = ({ page, setPage, sideOpen }) => {
  const nav = [
    { label: "Dashboard", icon: "⊞", key: "dashboard", group: "UTAMA" },
    { label: "Kelola Menu", icon: "🍽", key: "menu", group: "OPERASIONAL" },
    { label: "Kelola Stok", icon: "📦", key: "stok", group: "OPERASIONAL" },
    { label: "Laporan Penjualan", icon: "📊", key: "laporan", group: "OPERASIONAL" },
  ];
  const groups = ["UTAMA", "OPERASIONAL"];

  return (
    <div className="sidebar" style={{ width: sideOpen ? 220 : 0, minWidth: sideOpen ? 220 : 0 }}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-logo">HS</div>
          <div className="sidebar-title-wrapper">
            <div className="sidebar-title">Restoflow Admin</div>
            <div className="sidebar-subtitle">Warkop HS Balio</div>
          </div>
        </div>
      </div>
      <div className="sidebar-menu">
        {groups.map(group => (
          <div key={group}>
            <div className="sidebar-group-title">{group}</div>
            {nav.filter(n => n.group === group).map(n => (
              <div
                key={n.key}
                onClick={() => setPage(n.key)}
                className={`sidebar-item ${page === n.key ? "active" : ""}`}
              >
                <span className="sidebar-icon">{n.icon}</span>
                <span>{n.label}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <div className="sidebar-avatar">A</div>
        <div>
          <div className="sidebar-user-name">Admin</div>
        </div>
        <div className="sidebar-logout-trigger">⇥</div>
      </div>
    </div>
  );
};

const Topbar = ({ title, sideOpen, setSideOpen, setPage }) => (
  <div className="topbar">
    <button onClick={() => setSideOpen(s => !s)} className="topbar-toggle">☰</button>
    <div className="topbar-breadcrumb">
      <span className="topbar-link" onClick={() => setPage("dashboard")}>Restoflow</span>
      <span> / </span>
      <span className="topbar-active-page">{title}</span>
    </div>
    <div className="topbar-right">
      <div className="topbar-date">Kamis, 14 Apr 2026</div>
      <div className="topbar-bell">🔔
        <span className="topbar-badge" />
      </div>
      <div className="topbar-user-pill">Admin</div>
      <div className="topbar-logout-btn" onClick={() => setPage("login")}>Logout</div>
    </div>
  </div>
);

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [sideOpen, setSideOpen] = useState(true);

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;

  const titles = { dashboard: "Dashboard", menu: "Kelola Menu", stok: "Kelola Stok", laporan: "Laporan Penjualan" };

  return (
    <div className="app-container">
      <Sidebar page={page} setPage={setPage} sideOpen={sideOpen} />
      <div className="main-content">
        <Topbar title={titles[page]} sideOpen={sideOpen} setSideOpen={setSideOpen} setPage={setPage} />
        <div className="page-content">
          {page === "dashboard" && <DashboardScreen setPage={setPage} />}
          {page === "menu" && <KelolaMenuScreen />}
          {page === "stok" && <KelolaStokScreen />}
          {page === "laporan" && <LaporanScreen />}
        </div>
      </div>
    </div>
  );
}