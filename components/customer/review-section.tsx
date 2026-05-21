"use client";

import { useEffect, useState } from "react";
import { Star, ThumbsUp, MessageSquare, User, X } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface Review {
  id: string | number;
  user: string;
  rating: number;
  date: string;
  text: string;
  likes: number;
}

const dummyReviews: Review[] = [
  {
    id: 1,
    user: "Budi Santoso",
    rating: 5,
    date: "2 hari lalu",
    text: "Pengalaman nonton yang luar biasa! Suara dan gambar benar-benar immersive. Worth it banget pakai IMAX.",
    likes: 24
  },
  {
    id: 2,
    user: "Dewi Kusuma",
    rating: 4,
    date: "5 hari lalu",
    text: "Filmnya bagus, tapi sedikit panjang. Studio Dolby Atmos-nya sih juara, bass-nya mantap!",
    likes: 12
  },
  {
    id: 3,
    user: "Rudi Hartono",
    rating: 5,
    date: "1 minggu lalu",
    text: "Booking tiketnya gampang banget lewat FilmKeren. Nggak perlu antre di loket. Recommended!",
    likes: 8
  }
];

export function ReviewSection({ movieTitle }: { movieTitle: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [likedReviews, setLikedReviews] = useState<Set<string | number>>(new Set());
  const { addToast } = useToast();

  useEffect(() => {
    const localKey = `reviews_${movieTitle}`;
    const saved = JSON.parse(localStorage.getItem(localKey) || "[]") as Review[];
    setReviews([...saved, ...dummyReviews]);
  }, [movieTitle]);

  function handleLike(id: string | number) {
    if (likedReviews.has(id)) {
      setLikedReviews((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, likes: r.likes - 1 } : r))
      );
      addToast("Batal menyukai ulasan", "info");
    } else {
      setLikedReviews((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, likes: r.likes + 1 } : r))
      );
      addToast("Menyukai ulasan ini", "success");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      addToast("Mohon lengkapi nama dan isi ulasan Anda", "warning");
      return;
    }

    const newReview: Review = {
      id: `local-${Date.now()}`,
      user: name,
      rating,
      date: "Baru saja",
      text: comment,
      likes: 0
    };

    const localKey = `reviews_${movieTitle}`;
    const saved = JSON.parse(localStorage.getItem(localKey) || "[]") as Review[];
    const updatedLocal = [newReview, ...saved];
    localStorage.setItem(localKey, JSON.stringify(updatedLocal));

    setReviews([newReview, ...reviews]);
    setName("");
    setComment("");
    setRating(5);
    setShowModal(false);
    addToast("Ulasan berhasil dikirim! Terima kasih.", "success");
  }

  return (
    <section className="customer-section">
      <div className="section-title-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <MessageSquare size={20} />
          Ulasan Penonton
        </h2>
        <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{reviews.length} ulasan</span>
      </div>

      <div className="review-list" style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}>
        {reviews.map((review) => (
          <article className="review-card" key={review.id} style={{ display: "grid", gap: "1rem" }}>
            <div className="review-header" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div className="review-avatar" style={{ width: "2.5rem", height: "2.5rem", borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "grid", placeItems: "center" }}>
                <User size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ color: "white", display: "block" }}>{review.user}</strong>
                <small style={{ color: "var(--muted)" }}>{review.date}</small>
              </div>
              <div className="review-rating" style={{ display: "flex", gap: "0.15rem" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < review.rating ? "var(--orange)" : "none"}
                    color={i < review.rating ? "var(--orange)" : "var(--dim)"}
                  />
                ))}
              </div>
            </div>
            <p className="review-text" style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.6, color: "rgba(255,255,255,0.8)" }}>{review.text}</p>
            <div className="review-footer" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "0.5rem" }}>
              <button 
                className={`review-like ${likedReviews.has(review.id) ? "active" : ""}`}
                onClick={() => handleLike(review.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  border: 0,
                  background: "transparent",
                  color: likedReviews.has(review.id) ? "var(--red)" : "var(--muted)",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  transition: "color 0.2s ease"
                }}
              >
                <ThumbsUp size={14} fill={likedReviews.has(review.id) ? "currentColor" : "none"} />
                <span>{review.likes}</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="review-prompt" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)", border: "1px dashed var(--line)", borderRadius: "12px", padding: "1.25rem" }}>
        <p style={{ margin: 0, fontSize: "0.95rem" }}>Sudah nonton <strong>{movieTitle}</strong>? Bagikan pengalaman Anda!</p>
        <button className="secondary-button" onClick={() => setShowModal(true)}>Tulis Ulasan</button>
      </div>

      {showModal && (
        <div 
          className="modal-backdrop animate-fade-in"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
            display: "grid",
            placeItems: "center",
            zIndex: 1000,
            padding: "1rem"
          }}
        >
          <div 
            className="modal-card animate-scale-up"
            style={{
              background: "rgba(20,21,23,0.95)",
              border: "1px solid var(--line)",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "500px",
              padding: "2rem",
              boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
              position: "relative"
            }}
          >
            <button 
              onClick={() => setShowModal(false)}
              className="icon-button"
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                border: 0,
                background: "rgba(255,255,255,0.05)",
                borderRadius: "50%",
                width: "2rem",
                height: "2rem",
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                color: "var(--muted)",
                transition: "all 0.2s ease"
              }}
            >
              <X size={16} />
            </button>

            <h3 style={{ fontSize: "1.35rem", fontWeight: 700, margin: "0 0 0.5rem 0", color: "white" }}>Tulis Ulasan</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", margin: "0 0 1.5rem 0" }}>Bagikan opini jujur Anda untuk film <strong>{movieTitle}</strong></p>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", color: "white", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>Nama Lengkap</label>
                <input 
                  type="text"
                  placeholder="Masukkan nama Anda..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--line)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "0.9rem",
                    outline: "none"
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", color: "white", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>Rating Film</label>
                <div style={{ display: "flex", gap: "0.35rem" }}>
                  {Array.from({ length: 5 }).map((_, i) => {
                    const starVal = i + 1;
                    const isActive = starVal <= (hoverRating || rating);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRating(starVal)}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        style={{
                          background: "transparent",
                          border: 0,
                          padding: 0,
                          cursor: "pointer"
                        }}
                      >
                        <Star 
                          size={28} 
                          fill={isActive ? "var(--orange)" : "none"} 
                          color={isActive ? "var(--orange)" : "var(--dim)"}
                          style={{ transition: "transform 0.1s ease" }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={{ display: "block", color: "white", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>Ulasan Anda</label>
                <textarea 
                  placeholder="Tulis ulasan menarik Anda di sini..."
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--line)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "0.9rem",
                    outline: "none",
                    resize: "none"
                  }}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="secondary-button" 
                  style={{ flex: 1 }}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="primary-button" 
                  style={{ flex: 1 }}
                >
                  Kirim Ulasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
