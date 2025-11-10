'use client'

interface NodePanelProps {
  onAddNode: (type: string) => void
}

const nodeTypes = [
  { type: 'API Call', icon: '🌐', description: 'Call external API' },
  { type: 'Database', icon: '💾', description: 'Query database' },
  { type: 'Condition', icon: '⚡', description: 'Add conditional logic' },
  { type: 'Transform', icon: '🔄', description: 'Transform data' },
  { type: 'Delay', icon: '⏱️', description: 'Add delay' },
  { type: 'Notification', icon: '🔔', description: 'Send notification' },
]

export function NodePanel({ onAddNode }: NodePanelProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Add Node</h3>
      <div className="space-y-2">
        {nodeTypes.map((node) => (
          <button
            key={node.type}
            onClick={() => onAddNode(node.type)}
            className="w-full p-3 text-left rounded-lg hover:bg-gray-800 transition-colors border border-transparent hover:border-arena-primary"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{node.icon}</span>
              <div>
                <div className="font-medium">{node.type}</div>
                <div className="text-sm text-gray-400">{node.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

