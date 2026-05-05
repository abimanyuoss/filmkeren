import { Plus } from "lucide-react";
import { createMovie, deleteMovie, updateMovie } from "@/app/actions";
import { EmptyMovieDraft, MoviePosterCard, PageHeader, PrimaryButton } from "@/components/ui";
import { getMovies } from "@/lib/db";

export default async function MoviesPage() {
  const movies = await getMovies();

  return (
    <>
      <PageHeader
        action={
          <PrimaryButton>
            <Plus size={18} />
            Add New Movie
          </PrimaryButton>
        }
        eyebrow="Catalog"
        title="Movie Management"
      />

      <section className="movies-layout">
        <div className="movie-grid management">
          {movies.map((movie) => (
            <div className="admin-movie-card" key={movie.id}>
              <MoviePosterCard movie={movie} />
              <details className="inline-edit-panel">
                <summary>Edit Data</summary>
                <form action={updateMovie} className="inline-edit-form">
                  <input name="movieId" type="hidden" value={movie.id} />
                  <label>
                    Title
                    <input name="title" defaultValue={movie.title} required />
                  </label>
                  <div className="form-grid">
                    <label>
                      Genre
                      <input name="genre" defaultValue={movie.genre} required />
                    </label>
                    <label>
                      Duration
                      <input min="1" name="durationMin" defaultValue={movie.durationMin} required type="number" />
                    </label>
                    <label>
                      Rating
                      <input name="rating" defaultValue={movie.rating} required />
                    </label>
                    <label>
                      Status
                      <select name="status" defaultValue={movie.status}>
                        <option>Now Showing</option>
                        <option>Coming Soon</option>
                        <option>Sold Out</option>
                      </select>
                    </label>
                    <label>
                      Release Date
                      <input name="releaseDate" defaultValue={movie.releaseDate} type="date" />
                    </label>
                    <label>
                      IMDb Rank
                      <input min="1" name="imdbRank" defaultValue={movie.imdbRank || ""} type="number" />
                    </label>
                  </div>
                  <label>
                    Poster URL
                    <input name="posterUrl" defaultValue={movie.posterUrl} type="url" />
                  </label>
                  <label>
                    Trailer URL
                    <input name="trailerUrl" defaultValue={movie.trailerUrl} type="url" />
                  </label>
                  <label>
                    Director
                    <input name="director" defaultValue={movie.director} />
                  </label>
                  <label>
                    Cast
                    <input name="cast" defaultValue={movie.cast.join(", ")} />
                  </label>
                  <label>
                    Poster Tone
                    <select name="posterTone" defaultValue={movie.posterTone}>
                      <option value="void">Void</option>
                      <option value="noir">Noir</option>
                      <option value="velocity">Velocity</option>
                      <option value="dune">Dune</option>
                      <option value="silver">Silver</option>
                    </select>
                  </label>
                  <label>
                    Synopsis
                    <textarea name="synopsis" defaultValue={movie.synopsis} rows={3} />
                  </label>
                  <button className="secondary-button" type="submit">
                    Update Movie
                  </button>
                </form>
              </details>
              <form action={deleteMovie}>
                <input name="movieId" type="hidden" value={movie.id} />
                <button className="danger-button" type="submit">
                  Delete
                </button>
              </form>
            </div>
          ))}
          <EmptyMovieDraft />
        </div>

        <form action={createMovie} className="panel movie-form">
          <div className="panel-heading">
            <h2>Add/Edit Movie</h2>
          </div>

          <label>
            Movie Title
            <input name="title" placeholder="Enter full movie title" required />
          </label>

          <div className="form-grid">
            <label>
              Genre
              <select name="genre" defaultValue="" required>
                <option disabled value="">
                  Pilih genre
                </option>
                <option>Sci-Fi</option>
                <option>Action</option>
                <option>Drama</option>
                <option>Thriller</option>
                <option>Crime</option>
                <option>Adventure</option>
                <option>Biography</option>
                <option>Western</option>
              </select>
            </label>
            <label>
              Duration
              <input min="1" name="durationMin" placeholder="Durasi menit" required type="number" />
            </label>
            <label>
              Release Date
              <input name="releaseDate" type="date" />
            </label>
            <label>
              Rating
              <select name="rating" defaultValue="" required>
                <option disabled value="">
                  Pilih rating
                </option>
                <option>U</option>
                <option>G</option>
                <option>PG</option>
                <option>PG-13</option>
                <option>R</option>
              </select>
            </label>
            <label>
              Status
              <select name="status" defaultValue="" required>
                <option disabled value="">
                  Pilih status
                </option>
                <option>Now Showing</option>
                <option>Coming Soon</option>
                <option>Sold Out</option>
              </select>
            </label>
            <label>
              Poster Tone
              <select name="posterTone" defaultValue="">
                <option disabled value="">
                  Pilih fallback
                </option>
                <option value="void">Void</option>
                <option value="noir">Noir</option>
                <option value="velocity">Velocity</option>
                <option value="dune">Dune</option>
                <option value="silver">Silver</option>
              </select>
            </label>
          </div>

          <label>
            Poster URL
            <input name="posterUrl" placeholder="https://..." type="url" />
          </label>

          <div className="form-grid">
            <label>
              Director
              <input name="director" placeholder="Director name" />
            </label>
            <label>
              IMDb Rank
              <input min="1" name="imdbRank" placeholder="1" type="number" />
            </label>
          </div>

          <label>
            Cast
            <input name="cast" placeholder="Actor 1, Actor 2, Actor 3" />
          </label>

          <label>
            Trailer URL
            <input name="trailerUrl" placeholder="https://www.youtube.com/watch?v=..." type="url" />
          </label>

          <label>
            Synopsis
            <textarea name="synopsis" placeholder="Enter movie description..." rows={4} />
          </label>

          <PrimaryButton type="submit">Save Movie</PrimaryButton>
        </form>
      </section>
    </>
  );
}
