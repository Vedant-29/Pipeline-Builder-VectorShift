import { useCallback } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useReactFlow,
} from '@xyflow/react'
import { shallow } from 'zustand/shallow'
import '@xyflow/react/dist/style.css'
import { useStore } from '@/store'
import { nodeDefs, accents } from '@/nodes/registry'
import { BaseNode } from '@/nodes/BaseNode'
import { DeletableEdge } from '@/components/DeletableEdge'

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
const edgeTypes = { deletable: DeletableEdge }

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
})

function FlowCanvas() {
  const { screenToFlowPosition } = useReactFlow()
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
      const raw = event.dataTransfer.getData('application/reactflow')
      if (!raw) return
      const { nodeType } = JSON.parse(raw)
      if (!nodeType) return
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })
      const id = getNodeID(nodeType)
      addNode({ id, type: nodeType, position, data: { id, nodeType } })
    },
    [screenToFlowPosition, getNodeID, addNode],
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDrop={onDrop}
      onDragOver={onDragOver}
      proOptions={{ hideAttribution: true }}
      deleteKeyCode={['Backspace', 'Delete']}
      connectionLineType="smoothstep"
      defaultEdgeOptions={{ type: 'deletable' }}
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
        maskColor="rgba(148, 163, 184, 0.1)"
      />
    </ReactFlow>
  )
}

export function PipelineUI() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  )
}
