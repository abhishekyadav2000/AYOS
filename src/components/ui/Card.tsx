"use client";

import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className, hoverable = true }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-indigo-500/20 bg-black/40 backdrop-blur-md p-6",
        hoverable &&
          "transition-all duration-300 hover:border-indigo-500/50 hover:bg-black/60",
        className
      )}
    >
      {children}
    </div>
  );
}

export default Card;
