import { Handle, Position } from 'reactflow';

interface SectionNodeProps {
  data: {
    label: string;
    content: string;
  };
}

const SectionNode = ({ data }: SectionNodeProps) => {
  return (
    <div className="section-node rounded shadow-md border border-yellow-300 overflow-hidden">
      <div className="node-header bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-3 rounded-t">
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

export default SectionNode;