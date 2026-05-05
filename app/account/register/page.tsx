import Link from "next/link";
import { Clapperboard, UserPlus } from "lucide-react";
import { registerCustomer } from "@/app/actions";
import { safeRedirectPath } from "@/lib/auth";

export default async function CustomerRegisterPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; redirectTo?: string }>;
}) {
  const params = await searchParams;
  const redirectTo = safeRedirectPath(params.redirectTo);
  const errorMessage =
    params.error === "exists"
      ? "Email sudah terdaftar. Silakan login."
      : params.error
        ? "Isi nama, email, dan password minimal 6 karakter."
        : "";

  return (
    <main className="login-page customer-login-page">
      <form action={registerCustomer} className="login-panel">
        <span className="brand-mark">
          <Clapperboard size={28} />
        </span>
        <div>
          <span className="eyebrow">Member Baru</span>
          <h1>Daftar Akun FilmKeren</h1>
          <p>Gabung sekarang untuk menikmati kemudahan booking tiket dan akses e-ticket eksklusif.</p>
        </div>

        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

        <input name="redirectTo" type="hidden" value={redirectTo} />
        <label>
          Nama Lengkap
          <input name="name" required />
        </label>
        <label>
          Email
          <input name="email" required type="email" />
        </label>
        <label>
          Nomor HP
          <input name="phone" />
        </label>
        <label>
          Password
          <input minLength={6} name="password" required type="password" />
        </label>

        <button className="primary-button full" type="submit">
          <UserPlus size={18} />
          Daftar
        </button>

        <p className="auth-switch">
          Sudah punya akun? <Link href={`/account/login?redirectTo=${encodeURIComponent(redirectTo)}`}>Masuk</Link>
        </p>
      </form>
    </main>
  );
}
