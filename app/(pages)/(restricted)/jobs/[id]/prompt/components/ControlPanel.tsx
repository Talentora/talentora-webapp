import { useState } from 'react';
import { Button } from '@/components/ui/button';
interface ControlPanelProps {
  saveFlow: () => void;
  autoLayout: () => void;
  generateWithAI: () => void;
  clearGraph: () => void;
  debugFlow?: () => void;
  isValid?: boolean;
  isGenerating?: boolean;
}

export default function ControlPanel({ 
  saveFlow, 
  autoLayout, 
  generateWithAI,
  clearGraph,
  debugFlow,
  isValid = true,
  isGenerating = false
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
          <p className="text-sm text-gray-600">Drag and drop nodes to build your interview flow</p>
          
          {/* Node Types Section */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div 
              className="p-2 border border-green-300 rounded cursor-move bg-green-50 text-green-700"
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow', 'input');
              }}
              draggable
            >
              Start Node
            </div>
            <div 
              className="p-2 border border-blue-300 rounded cursor-move bg-blue-50 text-blue-700"
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow', 'question');
              }}
              draggable
            >
              Question Node
            </div>
            <div 
              className="p-2 border border-yellow-300 rounded cursor-move bg-yellow-50 text-yellow-700"
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow', 'section');
              }}
              draggable
            >
              Section Node
            </div>
            <div 
              className="p-2 border border-purple-300 rounded cursor-move bg-purple-50 text-purple-700"
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow', 'conclusion');
              }}
              draggable
            >
              Conclusion Node
            </div>
          </div>
          
          {/* AI Generation and Action Buttons Section */}
          <div className="mt-4">
            <Button 
              onClick={generateWithAI}
              disabled={isGenerating}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition-colors flex items-center justify-center"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Interview Flow...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Generate with AI
                </>
              )}
            </Button>
            
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button 
                onClick={autoLayout}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
              >
                Auto Layout
              </Button>
              
              <Button 
                onClick={saveFlow}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
              >
                Save Flow
              </Button>
            </div>
            
            <Button 
              onClick={clearGraph}
              className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Clear Graph
            </Button>
          </div>
          
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
                <li>Drag node types from the panel to add them to the canvas</li>
                <li>Connect nodes by dragging from the right handle to the left handle of another node</li>
                <li><strong>Double-click</strong> on any node to edit its content or delete it</li>
                <li>Select an edge and press Delete to remove a connection</li>
              </ol>
              <p className="mt-2 text-blue-700">
                <strong>Note:</strong> Each node can have at most one incoming and one outgoing connection to create a linear interview flow.
              </p>
              <p className="mt-1 text-blue-700">Tip: You can also select a node and press Delete to remove it.</p>
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
          
          {/* Debug Button (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <Button 
              onClick={debugFlow}
              className="mt-2 w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors"
            >
              Debug Flow
            </Button>
          )}
        </div>
      )}
    </div>
  );
} 