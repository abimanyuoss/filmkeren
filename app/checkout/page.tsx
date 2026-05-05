import Link from "next/link";
import { notFound } from "next/navigation";
import { createBooking } from "@/app/actions";
import { CustomerHeader } from "@/components/customer/customer-header";
import { getScheduleDetail } from "@/lib/db";

export default async function CheckoutPage({
  searchParams
}: {
  searchParams: Promise<{ scheduleId?: string; seats?: string; error?: string }>;
}) {
  const params = await searchParams;
  const scheduleId = params.scheduleId ?? "";
  const seats = (params.seats ?? "").split(",").filter(Boolean);
  const detail = scheduleId ? await getScheduleDetail(scheduleId) : null;

  if (!detail || seats.length === 0) notFound();

  const subtotal = detail.schedule.price * seats.length;
  const serviceFee = 5000;
  const total = subtotal + serviceFee;

  return (
    <main className="customer-app">
      <CustomerHeader />
      <section className="checkout-layout">
        <form action={createBooking} className="customer-panel checkout-form">
          <span className="eyebrow">Checkout</span>
          <h1>Lengkapi Data Pemesan</h1>
          {params.error ? <p className="form-error">Mohon lengkapi nama, email, dan kursi sebelum melanjutkan.</p> : null}
          <input name="scheduleId" type="hidden" value={detail.schedule.id} />
          <input name="seats" type="hidden" value={seats.join(",")} />

          <label>
            Nama Lengkap
            <input name="customerName" placeholder="Nama sesuai identitas" required />
          </label>
          <label>
            Email
            <input name="customerEmail" placeholder="email@domain.com" required type="email" />
          </label>
          <label>
            Nomor HP
            <input name="customerPhone" placeholder="08xxxxxxxxxx" />
          </label>
          <label>
            Metode Pembayaran
            <select name="paymentMethod" defaultValue="QRIS">
              <option>QRIS</option>
              <option>Virtual Account</option>
              <option>Credit Card</option>
              <option>GoPay</option>
            </select>
          </label>

          <button className="primary-button full" type="submit">
            Bayar & Terbitkan E-ticket
          </button>
        </form>

        <aside className="customer-panel checkout-summary">
          <img alt={`${detail.movie.title} poster`} src={detail.movie.posterUrl} />
          <h2>{detail.movie.title}</h2>
          <p>
            {detail.schedule.cinemaName} / {detail.schedule.studioName}
          </p>
          <p>
            {detail.schedule.showDate} / {detail.schedule.startsAt} / {detail.schedule.format}
          </p>
          <div className="ticket-list">
            {seats.map((seat) => (
              <div className="ticket-row" key={seat}>
                <span>
                  <strong>Seat {seat}</strong>
                  <small>Adult Ticket</small>
                </span>
                <b>{formatRupiah(detail.schedule.price)}</b>
              </div>
            ))}
          </div>
          <div className="price-stack">
            <span>
              <small>Subtotal</small>
              <strong>{formatRupiah(subtotal)}</strong>
            </span>
            <span>
              <small>Service Fee</small>
              <strong>{formatRupiah(serviceFee)}</strong>
            </span>
            <span className="total">
              <small>Total</small>
              <strong>{formatRupiah(total)}</strong>
            </span>
          </div>
          <Link className="secondary-button" href={`/booking/${detail.schedule.id}`}>
            Ubah Kursi
          </Link>
        </aside>
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
