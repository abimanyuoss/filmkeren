import Link from "next/link";

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TwitterIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

export function CustomerFooter() {
  return (
    <footer className="customer-footer">
      <div className="footer-grid">
        <div className="footer-col">
          <h3>Perusahaan</h3>
          <Link href="#">Tentang Kami</Link>
          <Link href="#">Karir</Link>
          <Link href="#">Hubungan Investor</Link>
          <Link href="#">Mitra</Link>
        </div>
        <div className="footer-col">
          <h3>Bantuan</h3>
          <Link href="#">Pusat Bantuan</Link>
          <Link href="#">Syarat & Ketentuan</Link>
          <Link href="#">Kebijakan Privasi</Link>
          <Link href="#">FAQ Pemesanan</Link>
        </div>
        <div className="footer-col">
          <h3>Jaringan</h3>
          <Link href="#">Daftar Bioskop</Link>
          <Link href="#">Penawaran Korporat</Link>
          <Link href="#">FilmKeren Lounge</Link>
        </div>
        <div className="footer-col">
          <h3>Ikuti Kami</h3>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", margin: "0 0 1rem 0" }}>
            Dapatkan info promo dan film terbaru dari kami.
          </p>
          <div className="footer-socials">
            <Link href="#" aria-label="Instagram">
              <InstagramIcon size={18} />
            </Link>
            <Link href="#" aria-label="Twitter">
              <TwitterIcon size={18} />
            </Link>
            <Link href="#" aria-label="Facebook">
              <FacebookIcon size={18} />
            </Link>
            <Link href="#" aria-label="Youtube">
              <YoutubeIcon size={18} />
            </Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} FilmKeren. Semua Hak Cipta Dilindungi.</p>
      </div>
    </footer>
  );
}
