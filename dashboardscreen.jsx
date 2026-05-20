import { transaksiData, formatRp } from "./data";
import "./dashboardscreen.css";

// Ekspor komponen Badge agar bisa dipakai di kelolamenuscreen dan laporanscreen
export const StatusBadge = ({ status }) => {
  const styles = {
    Selesai: { bg: "var(--success-bg)", color: "var(--success)" },
    Diproses: { bg: "#eff6ff", color: "#2563eb" },
    Baru: { bg: "var(--warn-bg)", color: "var(--warn)" },
  };
  const s = styles[status] || { bg: "#f3f4f6", color: "var(--gray)" };
  
  return (
    <span className="status-badge" style={{ background: s.bg, color: s.color }}>
      {status}
    </span>
  );
};

export const KategoriPill = ({ kat }) => {
  const colors = {
    Minuman: { bg: "#eff6ff", color: "#1d4ed8" },
    Pancong: { bg: "#fdf4ff", color: "#7e22ce" },
    Magelangan: { bg: "var(--warn-bg)", color: "#c2410c" },
    "Mie Rebus": { bg: "var(--success-bg)", color: "#15803d" },
    Nasi: { bg: "#fffbeb", color: "#b45309" },
    "Mie Goreng": { bg: "var(--danger-bg)", color: "var(--danger)" },
  };
  const s = colors[kat] || { bg: "#f3f4f6", color: "var(--gray)" };
  
  return (
    <span className="kategori-pill" style={{ background: s.bg, color: s.color }}>
      {kat}
    </span>
  );
};

export default function DashboardScreen({ setPage }) {
  const pesananTerbaru = transaksiData.slice(0, 5);

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header" style={{ marginBottom: 24 }}>
        <h1>Dashboard</h1>
        <p>Ringkasan operasional hari ini • Kamis, 14 Apr 2026</p>
      </div>

      {/* Alert Banner */}
      <div className="dashboard-alert">
        <span>⚠️</span>
        <span>
          3 item stok hampir habis: <strong>Kopi Susu</strong> (sisa 5), <strong>Nasi Goreng</strong> (sisa 3), <strong>Pancong Lumer Keju Coklat</strong> (sisa 4).
          <span className="alert-link" onClick={() => setPage("stok")}>Lihat Stok →</span>
        </span>
      </div>

      {/* Stats Grid Lengkap */}
      <div className="dashboard-stats-grid">
        {[
          { label: "PESANAN HARI INI", val: "47" },
          { label: "PENDAPATAN HARIAN", val: "Rp 842.000" },
          { label: "PESANAN SELESAI", val: "44" },
          { label: "STOK HAMPIR HABIS", val: "3" },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.val}</div>
          </div>
        ))}
      </div>

      {/* Tabel Pesanan Terbaru Lengkap */}
      <div className="table-container">
        <div className="table-header">
          <h3>Pesanan Terbaru</h3>
          <span className="table-link" onClick={() => setPage("laporan")}>Lihat Semua →</span>
        </div>
        
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                {["KODE", "MEJA", "ITEM", "TOTAL", "WAKTU", "STATUS"].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pesananTerbaru.map((t, i) => (
                <tr key={i}>
                  <td style={{ color: "var(--accent)", fontWeight: 600 }}>{t.kode}</td>
                  <td>{t.meja}</td>
                  <td style={{ color: "var(--text-muted)", maxWidth: 200 }}>{t.item}</td>
                  <td style={{ fontWeight: 600, color: "var(--text)" }}>{formatRp(t.total)}</td>
                  <td style={{ color: "var(--text-muted)" }}>{t.waktu}</td>
                  <td><StatusBadge status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}