import { notFound } from "next/navigation";
import { BookingSteps } from "@/components/customer/booking-steps";
import { CustomerHeader } from "@/components/customer/customer-header";
import { BookingSeatMap } from "@/components/booking-seat-map";
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
  const detail = await getScheduleDetail(scheduleId);

  if (!detail) notFound();

  return (
    <main className="customer-app">
      <CustomerHeader />
      <BookingSteps current={5} />
      <section className="customer-page-head compact">
        <div>
          <span className="eyebrow">Seat Selection</span>
          <h1>Pilih Kursi</h1>
          <p>Kursi yang dipilih akan dikunci sementara selama 5 menit sebelum checkout.</p>
          {query.error ? <p className="form-error">Kursi pilihan tidak tersedia. Silakan pilih kursi lain.</p> : null}
        </div>
      </section>
      <BookingSeatMap movie={detail.movie} schedule={detail.schedule} seats={detail.seats} />
    </main>
  );
}
