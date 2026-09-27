import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "muted";
  className?: string;
}

export default function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const base = "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-medium tracking-wide";
  const variants = {
    default: "border-[var(--border)] text-[var(--muted)]",
    accent: "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-soft)]",
    muted: "border-[var(--border)] text-[var(--muted)] bg-transparent",
  };
  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
