"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast(`Kode promo "${text}" berhasil disalin!`, "success");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      type="button"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        background: copied ? "rgba(53, 208, 127, 0.15)" : "rgba(255, 255, 255, 0.1)",
        border: `1px solid ${copied ? "#35d07f" : "rgba(255, 255, 255, 0.2)"}`,
        borderRadius: "6px",
        color: copied ? "#35d07f" : "white",
        padding: "0.2rem 0.5rem",
        fontSize: "0.75rem",
        fontWeight: 600,
        cursor: "pointer",
        marginLeft: "0.5rem",
        transition: "all 0.2s ease"
      }}
      aria-label="Salin kode"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      <span>{copied ? "Tersalin" : "Salin"}</span>
    </button>
  );
}
