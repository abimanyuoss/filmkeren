import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: {
    template: "%s | FilmKeren",
    default: "FilmKeren - Pesan Tiket Bioskop Tanpa Ribet"
  },
  description: "Nikmati pengalaman sinematik terbaik. Pesan tiket bioskop favorit Anda dengan mudah dan aman di jaringan FilmKeren seluruh Indonesia.",
  openGraph: {
    title: "FilmKeren - Platform Booking Tiket Bioskop",
    description: "Nikmati pengalaman sinematik terbaik. Pesan tiket bioskop favorit Anda dengan mudah dan aman di jaringan FilmKeren seluruh Indonesia.",
    url: "https://filmkeren.vercel.app",
    siteName: "FilmKeren",
    images: [
      {
        url: "https://filmkeren.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FilmKeren Thumbnail"
      }
    ],
    locale: "id_ID",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
