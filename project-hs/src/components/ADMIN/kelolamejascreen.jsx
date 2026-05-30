import { useState, useEffect } from "react";
import { supabase } from "../../supabase";

// Pastikan jalankan SQL ini dulu di Supabase:
// create table tables (
//   id serial primary key,
//   number int unique not null,
//   capacity int default 4,
//   status text default 'available', -- available | occupied | reserved
//   created_at timestamptz default now()
// );

const STATUS_CONFIG = {
  available: { label: "Tersedia",   bg: "#d4edda", text: "#155724", emoji: "🟢" },
  occupied:  { label: "Terisi",     bg: "#fff3cd", text: "#856404", emoji: "🟡" },
  reserved:  { label: "Reservasi",  bg: "#cce5ff", text: "#004085", emoji: "🔵" },
};

const STYLE = {
  btn: (bg, color = "#fff") => ({
    background: bg, color, border: "none", borderRadius: 8,
    padding: "8px 16px", fontSize: 13, fontWeight: 700,
    cursor: "pointer", fontFamily: "sans-serif",
  }),
  input: {
    width: "100%", padding: "9px 12px", border: "1.5px solid #E0E0E0",
    borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box",
    fontFamily: "sans-serif",
  },
};

function TableModal({ table, onClose, onSave }) {
  const [form, setForm] = useState(
    table
      ? { number: table.number, capacity: table.capacity, status: table.status }
      : { number: "", capacity: 4, status: "available" }
  );
  const [saving, setSaving] = useState(false);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSave() {
    if (!form.number) return alert("Nomor meja wajib diisi.");
    setSaving(true);
    const payload = { number: Number(form.number), capacity: Number(form.capacity), status: form.status };
    let error;
    if (table) {
      ({ error } = await supabase.from("tables").update(payload).eq("id", table.id));
    } else {
      ({ error } = await supabase.from("tables").insert(payload));
    }
    setSaving(false);
    if (error) { alert("Gagal: " + error.message); return; }
    onSave();
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 380, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
        <h3 style={{ margin: "0 0 20px", fontSize: 17, fontWeight: 700 }}>{table ? "Edit Meja" : "Tambah Meja"}</h3>
        <div style={{ display: "grid", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>Nomor Meja *</label>
            <input style={STYLE.input} type="number" value={form.number} onChange={e => set("number", e.target.value)} placeholder="1" />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>Kapasitas (orang)</label>
            <input style={STYLE.input} type="number" value={form.capacity} onChange={e => set("capacity", e.target.value)} placeholder="4" />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>Status</label>
            <select style={STYLE.input} value={form.status} onChange={e => set("status", e.target.value)}>
              <option value="available">Tersedia</option>
              <option value="occupied">Terisi</option>
              <option value="reserved">Reservasi</option>
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
          <button style={STYLE.btn("#F0F0F0", "#333")} onClick={onClose}>Batal</button>
          <button style={STYLE.btn("#1A1208")} onClick={handleSave} disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function KelolaMejaScreen() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]   = useState(null);

  async function fetchTables() {
    setLoading(true);
    const { data } = await supabase.from("tables").select("*").order("number");
    if (data) setTables(data);
    setLoading(false);
  }

  useEffect(() => { fetchTables(); }, []);

  async function handleDelete(id) {
    if (!confirm("Hapus meja ini?")) return;
    await supabase.from("tables").delete().eq("id", id);
    fetchTables();
  }

  async function handleStatus(table, status) {
    await supabase.from("tables").update({ status }).eq("id", table.id);
    fetchTables();
  }

  const counts = {
    available: tables.filter(t => t.status === "available").length,
    occupied:  tables.filter(t => t.status === "occupied").length,
    reserved:  tables.filter(t => t.status === "reserved").length,
  };

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Kelola Meja</h2>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: 13 }}>{tables.length} meja terdaftar</p>
        </div>
        <button style={STYLE.btn("#1A1208")} onClick={() => setModal("add")}>+ Tambah Meja</button>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <div key={key} style={{ background: "#fff", borderRadius: 12, border: "1px solid #E8E8E8", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24 }}>{cfg.emoji}</span>
            <div>
              <div style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>{cfg.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{counts[key]}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Grid meja visual */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#888" }}>Memuat...</div>
      ) : tables.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "#aaa", background: "#fff", borderRadius: 12 }}>
          Belum ada meja. Klik "+ Tambah Meja" untuk mulai.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14 }}>
          {tables.map(table => {
            const cfg = STATUS_CONFIG[table.status] || STATUS_CONFIG.available;
            return (
              <div key={table.id} style={{
                background: "#fff", borderRadius: 14, border: `2px solid ${cfg.bg}`,
                padding: 16, display: "flex", flexDirection: "column", gap: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}>
                {/* Nomor meja */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>MEJA</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: "#1A1208", lineHeight: 1 }}>{table.number}</div>
                  </div>
                  <span style={{ fontSize: 20 }}>{cfg.emoji}</span>
                </div>

                <div style={{ fontSize: 11, color: "#888" }}>👥 {table.capacity} orang</div>

                {/* Badge status */}
                <span style={{
                  background: cfg.bg, color: cfg.text,
                  padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                  alignSelf: "flex-start",
                }}>
                  {cfg.label}
                </span>

                {/* Tombol ubah status */}
                <select
                  value={table.status}
                  onChange={e => handleStatus(table, e.target.value)}
                  style={{
                    padding: "5px 8px", border: "1px solid #E0E0E0", borderRadius: 6,
                    fontSize: 11, outline: "none", cursor: "pointer", background: "#FAFAFA",
                  }}
                >
                  <option value="available">Tersedia</option>
                  <option value="occupied">Terisi</option>
                  <option value="reserved">Reservasi</option>
                </select>

                {/* Aksi */}
                <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
                  <button
                    style={{ ...STYLE.btn("#F0F0F0", "#333"), flex: 1, padding: "6px 0", fontSize: 12 }}
                    onClick={() => setModal(table)}
                  >Edit</button>
                  <button
                    style={{ ...STYLE.btn("#fdecea", "#c0392b"), flex: 1, padding: "6px 0", fontSize: 12 }}
                    onClick={() => handleDelete(table.id)}
                  >Hapus</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <TableModal
          table={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); fetchTables(); }}
        />
      )}
    </div>
  );
}