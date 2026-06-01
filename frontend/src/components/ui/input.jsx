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
        "h-8 w-full min-w-0 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-sm text-slate-800 shadow-xs transition-colors outline-none placeholder:text-slate-400 hover:border-slate-300 focus-visible:border-[var(--node-accent,#6366f1)] focus-visible:ring-2 focus-visible:ring-[var(--node-accent,#6366f1)]/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props} />
  );
}

export { Input }
