"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Movie } from "@/lib/types";

const allGenres = ["All", "Action", "Crime", "Drama", "Adventure", "Biography", "Western"];

export function MovieSearchFilter({ movies, children }: { movies: Movie[]; children: (filtered: Movie[]) => React.ReactNode }) {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return movies.filter((movie) => {
      const matchQuery =
        !query ||
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.director.toLowerCase().includes(query.toLowerCase());
      const matchGenre = genre === "All" || movie.genre === genre;
      return matchQuery && matchGenre;
    });
  }, [movies, query, genre]);

  const genres = useMemo(() => {
    const set = new Set(movies.map((m) => m.genre));
    return ["All", ...Array.from(set)];
  }, [movies]);

  return (
    <>
      <div className="movie-search-filter-bar">
        <div className="customer-search expanded">
          <Search size={16} />
          <input
            aria-label="Cari film"
            placeholder="Cari judul, sutradara..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query ? (
            <button className="icon-button small" onClick={() => setQuery("")} aria-label="Clear">
              <X size={14} />
            </button>
          ) : null}
        </div>
        <button
          className={`secondary-button ${showFilters ? "active" : ""}`}
          onClick={() => setShowFilters((s) => !s)}
        >
          <SlidersHorizontal size={16} />
          Filter
        </button>
      </div>

      {showFilters ? (
        <div className="genre-chip-bar">
          {genres.map((g) => (
            <button
              key={g}
              className={`genre-chip ${g === genre ? "active" : ""} genre-${g.toLowerCase()}`}
              onClick={() => setGenre(g)}
            >
              {g}
            </button>
          ))}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <div className="empty-state-illustrated compact">
          <div className="empty-state-icon">
            <Search size={36} />
          </div>
          <strong>Tidak ditemukan</strong>
          <p>Coba ubah kata kunci atau filter lain.</p>
        </div>
      ) : (
        children(filtered)
      )}

      {query || genre !== "All" ? (
        <p className="filter-result-count">
          Menampilkan {filtered.length} film
        </p>
      ) : null}
    </>
  );
}
