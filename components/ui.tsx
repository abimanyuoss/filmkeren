import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Banknote,
  CalendarPlus,
  Clapperboard,
  Edit3,
  MoreVertical,
  Play,
  Plus,
  ReceiptText,
  TicketCheck,
  Trash2
} from "lucide-react";
import type { ReactNode } from "react";
import type {
  AdminUser,
  AttentionItem,
  DailySalesData,
  Metric,
  Movie,
  Schedule,
  StudioUtilizationItem
} from "@/lib/types";

export function PageHeader({
  eyebrow,
  title,
  action
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
      </div>
      {action}
    </header>
  );
}

export function PrimaryButton({
  children,
  type = "button"
}: {
  children: ReactNode;
  type?: "button" | "submit";
}) {
  return (
    <button className="primary-button" type={type}>
      {children}
    </button>
  );
}

export function SecondaryButton({ children }: { children: ReactNode }) {
  return (
    <button className="secondary-button" type="button">
      {children}
    </button>
  );
}

export function MetricCard({ metric }: { metric: Metric }) {
  const TrendIcon = metric.tone === "down" ? ArrowDown : ArrowUp;
  return (
    <article className="metric-card">
      <span className="metric-label">{metric.label}</span>
      <strong>{metric.value}</strong>
      <span className={`trend ${metric.tone}`}>
        <TrendIcon size={14} />
        {metric.trend}
      </span>
    </article>
  );
}

export function MoviePosterCard({ movie, compact = false }: { movie: Movie; compact?: boolean }) {
  const trailerUrl = toYoutubeWatchUrl(movie.trailerUrl);

  return (
    <article className={compact ? "movie-card compact" : "movie-card"}>
      <img alt={`${movie.title} poster`} src={movie.posterUrl || `/posters/${movie.posterTone}.svg`} />
      <span className={movie.status === "Now Showing" ? "status-badge red" : "status-badge"}>{movie.status}</span>
      <div className="movie-overlay">
        <h3>{movie.title}</h3>
        <p>
          {movie.genre} / {movie.durationMin} min
        </p>
        <div className="poster-actions">
          {trailerUrl ? (
            <a href={trailerUrl} title="Trailer">
              <Play size={15} />
            </a>
          ) : null}
          <button title="Edit" type="button">
            <Edit3 size={15} />
          </button>
          <button title="Delete" type="button">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}

function toYoutubeWatchUrl(url: string) {
  if (!url.includes("youtube.com/embed/")) return url;

  const videoId = url.split("youtube.com/embed/")[1]?.split(/[?&/]/)[0];
  return videoId ? `https://www.youtube.com/watch?v=${videoId}` : url;
}

export function AttentionList({ items }: { items: AttentionItem[] }) {
  return (
    <div className="stack-list">
      {items.map((item) => (
        <article className="attention-item" key={item.title}>
          <span className={`attention-icon ${item.severity}`}>
            <AlertTriangle size={18} />
          </span>
          <span>
            <strong>{item.title}</strong>
            <small>{item.detail}</small>
          </span>
          <time>{item.time}</time>
        </article>
      ))}
    </div>
  );
}

function formatBarCurrency(value: number) {
  if (value >= 1000000000) return `Rp${(value / 1000000000).toFixed(1)}M`;
  if (value >= 1000000) return `Rp${Math.round(value / 1000000)}Jt`;
  if (value >= 1000) return `Rp${Math.round(value / 1000)}K`;
  return `Rp${value}`;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);
}

const emptyDailySales: DailySalesData = {
  totalRevenue: 0,
  ticketsSold: 0,
  bookings: 0,
  avgOrder: 0,
  hourly: ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"].map((label) => ({
    label,
    revenue: 0,
    tickets: 0,
    bookings: 0
  })),
  recent: []
};

