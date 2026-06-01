import { useState, useEffect, useRef } from "react";
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
  label: { fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 },
};

// ===================== IMAGE UPLOADER =====================
function ImageUploader({ currentUrl, onUploaded }) {
  const inputRef = useRef();
  const [preview, setPreview]     = useState(currentUrl || "");
  const [uploading, setUploading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const ext      = file.name.split(".").pop();
    const fileName = `menu_${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("menu-images")
      .upload(fileName, file, { upsert: true });

    if (error) {
      alert("Gagal upload: " + error.message);
      setPreview(currentUrl || "");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("menu-images").getPublicUrl(fileName);
    setPreview(data.publicUrl);
    onUploaded(data.publicUrl);
    setUploading(false);
  }

  return (
    <div>
      <label style={STYLE.label}>Gambar Menu</label>
      <div
        onClick={() => inputRef.current.click()}
        style={{
          border: "2px dashed #E0E0E0", borderRadius: 10, padding: 12,
          textAlign: "center", cursor: "pointer", background: "#FAFAFA",
          transition: "border-color 0.15s", minHeight: 120,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 8,
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "#B8860B"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "#E0E0E0"}
      >
        {uploading ? (
          <div style={{ color: "#888", fontSize: 13 }}>⏳ Mengupload...</div>
        ) : preview ? (
          <>
            <img src={preview} alt="preview" style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 8 }} />
            <span style={{ fontSize: 11, color: "#888" }}>Klik untuk ganti gambar</span>
          </>
        ) : (
          <>
            <div style={{ fontSize: 32 }}>🖼️</div>
            <div style={{ fontSize: 13, color: "#888" }}>Klik untuk upload gambar</div>
            <div style={{ fontSize: 11, color: "#aaa" }}>JPG, PNG, WEBP (maks 2MB)</div>
          </>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
    </div>
  );
}

// ===================== KONFIRMASI HAPUS MODAL =====================
function DeleteConfirmModal({ item, onCancel, onConfirm, deleting }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 360, boxShadow: "0 8px 32px rgba(0,0,0,0.2)", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🗑️</div>
        <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 700 }}>Hapus Menu?</h3>
        <p style={{ fontSize: 13, color: "#666", margin: "0 0 20px", lineHeight: 1.5 }}>
          Yakin ingin menghapus <strong>"{item.name}"</strong>?<br />
          Tindakan ini tidak bisa dibatalkan.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button style={STYLE.btn("#F0F0F0", "#333")} onClick={onCancel} disabled={deleting}>Batal</button>
          <button
            style={{ ...STYLE.btn("#c0392b"), opacity: deleting ? 0.7 : 1 }}
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ===================== MENU MODAL =====================
function MenuModal({ item, categories, onClose, onSave }) {
  const [form, setForm] = useState(
    item
      ? { name: item.name, price: item.price, category_id: item.category_id || "", description: item.description || "", image_url: item.image_url || "", is_available: item.is_available }
      : { name: "", price: "", category_id: categories[0]?.id || "", description: "", image_url: "", is_available: true }
  );
  const [saving, setSaving] = useState(false);

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  async function handleSave() {
    if (!form.name.trim() || !form.price) return alert("Nama dan harga wajib diisi.");
    setSaving(true);

    const payload = {
      name:         form.name.trim(),
      price:        Number(form.price),
      category_id:  form.category_id || null,
      description:  form.description,
      image_url:    form.image_url,
      is_available: form.is_available,
    };

    let error;
    if (item) {
      ({ error } = await supabase.from("menus").update(payload).eq("id", item.id));
    } else {
      ({ error } = await supabase.from("menus").insert(payload));
    }

    setSaving(false);
    if (error) { alert("Gagal menyimpan: " + error.message); return; }
    onSave();
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 460, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
        <h3 style={{ margin: "0 0 20px", fontSize: 17, fontWeight: 700 }}>{item ? "Edit Menu" : "Tambah Menu"}</h3>
        <div style={{ display: "grid", gap: 14 }}>
          <ImageUploader currentUrl={form.image_url} onUploaded={url => set("image_url", url)} />
          <div>
            <label style={STYLE.label}>Nama Menu *</label>
            <input style={STYLE.input} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Contoh: Kopi Susu" />
          </div>
          <div>
            <label style={STYLE.label}>Harga (Rp) *</label>
            <input style={STYLE.input} type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="8000" />
          </div>
          <div>
            <label style={STYLE.label}>Kategori</label>
            <select style={STYLE.input} value={form.category_id} onChange={e => set("category_id", e.target.value)}>
              <option value="">— Pilih Kategori —</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={STYLE.label}>Deskripsi</label>
            <textarea style={{ ...STYLE.input, height: 70, resize: "vertical" }} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Opsional" />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
            <input type="checkbox" checked={form.is_available} onChange={e => set("is_available", e.target.checked)} />
            Tersedia / Aktif
          </label>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
          <button style={STYLE.btn("#F0F0F0", "#333")} onClick={onClose}>Batal</button>
          <button style={{ ...STYLE.btn("#1A1208"), opacity: saving ? 0.7 : 1 }} onClick={handleSave} disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ===================== MAIN SCREEN =====================
export default function KelolaMenuScreen() {
  const [menus, setMenus]           = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [filterCat, setFilterCat]   = useState("Semua");
  const [modal, setModal]           = useState(null);        // null | "add" | item object
  const [deleteTarget, setDeleteTarget] = useState(null);    // item yang akan dihapus
  const [deleting, setDeleting]     = useState(false);
  const [toast, setToast]           = useState("");

  async function fetchData() {
    setLoading(true);
    const [{ data: cats }, { data: mens }] = await Promise.all([
      supabase.from("categories").select("*").order("name"),
      supabase.from("menus").select("*, categories(name)").order("name"),
    ]);
    if (cats) setCategories(cats);
    if (mens) setMenus(mens);
    setLoading(false);
  }

  useEffect(() => { fetchData(); }, []);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  // FIX: delete dengan optimistic update + error handling yang jelas
  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);

    const { error } = await supabase
      .from("menus")
      .delete()
      .eq("id", deleteTarget.id);

    setDeleting(false);
    setDeleteTarget(null);

    if (error) {
      // Cek apakah error karena foreign key (menu masih ada di order_items)
      if (error.code === "23503") {
        showToast("❌ Menu tidak bisa dihapus karena masih ada di riwayat pesanan.");
      } else {
        showToast("❌ Gagal menghapus: " + error.message);
      }
      return;
    }

    // Optimistic: langsung hapus dari state, tidak perlu refetch
    setMenus(prev => prev.filter(m => m.id !== deleteTarget.id));
    showToast("✓ Menu berhasil dihapus.");
  }

  async function handleToggle(item) {
    // Optimistic update dulu
    setMenus(prev => prev.map(m => m.id === item.id ? { ...m, is_available: !m.is_available } : m));
    const { error } = await supabase
      .from("menus")
      .update({ is_available: !item.is_available })
      .eq("id", item.id);
    if (error) {
      // Rollback kalau gagal
      setMenus(prev => prev.map(m => m.id === item.id ? { ...m, is_available: item.is_available } : m));
      showToast("❌ Gagal mengubah status.");
    }
  }

  const filtered = menus.filter(m => {
    const matchQ   = m.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "Semua" || m.categories?.name === filterCat;
    return matchQ && matchCat;
  });

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 24,
          background: toast.startsWith("✓") ? "#27ae60" : "#c0392b",
          color: "#fff", padding: "10px 20px", borderRadius: 10,
          fontSize: 13, fontWeight: 700, zIndex: 999,
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          animation: "toastIn 0.2s ease",
        }}>
          <style>{`@keyframes toastIn{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
          {toast}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Kelola Menu</h2>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: 13 }}>{menus.length} item menu</p>
        </div>
        <button style={STYLE.btn("#1A1208")} onClick={() => setModal("add")}>+ Tambah Menu</button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input style={{ ...STYLE.input, width: 220 }} placeholder="Cari menu..." value={search} onChange={e => setSearch(e.target.value)} />
        <select style={{ ...STYLE.input, width: 160 }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option>Semua</option>
          {categories.map(c => <option key={c.id}>{c.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#888" }}>Memuat...</div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E8E8E8", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#F8F8F8", borderBottom: "1px solid #E8E8E8" }}>
                {["Gambar", "Nama", "Kategori", "Harga", "Status", "Aksi"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#555" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: 32, color: "#aaa" }}>Tidak ada menu</td></tr>
              ) : filtered.map((item, i) => (
                <tr key={item.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F0F0F0" : "none" }}>
                  <td style={{ padding: "10px 16px" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 8, overflow: "hidden", background: "#F5E9C9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                      {item.image_url
                        ? <img src={item.image_url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : "🍽️"}
                    </div>
                  </td>
                  <td style={{ padding: "10px 16px", fontWeight: 600 }}>
                    {item.name}
                    {item.description && <div style={{ fontSize: 11, color: "#888", fontWeight: 400, marginTop: 2 }}>{item.description}</div>}
                  </td>
                  <td style={{ padding: "10px 16px", color: "#555" }}>{item.categories?.name || "—"}</td>
                  <td style={{ padding: "10px 16px", fontWeight: 700 }}>Rp{Number(item.price).toLocaleString("id")}</td>
                  <td style={{ padding: "10px 16px" }}>
                    <span
                      onClick={() => handleToggle(item)}
                      title="Klik untuk toggle ketersediaan"
                      style={{
                        display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11,
                        fontWeight: 700, cursor: "pointer",
                        background: item.is_available ? "#d4edda" : "#f8d7da",
                        color: item.is_available ? "#155724" : "#721c24",
                      }}
                    >
                      {item.is_available ? "✓ Tersedia" : "✗ Habis"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={STYLE.btn("#F0F0F0", "#333")} onClick={() => setModal(item)}>Edit</button>
                      <button style={STYLE.btn("#fdecea", "#c0392b")} onClick={() => setDeleteTarget(item)}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal edit/tambah */}
      {modal && (
        <MenuModal
          item={modal === "add" ? null : modal}
          categories={categories}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); fetchData(); }}
        />
      )}

      {/* Modal konfirmasi hapus */}
      {deleteTarget && (
        <DeleteConfirmModal
          item={deleteTarget}
          deleting={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}