import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  const variants = {
    primary: "bg-primary text-white hover:opacity-90",
    secondary: "bg-muted text-foreground hover:bg-muted/80",
    ghost: "bg-transparent hover:bg-muted",
    danger: "bg-red-600 text-white hover:bg-red-500"
  };
  return (
    <button
      className={cn("inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60", variants[variant], className)}
      {...props}
    />
  );
}
