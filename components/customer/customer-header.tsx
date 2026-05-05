import Link from "next/link";
import { Clapperboard, Ticket } from "lucide-react";

export function CustomerHeader() {
  return (
    <header className="customer-header">
      <Link className="customer-brand" href="/">
        <span>
          <Clapperboard size={22} />
        </span>
        FilmKeren
      </Link>
      <nav aria-label="Customer navigation">
        <Link href="/movies">Film</Link>
        <Link href="/admin">Admin</Link>
      </nav>
    </header>
  );
}

export function CustomerHeroActions() {
  return (
    <div className="customer-hero-actions">
      <Link className="primary-button" href="/movies">
        <Ticket size={18} />
        Beli Tiket
      </Link>
      <Link className="secondary-button" href="/admin">
        Masuk Admin
      </Link>
    </div>
  );
}
