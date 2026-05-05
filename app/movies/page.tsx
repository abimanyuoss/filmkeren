import Link from "next/link";
import { Search, Star } from "lucide-react";
import { BookingSteps } from "@/components/customer/booking-steps";
import { CustomerHeader } from "@/components/customer/customer-header";
import { getMovies } from "@/lib/db";

export default async function MoviesPage() {
  const movies = await getMovies();

  return (
    <main className="customer-app">
      <CustomerHeader />
      <BookingSteps current={1} />

      <section className="customer-page-head">
        <div>
          <span className="eyebrow">Katalog Film</span>
          <h1>Sedang Tayang</h1>
          <p>Temukan film favoritmu dan nikmati pengalaman sinematik terbaik di seluruh jaringan FilmKeren.</p>
        </div>
        <div className="customer-search">
          <Search size={16} />
          <input aria-label="Cari film" placeholder="Cari film..." />
        </div>
      </section>

      <section className="customer-movie-grid">
        {movies.map((movie) => (
          <Link className="customer-movie-card large" href={`/movies/${movie.id}`} key={movie.id}>
            <img alt={`${movie.title} poster`} src={movie.posterUrl} />
            <span>
              <Star size={14} />
              IMDb #{movie.imdbRank}
            </span>
            <strong>{movie.title}</strong>
            <small>
              {movie.genre} / {movie.durationMin}m / {movie.rating}
            </small>
          </Link>
        ))}
      </section>
    </main>
  );
}
