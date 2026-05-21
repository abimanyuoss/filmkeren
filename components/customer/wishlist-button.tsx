"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export function WishlistButton({ movieId }: { movieId: string }) {
  const [saved, setSaved] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const list = new Set(JSON.parse(localStorage.getItem("wishlist") || "[]"));
    setSaved(list.has(movieId));
  }, [movieId]);

  function toggle() {
    const raw = JSON.parse(localStorage.getItem("wishlist") || "[]") as string[];
    const list = new Set(raw);
    if (list.has(movieId)) {
      list.delete(movieId);
      setSaved(false);
      addToast("Dihapus dari daftar simpan", "info");
    } else {
      list.add(movieId);
      setSaved(true);
      addToast("Ditambahkan ke daftar simpan", "success");
    }
    localStorage.setItem("wishlist", JSON.stringify([...list]));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`wishlist-button ${saved ? "saved" : ""}`}
      aria-label={saved ? "Hapus dari wishlist" : "Tambah ke wishlist"}
    >
      <Heart size={20} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
