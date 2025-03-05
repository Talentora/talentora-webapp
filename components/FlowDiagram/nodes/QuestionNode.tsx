import { Handle, Position } from 'reactflow';

interface QuestionNodeProps {
  data: {
    label: string;
    content: string;
    criteria?: string;
  };
}

const QuestionNode = ({ data }: QuestionNodeProps) => {
  return (
    <div className="question-node rounded shadow-md border border-blue-300 overflow-hidden">
      <div className="node-header bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-t">
        <div className="text-sm font-bold truncate">{data.label}</div>
      </div>
      <div className="node-content bg-white p-3 text-sm max-h-40 overflow-y-auto">
        {data.content}
        {data.criteria && (
          <div className="criteria mt-2 text-xs bg-blue-50 p-2 rounded border border-blue-100">
            <span className="font-bold text-blue-700">Criteria:</span> {data.criteria}
          </div>
        )}
      </div>
      <Handle 
        type="target" 
        position={Position.Left} 
        id="left" 
        className="handle-left w-3 h-3 bg-blue-400 border-2 border-white" 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="right" 
        className="handle-right w-3 h-3 bg-green-400 border-2 border-white" 
      />
      <Handle 
        type="target" 
        position={Position.Top} 
        id="top" 
        className="handle-top w-3 h-3 bg-blue-400 border-2 border-white" 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="bottom" 
        className="handle-bottom w-3 h-3 bg-green-400 border-2 border-white" 
      />
    </div>
  );
};

export default QuestionNode;