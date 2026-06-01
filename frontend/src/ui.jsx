import { useCallback, useRef, useState } from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
} from 'reactflow'
import { shallow } from 'zustand/shallow'
import 'reactflow/dist/style.css'
import { useStore } from '@/store'
import { nodeDefs, accents } from '@/nodes/registry'
import { BaseNode } from '@/nodes/BaseNode'

const GRID = 18

function buildNodeTypes(defs) {
  const entries = defs.map((def) => {
    if (def.component) return [def.type, def.component]
    const Configured = ({ id, data, selected }) => (
      <BaseNode
        id={id}
        data={data}
        selected={selected}
        title={def.title}
        description={def.description}
        icon={def.icon}
        accent={def.accent}
        fields={def.fields}
        handles={def.handles}
      />
    )
    Configured.displayName = `Node(${def.type})`
    return [def.type, Configured]
  })
  return Object.fromEntries(entries)
}

const nodeTypes = buildNodeTypes(nodeDefs)

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
})

export function PipelineUI() {
  const wrapperRef = useRef(null)
  const [rfInstance, setRfInstance] = useState(null)
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow)

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event) => {
      event.preventDefault()
      if (!rfInstance) return
      const raw = event.dataTransfer.getData('application/reactflow')
      if (!raw) return
      const { nodeType } = JSON.parse(raw)
      if (!nodeType) return
      const bounds = wrapperRef.current.getBoundingClientRect()
      const position = rfInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      })
      const id = getNodeID(nodeType)
      addNode({ id, type: nodeType, position, data: { id, nodeType } })
    },
    [rfInstance, getNodeID, addNode],
  )

  return (
    <div ref={wrapperRef} className="min-h-0 flex-1 bg-slate-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setRfInstance}
        proOptions={{ hideAttribution: true }}
        snapGrid={[GRID, GRID]}
        connectionLineType="smoothstep"
        defaultEdgeOptions={{ type: 'smoothstep' }}
        fitView
        fitViewOptions={{ padding: 0.3, maxZoom: 1 }}
      >
        <Background variant={BackgroundVariant.Dots} gap={GRID} size={2} color="#cbd5e1" />
        <Controls showInteractive={false} />
        <MiniMap
          pannable
          zoomable
          nodeColor={(node) => accents[node.type] ?? '#94a3b8'}
          nodeStrokeWidth={0}
          maskColor="rgba(148, 163, 184, 0.12)"
        />
      </ReactFlow>
    </div>
  )
}
