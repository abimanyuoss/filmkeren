"use client";

import { useEffect } from "react";

interface TicketData {
  id: string;
  movieTitle: string;
  moviePoster: string;
  cinemaName: string;
  studioName: string;
  showDate: string;
  startsAt: string;
  seats: string[];
  bookingCode: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
}

export function TicketSaver({ ticket }: { ticket: TicketData }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const existing = localStorage.getItem("booked_tickets");
      const tickets: TicketData[] = existing ? JSON.parse(existing) : [];

      // Check if ticket already exists
      const exists = tickets.some((t) => t.id === ticket.id);
      if (!exists) {
        // Prepend new ticket
        const updated = [ticket, ...tickets];
        localStorage.setItem("booked_tickets", JSON.stringify(updated));
      }
    } catch (e) {
      console.error("Failed to save ticket to localStorage:", e);
    }
  }, [ticket]);

  return null;
}
