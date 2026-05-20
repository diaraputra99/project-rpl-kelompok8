import { useState } from "react";
import { stokData } from "./data";
import { KategoriPill } from "./dashboardscreen";
import "./kelolastokscreen.css";

export default function KelolaStokScreen() {
  const [stoks, setStoks] = useState(stokData);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [editId, setEditId] = useState(null);
  const [editVal, setEditVal] = useState("");

  const getStatus = (j) => j === 0 ? "Habis" : j < 10 ? "Hampir Habis" : "Aman";
  const statusColor = { 
    Aman: { bg: "var(--success-bg)", color: "var(--success)" }, 
    "Hampir Habis": { bg: "var(--warn-bg)", color: "var(--warn)" }, 
    Habis: { bg: "var(--danger-bg)", color: "var(--danger)" } 
  };

  const filtered = stoks.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const status = getStatus(s.jumlah);
    const matchFilter = filter === "Semua" || status === filter;
    return matchSearch && matchFilter;
  });

  const aman = stoks.filter(s => getStatus(s.jumlah) === "Aman").length;
  const hampir = stoks.filter(s => getStatus(s.jumlah) === "Hampir Habis").length;
  const habis = stoks.filter(s => getStatus(s.jumlah) === "Habis").length;

  const saveEdit = (id) => {
    setStoks(s => s.map(x => x.id === id ? { ...x, jumlah: Number(editVal) } : x));
    setEditId(null);
  };

  return (
    <div className="stok-container">
      <div className="stok-header">
        <h1>Kelola Stok</h1>
        <p>Monitor dan update ketersediaan stok menu</p>
      </div>

      {hampir + habis > 0 && (
        <div className="alert-critical-banner">
          ⚠️ <strong>Peringatan Kritis!</strong> {hampir + habis} item memiliki stok di bawah batas minimum (10 unit): Kopi Susu (sisa 5), Nasi Goreng (sisa 3), Cappuccino (0 unit).
        </div>
      )}

      <div className="stok-stats-grid">
        {[
          { label: "STOK AMAN", val: aman, tc: "var(--success)" },
          { label: "HAMPIR HABIS", val: hampir, tc: "var(--warn)" },
          { label: "STOK HABIS", val: habis, tc: "var(--danger)" },
          { label: "TOTAL ITEM", val: stoks.length, tc: "var(--text)" },
        ].map((s, i) => (
          <div key={i} className="stok-stat-card">
            <div className="stok-stat-label">{s.label}</div>
            <div className="stok-stat-value" style={{ color: s.tc }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div className="stok-toolbar">
        <input
          placeholder="🔍 Cari nama menu..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="stok-search"
        />
        {["Semua", "Aman", "Hampir Habis", "Habis"].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`stok-filter-btn ${filter === s ? "active" : "inactive"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="stok-table-card">
        <table className="stok-table">
          <thead>
            <tr>
              {["NO.", "NAMA MENU", "KATEGORI", "STATUS", "JUMLAH", "KETERSEDIAAN"].map(h => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => {
              const status = getStatus(s.jumlah);
              const sc = statusColor[status];
              return (
                <tr key={s.id}>
                  <td style={{ fontSize: 13, color: "var(--text-muted)" }}>{i + 1}</td>
                  <td style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{s.name}</td>
                  <td><KategoriPill kat={s.kategori} /></td>
                  <td>
                    <span className="status-indicator-badge" style={{ background: sc.bg, color: sc.color }}>{status}</span>
                  </td>
                  <td>
                    {editId === s.id ? (
                      <div className="inline-edit-box">
                        <input
                          type="number"
                          value={editVal}
                          onChange={e => setEditVal(e.target.value)}
                          className="inline-edit-input"
                          autoFocus
                        />
                        <button onClick={() => saveEdit(s.id)} className="btn-inline-save">✓</button>
                        <button onClick={() => setEditId(null)} className="btn-inline-cancel">✕</button>
                      </div>
                    ) : (
                      <div className="display-stock-row">
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{s.jumlah}</span>
                        <button onClick={() => { setEditId(s.id); setEditVal(s.jumlah); }} className="btn-trigger-edit">Edit</button>
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="stock-progress-track">
                      <div 
                        className="stock-progress-bar"
                        style={{
                          width: `${Math.min(100, (s.jumlah / 50) * 100)}%`,
                          backgroundColor: status === "Aman" ? "var(--success)" : status === "Hampir Habis" ? "var(--warn)" : "var(--danger)"
                        }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}