export function SalesBars({ data = emptyDailySales }: { data?: DailySalesData }) {
  const points = data.hourly.length ? data.hourly : emptyDailySales.hourly;
  const hasSales = data.totalRevenue > 0 || data.ticketsSold > 0 || data.bookings > 0;
  const max = Math.max(...points.map((point) => point.revenue), 1);
  const activeIndex = points.reduce((lastIndex, point, index) => (point.revenue > 0 ? index : lastIndex), -1);

  return (
    <div className="sales-panel">
      <div className="sales-kpis" aria-label="Ringkasan penjualan hari ini">
        <span>
          <TicketCheck size={18} />
          <small>Tiket Terjual</small>
          <strong>{data.ticketsSold.toLocaleString("id-ID")}</strong>
        </span>
        <span>
          <Banknote size={18} />
          <small>Pendapatan</small>
          <strong>{formatCurrency(data.totalRevenue)}</strong>
        </span>
        <span>
          <ReceiptText size={18} />
          <small>Booking Selesai</small>
          <strong>{data.bookings.toLocaleString("id-ID")}</strong>
        </span>
        <span>
          <Banknote size={18} />
          <small>Avg Order</small>
          <strong>{formatCurrency(data.avgOrder)}</strong>
        </span>
      </div>

      {hasSales ? (
        <div className="sales-content-grid">
          <div className="sales-chart-wrap">
            <div className="bar-chart hourly-sales-chart" aria-label="Grafik penjualan per jam">
              {points.map((point, index) => (
                <span
                  className={[index === activeIndex ? "active" : "", point.revenue > 0 ? "filled" : ""]
                    .filter(Boolean)
                    .join(" ")}
                  key={point.label}
                  style={{ height: `${point.revenue > 0 ? Math.max(8, (point.revenue / max) * 100) : 2}%` }}
                >
                  <small>
                    {formatBarCurrency(point.revenue)} / {point.tickets} tiket
                  </small>
                  <em>{point.label}</em>
                </span>
              ))}
            </div>
          </div>

          <div className="recent-sales">
            <div className="recent-sales-heading">
              <h3>Transaksi Terbaru</h3>
              <small>Hari ini</small>
            </div>
            {data.recent.length ? (
              <div className="recent-sales-list">
                {data.recent.map((transaction) => (
                  <article key={transaction.id}>
                    <span>
                      <strong>{transaction.movieTitle}</strong>
                      <small>
                        {transaction.code} / {transaction.seats} tiket / {transaction.createdAt}
                      </small>
                    </span>
                    <b>{formatBarCurrency(transaction.totalAmount)}</b>
                  </article>
                ))}
              </div>
            ) : (
              <p className="recent-sales-empty">Transaksi akan muncul setelah checkout berhasil.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="empty-state sales-empty">
          <strong>Belum ada transaksi hari ini.</strong>
          <p>Ringkasan penjualan akan terisi otomatis setelah pelanggan berhasil memesan tiket.</p>
        </div>
      )}
    </div>
  );
}

export function RevenueBars({ rows }: { rows: Array<{ label: string; value: number; shortLabel: string }> }) {
  const max = Math.max(...rows.map((row) => row.value), 1);

  return (
    <div className="revenue-bars">
      {rows.map((row, index) => (
        <div className="revenue-bar" key={row.label}>
          <span className={index === 0 ? "bar active" : "bar"} style={{ height: `${(row.value / max) * 100}%` }} />
          <small title={row.label}>{row.shortLabel}</small>
        </div>
      ))}
    </div>
  );
}

export function ScheduleRow({ schedule, active = false }: { schedule: Schedule; active?: boolean }) {
  return (
    <article className={active ? "schedule-row active" : "schedule-row"}>
      <span className="drag-handle">::</span>
      <div className="time-block">
        <strong>{schedule.startsAt}</strong>
        <small>{schedule.endsAt} end</small>
      </div>
      <img
        alt={`${schedule.movieTitle} poster`}
        className="mini-poster"
        src={schedule.posterUrl || `/posters/${schedule.posterTone}.svg`}
      />
      <div className="schedule-title">
        <h3>{schedule.movieTitle}</h3>
        <p>
          {schedule.format} / {schedule.genre} / {schedule.durationMin}m
        </p>
      </div>
      <div className="occupancy">
        <strong>{schedule.occupancy}%</strong>
        <span>
          <i style={{ width: `${schedule.occupancy}%` }} />
        </span>
      </div>
      <button className="icon-button small" title="More" type="button">
        <MoreVertical size={16} />
      </button>
    </article>
  );
}

export function UserRow({
  user,
  action
}: {
  user: AdminUser;
  action: (formData: FormData) => Promise<void>;
}) {
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <tr>
      <td>
        <span className="user-cell">
          <span className="avatar mini">{initials}</span>
          <span>
            <strong>{user.name}</strong>
            <small>{user.email}</small>
          </span>
        </span>
      </td>
      <td>
        <span className={user.role === "Admin" ? "role-badge red" : "role-badge"}>{user.role}</span>
      </td>
      <td>
        <span className={user.status === "Active" ? "status-dot active" : "status-dot"}>{user.status}</span>
      </td>
      <td>{user.lastActive}</td>
      <td className="center">
        <form action={action}>
          <input name="userId" type="hidden" value={user.id} />
          <input name="nextAccess" type="hidden" value={String(!user.systemAccess)} />
          <button className={user.systemAccess ? "toggle on" : "toggle"} title="Toggle access" type="submit">
            <span />
          </button>
        </form>
      </td>
      <td className="right">
        <button className="icon-button small" title="Edit" type="button">
          <Edit3 size={15} />
        </button>
      </td>
    </tr>
  );
}

export function EmptyMovieDraft() {
  return (
    <article className="draft-card">
      <Plus size={30} />
      <span>Draft New</span>
    </article>
  );
}

export function StudioUtilization({ items }: { items: StudioUtilizationItem[] }) {
  return (
    <div className="utilization-list">
      {items.map((item) => (
        <div key={item.label}>
          <span>
            <strong>{item.label}</strong>
            <small>
              {item.value}% / {item.bookedSeats} dari {item.totalSeats} kursi
            </small>
          </span>
          <i>
            <b style={{ width: `${item.value}%` }} />
          </i>
        </div>
      ))}
    </div>
  );
}

export function QuickAssign() {
  return (
    <div className="panel">
      <div className="panel-heading">
        <h2>Unassigned Features</h2>
        <CalendarPlus size={18} />
      </div>
      <div className="assign-list">
        <span>
          <strong>Civil War</strong>
          <small>109m / Needs Studio 1</small>
        </span>
        <span>
          <strong>Godzilla x Kong</strong>
          <small>115m / IMAX Preferred</small>
        </span>
      </div>
    </div>
  );
}

export function BrandStamp() {
  return (
    <span className="brand-stamp">
      <Clapperboard size={18} />
      Live Cinema Ops
    </span>
  );
}
