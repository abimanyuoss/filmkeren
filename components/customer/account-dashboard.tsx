"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Ticket, History, Heart, User, Bookmark, Gift, Calendar, Clock, ArrowRight } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import type { Movie } from "@/lib/types";

interface BookedTicket {
  id: string;
  movieTitle: string;
  moviePoster: string;
  cinemaName: string;
  studioName: string;
  showDate: string;
  startsAt: string;
  seats: string[];
  bookingCode: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
}

export function AccountDashboard({
  customer,
  movies
}: {
  customer: { name: string; email: string };
  movies: Movie[];
}) {
  const [tab, setTab] = useState<"active" | "history" | "wishlist" | "vouchers">("active");
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [bookedTickets, setBookedTickets] = useState<BookedTicket[]>([]);
  const [copiedVoucher, setCopiedVoucher] = useState<string | null>(null);

  useEffect(() => {
    setWishlistIds(JSON.parse(localStorage.getItem("wishlist") || "[]"));
    setBookedTickets(JSON.parse(localStorage.getItem("booked_tickets") || "[]"));
  }, []);

  const wishlistMovies = useMemo(
    () => movies.filter((m) => wishlistIds.includes(m.id)),
    [movies, wishlistIds]
  );

  const mockVouchers = [
    {
      code: "GOPAYNONTON",
      title: "Cashback Spesial GoPay",
      discount: "Cashback Rp 15.000",
      description: "Tanpa minimum transaksi. Berlaku khusus metode GoPay.",
      expiry: "31 Des 2026",
    },
    {
      code: "WEEKENDSERU",
      title: "Promo Akhir Pekan FilmKeren",
      discount: "Diskon 10% (max 20K)",
      description: "Minimum pembelian 2 tiket di bioskop CGV atau XXI mana saja.",
      expiry: "30 Jun 2026",
    },
    {
      code: "MEMBERBARU",
      title: "Voucher Selamat Datang",
      discount: "Potongan Rp 10.000",
      description: "Khusus untuk transaksi pertama member baru FilmKeren.",
      expiry: "31 Des 2026",
    }
  ];

  const handleCopyVoucher = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedVoucher(code);
    setTimeout(() => setCopiedVoucher(null), 2000);
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <section className="customer-section account-layout" style={{ display: "grid", gap: "2rem", gridTemplateColumns: "minmax(0, 1fr) 300px" }}>
      <div style={{ display: "grid", gap: "2rem" }}>
        <div className="account-tabs">
          <button className={tab === "active" ? "active" : ""} onClick={() => setTab("active")}>
            <Ticket size={16} />
            Tiket Aktif
          </button>
          <button className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}>
            <History size={16} />
            Riwayat
          </button>
          <button className={tab === "vouchers" ? "active" : ""} onClick={() => setTab("vouchers")}>
            <Gift size={16} />
            Voucher Saya
          </button>
          <button className={tab === "wishlist" ? "active" : ""} onClick={() => setTab("wishlist")}>
            <Heart size={16} />
            Wishlist
          </button>
        </div>

        {tab === "active" && (
          <div>
            {bookedTickets.length === 0 ? (
              <EmptyState
                icon="ticket"
                title="Belum ada tiket aktif"
                description="Pesan tiket film favorit Anda dan nikmati pengalaman sinematik terbaik."
                action={
                  <Link href="/movies" className="primary-button">
                    Cari Film
                  </Link>
                }
              />
            ) : (
              <div style={{ display: "grid", gap: "1rem" }}>
                {bookedTickets.map((ticket) => (
                  <div key={ticket.id} className="customer-panel" style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "1.5rem", padding: "1.25rem", position: "relative" }}>
                    <img
                      src={ticket.moviePoster}
                      alt={ticket.movieTitle}
                      style={{ width: "100px", height: "140px", objectFit: "cover", borderRadius: "8px" }}
                    />
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                          <div>
                            <h3 style={{ color: "white", fontSize: "1.2rem", fontWeight: "bold", margin: 0 }}>
                              {ticket.movieTitle}
                            </h3>
                            <p style={{ color: "var(--muted)", fontSize: "0.9rem", margin: "0.2rem 0" }}>
                              {ticket.cinemaName} • {ticket.studioName}
                            </p>
                          </div>
                          <span className="status-badge success">PAID</span>
                        </div>
                        
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "0.5rem" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", color: "var(--muted)" }}>
                            <Calendar size={14} />
                            {ticket.showDate}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", color: "var(--muted)" }}>
                            <Clock size={14} />
                            {ticket.startsAt}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", color: "var(--muted)" }}>
                            <Ticket size={14} />
                            Kursi: {ticket.seats.join(", ")}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", borderTop: "1px solid var(--line)", paddingTop: "0.75rem" }}>
                        <span>
                          <small style={{ color: "var(--dim)", display: "block", fontSize: "0.75rem" }}>Booking Code</small>
                          <strong style={{ color: "white", fontSize: "1rem" }}>{ticket.bookingCode}</strong>
                        </span>
                        <Link href={`/ticket/${ticket.id}`} className="primary-button" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", height: "auto", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          Lihat E-Ticket <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "history" && (
          <div className="customer-panel" style={{ padding: 0 }}>
            {bookedTickets.map((ticket) => (
              <Link href={`/ticket/${ticket.id}`} key={ticket.id} className="transaction-row" style={{ textDecoration: "none", display: "flex" }}>
                <div>
                  <strong>{ticket.movieTitle}</strong>
                  <small>{ticket.seats.length} Tiket • {ticket.cinemaName}</small>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className="status-badge success">Berhasil</span>
                  <strong>{formatRupiah(ticket.totalAmount)}</strong>
                </div>
              </Link>
            ))}
            <div className="transaction-row">
              <div>
                <strong>Spider-Man: No Way Home</strong>
                <small>2 Tiket • CGV Grand Indonesia</small>
              </div>
              <div style={{ textAlign: "right" }}>
                <span className="status-badge success">Berhasil</span>
                <strong>Rp 105.000</strong>
              </div>
            </div>
            <div className="transaction-row">
              <div>
                <strong>The Batman</strong>
                <small>1 Tiket • XXI Senayan City</small>
              </div>
              <div style={{ textAlign: "right" }}>
                <span className="status-badge success">Berhasil</span>
                <strong>Rp 65.000</strong>
              </div>
            </div>
            <div className="transaction-row">
              <div>
                <strong>Inception</strong>
                <small>3 Tiket • FilmKeren Grand Indonesia</small>
              </div>
              <div style={{ textAlign: "right" }}>
                <span className="status-badge success">Berhasil</span>
                <strong>Rp 195.000</strong>
              </div>
            </div>
          </div>
        )}

        {tab === "vouchers" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
            {mockVouchers.map((v) => (
              <div key={v.code} className="customer-panel" style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: "1px dashed var(--line)",
                position: "relative",
                overflow: "hidden",
                padding: "1.25rem",
                background: "linear-gradient(135deg, rgba(20, 20, 20, 0.9) 0%, rgba(30, 30, 30, 0.9) 100%)",
                borderRadius: "12px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(229, 9, 20, 0.15)";
                e.currentTarget.style.borderColor = "var(--red-soft)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "var(--line)";
              }}
              >
                <div style={{
                  position: "absolute",
                  left: "-10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "var(--background)",
                }} />
                <div style={{
                  position: "absolute",
                  right: "-10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "var(--background)",
                }} />
                
                <div style={{ marginBottom: "1rem" }}>
                  <span className="eyebrow" style={{ fontSize: "0.75rem", background: "rgba(229,9,20,0.1)", color: "var(--red-soft)", padding: "0.2rem 0.5rem", borderRadius: "4px", display: "inline-block", marginBottom: "0.5rem" }}>
                    {v.discount}
                  </span>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "white", marginBottom: "0.25rem" }}>{v.title}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.4 }}>{v.description}</p>
                </div>

                <div style={{ borderTop: "1px dashed var(--line)", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ display: "block", fontSize: "0.7rem", color: "var(--dim)" }}>Berlaku hingga</span>
                    <strong style={{ fontSize: "0.8rem", color: "white" }}>{v.expiry}</strong>
                  </div>
                  <button
                    onClick={() => handleCopyVoucher(v.code)}
                    className="secondary-button"
                    style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem", height: "auto" }}
                  >
                    {copiedVoucher === v.code ? "Tersalin! ✅" : `Salin: ${v.code}`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "wishlist" && (
          <div>
            {wishlistMovies.length === 0 ? (
              <EmptyState
                icon="heart"
                title="Wishlist kosong"
                description="Tandai film favorit Anda dengan tombol hati di halaman film."
                action={
                  <Link href="/movies" className="primary-button">
                    Jelajahi Film
                  </Link>
                }
              />
            ) : (
              <div className="wishlist-grid">
                {wishlistMovies.map((movie) => (
                  <Link className="customer-movie-card" href={`/movies/${movie.id}`} key={movie.id}>
                    <img alt={`${movie.title} poster`} src={movie.posterUrl} />
                    <strong>{movie.title}</strong>
                    <small>{movie.genre} / {movie.durationMin}m</small>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <div className="customer-panel" style={{ position: "sticky", top: "7rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <div className="profile-avatar">
              <User size={24} />
            </div>
            <div>
              <strong style={{ display: "block", color: "white" }}>Profil Saya</strong>
              <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Member Reguler</span>
            </div>
          </div>
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <small style={{ color: "var(--dim)", display: "block" }}>Nama Lengkap</small>
              <strong style={{ color: "white" }}>{customer.name}</strong>
            </div>
            <div>
              <small style={{ color: "var(--dim)", display: "block" }}>Email</small>
              <strong style={{ color: "white" }}>{customer.email}</strong>
            </div>
            <div className="account-stats" style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
              <span>
                <Bookmark size={16} style={{ color: "#e50914" }} />
                <strong>{wishlistIds.length}</strong>
                <small>Disimpan</small>
              </span>
              <span>
                <History size={16} style={{ color: "#3b82f6" }} />
                <strong>{3 + bookedTickets.length}</strong>
                <small>Riwayat</small>
              </span>
              <span>
                <Gift size={16} style={{ color: "#f59e0b" }} />
                <strong>{mockVouchers.length}</strong>
                <small>Voucher</small>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
