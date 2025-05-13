import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export interface NodeFormData {
  type: string;
  label: string;
  content: string;
  criteria: string;
  follow_up_toggle: boolean;
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
} else {
  // Go to second path
}`;

  // Set default criteria when type changes to branching
  useEffect(() => {
    if (nodeFormData.type === 'branching' && !nodeFormData.criteria) {
      setNodeFormData(prev => ({ ...prev, criteria: defaultCriteria }));
    }
  }, [nodeFormData.type]);

  const insertTemplate = () => {
    setNodeFormData(prev => ({ ...prev, criteria: defaultCriteria }));
  };

  const handleCriteriaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log('Criteria changed:', e.target.value); // Debug log
    setNodeFormData(prev => ({ ...prev, criteria: e.target.value }));
  };

  const getNodeTypeLabel = (type: string) => {
    switch (type) {
      case 'start': return 'Start';
      case 'conclusion': return 'Conclusion';
      case 'question': return 'Question';
      case 'branching': return 'Branching';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }

  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Node' : 'Add New Node'}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
\              Node Type
            </label>
            <div className="p-2 border-2 border-gray-300 rounded bg-gray-50">
              {getNodeTypeLabel(nodeFormData.type)}
            </div>

          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={nodeFormData.content}
              onChange={(e) => setNodeFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full p-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
              placeholder="Enter node content"
            />
          </div>
          {(nodeFormData.type === 'branching' || nodeFormData.type === 'question') && (
            <>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {nodeFormData.type === 'branching' ? 'Split Criteria' : 'Evaluation Criteria'}
                  </label>
                  {nodeFormData.type === 'branching' && (
                    <Button
                      onClick={insertTemplate}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Reset Template
                    </Button>
                  )}
                </div>
                <textarea
                  value={nodeFormData.criteria || ''}
                  onChange={handleCriteriaChange}
                  className="w-full p-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 font-mono text-sm"
                  placeholder={nodeFormData.type === 'branching' 
                    ? "Example: if (candidate.experience > 5) { go to Senior path } else { go to Junior path }"
                    : "Enter evaluation criteria for this question"}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {nodeFormData.type === 'branching' 
                    ? "Use if-else statements to define which path to take based on conditions."
                    : "Define how this question should be evaluated."}
                </p>
              </div>

            </>
          )}
          {nodeFormData.type === 'question' && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="follow_up_toggle"
                checked={nodeFormData.follow_up_toggle}
                onChange={(e) => setNodeFormData(prev => ({ ...prev, follow_up_toggle: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="follow_up_toggle" className="text-sm font-medium text-gray-700">
                Ask follow-up questions
              </label>
            </div>
          )}
          {isEditing && nodeFormData.connectedNodes && nodeFormData.connectedNodes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selected Path
              </label>
              <select
                value={nodeFormData.selectedPath || ''}
                onChange={(e) => setNodeFormData(prev => ({ ...prev, selectedPath: e.target.value }))}
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