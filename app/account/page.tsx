import { redirect } from "next/navigation";
import { CustomerHeader } from "@/components/customer/customer-header";
import { CustomerFooter } from "@/components/customer/customer-footer";
import { AccountDashboard } from "@/components/customer/account-dashboard";
import { getCustomerSession } from "@/lib/auth";
import { getMovies } from "@/lib/db";

export const metadata = {
  title: "Dasbor Akun"
};

export default async function AccountPage() {
  const customer = await getCustomerSession();

  if (!customer) {
    redirect("/account/login");
  }

  const movies = await getMovies();

  return (
    <main className="customer-app">
      <CustomerHeader />
      <section className="customer-page-head">
        <div>
          <span className="eyebrow">Dasbor Pelanggan</span>
          <h1>Halo, {customer.name}</h1>
          <p>Kelola tiket aktif, riwayat transaksi, dan film tersimpan Anda di sini.</p>
        </div>
      </section>

      <AccountDashboard customer={customer} movies={movies} />

      <CustomerFooter />
    </main>
  );
}
