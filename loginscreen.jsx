import { useState } from "react";
import "./loginscreen.css";

export default function LoginScreen({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const handleLogin = () => {
    if (user === "admin" && pass === "admin123") {
      onLogin();
    } else {
      setErr("Username atau password salah");
    }
  };

  return (
    <div className="login-container">
      {/* --- Panel Kiri --- */}
      <div className="login-left">
        <div className="login-bg-gradient" />
        
        <div className="login-left-content">
          <div className="login-brand-wrapper">
            <div className="login-logo">HS</div>
            <div>
              <div className="login-brand-title">Restoflow Admin</div>
              <div className="login-brand-subtitle">Warkop HS Balio</div>
            </div>
          </div>
          
          <h1 className="login-title">
            Kelola operasional warkop<br />
            <span className="login-title-accent">lebih cepat,</span><br />
            lebih teratur.
          </h1>
          
          <p className="login-desc">
            Pantau pesanan, stok, menu, dan laporan penjualan dalam satu dashboard modern untuk kebutuhan warkop Anda.
          </p>
          
          <div className="login-icon-row">
            {["💻", "📱", "☕"].map((icon, i) => (
              <div key={i} className="login-icon-box">{icon}</div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Panel Kanan --- */}
      <div className="login-right">
        <div className="login-form-box">
          <h2 className="login-heading">Masuk ke Dashboard</h2>
          <p className="login-subheading">Masukkan kredensial admin Anda untuk melanjutkan</p>

          {err && <div className="login-error-box">{err}</div>}

          {/* Input Username */}
          <div className="form-group-login">
            <label className="form-label-login">USERNAME</label>
            <div className="input-wrapper-login">
              <span className="input-icon-login">👤</span>
              <input
                value={user}
                onChange={e => setUser(e.target.value)}
                placeholder="Masukkan username"
                className="login-input"
              />
            </div>
          </div>

          {/* Input Password */}
          <div className="form-group-login" style={{ marginBottom: 8 }}>
            <label className="form-label-login">PASSWORD</label>
            <div className="input-wrapper-login">
              <span className="input-icon-login">🔒</span>
              <input
                type="password"
                value={pass}
                onChange={e => setPass(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="Masukkan password"
                className="login-input"
              />
            </div>
          </div>

          {/* Options: Remember Me & Forgot Password */}
          <div className="login-options-row">
            <label className="login-remember">
              <input type="checkbox" /> Ingat saya?
            </label>
            <span className="login-forgot">Lupa password?</span>
          </div>

          {/* Submit Button */}
          <button className="login-btn" onClick={handleLogin}>
            Masuk ke Dashboard
          </button>

          {/* Keterangan Demo */}
          <p className="login-demo-text">
            Demo: username <strong>admin</strong> / password <strong>admin123</strong>
          </p>
        </div>
      </div>
    </div>
  );
}