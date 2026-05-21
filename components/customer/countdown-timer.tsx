"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

export function CountdownTimer({ seconds = 300, onExpire }: { seconds?: number; onExpire?: () => void }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onExpire]);

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const isWarning = remaining <= 60;

  return (
    <div className={`countdown-timer ${isWarning ? "warning" : ""}`}>
      <Timer size={16} />
      <span>
        {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
      </span>
      <small>{isWarning ? "Segera selesaikan!" : "Kursi terkunci"}</small>
    </div>
  );
}
