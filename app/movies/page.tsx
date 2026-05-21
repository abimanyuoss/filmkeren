import Link from "next/link";
import { Star } from "lucide-react";
import { Metadata } from "next";
import { BookingSteps } from "@/components/customer/booking-steps";
import { CustomerFooter } from "@/components/customer/customer-footer";
import { CustomerHeader } from "@/components/customer/customer-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { MovieSearchFilter } from "@/components/customer/movie-search-filter";
import { WishlistButton } from "@/components/customer/wishlist-button";
import { getMovies } from "@/lib/db";

export const metadata: Metadata = {
  title: "Katalog Film"
};

export default async function MoviesPage() {
  const movies = await getMovies();

  return (
    <main className="customer-app">
      <CustomerHeader />
      <BookingSteps current={1} />

      <Breadcrumb items={[{ label: "Film", href: "/movies" }]} />

      <section className="customer-page-head">
        <div>
          <span className="eyebrow">Katalog Film</span>
          <h1>Sedang Tayang</h1>
          <p>Temukan film favoritmu dan nikmati pengalaman sinematik terbaik di seluruh jaringan FilmKeren.</p>
        </div>
      </section>

      <MovieSearchFilter movies={movies}>
        {(filtered) => (
          <div className="customer-movie-grid">
            {filtered.map((movie) => (
              <div className="customer-movie-card-wrapper" key={movie.id}>
                <Link className="customer-movie-card large" href={`/movies/${movie.id}`}>
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
                <div className="movie-card-actions">
                  <WishlistButton movieId={movie.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </MovieSearchFilter>

      <CustomerFooter />
    </main>
  );
}
