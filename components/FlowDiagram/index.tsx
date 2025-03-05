import { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Panel,
  BackgroundVariant,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  ReactFlowInstance,
  getConnectedEdges,
  useEdges
} from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes } from './nodes';
import './styles.css';
import { toast } from '@/components/Toasts/use-toast';
import ConfirmationModal from './ConfirmationModal';

interface FlowDiagramProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  onNodeClick?: (event: React.MouseEvent, node: Node) => void;
  onPaneClick?: () => void;
  onInit?: (reactFlowInstance: ReactFlowInstance) => void;
  onDeleteEdge?: (edge: Edge) => void;
  children?: React.ReactNode;
}

const FlowDiagram: React.FC<FlowDiagramProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onPaneClick,
  onInit,
  onDeleteEdge,
  children
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Enhanced connect handler that checks for existing connections
  const handleConnect = useCallback((params: Connection) => {
    const sourceNode = nodes.find(node => node.id === params.source);
    const targetNode = nodes.find(node => node.id === params.target);
    
    if (!sourceNode || !targetNode) return;
    
    // Count existing connections for the source and target nodes
    const sourceConnections = edges.filter(
      edge => edge.source === params.source || edge.target === params.source
    );
    
    const targetConnections = edges.filter(
      edge => edge.source === params.target || edge.target === params.target
    );
    
    // Check connection limits but make exceptions for input and conclusion nodes
    // Input nodes can have multiple outgoing connections
    if (sourceNode.type !== 'input' && sourceConnections.length >= 2) {
      toast({
        title: "Connection limit reached",
        description: `The node "${sourceNode.data.label}" already has the maximum of 2 connections.`,
        variant: "destructive",
      });
      return;
    }
    
    // Conclusion nodes can have multiple incoming connections
    if (targetNode.type !== 'conclusion' && targetConnections.length >= 2) {
      toast({
        title: "Connection limit reached",
        description: `The node "${targetNode.data.label}" already has the maximum of 2 connections.`,
        variant: "destructive",
      });
      return;
    }
    
    // If everything is valid, call the original onConnect
    onConnect(params);
  }, [nodes, edges, onConnect]);

  // Handle edge double-click
  const onEdgeDoubleClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedEdge(edge);
    setShowDeleteConfirmation(true);
  }, []);

  // Handle edge deletion confirmation
  const handleDeleteEdge = useCallback(() => {
    if (selectedEdge && onDeleteEdge) {
      onDeleteEdge(selectedEdge);
      setShowDeleteConfirmation(false);
      setSelectedEdge(null);
    }
  }, [selectedEdge, onDeleteEdge]);

  // Handle edge deletion cancel
  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirmation(false);
    setSelectedEdge(null);
  }, []);

  return (
    <div 
      className="flow-container" 
      style={{ width: '100%', height: '100%' }}
      ref={reactFlowWrapper}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onInit={onInit}
        onDragOver={onDragOver}
        onEdgeDoubleClick={onEdgeDoubleClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2, includeHiddenNodes: false }}
        attributionPosition="bottom-right"
        snapToGrid={true}
        snapGrid={[15, 15]}
      >
        <Controls />
        <MiniMap 
          nodeStrokeWidth={3}
          zoomable 
          pannable
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={12} 
          size={1}
        />
        {children && (
          <Panel position="top-right" className="bg-white p-2 rounded shadow-md">
            {children}
          </Panel>
        )}
      </ReactFlow>
      
      {/* Confirmation Modal for Edge Deletion */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        title="Delete Connection"
        message="Are you sure you want to delete this connection?"
        confirmText="Delete"
        onConfirm={handleDeleteEdge}
        onClose={handleCancelDelete}
      />
    </div>
  );
};

export default FlowDiagram; 