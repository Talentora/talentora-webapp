import React from 'react';

interface NodeFormData {
  label: string;
  content: string;
  criteria: string;
  type: string;
}

interface NodeFormModalProps {
  isOpen: boolean;
  formData: NodeFormData;
  setFormData: React.Dispatch<React.SetStateAction<NodeFormData>>;
  onSubmit: () => void;
  onClose: () => void;
  onDelete?: () => void;
  isEditing?: boolean;
  connectionCount?: number;
}

export default function NodeFormModal({ 
  isOpen,
  formData, 
  setFormData, 
  onSubmit, 
  onClose,
  onDelete,
  isEditing = false,
  connectionCount = 0
}: NodeFormModalProps) {
  if (!isOpen) return null;

  const showConnectionWarning = 
    isEditing && 
    formData.type !== 'input' && 
    formData.type !== 'conclusion' && 
    connectionCount !== 2;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">
          {isEditing ? 'Edit' : 'Add'} {formData.type === 'question' ? 'Question' : formData.type === 'section' ? 'Section' : formData.type === 'conclusion' ? 'Conclusion' : 'Start'} Node
        </h3>
        
        {showConnectionWarning && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            <p className="text-sm font-medium">
              This node has {connectionCount} {connectionCount === 1 ? 'connection' : 'connections'}
            </p>
            <p className="text-xs mt-1">
              Each node (except start and conclusion) must have exactly 2 connections to save the flow.
            </p>
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Label</label>
          <input 
            type="text" 
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.label}
            onChange={(e) => setFormData({...formData, label: e.target.value})}
            placeholder={formData.type === 'question' ? 'e.g., Technical Question' : 'e.g., Technical Skills Section'}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Content</label>
          <textarea 
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            rows={3}
            placeholder={formData.type === 'question' ? 'Enter your question here...' : 'Describe this section...'}
          />
        </div>
        
        {formData.type === 'question' && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Evaluation Criteria</label>
            <textarea 
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.criteria}
              onChange={(e) => setFormData({...formData, criteria: e.target.value})}
              rows={2}
              placeholder="What to look for in the candidate's answer..."
            />
          </div>
        )}
        
        <div className="flex justify-between gap-2">
          <div>
            {onDelete && (
              <button 
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                onClick={onDelete}
              >
                Delete Node
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <button 
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              onClick={onSubmit}
              disabled={!formData.label.trim() || !formData.content.trim()}
            >
              {isEditing ? 'Update' : 'Add'} Node
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 