"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Armchair, MapPin } from "lucide-react";
import type { BookingSeat, Movie, Schedule } from "@/lib/types";

const rows = ["H", "G", "F", "E", "D", "C", "B"];
const seatNumbers = Array.from({ length: 10 }, (_, index) => index + 1);

export function BookingSeatMap({
  schedule,
  movie,
  seats
}: {
  schedule: Schedule;
  movie: Movie;
  seats: BookingSeat[];
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const occupied = useMemo(() => new Set(seats.filter((seat) => seat.status === "occupied").map((seat) => seat.code)), [seats]);
  const total = selected.length * schedule.price;
  const checkoutHref = `/checkout?scheduleId=${encodeURIComponent(schedule.id)}&seats=${encodeURIComponent(selected.join(","))}`;

  function toggleSeat(code: string) {
    if (occupied.has(code)) return;
    setSelected((current) => (current.includes(code) ? current.filter((item) => item !== code) : [...current, code].sort()));
  }

  return (
    <div className="booking-layout">
      <section className="panel seating-panel">
        <header className="panel-heading aligned">
          <div>
            <h2>{schedule.studioName}</h2>
            <p>
              {schedule.cinemaName} / {schedule.showDate} / {schedule.startsAt}
            </p>
          </div>
          <div className="seat-legend">
            <span>
              <i className="seat available" /> Available
            </span>
            <span>
              <i className="seat occupied" /> Occupied
            </span>
            <span>
              <i className="seat selected" /> Selected
            </span>
          </div>
        </header>

        <div className="screen-wrap">
          <div className="screen-curve" />
          <span>Screen</span>
        </div>

        <div className="seat-map">
          {rows.map((row) => (
            <div className="seat-row" key={row}>
              <strong>{row}</strong>
              {seatNumbers.map((number) => {
                const code = `${row}${number}`;
                const isOccupied = occupied.has(code);
                const isSelected = selected.includes(code);
                return (
                  <button
                    aria-label={`Seat ${code}`}
                    className={`seat ${isOccupied ? "occupied" : isSelected ? "selected" : "available"}`}
                    disabled={isOccupied}
                    key={code}
                    onClick={() => toggleSeat(code)}
                    type="button"
                  >
                    {number}
                  </button>
                );
              })}
              <strong>{row}</strong>
            </div>
          ))}
        </div>
      </section>

      <aside className="booking-summary">
        <article className="movie-info-card">
          <img alt={`${movie.title} poster`} src={movie.posterUrl || `/posters/${movie.posterTone}.svg`} />
          <div>
            <span className="status-badge red">{movie.status}</span>
            <h2>{movie.title}</h2>
            <p>
              {movie.genre} / {movie.durationMin}m / {schedule.format}
            </p>
            <p className="inline-meta">
              <MapPin size={14} />
              {schedule.cinemaLocation}
            </p>
          </div>
        </article>

        <article className="panel ticket-panel">
          <div className="panel-heading">
            <h2>Booking Summary</h2>
            <Armchair size={18} />
          </div>

          <div className="ticket-list">
            {selected.map((seat) => (
              <div className="ticket-row" key={seat}>
                <span>
                  <strong>Seat {seat}</strong>
                  <small>Adult Ticket</small>
                </span>
                <b>{formatRupiah(schedule.price)}</b>
              </div>
            ))}
          </div>

          <div className="price-stack">
            <span>
              <small>Subtotal</small>
              <strong>{formatRupiah(total)}</strong>
            </span>
            <span>
              <small>Service Fee</small>
              <strong>{formatRupiah(selected.length ? 5000 : 0)}</strong>
            </span>
            <span className="total">
              <small>Total</small>
              <strong>{formatRupiah(selected.length ? total + 5000 : 0)}</strong>
            </span>
          </div>

          {selected.length > 0 ? (
            <Link className="primary-button full" href={checkoutHref}>
              Lanjut Checkout
              <ArrowRight size={18} />
            </Link>
          ) : (
            <button className="primary-button full" disabled type="button">
              Pilih Kursi
            </button>
          )}
        </article>
      </aside>
    </div>
  );
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);
}
