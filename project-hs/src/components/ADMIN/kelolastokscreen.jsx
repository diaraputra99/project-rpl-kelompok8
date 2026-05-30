import { useState, useEffect } from "react";
import { supabase } from "../../supabase";

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

// Kelola Stok — menampilkan semua menu dan toggle ketersediaannya
// Karena tabel "stok" belum ada, kita pakai kolom is_available di tabel menus
export default function KelolaStokScreen() {
  const [menus, setMenus]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  async function fetchMenus() {
    setLoading(true);
    const { data } = await supabase
      .from("menus")
      .select("*, categories(name)")
      .order("name");
    if (data) setMenus(data);
    setLoading(false);
  }

  useEffect(() => { fetchMenus(); }, []);

  async function toggleAvailable(item) {
    await supabase
      .from("menus")
      .update({ is_available: !item.is_available })
      .eq("id", item.id);
    fetchMenus();
  }

  async function setAllAvailable(val) {
    if (!confirm(`${val ? "Aktifkan" : "Nonaktifkan"} semua menu?`)) return;
    await supabase.from("menus").update({ is_available: val }).neq("id", 0);
    fetchMenus();
  }

  const filtered = menus.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const tersedia    = menus.filter(m => m.is_available).length;
  const tidakTersedia = menus.length - tersedia;

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Kelola Stok / Ketersediaan</h2>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: 13 }}>
            {tersedia} tersedia &nbsp;•&nbsp; {tidakTersedia} tidak tersedia
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={STYLE.btn("#d4edda", "#155724")} onClick={() => setAllAvailable(true)}>
            ✓ Aktifkan Semua
          </button>
          <button style={STYLE.btn("#f8d7da", "#721c24")} onClick={() => setAllAvailable(false)}>
            ✗ Nonaktifkan Semua
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          style={{ ...STYLE.input, width: 260 }}
          placeholder="Cari menu..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Tabel */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E8E8E8", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#aaa" }}>Memuat...</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#F8F8F8", borderBottom: "1px solid #E8E8E8" }}>
                {["Nama Menu", "Kategori", "Harga", "Status", "Toggle"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#555" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: 32, color: "#aaa" }}>Tidak ada menu</td></tr>
              ) : filtered.map((item, i) => (
                <tr key={item.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F5F5F5" : "none" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 600 }}>{item.name}</td>
                  <td style={{ padding: "12px 16px", color: "#666" }}>{item.categories?.name || "—"}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 700 }}>
                    Rp{Number(item.price).toLocaleString("id")}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      background: item.is_available ? "#d4edda" : "#f8d7da",
                      color: item.is_available ? "#155724" : "#721c24",
                      padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                    }}>
                      {item.is_available ? "✓ Tersedia" : "✗ Habis"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {/* Toggle switch */}
                    <div
                      onClick={() => toggleAvailable(item)}
                      style={{
                        width: 44, height: 24, borderRadius: 12, cursor: "pointer",
                        background: item.is_available ? "#27ae60" : "#ccc",
                        position: "relative", transition: "background 0.2s",
                      }}
                    >
                      <div style={{
                        position: "absolute", top: 3,
                        left: item.is_available ? 23 : 3,
                        width: 18, height: 18, borderRadius: "50%",
                        background: "#fff", transition: "left 0.2s",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                      }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}