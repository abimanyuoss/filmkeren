"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, Ticket } from "lucide-react";
import type { Movie } from "@/lib/types";

export function HeroCarousel({ movies }: { movies: Movie[] }) {
  const featured = movies.slice(0, 5);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % featured.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featured.length]);

  function prev() {
    setIndex((i) => (i - 1 + featured.length) % featured.length);
  }

  function next() {
    setIndex((i) => (i + 1) % featured.length);
  }

  const current = featured[index];
  if (!current) return null;

  return (
    <div className="hero-carousel">
      <div className="hero-carousel-slides">
        {featured.map((movie, i) => (
          <div
            key={movie.id}
            className={`hero-carousel-slide ${i === index ? "active" : ""}`}
            style={{
              transform: `translateX(${(i - index) * 100}%)`,
              opacity: i === index ? 1 : 0
            }}
          >
            <div className="hero-carousel-backdrop">
              <img src={movie.posterUrl} alt="" />
              <div className="hero-carousel-gradient" />
            </div>
            <div className="hero-carousel-content">
              <span className="eyebrow">Featured Movie</span>
              <h1>{movie.title}</h1>
              <p>{movie.synopsis}</p>
              <div className="hero-carousel-meta">
                <span>
                  <Star size={14} />
                  IMDb #{movie.imdbRank}
                </span>
                <span>{movie.genre}</span>
                <span>{movie.durationMin} menit</span>
              </div>
              <div className="customer-hero-actions">
                <Link className="primary-button" href={`/movies/${movie.id}`}>
                  <Ticket size={18} />
                  Lihat Jadwal
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hero-carousel-dots">
        {featured.map((_, i) => (
          <button
            key={i}
            className={i === index ? "active" : ""}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      <button className="hero-carousel-arrow left" onClick={prev} aria-label="Previous">
        <ChevronLeft size={24} />
      </button>
      <button className="hero-carousel-arrow right" onClick={next} aria-label="Next">
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
