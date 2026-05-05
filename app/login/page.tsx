import { Clapperboard, LockKeyhole } from "lucide-react";
import { loginAdmin } from "@/app/actions";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="login-page">
      <form action={loginAdmin} className="login-panel">
        <span className="brand-mark">
          <Clapperboard size={28} />
        </span>
        <div>
          <span className="eyebrow">Admin Access</span>
          <h1>Masuk FilmKeren</h1>
          <p>Dashboard hanya tersedia untuk role Admin: Abimanyu Panji.</p>
        </div>

        {params.error ? <p className="form-error">Email atau password admin tidak sesuai.</p> : null}

        <label>
          Email Admin
          <input name="email" placeholder="abimanyu.panji@filmkeren.id" required type="email" />
        </label>
        <label>
          Password
          <input name="password" placeholder="admin123" required type="password" />
        </label>

        <button className="primary-button full" type="submit">
          <LockKeyhole size={18} />
          Masuk Dashboard
        </button>
      </form>
    </main>
  );
}
