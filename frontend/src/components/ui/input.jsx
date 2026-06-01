import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-md border border-line bg-surface px-2.5 py-1 text-sm text-ink transition-colors outline-none placeholder:text-faint hover:border-line-strong focus-visible:border-clay focus-visible:ring-2 focus-visible:ring-clay/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props} />
  );
}

export { Input }
