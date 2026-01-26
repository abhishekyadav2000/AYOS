"use client";

import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  variant?: "default" | "accent";
  className?: string;
}

export function Tag({ children, variant = "default", className }: TagProps) {
  const variantClasses = {
    default:
      "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors",
    accent:
      "bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 hover:bg-cyan-400/30 transition-colors",
  };

  return (
    <span
      className={cn(
        "inline-block rounded-full px-3 py-1 text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export default Tag;
