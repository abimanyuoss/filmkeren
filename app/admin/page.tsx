import { Plus } from "lucide-react";
import {
  MetricCard,
  MoviePosterCard,
  PageHeader,
  PrimaryButton,
  SalesBars
} from "@/components/ui";
import { getDashboardData } from "@/lib/db";

export default async function DashboardPage() {
  const { metrics, movies, schedules, dailySales } = await getDashboardData();

  return (
    <>
      <PageHeader
        action={
          <PrimaryButton>
            <Plus size={18} />
            Add New Movie
          </PrimaryButton>
        }
        eyebrow="Cinema Operations"
        title="Dashboard Admin"
      />

      <section className="metric-grid">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="dashboard-grid single">
        <article className="panel wide">
          <div className="panel-heading">
            <div>
              <h2>Penjualan Hari Ini</h2>
              <p>Berdasarkan booking yang sudah dibayar.</p>
            </div>
            <span className="sales-chip">Data asli</span>
          </div>
          <SalesBars data={dailySales} />
        </article>
      </section>

      <section className="section-stack">
        <div className="section-title-row">
          <h2>Recently Added</h2>
          <span>{schedules.length} jadwal aktif hari ini</span>
        </div>
        <div className="movie-grid">
          {movies.slice(0, 5).map((movie) => (
            <MoviePosterCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </>
  );
}
