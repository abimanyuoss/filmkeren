"use client";

import { useState } from "react";
import { QrCode, Wallet, Landmark, CreditCard, Check } from "lucide-react";

interface PaymentOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  instruction: string;
}

const paymentOptions: PaymentOption[] = [
  {
    id: "QRIS",
    name: "QRIS",
    description: "Scan & bayar instan via e-wallet",
    icon: <QrCode size={20} />,
    instruction: "Scan kode QR yang muncul menggunakan e-wallet (GoPay, OVO, DANA, ShopeePay) atau Mobile Banking Anda."
  },
  {
    id: "GoPay",
    name: "GoPay",
    description: "Bayar cepat pakai akun GoPay",
    icon: <Wallet size={20} />,
    instruction: "Pastikan aplikasi GoPay terpasang pada handphone Anda. Saldo akan langsung terpotong setelah konfirmasi PIN."
  },
  {
    id: "Virtual Account",
    name: "Virtual Account",
    description: "Transfer Mandiri / BCA / BRI",
    icon: <Landmark size={20} />,
    instruction: "Nomor rekening Virtual Account unik akan terbit setelah Anda menekan tombol penyelesaian pembayaran."
  },
  {
    id: "Credit Card",
    name: "Kartu Kredit",
    description: "Visa, Mastercard, JCB",
    icon: <CreditCard size={20} />,
    instruction: "Silakan masukkan nomor kartu kredit, tanggal kadaluarsa, dan kode CVV Anda pada gerbang pembayaran aman."
  }
];

export function PaymentSelector() {
  const [selected, setSelected] = useState("QRIS");

  const activeOption = paymentOptions.find((opt) => opt.id === selected) || paymentOptions[0];

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <input name="paymentMethod" type="hidden" value={selected} />

      <label style={{ color: "white", fontSize: "0.85rem", fontWeight: 600, display: "block" }}>
        Pilih Metode Pembayaran
      </label>

      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "0.75rem",
          margin: "0.25rem 0"
        }}
      >
        {paymentOptions.map((opt) => {
          const isSelected = opt.id === selected;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelected(opt.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "0.5rem",
                padding: "1rem",
                background: isSelected ? "rgba(229, 9, 20, 0.06)" : "rgba(255, 255, 255, 0.02)",
                border: `1px solid ${isSelected ? "var(--red)" : "var(--line)"}`,
                borderRadius: "12px",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                transition: "all 0.2s ease",
                position: "relative",
                boxShadow: isSelected ? "0 4px 20px rgba(229, 9, 20, 0.15)" : "none"
              }}
            >
              <div 
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  width: "100%",
                  color: isSelected ? "var(--red)" : "var(--muted)"
                }}
              >
                <span style={{ 
                  width: "2.25rem", 
                  height: "2.25rem", 
                  borderRadius: "8px", 
                  background: isSelected ? "rgba(229, 9, 20, 0.15)" : "rgba(255, 255, 255, 0.05)",
                  display: "grid",
                  placeItems: "center"
                }}>
                  {opt.icon}
                </span>
                {isSelected && (
                  <span style={{ 
                    background: "var(--red)", 
                    color: "white", 
                    width: "1rem", 
                    height: "1rem", 
                    borderRadius: "50%", 
                    display: "grid", 
                    placeItems: "center" 
                  }}>
                    <Check size={10} strokeWidth={3} />
                  </span>
                )}
              </div>
              
              <div style={{ marginTop: "0.25rem" }}>
                <strong style={{ display: "block", color: "white", fontSize: "0.95rem" }}>{opt.name}</strong>
                <small style={{ display: "block", color: "var(--muted)", fontSize: "0.75rem", marginTop: "0.15rem" }}>
                  {opt.description}
                </small>
              </div>
            </button>
          );
        })}
      </div>

      <div 
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid var(--line)",
          borderRadius: "10px",
          padding: "1rem",
          fontSize: "0.85rem",
          color: "rgba(255, 255, 255, 0.8)",
          lineHeight: 1.5,
          marginTop: "0.25rem"
        }}
      >
        <span style={{ fontWeight: 700, color: "white", display: "block", marginBottom: "0.25rem" }}>
          Instruksi Pembayaran:
        </span>
        {activeOption.instruction}
      </div>
    </div>
  );
}
