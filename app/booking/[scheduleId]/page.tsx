import { notFound } from "next/navigation";
import { CustomerHeader } from "@/components/customer/customer-header";
import { BookingSeatMap } from "@/components/booking-seat-map";
import { getScheduleDetail } from "@/lib/db";

export default async function BookingSchedulePage({ params }: { params: Promise<{ scheduleId: string }> }) {
  const { scheduleId } = await params;
  const detail = await getScheduleDetail(scheduleId);

  if (!detail) notFound();

  return (
    <main className="customer-app">
      <CustomerHeader />
      <section className="customer-page-head compact">
        <div>
          <span className="eyebrow">Seat Selection</span>
          <h1>Pilih Kursi</h1>
          <p>Kursi akan dikunci setelah checkout dan pembayaran selesai.</p>
        </div>
      </section>
      <BookingSeatMap movie={detail.movie} schedule={detail.schedule} seats={detail.seats} />
    </main>
  );
}
