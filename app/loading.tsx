import { CustomerHeader } from "@/components/customer/customer-header";

export default function Loading() {
  return (
    <main className="customer-app">
      <CustomerHeader />
      <div style={{ padding: "4rem 0", display: "grid", gap: "2rem" }}>
        <div className="skeleton skeleton-card" style={{ height: "400px", width: "100%", borderRadius: "12px" }} />
        <div style={{ display: "grid", gap: "1rem" }}>
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text short" />
          <div className="skeleton skeleton-text" />
        </div>
      </div>
    </main>
  );
}
