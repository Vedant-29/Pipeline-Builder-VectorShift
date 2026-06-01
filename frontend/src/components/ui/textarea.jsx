import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({
  className,
  ...props
}) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-16 w-full rounded-md border border-line bg-surface px-2.5 py-2 text-sm text-ink transition-colors outline-none placeholder:text-faint hover:border-line-strong focus-visible:border-clay focus-visible:ring-2 focus-visible:ring-clay/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props} />
  );
}

export { Textarea }
