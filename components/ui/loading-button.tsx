"use client";

import { Loader2 } from "lucide-react";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary";
  children: ReactNode;
  full?: boolean;
}

export function LoadingButton({
  loading,
  variant = "primary",
  children,
  full,
  className = "",
  disabled,
  ...props
}: LoadingButtonProps) {
  const base = variant === "primary" ? "primary-button" : "secondary-button";
  return (
    <button
      className={`${base} ${full ? "full" : ""} loading-button ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 size={16} className="spin" /> : null}
      <span style={{ opacity: loading ? 0.7 : 1 }}>{children}</span>
    </button>
  );
}
