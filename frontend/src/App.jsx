import { PipelineToolbar } from '@/components/Toolbar'
import { PipelineUI } from '@/ui'
import { SubmitBar } from '@/submit'
import { Toaster } from '@/components/ui/sonner'

export default function App() {
  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold">VectorShift</span>
          <span className="text-xs text-muted-foreground">Pipeline Builder</span>
        </div>
        <SubmitBar />
      </header>
      <PipelineToolbar />
      <PipelineUI />
      <Toaster />
    </div>
  )
}
