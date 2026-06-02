import {
  Undo2,
  Redo2,
  Wand2,
  Moon,
  Sun,
  MoreHorizontal,
  Download,
  Upload,
  Trash2,
} from 'lucide-react'
import { Hint } from '@/components/Hint'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu'

function BarButton({ icon: Icon, label, keys, onClick }) {
  return (
    <Hint label={label} keys={keys}>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="flex size-7 items-center justify-center rounded-md text-dim transition-colors hover:bg-subtle hover:text-ink"
      >
        <Icon className="size-4" strokeWidth={2} />
      </button>
    </Hint>
  )
}

function BarDivider() {
  return <span className="mx-0.5 h-4 w-px bg-line" />
}

export function CanvasToolbar({
  mod,
  dark,
  onUndo,
  onRedo,
  onTidy,
  onToggleTheme,
  onExport,
  onImport,
  onClear,
}) {
  return (
    <div className="absolute right-3 top-3 z-10 flex items-center gap-0.5 rounded-lg border border-line bg-surface/90 p-1 shadow-sm backdrop-blur-sm">
      <BarButton icon={Undo2} label="Undo" keys={[mod, 'Z']} onClick={onUndo} />
      <BarButton
        icon={Redo2}
        label="Redo"
        keys={[mod, '⇧', 'Z']}
        onClick={onRedo}
      />
      <BarDivider />
      <BarButton
        icon={Wand2}
        label="Tidy layout"
        keys={[mod, '⇧', 'L']}
        onClick={onTidy}
      />
      <BarButton
        icon={dark ? Sun : Moon}
        label={dark ? 'Light mode' : 'Dark mode'}
        onClick={onToggleTheme}
      />
      <BarDivider />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="More actions"
            title="More"
            className="flex size-7 items-center justify-center rounded-md text-dim transition-colors hover:bg-subtle hover:text-ink data-[state=open]:bg-subtle data-[state=open]:text-ink"
          >
            <MoreHorizontal className="size-4" strokeWidth={2} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={onExport}>
            <Download />
            Export JSON
            <DropdownMenuShortcut>{mod}S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onImport}>
            <Upload />
            Import JSON
            <DropdownMenuShortcut>{mod}O</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={onClear}
            className="text-clay focus:bg-clay/10 focus:text-clay"
          >
            <Trash2 />
            Clear canvas
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
