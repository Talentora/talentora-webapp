import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ControlPanelProps {
  onAddNode: (type: string) => void;
  onAutoLayout: () => void;
  onSaveFlow: () => void;
  onResetFlow: () => void;
  loading?: boolean;
}

export default function ControlPanel({ 
  onAddNode,
  onAutoLayout, 
  onSaveFlow,
  onResetFlow,
  loading = false
}: ControlPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="bg-white rounded shadow-md">
      <div 
        className="p-3 border-b flex justify-between items-center cursor-pointer hover:bg-gray-50"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="font-bold">Interview Builder</h3>
        <Button className="text-gray-500">
          {isCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          )}
        </Button>
      </div>
      
      {!isCollapsed && (
        <div className="p-4 max-h-[350px] overflow-y-auto">
          <p className="text-sm text-gray-600">Use the tools below to build your interview flow</p>
          
          {/* Node Types Section */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <button 
              className="p-2 border border-green-300 rounded bg-green-50 text-green-700 hover:bg-green-100"
              onClick={() => onAddNode('input')}
            >
              Add Start Node
            </button>
            <button 
              className="p-2 border border-blue-300 rounded bg-blue-50 text-blue-700 hover:bg-blue-100"
              onClick={() => onAddNode('question')}
            >
              Add Question
            </button>
            <button 
              className="p-2 border border-yellow-300 rounded bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
              onClick={() => onAddNode('section')}
            >
              Add Section
            </button>
            <button 
              className="p-2 border border-purple-300 rounded bg-purple-50 text-purple-700 hover:bg-purple-100"
              onClick={() => onAddNode('conclusion')}
            >
              Add Conclusion
            </button>
          </div>
          
          {/* Action Buttons Section */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button 
              onClick={onAutoLayout}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
            >
              Auto Layout
            </Button>
            
            <Button 
              onClick={onSaveFlow}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
            >
              {loading ? 'Saving...' : 'Save Flow'}
            </Button>
          </div>
          
          <Button 
            onClick={onResetFlow}
            className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors"
          >
            Reset to Default
          </Button>
          
          {/* Help Button */}
          <Button 
            onClick={() => setShowHelp(!showHelp)}
            className="mt-2 w-full bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 px-4 rounded transition-colors"
          >
            {showHelp ? 'Hide Help' : 'Show Help'}
          </Button>
          
          {showHelp && (
            <div className="mt-2 p-3 bg-blue-50 rounded text-sm">
              <h4 className="font-bold mb-1">How to use the Interview Builder:</h4>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Add nodes using the buttons above</li>
                <li>Connect nodes by dragging between node handles</li>
                <li>Click on a node to edit its content</li>
                <li>Use Auto Layout to organize your flow</li>
              </ol>
              <p className="mt-2 text-blue-700">
                <strong>Note:</strong> Create a linear flow from Start to Conclusion with sections and questions in between.
              </p>
            </div>
          )}
          
          <div className="mt-3 p-2 border rounded text-sm">
            <h4 className="font-bold">Flow Requirements:</h4>
            <ul className="list-disc pl-4 mt-1">
              <li>Must start with a Start node</li>
              <li>Must end with a Conclusion node</li>
              <li>All nodes must be connected</li>
              <li>No cycles allowed (linear flow only)</li>
              <li>Start cannot connect directly to Conclusion - add at least one question or section in between</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
} 