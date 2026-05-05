import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { BookingSteps } from "@/components/customer/booking-steps";
import { CustomerHeader } from "@/components/customer/customer-header";
import { PrintTicketButton } from "@/components/customer/print-ticket-button";
import { getBookingDetail } from "@/lib/db";

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await getBookingDetail(id);

  if (!booking) notFound();

  return (
    <main className="customer-app">
      <CustomerHeader />
      <BookingSteps current={7} />
      <section className="ticket-page">
        <article className="e-ticket">
          <div className="ticket-success">
            <CheckCircle2 size={28} />
            <span>Pembayaran berhasil</span>
          </div>
          <div className="ticket-main">
            <img alt={`${booking.movie.title} poster`} src={booking.movie.posterUrl} />
            <div>
              <span className="eyebrow">E-ticket</span>
              <h1>{booking.movie.title}</h1>
              <p>{booking.schedule.cinemaName}</p>
              <p>
                {booking.schedule.showDate} / {booking.schedule.startsAt} / {booking.schedule.studioName}
              </p>
              <div className="seat-chip-row">
                {booking.seats.map((seat) => (
                  <span key={seat}>Seat {seat}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="ticket-code">
            <div>
              <img
                alt={`QR Code ${booking.bookingCode}`}
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                  `FilmKeren:${booking.bookingCode}:${booking.id}`
                )}`}
              />
            </div>
            <span>
              <small>Booking Code</small>
              <strong>{booking.bookingCode}</strong>
              <em>Scan QR di gate studio.</em>
            </span>
          </div>
          <div className="ticket-footer">
            <span>
              <small>Nama</small>
              <strong>{booking.customerName}</strong>
            </span>
            <span>
              <small>Payment</small>
              <strong>{booking.paymentMethod}</strong>
            </span>
            <span>
              <small>Total</small>
              <strong>{formatRupiah(booking.totalAmount)}</strong>
            </span>
            <span>
              <small>Studio</small>
              <strong>{booking.schedule.studioName}</strong>
            </span>
            <span>
              <small>Tanggal</small>
              <strong>{booking.schedule.showDate}</strong>
            </span>
            <span>
              <small>Jam</small>
              <strong>{booking.schedule.startsAt}</strong>
            </span>
          </div>
        </article>

        <div className="ticket-actions">
          <Link className="primary-button" href="/movies">
            Booking Lagi
          </Link>
          <PrintTicketButton />
        </div>
      </section>
    </main>
  );
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);
}
