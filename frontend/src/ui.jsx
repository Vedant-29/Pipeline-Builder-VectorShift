import { useCallback } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useReactFlow,
} from '@xyflow/react'
import { shallow } from 'zustand/shallow'
import '@xyflow/react/dist/style.css'
import { useStore } from '@/store'
import { nodeDefs } from '@/nodes/registry'
import { BaseNode } from '@/nodes/BaseNode'
import { DeletableEdge } from '@/components/DeletableEdge'
import { createsCycle } from '@/lib/graph'

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

export function PipelineUI({ onCycleWarning }) {
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

  const handleConnect = useCallback(
    (connection) => {
      if (createsCycle(edges, connection.source, connection.target)) {
        onCycleWarning?.()
      }
      onConnect(connection)
    },
    [edges, onConnect, onCycleWarning],
  )

  const isValidConnection = useCallback(
    (connection) => connection.source !== connection.target,
    [],
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={handleConnect}
      isValidConnection={isValidConnection}
      onDrop={onDrop}
      onDragOver={onDragOver}
      proOptions={{ hideAttribution: true }}
      deleteKeyCode={['Backspace', 'Delete']}
      connectionLineType="smoothstep"
      defaultEdgeOptions={{ type: 'deletable' }}
      nodeOrigin={[0, 0]}
      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
    >
      <Background variant={BackgroundVariant.Dots} gap={GRID} size={1.5} color="var(--dot)" />
      <Controls showInteractive={false} />
      <MiniMap
        pannable
        zoomable
        nodeColor="var(--minimap-node)"
        nodeStrokeWidth={0}
        maskColor="var(--minimap-mask)"
      />
    </ReactFlow>
  )
}
