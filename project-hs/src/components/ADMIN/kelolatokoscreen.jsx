import { useState, useEffect } from "react";
import { supabase } from "../../supabase";

// ===================== HELPERS =====================
const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

const DEFAULT_STORE = {
  name:        "Warkop HS Balio",
  address:     "Jl. Babakan Lor No.25, Bogor Barat, Bogor",
  phone:       "08123456789",
  description: "Warkop legendaris dengan suasana nyaman dan menu pilihan.",
  maps_url:    "",
  instagram:   "",
};

const DEFAULT_HOURS = DAYS.map(day => ({
  day,
  is_open:    true,
  open_time:  "00:00",
  close_time: "23:59",
  is_24h:     true,
}));

// ===================== SUB-COMPONENTS =====================
function SectionCard({ title, icon, children }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E8E8E8", marginBottom: 20, overflow: "hidden" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid #F0F0F0", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{title}</h3>
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "9px 12px",
  border: "1.5px solid #E0E0E0", borderRadius: 8,
  fontSize: 13, outline: "none", fontFamily: "sans-serif",
  boxSizing: "border-box", transition: "border-color 0.15s",
};

// ===================== MAIN SCREEN =====================
export default function KelolaTokoScreen() {
  const [store, setStore]   = useState(DEFAULT_STORE);
  const [hours, setHours]   = useState(DEFAULT_HOURS);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState({ msg: "", type: "" });
  const [activeTab, setActiveTab] = useState("info");

  // ===== LOAD dari Supabase =====
  useEffect(() => {
    async function load() {
      setLoading(true);
      // Ambil info toko
      const { data: sd } = await supabase
        .from("store_settings")
        .select("*")
        .eq("id", 1)
        .single();
      if (sd) setStore(sd);

      // Ambil jam buka
      const { data: hd } = await supabase
        .from("store_hours")
        .select("*")
        .order("id");
      if (hd && hd.length > 0) setHours(hd);

      setLoading(false);
    }
    load();
  }, []);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  }

  // ===== SAVE INFO TOKO =====
  async function saveStoreInfo() {
    setSaving(true);
    const { error } = await supabase
      .from("store_settings")
      .upsert({ id: 1, ...store }, { onConflict: "id" });
    setSaving(false);
    if (error) showToast("Gagal menyimpan: " + error.message, "error");
    else showToast("✓ Info toko berhasil disimpan!");
  }

  // ===== SAVE JAM BUKA =====
  async function saveHours() {
    setSaving(true);
    const upsertData = hours.map((h, idx) => ({
      id: idx + 1,
      day: h.day,
      is_open: h.is_open,
      open_time: h.is_24h ? "00:00" : h.open_time,
      close_time: h.is_24h ? "23:59" : h.close_time,
      is_24h: h.is_24h,
    }));

    const { error } = await supabase
      .from("store_hours")
      .upsert(upsertData, { onConflict: "id" });
    setSaving(false);
    if (error) showToast("Gagal menyimpan: " + error.message, "error");
    else showToast("✓ Jam operasional berhasil disimpan!");
  }

  function updateHour(idx, field, value) {
    setHours(prev => prev.map((h, i) => i === idx ? { ...h, [field]: value } : h));
  }

  function setAll24h(val) {
    setHours(prev => prev.map(h => ({ ...h, is_24h: val, is_open: true })));
  }

  if (loading) return (
    <div style={{ padding: 40, textAlign: "center", color: "#aaa", fontFamily: "sans-serif" }}>
      Memuat data toko...
    </div>
  );

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 800 }}>
      {/* Toast */}
      {toast.msg && (
        <div style={{
          position: "fixed", top: 20, right: 24,
          background: toast.type === "error" ? "#c0392b" : "#27ae60",
          color: "#fff", padding: "10px 20px", borderRadius: 10,
          fontSize: 13, fontWeight: 700, zIndex: 999,
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          animation: "toastIn 0.2s ease",
        }}>
          <style>{`@keyframes toastIn{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
          {toast.msg}
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Kelola Toko</h2>
        <p style={{ margin: "4px 0 0", color: "#888", fontSize: 13 }}>Atur informasi dan jam operasional toko</p>
      </div>

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, background: "#F0F0F0", borderRadius: 10, padding: 4, width: "fit-content" }}>
        {[{ key: "info", label: "📋 Info Toko" }, { key: "hours", label: "🕐 Jam Operasional" }].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 700, transition: "all 0.15s",
            background: activeTab === t.key ? "#fff" : "none",
            color: activeTab === t.key ? "#1A1208" : "#888",
            boxShadow: activeTab === t.key ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ===== TAB INFO TOKO ===== */}
      {activeTab === "info" && (
        <>
          <SectionCard title="Informasi Dasar" icon="🏪">
            <Field label="Nama Toko">
              <input value={store.name || ""} onChange={e => setStore(p => ({ ...p, name: e.target.value }))}
                style={inputStyle} placeholder="Nama Toko" />
            </Field>
            <Field label="Alamat Lengkap">
              <textarea value={store.address || ""} onChange={e => setStore(p => ({ ...p, address: e.target.value }))}
                style={{ ...inputStyle, resize: "vertical", minHeight: 72 }} placeholder="Jl. ..." />
            </Field>
            <Field label="Nomor Telepon / WhatsApp">
              <input value={store.phone || ""} onChange={e => setStore(p => ({ ...p, phone: e.target.value }))}
                style={inputStyle} placeholder="08xxxxxxxxxx" type="tel" />
            </Field>
            <Field label="Deskripsi Singkat">
              <textarea value={store.description || ""} onChange={e => setStore(p => ({ ...p, description: e.target.value }))}
                style={{ ...inputStyle, resize: "vertical", minHeight: 72 }} placeholder="Deskripsi singkat tentang toko..." />
            </Field>
          </SectionCard>

          <SectionCard title="Link & Media Sosial" icon="🔗">
            <Field label="Link Google Maps">
              <input value={store.maps_url || ""} onChange={e => setStore(p => ({ ...p, maps_url: e.target.value }))}
                style={inputStyle} placeholder="https://maps.google.com/..." />
            </Field>
            <Field label="Instagram">
              <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #E0E0E0", borderRadius: 8, overflow: "hidden" }}>
                <span style={{ padding: "9px 10px", background: "#F8F8F8", fontSize: 13, color: "#888", borderRight: "1px solid #E0E0E0" }}>@</span>
                <input value={store.instagram || ""} onChange={e => setStore(p => ({ ...p, instagram: e.target.value }))}
                  style={{ ...inputStyle, border: "none", borderRadius: 0 }} placeholder="username" />
              </div>
            </Field>
          </SectionCard>

          <button
            onClick={saveStoreInfo}
            disabled={saving}
            style={{
              background: "#1A1208", color: "#fff", border: "none", borderRadius: 10,
              padding: "12px 32px", fontSize: 14, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Menyimpan..." : "💾 Simpan Info Toko"}
          </button>
        </>
      )}

      {/* ===== TAB JAM OPERASIONAL ===== */}
      {activeTab === "hours" && (
        <>
          <SectionCard title="Jam Operasional" icon="🕐">
            {/* Shortcut all 24h */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button onClick={() => setAll24h(true)} style={{
                padding: "7px 14px", border: "1.5px solid #27ae60", borderRadius: 8,
                background: "#eafaf1", color: "#1e8449", fontSize: 12, fontWeight: 700, cursor: "pointer",
              }}>⚡ Set Semua 24 Jam</button>
              <button onClick={() => setHours(prev => prev.map(h => ({ ...h, is_24h: false })))} style={{
                padding: "7px 14px", border: "1.5px solid #E0E0E0", borderRadius: 8,
                background: "#F8F8F8", color: "#555", fontSize: 12, fontWeight: 700, cursor: "pointer",
              }}>Atur Manual</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {hours.map((h, idx) => (
                <div key={h.day} style={{
                  display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
                  padding: "12px 14px", borderRadius: 8,
                  background: h.is_open ? "#fff" : "#F8F8F8",
                  border: "1px solid " + (h.is_open ? "#E8DCC8" : "#E0E0E0"),
                }}>
                  {/* Toggle buka/tutup */}
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", minWidth: 80 }}>
                    <input type="checkbox" checked={h.is_open} onChange={e => updateHour(idx, "is_open", e.target.checked)}
                      style={{ width: 16, height: 16, accentColor: "#B8860B" }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: h.is_open ? "#1A1208" : "#aaa", minWidth: 56 }}>{h.day}</span>
                  </label>

                  {h.is_open ? (
                    <>
                      {/* Checkbox 24 jam */}
                      <label style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
                        <input type="checkbox" checked={h.is_24h} onChange={e => updateHour(idx, "is_24h", e.target.checked)}
                          style={{ width: 14, height: 14, accentColor: "#B8860B" }} />
                        <span style={{ fontSize: 12, color: "#555", fontWeight: 600 }}>24 Jam</span>
                      </label>

                      {/* Input jam buka/tutup — disabled kalau 24h */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <input type="time" value={h.open_time} onChange={e => updateHour(idx, "open_time", e.target.value)}
                          disabled={h.is_24h}
                          style={{ ...inputStyle, width: 110, opacity: h.is_24h ? 0.4 : 1, cursor: h.is_24h ? "not-allowed" : "auto" }} />
                        <span style={{ fontSize: 12, color: "#888" }}>–</span>
                        <input type="time" value={h.close_time} onChange={e => updateHour(idx, "close_time", e.target.value)}
                          disabled={h.is_24h}
                          style={{ ...inputStyle, width: 110, opacity: h.is_24h ? 0.4 : 1, cursor: h.is_24h ? "not-allowed" : "auto" }} />
                      </div>

                      <span style={{ fontSize: 11, color: "#27ae60", fontWeight: 700 }}>
                        {h.is_24h ? "🟢 Buka 24 Jam" : "🟢 Buka"}
                      </span>
                    </>
                  ) : (
                    <span style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>🔴 Tutup</span>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>

          <button
            onClick={saveHours}
            disabled={saving}
            style={{
              background: "#1A1208", color: "#fff", border: "none", borderRadius: 10,
              padding: "12px 32px", fontSize: 14, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Menyimpan..." : "💾 Simpan Jam Operasional"}
          </button>
        </>
      )}

      {/* Catatan setup DB */}
      <div style={{ marginTop: 24, background: "#FFF9E6", border: "1px solid #ffc107", borderRadius: 10, padding: "14px 18px", fontSize: 12, color: "#856404", wordBreak: "break-word", overflowWrap: "break-word" }}>
        <strong>⚠️ Setup Database (sekali saja)</strong> — jalankan di Supabase SQL Editor:
        <pre style={{
          marginTop: 10, background: "#1A1208", color: "#E8A020",
          borderRadius: 8, padding: "12px 14px", fontSize: 11,
          overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word",
          lineHeight: 1.7, fontFamily: "monospace",
        }}>{`CREATE TABLE IF NOT EXISTS store_settings (
  id int PRIMARY KEY DEFAULT 1,
  name text, address text, phone text,
  description text, maps_url text, instagram text
);

CREATE TABLE IF NOT EXISTS store_hours (
  id int PRIMARY KEY, day text NOT NULL,
  is_open boolean DEFAULT true,
  open_time text DEFAULT '00:00',
  close_time text DEFAULT '23:59',
  is_24h boolean DEFAULT true
);

INSERT INTO store_settings (id, name)
VALUES (1, 'Warkop HS Balio')
ON CONFLICT (id) DO NOTHING;`}</pre>
      </div>
    </div>
  );
}