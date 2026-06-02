import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Kbd } from '@/components/Kbd'

export function Hint({ label, keys, side = 'bottom', children }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>
        <span>{label}</span>
        {keys?.length ? <Kbd keys={keys} tone="onDark" /> : null}
      </TooltipContent>
    </Tooltip>
  )
}
