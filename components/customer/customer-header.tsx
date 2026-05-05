import Link from "next/link";
import { Clapperboard, Ticket } from "lucide-react";
import { logoutCustomer } from "@/app/actions";
import { getCustomerSession } from "@/lib/auth";

export async function CustomerHeader() {
  const customer = await getCustomerSession();

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
        {customer ? (
          <>
            <span>{customer.name}</span>
            <form action={logoutCustomer}>
              <button className="customer-nav-button" type="submit">
                Keluar
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/account/login">Masuk</Link>
            <Link href="/account/register">Daftar</Link>
          </>
        )}
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
      <Link className="secondary-button" href="/account/login">
        Masuk Akun
      </Link>
    </div>
  );
}
