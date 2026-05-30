import { useState, useEffect } from "react";
import { supabase } from "../../supabase";

import DashboardScreen from "./dashboardscreen";
import KelolaMenuScreen from "./kelolamenuscreen";
import KelolaStokScreen from "./kelolastokscreen";
import LaporanScreen from "./laporanscreen";

// ===================== LOGIN SCREEN =====================
function LoginScreen({ onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authErr } = await supabase.auth.signInWithPassword({ email, password });
    if (authErr) {
      setError("Email atau password salah.");
    } else {
      onLogin();
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#F5F5F5", fontFamily: "sans-serif",
    }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 40, width: 360, boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, background: "#1A1208", borderRadius: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 800, color: "#E8A020", margin: "0 auto 12px",
          }}>HS</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Restoflow Admin</h2>
          <p style={{ color: "#888", fontSize: 13, marginTop: 4 }}>Warkop HS Balio</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@warkophs.com"
              required
              style={{
                width: "100%", padding: "10px 14px", border: "1.5px solid #E0E0E0",
                borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%", padding: "10px 14px", border: "1.5px solid #E0E0E0",
                borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
          {error && (
            <div style={{ background: "#fdecea", color: "#c0392b", borderRadius: 8, padding: "8px 12px", fontSize: 13, marginBottom: 12 }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", background: "#1A1208", color: "#fff", border: "none",
              borderRadius: 8, padding: "12px 0", fontSize: 15, fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer", marginTop: 8,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ===================== SIDEBAR =====================
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
        <div><div className="sidebar-user-name">Admin</div></div>
      </div>
    </div>
  );
};

// ===================== TOPBAR =====================
const Topbar = ({ title, sideOpen, setSideOpen, onLogout }) => {
  const now = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return (
    <div className="topbar">
      <button onClick={() => setSideOpen(s => !s)} className="topbar-toggle">☰</button>
      <div className="topbar-breadcrumb">
        <span className="topbar-link">Restoflow</span>
        <span> / </span>
        <span className="topbar-active-page">{title}</span>
      </div>
      <div className="topbar-right">
        <div className="topbar-date">{now}</div>
        <div className="topbar-user-pill">Admin</div>
        <div className="topbar-logout-btn" onClick={onLogout}>Logout</div>
      </div>
    </div>
  );
};

// ===================== MAIN APP =====================
export default function AdminApp() {
  const [loggedIn, setLoggedIn]   = useState(false);
  const [checking, setChecking]   = useState(true);
  const [page, setPage]           = useState("dashboard");
  const [sideOpen, setSideOpen]   = useState(true);

  // Cek sesi yang masih aktif saat refresh halaman
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setLoggedIn(true);
      setChecking(false);
    });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setLoggedIn(false);
    setPage("dashboard");
  }

  if (checking) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#888" }}>
      Memeriksa sesi...
    </div>
  );

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;

  const titles = { dashboard: "Dashboard", menu: "Kelola Menu", stok: "Kelola Stok", laporan: "Laporan Penjualan" };

  return (
    <div className="app-container">
      <Sidebar page={page} setPage={setPage} sideOpen={sideOpen} />
      <div className="main-content">
        <Topbar title={titles[page]} sideOpen={sideOpen} setSideOpen={setSideOpen} onLogout={handleLogout} />
        <div className="page-content">
          {page === "dashboard" && <DashboardScreen setPage={setPage} />}
          {page === "menu"      && <KelolaMenuScreen />}
          {page === "stok"      && <KelolaStokScreen />}
          {page === "laporan"   && <LaporanScreen />}
        </div>
      </div>
    </div>
  );
}