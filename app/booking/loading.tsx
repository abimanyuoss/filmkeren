import { CustomerHeader } from "@/components/customer/customer-header";

export default function BookingLoading() {
  return (
    <main className="customer-app">
      <CustomerHeader />
      <div style={{ padding: "3rem 0" }}>
        <div className="skeleton skeleton-text short" style={{ height: "2rem", marginBottom: "1.5rem", width: "40%" }} />
        <div className="skeleton skeleton-text" style={{ height: "1rem", marginBottom: "2rem", width: "60%" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 24rem", gap: "1.5rem" }}>
          <div>
            <div className="skeleton" style={{ height: "1.2rem", marginBottom: "1rem", width: "30%" }} />
            <div className="skeleton" style={{ height: "28rem", borderRadius: "10px" }} />
          </div>
          <div style={{ display: "grid", gap: "1rem" }}>
            <div className="skeleton" style={{ aspectRatio: "16 / 9", borderRadius: "10px" }} />
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-text short" />
            <div className="skeleton skeleton-text" />
          </div>
        </div>
      </div>
    </main>
  );
}
