'use client'

import { Node } from 'reactflow'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface NodeConfigModalProps {
  node: Node
  onClose: () => void
  onSave: (config: any) => void
}

export function NodeConfigModal({ node, onClose, onSave }: NodeConfigModalProps) {
  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-dark-card border border-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Configure Node</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Node Label</label>
            <input
              type="text"
              defaultValue={node.data.label}
              className="w-full px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg focus:outline-none focus:border-arena-primary"
            />
          </div>
          
          {node.data.type && (
            <div>
              <label className="block text-sm font-medium mb-2">Node Type</label>
              <div className="px-3 py-2 bg-gray-800 rounded-lg">{node.data.type}</div>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({})}
            className="flex-1 px-4 py-2 bg-arena-primary hover:bg-arena-primary/80 rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

