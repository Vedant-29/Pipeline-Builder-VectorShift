import { cn } from '@/lib/utils'

const TONES = {
  onLight: 'border border-line bg-subtle text-dim',
  onDark: 'bg-canvas/15 text-canvas/90',
}

export function Kbd({ keys, tone = 'onDark', className }) {
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)}>
      {keys.map((key, index) => (
        <kbd
          key={index}
          className={cn(
            'inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-[5px] px-1 font-mono text-[11px] font-medium leading-none',
            TONES[tone],
          )}
        >
          {key}
        </kbd>
      ))}
    </span>
  )
}
