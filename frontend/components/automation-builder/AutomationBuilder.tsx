'use client'

import React, { useCallback, useState } from 'react'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { PlusIcon, CogIcon } from '@heroicons/react/24/outline'
import { NodePanel } from './NodePanel'
import { NodeConfigModal } from './NodeConfigModal'

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start' },
    position: { x: 250, y: 100 },
  },
]

const initialEdges: Edge[] = []

export function AutomationBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [showPanel, setShowPanel] = useState(false)
  const [configNode, setConfigNode] = useState<Node | null>(null)
  const [nodeIdCounter, setNodeIdCounter] = useState(2)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const addNode = useCallback((type: string) => {
    const newNode: Node = {
      id: nodeIdCounter.toString(),
      type: 'default',
      data: { 
        label: type,
        type: type,
      },
      position: { 
        x: Math.random() * 400, 
        y: Math.random() * 400 
      },
    }
    setNodes((nds) => [...nds, newNode])
    setNodeIdCounter((prev) => prev + 1)
    setShowPanel(false)
  }, [nodeIdCounter, setNodes])

  const onNodeClick = useCallback((event: any, node: Node) => {
    setConfigNode(node)
  }, [])

  const updateNodeConfig = useCallback((config: any) => {
    if (!configNode) return
    
    setNodes((nds) =>
      nds.map((node) =>
        node.id === configNode.id
          ? { ...node, data: { ...node.data, ...config } }
          : node
      )
    )
    setConfigNode(null)
  }, [configNode, setNodes])

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-dark-bg">
      <div className="h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          className="bg-dark-bg"
        >
          <Background />
          <Controls className="bg-dark-card border-gray-800" />
          <MiniMap 
            className="bg-dark-card border-gray-800"
            nodeColor="#6366f1"
          />
        </ReactFlow>
        
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="absolute top-4 left-4 p-3 bg-arena-primary hover:bg-arena-primary/80 rounded-lg shadow-lg transition-colors"
        >
          <PlusIcon className="w-6 h-6 text-white" />
        </button>
        
        {showPanel && (
          <div className="absolute top-4 left-20 bg-dark-card border border-gray-800 rounded-lg shadow-xl p-4 w-64">
            <NodePanel onAddNode={addNode} />
          </div>
        )}
        
        {configNode && (
          <NodeConfigModal
            node={configNode}
            onClose={() => setConfigNode(null)}
            onSave={updateNodeConfig}
          />
        )}
      </div>
    </div>
  )
}

