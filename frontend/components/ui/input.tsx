import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn("h-11 w-full rounded-lg border bg-card px-3 text-sm outline-none transition placeholder:text-foreground/40 focus:ring-2 focus:ring-primary/40", className)}
      {...props}
    />
  )
);
Input.displayName = "Input";
