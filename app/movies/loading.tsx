import { CustomerHeader } from "@/components/customer/customer-header";

export default function MoviesLoading() {
  return (
    <main className="customer-app">
      <CustomerHeader />
      <div style={{ padding: "3rem 0" }}>
        <div className="skeleton skeleton-text short" style={{ height: "2.5rem", marginBottom: "2rem" }} />
        <div className="customer-movie-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.5rem" }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div className="skeleton skeleton-card" />
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text short" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
