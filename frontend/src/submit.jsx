import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store'

const ENDPOINT = 'http://localhost:8000/pipelines/parse'

function countLabel(count, singular) {
  return `${count} ${singular}${count === 1 ? '' : 's'}`
}

export function SubmitBar() {
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
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`)
      }
      const result = await response.json()
      toast.success('Pipeline parsed', {
        description: `${countLabel(result.num_nodes, 'node')}, ${countLabel(
          result.num_edges,
          'edge',
        )}. ${result.is_dag ? 'This pipeline is a valid DAG.' : 'This pipeline is not a DAG (it contains a cycle).'}`,
      })
    } catch (error) {
      toast.error('Could not reach the backend', {
        description: `${error.message}. Make sure the FastAPI server is running on port 8000.`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={onSubmit}
      disabled={loading}
      size="sm"
      className="bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
    >
      {loading ? 'Submitting...' : 'Submit'}
    </Button>
  )
}
