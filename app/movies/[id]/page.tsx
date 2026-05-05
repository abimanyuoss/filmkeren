import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, MapPin, Play, Star, Ticket } from "lucide-react";
import { CustomerHeader } from "@/components/customer/customer-header";
import { getMovieById, getMovieShowtimes } from "@/lib/db";

export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [movie, showtimes] = await Promise.all([getMovieById(id), getMovieShowtimes(id)]);

  if (!movie) notFound();

  const firstShowtime = showtimes[0];
  const bookingHref = firstShowtime ? `/booking/${firstShowtime.id}` : "#showtimes";

  return (
    <main className="customer-app">
      <CustomerHeader />

      <section className="movie-detail-hero">
        <img alt={`${movie.title} poster`} className="detail-poster" src={movie.posterUrl} />
        <div className="detail-copy">
          <span className="rank-pill">
            <Star size={15} />
            IMDb #{movie.imdbRank}
          </span>
          <h1>{movie.title}</h1>
          <p>{movie.synopsis}</p>
          <div className="detail-meta">
            <span>
              <Clock size={15} />
              {movie.durationMin} menit
            </span>
            <span>{movie.genre}</span>
            <span>{movie.rating}</span>
          </div>
          <div className="cast-strip">
            <span>Director: {movie.director}</span>
            <span>Cast: {movie.cast.join(", ")}</span>
          </div>
          <div className="customer-hero-actions">
            <Link className="primary-button" href={bookingHref}>
              <Ticket size={16} />
              Pesan Tiket
            </Link>
            <a className="secondary-button" href={toYoutubeWatchUrl(movie.trailerUrl)}>
              <Play size={16} />
              Trailer
            </a>
          </div>
        </div>
      </section>

      <section className="customer-section" id="showtimes">
        <div className="customer-section-title">
          <div>
            <span className="eyebrow">Showtimes</span>
            <h2>Pilih Jadwal</h2>
          </div>
        </div>

        <div className="showtime-grid">
          {showtimes.length ? (
            showtimes.map((schedule) => (
              <article className="showtime-card" key={schedule.id}>
                <div>
                  <h3>{schedule.cinemaName}</h3>
                  <p>
                    <MapPin size={14} />
                    {schedule.cinemaLocation}
                  </p>
                </div>
                <div className="showtime-meta">
                  <span>
                    <CalendarDays size={14} />
                    {schedule.showDate}
                  </span>
                  <span>{schedule.format}</span>
                  <strong>{formatRupiah(schedule.price)}</strong>
                </div>
                <Link className="primary-button" href={`/booking/${schedule.id}`}>
                  <Ticket size={16} />
                  Pilih Kursi {schedule.startsAt}
                </Link>
              </article>
            ))
          ) : (
            <article className="customer-panel">Belum ada jadwal aktif untuk film ini.</article>
          )}
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

function toYoutubeWatchUrl(url: string) {
  if (!url.includes("youtube.com/embed/")) return url;

  const videoId = url.split("youtube.com/embed/")[1]?.split(/[?&/]/)[0];
  return videoId ? `https://www.youtube.com/watch?v=${videoId}` : url;
}
