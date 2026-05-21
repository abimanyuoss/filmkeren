import { CustomerHeader } from "@/components/customer/customer-header";

export default function TicketLoading() {
  return (
    <main className="customer-app">
      <CustomerHeader />
      <div style={{ padding: "3rem 0", display: "grid", gap: "2rem", justifyItems: "center" }}>
        <div className="skeleton" style={{ height: "1.5rem", width: "12rem", borderRadius: "8px" }} />
        <div className="skeleton" style={{ height: "24rem", width: "min(46rem, 100%)", borderRadius: "16px" }} />
        <div className="skeleton" style={{ height: "3rem", width: "10rem", borderRadius: "6px" }} />
      </div>
    </main>
  );
}
