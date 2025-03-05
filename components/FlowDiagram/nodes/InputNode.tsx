import { Handle, Position } from 'reactflow';

interface InputNodeProps {
  data: {
    label: string;
    content: string;
  };
}

const InputNode = ({ data }: InputNodeProps) => {
  return (
    <div className="input-node rounded shadow-md border border-green-300 overflow-hidden">
      <div className="node-header bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-t">
        <div className="text-sm font-bold truncate">{data.label}</div>
      </div>
      <div className="node-content bg-white p-3 text-sm max-h-40 overflow-y-auto">
        {data.content}
      </div>
      <Handle 
        type="source" 
        position={Position.Right} 
        id="right" 
        className="handle-right w-3 h-3 bg-green-400 border-2 border-white" 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="bottom" 
        className="handle-bottom w-3 h-3 bg-green-400 border-2 border-white" 
      />
      <Handle 
        type="source" 
        position={Position.Top} 
        id="top" 
        className="handle-top w-3 h-3 bg-green-400 border-2 border-white" 
      />
      <Handle 
        type="source" 
        position={Position.Left} 
        id="left" 
        className="handle-left w-3 h-3 bg-green-400 border-2 border-white" 
      />
    </div>
  );
};

export default InputNode; 