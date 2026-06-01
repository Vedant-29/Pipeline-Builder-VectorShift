import { Workflow } from 'lucide-react'
import { PipelineToolbar } from '@/components/Toolbar'
import { PipelineUI } from '@/ui'
import { SubmitBar } from '@/submit'

export default function App() {
  return (
    <div className="flex h-screen flex-col bg-subtle text-ink">
      <header className="flex items-center justify-between border-b border-line bg-surface px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-md bg-ink text-canvas">
            <Workflow className="size-4" strokeWidth={2.25} />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-ink">
            VectorShift
          </span>
        </div>
        <SubmitBar />
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
        <PipelineToolbar />
        <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-line bg-canvas">
          <PipelineUI />
        </div>
      </div>
    </div>
  )
}
