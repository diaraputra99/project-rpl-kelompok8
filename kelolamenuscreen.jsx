import { useState } from "react";
import { menuData, formatRp } from "./data";
import { KategoriPill } from "./dashboardscreen";
import "./kelolamenuscreen.css";

export default function KelolaMenuScreen() {
  const [menus, setMenus] = useState(menuData);
  const [search, setSearch] = useState("");
  const [filterKat, setFilterKat] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [modal, setModal] = useState(null); 
  const [form, setForm] = useState({ name: "", kategori: "Minuman", harga: "", deskripsi: "", tersedia: true });
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const kategoriList = ["Semua", ...Array.from(new Set(menus.map(m => m.kategori)))];

  const filtered = menus.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchKat = filterKat === "Semua" || m.kategori === filterKat;
    const matchStatus = filterStatus === "Semua" ? true : filterStatus === "Tersedia" ? m.tersedia : !m.tersedia;
    return matchSearch && matchKat && matchStatus;
  });

  const totalPage = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openEdit = (item) => {
    setForm({ name: item.name, kategori: item.kategori, harga: item.harga, deskripsi: "", tersedia: item.tersedia });
    setModal({ type: "edit", item });
  };
  const openHapus = (item) => setModal({ type: "hapus", item });
  const openTambah = () => {
    setForm({ name: "", kategori: "Minuman", harga: "", deskripsi: "", tersedia: true });
    setModal({ type: "tambah" });
  };

  const saveMenu = () => {
    if (modal.type === "tambah") {
      setMenus(m => [...m, { id: Date.now(), name: form.name, kategori: form.kategori, harga: Number(form.harga), tersedia: form.tersedia, img: "🍽" }]);
    } else {
      setMenus(m => m.map(x => x.id === modal.item.id ? { ...x, name: form.name, kategori: form.kategori, harga: Number(form.harga), tersedia: form.tersedia } : x));
    }
    setModal(null);
  };

  const hapusMenu = () => {
    setMenus(m => m.filter(x => x.id !== modal.item.id));
    setModal(null);
  };

  const toggleStatus = (id) => {
    setMenus(m => m.map(x => x.id === id ? { ...x, tersedia: !x.tersedia } : x));
  };

  return (
    <div className="menu-container">
      <div className="menu-header">
        <h1>Kelola Menu</h1>
        <p>Tambah, edit, dan hapus item menu</p>
      </div>

      <div className="menu-toolbar">
        <input
          placeholder="🔍 Cari menu..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="search-input"
        />
        <select value={filterKat} onChange={e => { setFilterKat(e.target.value); setPage(1); }} className="filter-select">
          {kategoriList.map(k => <option key={k}>{k}</option>)}
        </select>
        {["Semua", "Tersedia", "Tidak Tersedia"].map(s => (
          <button
            key={s}
            onClick={() => { setFilterStatus(s); setPage(1); }}
            className={`status-tab-btn ${filterStatus === s ? "active" : "inactive"}`}
          >
            {s}
          </button>
        ))}
        <button onClick={openTambah} className="add-menu-btn">+ Tambah Menu</button>
      </div>

      <div className="menu-table-card">
        <table className="menu-table">
          <thead>
            <tr>
              {["NO.", "MENU", "KATEGORI", "HARGA", "STATUS", "AKSI"].map(h => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {paged.map((m, i) => (
              <tr key={m.id}>
                <td>{(page - 1) * PER_PAGE + i + 1}</td>
                <td>
                  <div className="menu-item-info">
                    <div className="menu-img-placeholder">{m.img}</div>
                    <span className="menu-name-text">{m.name}</span>
                  </div>
                </td>
                <td><KategoriPill kat={m.kategori} /></td>
                <td className="menu-price-text">{formatRp(m.harga)}</td>
                <td>
                  <div className="toggle-switch-container">
                    <div
                      onClick={() => toggleStatus(m.id)}
                      className="toggle-track"
                      style={{ backgroundColor: m.tersedia ? "var(--success)" : "#d1d5db" }}
                    >
                      <div className="toggle-thumb" style={{ left: m.tersedia ? 18 : 2 }} />
                    </div>
                    <span style={{ fontSize: 12, color: m.tersedia ? "var(--success)" : "var(--text-light)" }}>
                      {m.tersedia ? "Tersedia" : "Tidak Tersedia"}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="action-btn-group">
                    <button onClick={() => openEdit(m)} className="edit-action-btn">✏️</button>
                    <button onClick={() => openHapus(m)} className="delete-action-btn">🗑</button>
                  </div>
                </td>
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

      {modal && (
        <div className="modal-overlay">
          {modal.type === "hapus" && (
            <div className="modal-box-delete">
              <div className="modal-header">
                <h3>Hapus Menu</h3>
                <button onClick={() => setModal(null)} className="modal-close-trigger">✕</button>
              </div>
              <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>
                Apakah Anda yakin ingin menghapus menu <strong>"{modal.item.name}"</strong>?
              </p>
              <div className="modal-action-footer">
                <button onClick={() => setModal(null)} className="btn-modal-cancel">Batal</button>
                <button onClick={hapusMenu} className="btn-modal-submit-delete">Hapus</button>
              </div>
            </div>
          )}

          {(modal.type === "edit" || modal.type === "tambah") && (
            <div className="modal-box-form">
              <div className="modal-header">
                <h3>{modal.type === "tambah" ? "Tambah Menu" : "Edit Menu"}</h3>
                <button onClick={() => setModal(null)} className="modal-close-trigger">✕</button>
              </div>

              <div className="upload-dashed-box">
                <div className="icon">🖼</div>
                <div className="main-text">Klik untuk upload foto menu</div>
                <div className="sub-text">JPG, PNG maks 50mb</div>
              </div>

              <div className="form-group">
                <label>Nama Menu</label>
                <input
                  value={form.name}
                  onChange={e => setForm(x => ({ ...x, name: e.target.value }))}
                  placeholder="Contoh: Kopi Susu Gula Aren"
                  className="form-input-field"
                />
              </div>

              <div className="form-row">
                <div className="form-col">
                  <label>Kategori</label>
                  <select value={form.kategori} onChange={e => setForm(x => ({ ...x, kategori: e.target.value }))} className="form-input-field" style={{ background: '#fff' }}>
                    {["Minuman", "Pancong", "Magelangan", "Mie Rebus", "Nasi", "Lainnya"].map(k => <option key={k}>{k}</option>)}
                  </select>
                </div>
                <div className="form-col">
                  <label>Harga (Rp)</label>
                  <input
                    type="number"
                    value={form.harga}
                    onChange={e => setForm(x => ({ ...x, harga: e.target.value }))}
                    placeholder="8.000"
                    className="form-input-field"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Deskripsi (Opsional)</label>
                <textarea
                  value={form.deskripsi}
                  onChange={e => setForm(x => ({ ...x, deskripsi: e.target.value }))}
                  placeholder="Deskripsi singkat menu ini..."
                  rows={3}
                  className="form-textarea"
                />
              </div>

              <label className="toggle-switch-container" style={{ marginBottom: 20, cursor: 'pointer' }}>
                <div
                  onClick={() => setForm(x => ({ ...x, tersedia: !x.tersedia }))}
                  className="toggle-track"
                  style={{ backgroundColor: form.tersedia ? "var(--success)" : "#d1d5db" }}
                >
                  <div className="toggle-thumb" style={{ left: form.tersedia ? 18 : 2 }} />
                </div>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Aktifkan menu setelah disimpan</span>
              </label>

              <div className="modal-action-footer">
                <button onClick={() => setModal(null)} className="btn-modal-cancel">Batal</button>
                <button onClick={saveMenu} className="btn-modal-submit-save">Simpan Menu</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}