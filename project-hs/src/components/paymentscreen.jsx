import React, { useState } from "react";
import "../styles/paymentscreen.css";

// ===================== FORM WITH VALIDATION =====================
function OrdererForm({ nama, noHp, email, onChange, errors }) {
  return (
    <div className="form-section">
      <div className="form-title">Informasi Pemesan</div>

      <div className="form-field">
        <label>Nama Lengkap <span style={{ color: "#c0392b", fontWeight: 800 }}>*</span></label>
        <div className="field-wrap">
          <span className="field-icon">👤</span>
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={nama}
            onChange={e => onChange("nama", e.target.value)}
            style={errors.nama ? { borderColor: "#c0392b", background: "#fff5f5" } : {}}
          />
        </div>
        {errors.nama && <div className="field-error">⚠ {errors.nama}</div>}
      </div>

      <div className="form-field">
        <label>Nomor Ponsel <span style={{ color: "#c0392b", fontWeight: 800 }}>*</span></label>
        <div className="field-wrap">
          <span className="field-icon">📞</span>
          <input
            type="tel"
            placeholder="08xxxxxxxxxx"
            value={noHp}
            onChange={e => onChange("noHp", e.target.value)}
            style={errors.noHp ? { borderColor: "#c0392b", background: "#fff5f5" } : {}}
          />
        </div>
        {errors.noHp && <div className="field-error">⚠ {errors.noHp}</div>}
      </div>

      <div className="form-field">
        <label>
          Kirim struk ke email{" "}
          <span style={{ color: "#9A8A70", fontWeight: 400, fontSize: 10, textTransform: "none", letterSpacing: 0 }}>(opsional)</span>
        </label>
        <div className="field-wrap">
          <span className="field-icon">✉️</span>
          <input
            type="email"
            placeholder="contoh@email.com"
            value={email}
            onChange={e => onChange("email", e.target.value)}
            style={errors.email ? { borderColor: "#c0392b", background: "#fff5f5" } : {}}
          />
        </div>
        {errors.email && <div className="field-error">⚠ {errors.email}</div>}
      </div>

      <div className="form-field">
        <label>Nomor Meja</label>
        <div className="field-wrap">
          <span className="field-icon">🪑</span>
          <input type="text" value="7" readOnly className="input-readonly" />
        </div>
      </div>

      <div className="store-notice">
        Kamu pesan dari &nbsp;<strong>Warkop HS Balio</strong>
      </div>
    </div>
  );
}

function MethodSelector({ method, onSelect }) {
  return (
    <div className="method-wrap">
      <div className="method-label">Metode Pembayaran</div>
      <div className="method-selector">
        <button className={`method-btn ${method === "online" ? "active" : ""}`} onClick={() => onSelect("online")}>
          💳 Pembayaran Online
        </button>
        <button className={`method-btn ${method === "cash" ? "active" : ""}`} onClick={() => onSelect("cash")}>
          💵 Bayar di Kasir
        </button>
      </div>
    </div>
  );
}

function QRISOption({ agreed, onToggle, error }) {
  return (
    <div className="qris-option-wrap">
      <div className="qris-selector">
        <div className="qris-left">
          <div className="qris-logo-box">QRIS</div>
          <span className="qris-label">QRIS</span>
        </div>
        <div className="qris-check">✓</div>
      </div>
      <div className="syarat-row" style={error ? { borderColor: "#c0392b" } : {}}>
        <input type="checkbox" id="syarat" checked={agreed} onChange={onToggle} />
        <label htmlFor="syarat">
          Saya setuju dengan <a href="#">Syarat &amp; Ketentuan</a> dan <a href="#">Kebijakan Privasi</a>
        </label>
      </div>
      {error && <div className="field-error">⚠ {error}</div>}
    </div>
  );
}

function CashInfo() {
  return (
    <div className="cash-info">
      🧾 Klik <strong>'Bayar'</strong> lalu tunjukkan bukti pesanan ke kasir untuk proses pembayaran tunai.
    </div>
  );
}

// ===================== MAIN SCREEN =====================
export default function PaymentScreen({ subtotal = 0, onBack, onPay }) {
  const [method, setMethod] = useState("online");
  const [agreed, setAgreed] = useState(true);
  const [form, setForm]     = useState({ nama: "", noHp: "", email: "" });
  const [errors, setErrors] = useState({});

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    // hapus error field yg lagi diketik
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.nama.trim())
      e.nama = "Nama lengkap wajib diisi.";
    if (!form.noHp.trim())
      e.noHp = "Nomor ponsel wajib diisi.";
    else if (!/^0[0-9]{8,12}$/.test(form.noHp.trim()))
      e.noHp = "Format tidak valid. Contoh: 08123456789";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Format email tidak valid.";
    if (method === "online" && !agreed)
      e.agreed = "Harap setujui syarat & ketentuan.";
    return e;
  }

  function handlePay() {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      // scroll ke error pertama
      setTimeout(() => {
        const el = document.querySelector(".field-error");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return;
    }
    onPay({ method, agreed, ...form });
  }

  return (
    <div className="payment-screen">
      <div className="topbar">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2>Pembayaran</h2>
      </div>

      <div className="order-type-tabs">
        <button className="ot-tab active">Tipe Pemesanan</button>
        <button className="ot-tab ot-tag">Makan di tempat 🍽️</button>
      </div>

      <div className="scroll-content">
        <div className="scroll-inner">
          <OrdererForm nama={form.nama} noHp={form.noHp} email={form.email} onChange={handleChange} errors={errors} />
          <MethodSelector method={method} onSelect={(m) => { setMethod(m); setErrors(p => ({ ...p, agreed: "" })); }} />
          {method === "online" ? (
            <QRISOption agreed={agreed} onToggle={() => { setAgreed(v => !v); setErrors(p => ({ ...p, agreed: "" })); }} error={errors.agreed} />
          ) : (
            <CashInfo />
          )}
        </div>
      </div>

      <div className="pay-footer">
        <div className="pay-footer-left">
          <div className="footer-label">Total Pembayaran</div>
          <div className="footer-amount">Rp{subtotal.toLocaleString("id")}</div>
        </div>
        <button className="pay-now-btn" onClick={handlePay}>Bayar</button>
      </div>
    </div>
  );
}