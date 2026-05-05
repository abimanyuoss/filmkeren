import Link from "next/link";
import { Clapperboard, LogIn } from "lucide-react";
import { loginCustomer } from "@/app/actions";
import { safeRedirectPath } from "@/lib/auth";

export default async function CustomerLoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; redirectTo?: string }>;
}) {
  const params = await searchParams;
  const redirectTo = safeRedirectPath(params.redirectTo);

  return (
    <main className="login-page customer-login-page">
      <form action={loginCustomer} className="login-panel">
        <span className="brand-mark">
          <Clapperboard size={28} />
        </span>
        <div>
          <span className="eyebrow">FilmKeren Member</span>
          <h1>Selamat Datang Kembali</h1>
          <p>Silakan masuk untuk melanjutkan pemesanan tiket bioskop Anda dengan mudah dan cepat.</p>
        </div>

        {params.error ? <p className="form-error">Email atau password tidak sesuai.</p> : null}

        <input name="redirectTo" type="hidden" value={redirectTo} />
        <label>
          Email
          <input name="email" required type="email" />
        </label>
        <label>
          Password
          <input name="password" required type="password" />
        </label>

        <button className="primary-button full" type="submit">
          <LogIn size={18} />
          Masuk
        </button>

        <p className="auth-switch">
          Belum punya akun? <Link href={`/account/register?redirectTo=${encodeURIComponent(redirectTo)}`}>Daftar dahulu</Link>
        </p>
      </form>
    </main>
  );
}
