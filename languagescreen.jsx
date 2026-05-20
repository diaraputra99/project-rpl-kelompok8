import React, { useState } from "react";
import "./LanguageScreen.css";

// ===================== DATA =====================
const LANGUAGES = [
  { code: "id", flag: "🇮🇩", label: "Indonesia" },
  { code: "en", flag: "🇬🇧", label: "Inggris"   },
];

// ===================== SUB-COMPONENTS =====================

function LangOption({ lang, isActive, onSelect }) {
  return (
    <div
      className={`lang-option ${isActive ? "active" : ""}`}
      onClick={() => onSelect(lang.code)}
    >
      <div className="flag-label">
        <span className="flag">{lang.flag}</span>
        <span className="lang-name">{lang.label}</span>
      </div>
      <span className={`check-icon ${isActive ? "visible" : ""}`}>✔</span>
    </div>
  );
}

// ===================== MAIN SCREEN =====================

export default function LanguageScreen({ onBack, onShowToast }) {
  const [selectedLang, setSelectedLang] = useState("id");

  function handleSelect(code) {
    setSelectedLang(code);
    const lang = LANGUAGES.find((l) => l.code === code);
    onShowToast?.(
      code === "id" ? "Bahasa: Indonesia" : "Language: English"
    );
  }

  return (
    <div className="language-screen">

      {/* STATUS BAR */}
      <div className="status-bar">
        <span className="time">20:15</span>
        <div className="icons">📶 🔋</div>
      </div>

      {/* TOP BAR */}
      <div className="topbar">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2>Bahasa</h2>
      </div>

      {/* CONTENT */}
      <div className="scroll-content">
        <div className="lang-list">
          {LANGUAGES.map((lang) => (
            <LangOption
              key={lang.code}
              lang={lang}
              isActive={selectedLang === lang.code}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
