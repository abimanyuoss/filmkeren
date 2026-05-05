import type { CSSProperties } from "react";
import { FileDown } from "lucide-react";
import { MetricCard, PageHeader, PrimaryButton } from "@/components/ui";
import { getAnalytics } from "@/lib/db";

export default async function AnalyticsPage({
  searchParams
}: {
  searchParams: Promise<{ period?: "today" | "7d" | "30d" | "month" }>;
}) {
  const params = await searchParams;
  const period = params.period ?? "today";
  const analytics = await getAnalytics(period);
  const displayedMovies = analytics.topMovies.filter((movie) => movie.ticketsSold > 0 || movie.revenue > 0);
  const hasMovieSales = displayedMovies.length > 0;
  const hasStudioShare = analytics.studioShare.some((item) => item.value > 0);
  const topStudio = analytics.studioShare[0];

  return (
    <>
      <PageHeader
        action={
          <PrimaryButton>
            <FileDown size={18} />
            Export PDF
          </PrimaryButton>
        }
        eyebrow="Reports"
        title="Sales Reports & Analytics"
      />

      <nav className="period-filter" aria-label="Filter periode analytics">
        {[
          ["today", "Hari Ini"],
          ["7d", "7 Hari"],
          ["30d", "30 Hari"],
          ["month", "Bulan Ini"]
        ].map(([value, label]) => (
          <a className={period === value ? "selected" : ""} href={`/admin/analytics?period=${value}`} key={value}>
            {label}
          </a>
        ))}
      </nav>

      <section className="metric-grid">
        {analytics.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="analytics-grid">
        <article className="panel wide performance-panel">
          <div className="panel-heading">
            <h2>Top Performing Movies</h2>
            <span className="table-note">Berdasarkan booking asli</span>
          </div>
          {hasMovieSales ? (
            <div className="table-scroll">
              <table className="admin-table performance-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Film</th>
                    <th className="right">Tiket</th>
                    <th className="right">Pendapatan</th>
                    <th className="right">Occupancy</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedMovies.map((movie, index) => (
                    <tr key={movie.id}>
                      <td>
                        <span className="rank-cell">#{index + 1}</span>
                      </td>
                      <td>
                        <strong>{movie.title}</strong>
                      </td>
                      <td className="right">{movie.ticketsSold.toLocaleString("id-ID")}</td>
                      <td className="right">{formatRupiah(movie.revenue)}</td>
                      <td className="right">{movie.occupancy.toLocaleString("id-ID")}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <strong>Belum ada penjualan.</strong>
              <p>Ranking film akan muncul setelah pelanggan berhasil memesan tiket.</p>
            </div>
          )}
        </article>

        <article className="panel">
          <div className="panel-heading">
            <h2>Studio Share</h2>
          </div>
          {hasStudioShare ? (
            <>
              <div className="donut" style={{ "--slice": `${topStudio?.value ?? 0}%` } as CSSProperties}>
                <span>{topStudio?.label ?? "Studio"}</span>
                <strong>{topStudio?.value ?? 0}%</strong>
              </div>
              <div className="share-list">
                {analytics.studioShare.map((item) => (
                  <span key={item.label}>
                    <small>{item.label}</small>
                    <strong>{item.value}%</strong>
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state compact">
              <strong>Belum ada studio terpakai.</strong>
              <p>Distribusi studio akan dihitung setelah tiket terjual.</p>
            </div>
          )}
        </article>
      </section>
    </>
  );
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);
}
