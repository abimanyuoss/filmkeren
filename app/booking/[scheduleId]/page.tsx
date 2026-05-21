import { notFound, redirect } from "next/navigation";
import { BookingSteps } from "@/components/customer/booking-steps";
import { CustomerHeader } from "@/components/customer/customer-header";
import { BookingSeatMap } from "@/components/booking-seat-map";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { CountdownTimer } from "@/components/customer/countdown-timer";
import { getCustomerSession } from "@/lib/auth";
import { getScheduleDetail } from "@/lib/db";

export default async function BookingSchedulePage({
  params,
  searchParams
}: {
  params: Promise<{ scheduleId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { scheduleId } = await params;
  const query = await searchParams;
  const customer = await getCustomerSession();

  if (!customer) {
    redirect(`/account/login?redirectTo=${encodeURIComponent(`/booking/${scheduleId}`)}`);
  }

  const detail = await getScheduleDetail(scheduleId);

  if (!detail) notFound();

  return (
    <main className="customer-app">
      <CustomerHeader />
      <BookingSteps current={5} />
      <Breadcrumb
        items={[
          { label: "Film", href: "/movies" },
          { label: detail.movie.title, href: `/movies/${detail.movie.id}` },
          { label: "Pilih Kursi" }
        ]}
      />

      <section className="customer-page-head compact">
        <div>
          <span className="eyebrow">Pilih Posisi Favorit</span>
          <h1>Tentukan Tempat Duduk Anda</h1>
          <p>Dapatkan pengalaman nonton terbaik dengan memilih kursi Anda.</p>
          {query.error ? <p className="form-error">Kursi pilihan tidak tersedia. Silakan pilih kursi lain.</p> : null}
        </div>
        <CountdownTimer seconds={300} />
      </section>
      <BookingSeatMap movie={detail.movie} schedule={detail.schedule} seats={detail.seats} />
    </main>
  );
}
