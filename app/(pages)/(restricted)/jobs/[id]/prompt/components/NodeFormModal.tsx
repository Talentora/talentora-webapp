interface NodeFormData {
  type: string;
  label: string;
  content: string;
  criteria: string;
  position: { x: number; y: number };
}

interface NodeFormModalProps {
  nodeFormData: NodeFormData;
  setNodeFormData: React.Dispatch<React.SetStateAction<NodeFormData>>;
  onSubmit: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  isEditing?: boolean;
}

export default function NodeFormModal({ 
  nodeFormData, 
  setNodeFormData, 
  onSubmit, 
  onCancel,
  onDelete,
  isEditing = false
}: NodeFormModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">
          {isEditing ? 'Edit' : 'Add'} {nodeFormData.type === 'question' ? 'Question' : nodeFormData.type === 'section' ? 'Section' : nodeFormData.type === 'conclusion' ? 'Conclusion' : 'Start'} Node
        </h3>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Label</label>
          <input 
            type="text" 
            className="w-full p-2 border border-gray-300 rounded"
            value={nodeFormData.label}
            onChange={(e) => setNodeFormData({...nodeFormData, label: e.target.value})}
            placeholder={nodeFormData.type === 'question' ? 'e.g., Technical Question' : 'e.g., Technical Skills Section'}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Content</label>
          <textarea 
            className="w-full p-2 border border-gray-300 rounded"
            value={nodeFormData.content}
            onChange={(e) => setNodeFormData({...nodeFormData, content: e.target.value})}
            rows={3}
            placeholder={nodeFormData.type === 'question' ? 'Enter your question here...' : 'Describe this section...'}
          />
        </div>
        
        {nodeFormData.type === 'question' && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Evaluation Criteria</label>
            <textarea 
              className="w-full p-2 border border-gray-300 rounded"
              value={nodeFormData.criteria}
              onChange={(e) => setNodeFormData({...nodeFormData, criteria: e.target.value})}
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
              onClick={onCancel}
            >
              Cancel
            </button>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              onClick={onSubmit}
              disabled={!nodeFormData.label.trim() || !nodeFormData.content.trim()}
            >
              {isEditing ? 'Update' : 'Add'} Node
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 