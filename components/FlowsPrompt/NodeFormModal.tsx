import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface NodeFormData {
  type: string;
  label: string;
  content: string;
  criteria: string;
  position: { x: number; y: number };
  connectedNodes?: Array<{ id: string; label: string }>;
  selectedPath?: string;
}

interface NodeFormModalProps {
  nodeFormData: NodeFormData;
  setNodeFormData: React.Dispatch<React.SetStateAction<NodeFormData>>;
  onSubmit: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  isEditing?: boolean;
}

const nodeTypes = [
  { value: 'start', label: 'Start' },
  { value: 'conclusion', label: 'Conclusion' },
  { value: 'question', label: 'Question' },
  { value: 'section', label: 'Section' },
  { value: 'branching', label: 'Branching' }
];

export default function NodeFormModal({ 
  nodeFormData, 
  setNodeFormData, 
  onSubmit, 
  onCancel,
  onDelete,
  isEditing = false
}: NodeFormModalProps) {
  const defaultCriteria = `if (condition) {
  // Go to first path
} if (condition) {
  // Go to second path
}`;

  // Set default criteria when type changes to branching
  useEffect(() => {
    if (nodeFormData.type === 'branching' && !nodeFormData.criteria) {
      setNodeFormData({ ...nodeFormData, criteria: defaultCriteria });
    }
  }, [nodeFormData.type]);

  const insertTemplate = () => {
    setNodeFormData({ ...nodeFormData, criteria: defaultCriteria });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Node' : 'Add New Node'}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label
            </label>
            <input
              type="text"
              value={nodeFormData.label}
              onChange={(e) => setNodeFormData({ ...nodeFormData, label: e.target.value })}
              className="w-full p-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter node label"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={nodeFormData.content}
              onChange={(e) => setNodeFormData({ ...nodeFormData, content: e.target.value })}
              className="w-full p-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
              placeholder="Enter node content"
            />
          </div>
          {nodeFormData.type === 'branching' && (
            <>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Split Criteria
                  </label>
                  <Button
                    onClick={insertTemplate}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Reset Template
                  </Button>
                </div>
                <textarea
                  value={nodeFormData.criteria || defaultCriteria}
                  onChange={(e) => setNodeFormData({ ...nodeFormData, criteria: e.target.value })}
                  className="w-full p-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 font-mono text-sm"
                  placeholder="Example: if (candidate.experience > 5) { go to Senior path } else { go to Junior path }"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Use if-else statements to define which path to take based on conditions.
                </p>
              </div>
              {isEditing && nodeFormData.connectedNodes && nodeFormData.connectedNodes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selected Path
                  </label>
                  <select
                    value={nodeFormData.selectedPath || ''}
                    onChange={(e) => setNodeFormData({ ...nodeFormData, selectedPath: e.target.value })}
                    className="w-full p-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a path...</option>
                    {nodeFormData.connectedNodes.map((node) => (
                      <option key={node.id} value={node.id}>
                        {node.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}
          <div className="flex justify-end space-x-2">
            {isEditing && (
              <Button
                onClick={onDelete}
                variant="destructive"
              >
                Delete
              </Button>
            )}
            <Button
              onClick={onCancel}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              variant="default"
            >
              {isEditing ? 'Save Changes' : 'Add Node'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 