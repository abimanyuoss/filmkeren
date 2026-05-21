import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, Film, MapPin, Play, Star, Ticket, UserRound } from "lucide-react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { BookingSteps } from "@/components/customer/booking-steps";
import { CustomerFooter } from "@/components/customer/customer-footer";
import { CustomerHeader } from "@/components/customer/customer-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { WishlistButton } from "@/components/customer/wishlist-button";
import { ReviewSection } from "@/components/customer/review-section";
import { getMovieById, getMovieShowtimes } from "@/lib/db";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieById(id);
  if (!movie) return { title: "Not Found" };
  
  return {
    title: movie.title,
    description: movie.synopsis,
    openGraph: {
      title: `${movie.title} - Jadwal & Tiket | FilmKeren`,
      description: movie.synopsis,
      images: [movie.posterUrl]
    }
  };
}

export default async function MovieDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ cinemaId?: string; date?: string }>;
}) {
  const { id } = await params;
  const filters = await searchParams;
  const [movie, allShowtimes] = await Promise.all([getMovieById(id), getMovieShowtimes(id)]);

  if (!movie) notFound();

  const cookieStore = await cookies();
  const selectedCity = cookieStore.get("selected-city")?.value || "Jakarta";
  
  const activeCityLower = selectedCity.toLowerCase();
  const showtimes = allShowtimes.filter((schedule) => {
    const loc = schedule.cinemaLocation.toLowerCase();
    if (activeCityLower === "jakarta") {
      return loc.includes("jakarta") || loc.includes("scbd");
    }
    return loc.includes(activeCityLower);
  });

  const movieId = movie.id;
  const cinemas = Array.from(new Map(showtimes.map((schedule) => [schedule.cinemaId, schedule])).values());
  const selectedCinemaId = filters.cinemaId || cinemas[0]?.cinemaId || "";
  const dates = Array.from(
    new Set(
      showtimes
        .filter((schedule) => !selectedCinemaId || schedule.cinemaId === selectedCinemaId)
        .map((schedule) => schedule.showDate)
    )
  );
  const selectedDate = filters.date || dates[0] || "";
  const filteredShowtimes = showtimes.filter((schedule) => {
    if (selectedCinemaId && schedule.cinemaId !== selectedCinemaId) return false;
    if (selectedDate && schedule.showDate !== selectedDate) return false;
    return true;
  });
  const firstShowtime = filteredShowtimes[0] ?? showtimes[0];
  const bookingHref = firstShowtime ? `/booking/${firstShowtime.id}` : "#showtimes";

  function movieHref(nextCinemaId: string, nextDate = "") {
    const params = new URLSearchParams();
    if (nextCinemaId) params.set("cinemaId", nextCinemaId);
    if (nextDate) params.set("date", nextDate);
    const query = params.toString();
    return query ? `/movies/${movieId}?${query}` : `/movies/${movieId}`;
  }

  return (
    <main className="customer-app">
      <CustomerHeader />
      <BookingSteps current={2} />
      <Breadcrumb
        items={[
          { label: "Film", href: "/movies" },
          { label: movie.title }
        ]}
      />

      <section className="movie-detail-hero">
        <img alt={`${movie.title} poster`} className="detail-poster" src={movie.posterUrl} />
        <div className="detail-copy">
          <span className="rank-pill">
            <Star size={15} />
            IMDb #{movie.imdbRank}
          </span>
          <h1>{movie.title}</h1>
          <p>{movie.synopsis}</p>
          <div className="detail-meta premium">
            <span>
              <Clock size={15} />
              {movie.durationMin} menit
            </span>
            <span>
              <Film size={15} />
              {movie.genre}
            </span>
            <span>{movie.rating}</span>
          </div>
          <div className="movie-fact-grid">
            <span>
              <small>Sutradara</small>
              <strong>{movie.director}</strong>
            </span>
            <span>
              <small>Pemain</small>
              <strong>{movie.cast.join(", ")}</strong>
            </span>
            <span>
              <small>Rilis</small>
              <strong>{movie.releaseDate}</strong>
            </span>
            <span>
              <small>Status</small>
              <strong>{movie.status}</strong>
            </span>
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
            <WishlistButton movieId={movie.id} />
          </div>
        </div>
      </section>

      <section className="customer-section" id="showtimes">
        <div className="customer-section-title">
          <div>
            <span className="eyebrow">Jadwal Tayang</span>
            <h2>Temukan Bioskop & Waktu Terbaik Untukmu</h2>
          </div>
        </div>

        {showtimes.length ? (
          <>
            <div className="choice-stack">
              <div>
                <span className="choice-label">
                  <UserRound size={15} />
                  1. Pilih bioskop
                </span>
                <div className="choice-chip-row">
                  {cinemas.map((schedule) => (
                    <Link
                      className={selectedCinemaId === schedule.cinemaId ? "selected" : ""}
                      href={movieHref(schedule.cinemaId)}
                      key={schedule.cinemaId}
                    >
                      <strong>{schedule.cinemaName}</strong>
                      <small>{schedule.cinemaLocation}</small>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <span className="choice-label">
                  <CalendarDays size={15} />
                  2. Pilih tanggal
                </span>
                <div className="choice-chip-row compact">
                  {dates.map((date) => (
                    <Link
                      className={selectedDate === date ? "selected" : ""}
                      href={movieHref(selectedCinemaId, date)}
                      key={date}
                    >
                      <strong>{formatDate(date)}</strong>
                      <small>{date}</small>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="showtime-grid">
              {filteredShowtimes.map((schedule) => (
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
              ))}
            </div>
          </>
        ) : (
          <article className="customer-panel">Belum ada jadwal aktif untuk film ini.</article>
        )}
      </section>

      <ReviewSection movieTitle={movie.title} />

      <CustomerFooter />
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short" }).format(new Date(value));
}

function toYoutubeWatchUrl(url: string) {
  if (!url.includes("youtube.com/embed/")) return url;

  const videoId = url.split("youtube.com/embed/")[1]?.split(/[?&/]/)[0];
  return videoId ? `https://www.youtube.com/watch?v=${videoId}` : url;
}
