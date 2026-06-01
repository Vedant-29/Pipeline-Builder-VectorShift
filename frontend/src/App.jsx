import { Workflow } from 'lucide-react'
import { PipelineToolbar } from '@/components/Toolbar'
import { PipelineUI } from '@/ui'
import { SubmitBar } from '@/submit'
import { Toaster } from '@/components/ui/sonner'

export default function App() {
  return (
    <div className="flex h-screen flex-col bg-slate-50 text-slate-900">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
            <Workflow className="size-4" strokeWidth={2.5} />
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] font-semibold tracking-tight text-slate-900">
              VectorShift
            </span>
            <span className="text-xs text-slate-400">Pipeline Builder</span>
          </div>
        </div>
        <SubmitBar />
      </header>
      <PipelineToolbar />
      <PipelineUI />
      <Toaster />
    </div>
  )
}
