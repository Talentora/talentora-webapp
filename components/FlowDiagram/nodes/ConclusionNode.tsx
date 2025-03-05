import { Handle, Position } from 'reactflow';

interface ConclusionNodeProps {
  data: {
    label: string;
    content: string;
  };
}

const ConclusionNode = ({ data }: ConclusionNodeProps) => {
  return (
    <div className="conclusion-node rounded shadow-md border border-purple-300 overflow-hidden">
      <div className="node-header bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 rounded-t">
        <div className="text-sm font-bold truncate">{data.label}</div>
      </div>
      <div className="node-content bg-white p-3 text-sm max-h-40 overflow-y-auto">
        {data.content}
      </div>
      <Handle 
        type="target" 
        position={Position.Left} 
        id="left" 
        className="handle-left w-3 h-3 bg-blue-400 border-2 border-white" 
      />
      <Handle 
        type="target" 
        position={Position.Top} 
        id="top" 
        className="handle-top w-3 h-3 bg-blue-400 border-2 border-white" 
      />
      <Handle 
        type="target" 
        position={Position.Bottom} 
        id="bottom" 
        className="handle-bottom w-3 h-3 bg-blue-400 border-2 border-white" 
      />
    </div>
  );
};

export default ConclusionNode;