"use client";

import { Download } from "lucide-react";

export function PrintTicketButton() {
  return (
    <button className="secondary-button" onClick={() => window.print()} type="button">
      <Download size={16} />
      Cetak / Download
    </button>
  );
}
