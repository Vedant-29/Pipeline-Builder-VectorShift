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
        "flex min-h-16 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-800 shadow-xs transition-colors outline-none placeholder:text-slate-400 hover:border-slate-300 focus-visible:border-[var(--node-accent,#6366f1)] focus-visible:ring-2 focus-visible:ring-[var(--node-accent,#6366f1)]/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props} />
  );
}

export { Textarea }
