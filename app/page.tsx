import Link from "next/link";
import { CalendarDays, MapPin, Star, Ticket } from "lucide-react";
import { CustomerHeader, CustomerHeroActions } from "@/components/customer/customer-header";
import { getCinemas, getMovies, getSchedules } from "@/lib/db";

export default async function HomePage() {
  const [movies, schedules, cinemas] = await Promise.all([getMovies(), getSchedules(), getCinemas()]);
  const heroMovie = movies[0];

  return (
    <main className="customer-app">
      <CustomerHeader />

      <section className="customer-hero">
        <div className="hero-copy">
          <span className="eyebrow">Cinema Booking Experience</span>
          <h1>Nonton film terbaik dengan alur booking yang cepat.</h1>
          <p>
            Pilih film, pilih lokasi, pilih jadwal, pilih kursi, checkout, dan dapatkan e-ticket dalam satu alur.
          </p>
          <CustomerHeroActions />
        </div>
        {heroMovie ? (
          <Link className="hero-poster" href={`/movies/${heroMovie.id}`}>
            <img alt={`${heroMovie.title} poster`} src={heroMovie.posterUrl} />
            <span>
              <Star size={16} />
              IMDb #{heroMovie.imdbRank}
            </span>
          </Link>
        ) : null}
      </section>

      <section className="customer-section">
        <div className="customer-section-title">
          <div>
            <span className="eyebrow">Now Showing</span>
            <h2>Top IMDb di FilmKeren</h2>
          </div>
          <Link href="/movies">Lihat semua</Link>
        </div>
        <div className="customer-movie-row">
          {movies.slice(0, 5).map((movie) => (
            <Link className="customer-movie-card" href={`/movies/${movie.id}`} key={movie.id}>
              <img alt={`${movie.title} poster`} src={movie.posterUrl} />
              <strong>{movie.title}</strong>
              <small>
                {movie.genre} / {movie.durationMin}m
              </small>
            </Link>
          ))}
        </div>
      </section>

      <section className="customer-two-col">
        <article className="customer-panel">
          <div className="panel-heading">
            <h2>Jadwal Hari Ini</h2>
            <CalendarDays size={18} />
          </div>
          <div className="customer-showtime-list">
            {schedules.slice(0, 5).map((schedule) => (
              <Link href={`/booking/${schedule.id}`} key={schedule.id}>
                <span>
                  <strong>{schedule.movieTitle}</strong>
                  <small>
                    {schedule.cinemaName} / {schedule.format}
                  </small>
                </span>
                <b>{schedule.startsAt}</b>
              </Link>
            ))}
          </div>
        </article>

        <article className="customer-panel">
          <div className="panel-heading">
            <h2>Lokasi Bioskop</h2>
            <MapPin size={18} />
          </div>
          <div className="cinema-list">
            {cinemas.map((cinema) => (
              <span key={cinema.id}>
                <strong>{cinema.name}</strong>
                <small>{cinema.address}</small>
              </span>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
