"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  asChild,
  disabled,
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary:
      "bg-cyan-400 text-black hover:bg-cyan-300 font-semibold transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed",
    secondary:
      "border border-indigo-500 text-indigo-400 hover:bg-indigo-500/10 transition-colors disabled:border-gray-500 disabled:text-gray-500 disabled:cursor-not-allowed",
    ghost: "text-cyan-400 hover:text-cyan-300 transition-colors disabled:text-gray-500 disabled:cursor-not-allowed",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm rounded",
    md: "px-6 py-2.5 text-base rounded-lg",
    lg: "px-8 py-3 text-lg rounded-lg",
  };

  const baseClasses = cn(
    "font-medium transition-colors duration-200 inline-flex items-center justify-center",
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  if (asChild) {
    return (
      <span className={baseClasses}>
        {children}
      </span>
    );
  }

  return (
    <button
      className={baseClasses}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
