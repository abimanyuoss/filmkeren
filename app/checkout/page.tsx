import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createBooking } from "@/app/actions";
import { BookingSteps } from "@/components/customer/booking-steps";
import { CustomerHeader } from "@/components/customer/customer-header";
import { getCustomerSession } from "@/lib/auth";
import { getScheduleDetail } from "@/lib/db";

export default async function CheckoutPage({
  searchParams
}: {
  searchParams: Promise<{ scheduleId?: string; seats?: string; lockToken?: string; error?: string }>;
}) {
  const params = await searchParams;
  const scheduleId = params.scheduleId ?? "";
  const seats = (params.seats ?? "").split(",").filter(Boolean);
  const lockToken = params.lockToken ?? "";
  const customer = await getCustomerSession();
  const currentPath = `/checkout?scheduleId=${encodeURIComponent(scheduleId)}&seats=${encodeURIComponent(seats.join(","))}&lockToken=${encodeURIComponent(lockToken)}`;

  if (!customer) {
    redirect(`/account/login?redirectTo=${encodeURIComponent(currentPath)}`);
  }

  const detail = scheduleId ? await getScheduleDetail(scheduleId) : null;

  if (!detail || seats.length === 0) notFound();

  const subtotal = detail.schedule.price * seats.length;
  const serviceFee = 5000;
  const total = subtotal + serviceFee;

  return (
    <main className="customer-app">
      <CustomerHeader />
      <BookingSteps current={6} />
      <section className="checkout-layout">
        <form action={createBooking} className="customer-panel checkout-form">
          <span className="eyebrow">Checkout</span>
          <h1>Lengkapi Data Pemesan</h1>
          {params.error ? <p className="form-error">Mohon lengkapi nama, email, dan kursi sebelum melanjutkan.</p> : null}
          <div className="demo-payment-banner">
            <strong>Pembayaran Aman & Terverifikasi</strong>
            <span>Transaksi Anda dilindungi oleh enkripsi standar industri. E-ticket akan langsung dikirim setelah pembayaran.</span>
          </div>
          <input name="scheduleId" type="hidden" value={detail.schedule.id} />
          <input name="seats" type="hidden" value={seats.join(",")} />
          <input name="lockToken" type="hidden" value={lockToken} />

          <div className="account-summary-box">
            <small>Akun Pemesan</small>
            <strong>{customer.name}</strong>
            <span>{customer.email}</span>
          </div>
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
            Selesaikan Pembayaran & Dapatkan Tiket
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
          <span className="simulation-pill">Transaksi Aman</span>
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
