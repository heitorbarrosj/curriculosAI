import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn("min-h-32 w-full rounded-lg border bg-card px-3 py-3 text-sm outline-none transition placeholder:text-foreground/40 focus:ring-2 focus:ring-primary/40", className)}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
