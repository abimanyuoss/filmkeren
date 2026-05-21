"use client";

import { useEffect, useState, useRef } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

const CITIES = ["Jakarta", "Bandung", "Surabaya", "Medan"];

export function CitySelector() {
  const [city, setCity] = useState("Jakarta");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return null;
    };

    const savedCity = getCookie("selected-city") || localStorage.getItem("selected-city") || "Jakarta";
    setCity(savedCity);
    document.cookie = `selected-city=${savedCity}; path=/; max-age=31536000; SameSite=Lax`;
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => dropdownRef.current ? document.removeEventListener("mousedown", handleClickOutside) : undefined;
  }, []);

  function handleSelectCity(selectedCity: string) {
    setCity(selectedCity);
    setIsOpen(false);
    
    document.cookie = `selected-city=${selectedCity}; path=/; max-age=31536000; SameSite=Lax`;
    localStorage.setItem("selected-city", selectedCity);
    
    router.refresh();
    window.location.reload();
  }

  return (
    <div className="city-selector-container" ref={dropdownRef} style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="city-selector-button"
        type="button"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.45rem",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid var(--line)",
          borderRadius: "999px",
          color: "white",
          padding: "0.45rem 1rem",
          fontSize: "0.85rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
      >
        <MapPin size={14} color="var(--red)" />
        <span>{city}</span>
        <ChevronDown size={12} style={{ opacity: 0.7, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }} />
      </button>

      {isOpen && (
        <div
          className="city-selector-dropdown animate-fade-in"
          style={{
            position: "absolute",
            top: "calc(100% + 0.5rem)",
            left: 0,
            zIndex: 100,
            background: "rgba(20, 21, 23, 0.95)",
            backdropFilter: "blur(12px)",
            border: "1px solid var(--line)",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
            padding: "0.5rem",
            minWidth: "150px",
            display: "grid",
            gap: "0.25rem",
          }}
        >
          {CITIES.map((c) => (
            <button
              key={c}
              onClick={() => handleSelectCity(c)}
              className={`city-option ${c === city ? "active" : ""}`}
              type="button"
              style={{
                background: c === city ? "rgba(229, 9, 20, 0.15)" : "transparent",
                border: 0,
                borderRadius: "8px",
                color: c === city ? "var(--red)" : "var(--muted)",
                padding: "0.45rem 0.75rem",
                textAlign: "left",
                fontSize: "0.85rem",
                fontWeight: c === city ? 700 : 500,
                cursor: "pointer",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "all 0.15s ease",
              }}
            >
              {c}
              {c === city && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--red)" }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
