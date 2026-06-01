import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store'

const ENDPOINT = 'http://localhost:8000/pipelines/parse'

export function SubmitBar({ onResult, onError }) {
  const [loading, setLoading] = useState(false)

  const onSubmit = async () => {
    const { nodes, edges } = useStore.getState()
    setLoading(true)
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      })
      if (!response.ok) throw new Error(String(response.status))
      onResult(await response.json())
    } catch {
      onError('Backend unreachable')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={onSubmit}
      disabled={loading}
      size="sm"
      className="bg-ink text-canvas hover:bg-ink/90"
    >
      {loading ? 'Submitting…' : 'Submit'}
    </Button>
  )
}
