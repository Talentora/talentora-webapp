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

const nodeTypes = [
  { 
    type: 'start', 
    label: 'Start', 
    description: 'Begin the interview flow',
    color: 'green'
  },
  { 
    type: 'conclusion', 
    label: 'Conclusion', 
    description: 'End the interview flow',
    color: 'purple'
  },
  { 
    type: 'question', 
    label: 'Question', 
    description: 'Add an interview question',
    color: 'blue'
  },
  { 
    type: 'branching', 
    label: 'Branching', 
    description: 'Add a conditional branch (supports multiple paths)',
    color: 'red'
  }
];

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
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<string | null>(null);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
    setDragType(nodeType);
  };

  const onDragEnd = () => {
    setIsDragging(false);
    setDragType(null);
  };

  const getNodeStyle = (node: typeof nodeTypes[0]) => {
    const baseStyle = 'p-2 border rounded cursor-move transition-colors';
    const colorMap = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        hover: 'hover:bg-blue-100',
        active: 'bg-blue-100 border-blue-300'
      },
      yellow: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        hover: 'hover:bg-yellow-100',
        active: 'bg-yellow-100 border-yellow-300'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        hover: 'hover:bg-green-100',
        active: 'bg-green-100 border-green-300'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        hover: 'hover:bg-orange-100',
        active: 'bg-orange-100 border-orange-300'
      },
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        hover: 'hover:bg-red-100',
        active: 'bg-red-100 border-red-300'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        hover: 'hover:bg-purple-100',
        active: 'bg-purple-100 border-purple-300'
      }
    };

    const colors = colorMap[node.color as keyof typeof colorMap];
    if (!colors) {
      console.error(`No color mapping found for ${node.color}`);
      return baseStyle;
    }

    return `${baseStyle} ${colors.bg} ${colors.border} ${colors.hover} ${
      isDragging && dragType === node.type ? colors.active : ''
    }`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div 
        className="p-3 border-b flex justify-between items-center cursor-pointer hover:bg-gray-50"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="font-semibold">Interview Builder</h3>
        <button className="text-gray-500 hover:text-gray-700">
          {isCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-4 space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Add Nodes</h3>
            <div className="grid grid-cols-2 gap-2">
              {nodeTypes.map((node) => (
                <div
                  key={node.type}
                  className={getNodeStyle(node)}
                  draggable
                  onDragStart={(e) => onDragStart(e, node.type)}
                  onDragEnd={onDragEnd}
                >
                  <div className={`font-medium text-sm text-${node.color}-700`}>{node.label}</div>
                  <div className={`text-xs text-${node.color}-500`}>{node.description}</div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-500 italic">
              Note: Only branching nodes can have multiple outgoing connections
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={saveFlow}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Save Flow
              </button>
              <button
                onClick={autoLayout}
                className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Auto Layout
              </button>
              <button
                onClick={generateWithAI}
                disabled={isGenerating}
                className={`p-2 rounded transition-colors ${
                  isGenerating
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isGenerating ? 'Generating...' : 'Generate with AI'}
              </button>
              <button
                onClick={clearGraph}
                className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Clear Graph
              </button>
              <button
                onClick={debugFlow}
                className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors col-span-2"
              >
                Debug Flow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 