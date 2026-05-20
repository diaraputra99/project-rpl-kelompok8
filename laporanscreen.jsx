import { useState } from "react";
import { transaksiData, formatRp } from "./data";
import { StatusBadge } from "./dashboardscreen";
import "./laporanscreen.css";

export default function LaporanScreen() {
  const [period, setPeriod] = useState("Hari Ini");
  const [filterStatus, setFilterStatus] = useState("Semua Status");
  const [search, setSearch] = useState("");
  const [dropOpen, setDropOpen] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const filtered = transaksiData.filter(t => {
    const matchSearch = t.kode.toLowerCase().includes(search.toLowerCase()) || t.meja.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "Semua Status" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPage = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalPendapatan = filtered.reduce((s, t) => s + t.total, 0);
  const rataRata = filtered.length ? Math.round(totalPendapatan / filtered.length) : 0;
  const itemTerjual = 118;

  const periodLabel = {
    "Hari Ini": "Periode: Hari ini, 14 April 2026",
    "Minggu Ini": "Periode: 17 – 23 April 2026",
    "Bulan Ini": "Periode: April 2026",
    "Custom": "Periode: 14/04/2026 s/d 20/04/2026",
  };

  return (
    <div className="laporan-container">
      <div className="laporan-header-box">
        <div>
          <h1>Laporan Penjualan</h1>
          <p>Rekap transaksi dan pendapatan</p>
        </div>
        <div className="export-btn-group">
          <button className="btn-export-excel">📊 Ekspor Excel</button>
          <button className="btn-export-pdf">📄 Ekspor PDF</button>
        </div>
      </div>

      <div className="period-toolbar-row">
        {["Hari Ini", "Minggu Ini", "Bulan Ini", "Custom"].map(p => (
          <button
            key={p}
            onClick={() => { setPeriod(p); setPage(1); }}
            className={`period-toggle-btn ${period === p ? "active" : "inactive"}`}
          >
            {p}
          </button>
        ))}
        <span className="period-meta-text">{periodLabel[period]}</span>
      </div>

      <div className="laporan-stats-grid">
        {[
          { label: "TOTAL PENDAPATAN", val: formatRp(totalPendapatan) },
          { label: "TOTAL TRANSAKSI", val: filtered.length },
          { label: "RATA-RATA/TRANSAKSI", val: formatRp(rataRata) },
          { label: "ITEM TERJUAL", val: itemTerjual },
        ].map((s, i) => (
          <div key={i} className="laporan-stat-card">
            <div className="laporan-stat-label">{s.label}</div>
            <div className="laporan-stat-value">{s.val}</div>
          </div>
        ))}
      </div>

      <div className="filter-toolbar-row">
        <input
          placeholder="🔍 Cari kode / meja..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="laporan-search-input"
        />
        <div className="dropdown-anchor-wrapper">
          <button onClick={() => setDropOpen(d => !d)} className="dropdown-trigger-btn">
            {filterStatus} ▾
          </button>
          {dropOpen && (
            <div className="dropdown-floating-menu">
              {["Semua Status", "Selesai", "Diproses", "Baru"].map(s => (
                <div
                  key={s}
                  onClick={() => { setFilterStatus(s); setDropOpen(false); setPage(1); }}
                  className={`dropdown-floating-item ${filterStatus === s ? "selected" : "unselected"}`}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
        <span className="toolbar-counter-label">{filtered.length} transaksi ditemukan</span>
      </div>

      <div className="laporan-table-card">
        <table className="laporan-table">
          <thead>
            <tr>
              {["KODE", "MEJA", "ITEM", "TOTAL", "WAKTU", "METODE", "STATUS"].map(h => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {paged.map((t, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600, color: "var(--accent)" }}>{t.kode}</td>
                <td style={{ color: "var(--text)" }}>{t.meja}</td>
                <td style={{ color: "var(--text-muted)", maxWidth: 180 }}>{t.item}</td>
                <td style={{ fontWeight: 600, color: "var(--text)" }}>{formatRp(t.total)}</td>
                <td style={{ color: "var(--text-muted)" }}>{t.waktu}</td>
                <td>
                  <span 
                    className="method-badge-pill"
                    style={{
                      backgroundColor: t.metode === "QRIS" ? "#eff6ff" : "#f0fdf4",
                      color: t.metode === "QRIS" ? "#2563eb" : "#15803d"
                    }}
                  >
                    {t.metode}
                  </span>
                </td>
                <td><StatusBadge status={t.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination-wrapper">
          {Array.from({ length: totalPage }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`pagination-btn ${page === i + 1 ? "active" : "inactive"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}