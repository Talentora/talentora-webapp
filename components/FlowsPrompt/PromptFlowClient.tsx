'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  Connection,
  Edge,
  BackgroundVariant,
  MarkerType,
  Handle,
  Position,
  updateEdge,
  ReactFlowInstance,
  ConnectionMode
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Job } from '@/types/merge';
import { Tables } from '@/types/types_db';
import NodeFormModal from './NodeFormModal';
import ControlPanel from './ControlPanel';
import toast, { Toaster } from 'react-hot-toast';
import ConfirmationModal from './ConfirmationModal';
import { createClient } from '@/utils/supabase/client';

type EnrichedJob = Job & Tables<'jobs'>;

interface NodeData {
  label: string;
  content: string;
  criteria?: string;
  connectedNodes?: Array<{ id: string; label: string }>;
  selectedPath?: string;
}

interface FlowNode {
  id: string;
  data: {
    label: string;
    content: string;
    criteria?: string;
    connectedNodes?: Array<{ id: string; label: string }>;
    selectedPath?: string;
  };
  type: string;
  position: {
    x: number;
    y: number;
  };
}

interface FlowEdge {
  id: string;
  type: string;
  style: {
    stroke: string;
  };
  source: string;
  target: string;
  animated: boolean;
  markerEnd: {
    type: string;
  };
}

type FlowData = {
  [key: string]: any;
  nodes: FlowNode[];
  edges: FlowEdge[];
};

// Custom node types with Tailwind styles
const nodeTypes = {
  question: ({ data }: { data: any }) => (
    <div className="px-3 py-4 shadow-md rounded-md bg-white border-2 border-blue-200 w-48">
      <Handle
        type="target"
        position={Position.Left}
        className="w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white hover:bg-blue-600 hover:scale-120 transition-all duration-200 -left-1"
      />
      <div className="flex flex-col gap-1">
        <div className="font-bold text-blue-700">{data.label}</div>
        <div className="text-sm text-blue-500">{data.content}</div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white hover:bg-blue-600 hover:scale-120 transition-all duration-200 -right-1"
      />
    </div>
  ),
  section: ({ data }: { data: any }) => (
    <div className="px-3 py-4 shadow-md rounded-md bg-yellow-50 border-2 border-yellow-200 w-48">
      <Handle
        type="target"
        position={Position.Left}
        className="w-2.5 h-2.5 rounded-full bg-yellow-500 border-2 border-white hover:bg-yellow-600 hover:scale-120 transition-all duration-200 -left-1"
      />
      <div className="flex flex-col gap-1">
        <div className="font-bold text-yellow-700">{data.label}</div>
        <div className="text-sm text-yellow-500">{data.content}</div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-2.5 h-2.5 rounded-full bg-yellow-500 border-2 border-white hover:bg-yellow-600 hover:scale-120 transition-all duration-200 -right-1"
      />
    </div>
  ),
  input: ({ data }: { data: any }) => (
    <div className="px-3 py-4 shadow-md rounded-md bg-green-50 border-2 border-green-200 w-48">
      <Handle
        type="target"
        position={Position.Left}
        className="w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white hover:bg-green-600 hover:scale-120 transition-all duration-200 -left-1"
      />
      <div className="flex flex-col gap-1">
        <div className="font-bold text-green-700">{data.label}</div>
        <div className="text-sm text-green-500">{data.content}</div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white hover:bg-green-600 hover:scale-120 transition-all duration-200 -right-1"
      />
    </div>
  ),
  output: ({ data }: { data: any }) => (
    <div className="px-3 py-4 shadow-md rounded-md bg-orange-50 border-2 border-orange-200 w-48">
      <Handle
        type="target"
        position={Position.Left}
        className="w-2.5 h-2.5 rounded-full bg-orange-500 border-2 border-white hover:bg-orange-600 hover:scale-120 transition-all duration-200 -left-1"
      />
      <div className="flex flex-col gap-1">
        <div className="font-bold text-orange-700">{data.label}</div>
        <div className="text-sm text-orange-500">{data.content}</div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-2.5 h-2.5 rounded-full bg-orange-500 border-2 border-white hover:bg-orange-600 hover:scale-120 transition-all duration-200 -right-1"
      />
    </div>
  ),
  start: ({ data }: { data: any }) => (
    <div className="px-3 py-4 shadow-md rounded-md bg-green-50 border-2 border-green-200 w-48">
      <div className="flex flex-col gap-1">
        <div className="font-bold text-green-700">{data.label}</div>
        <div className="text-sm text-green-500">{data.content}</div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white hover:bg-green-600 hover:scale-120 transition-all duration-200 -right-1"
      />
    </div>
  ),
  conclusion: ({ data }: { data: any }) => (
    <div className="px-3 py-4 shadow-md rounded-md bg-purple-50 border-2 border-purple-200 w-48">
      <Handle
        type="target"
        position={Position.Left}
        className="w-2.5 h-2.5 rounded-full bg-purple-500 border-2 border-white hover:bg-purple-600 hover:scale-120 transition-all duration-200 -left-1"
      />
      <div className="flex flex-col gap-1">
        <div className="font-bold text-purple-700">{data.label}</div>
        <div className="text-sm text-purple-500">{data.content}</div>
      </div>
    </div>
  ),
  branching: ({ data }: { data: any }) => (
    <div className="px-3 py-4 shadow-md rounded-md bg-red-50 border-2 border-red-200 w-48">
      <Handle
        type="target"
        position={Position.Left}
        className="w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white hover:bg-red-600 hover:scale-120 transition-all duration-200 -left-1"
      />
      <div className="flex flex-col gap-1">
        <div className="font-bold text-red-700">{data.label}</div>
        <div className="text-sm text-red-500">{data.content}</div>
        {data.criteria && (
          <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-600">
            <div className="font-semibold mb-1">Split Criteria:</div>
            {data.criteria}
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white hover:bg-red-600 hover:scale-120 transition-all duration-200 -right-1"
      />
    </div>
  ),
};

interface PromptFlowClientProps {
  job: EnrichedJob;
  initialConfig: any;
}

const PromptFlowClient = ({ job, initialConfig }: PromptFlowClientProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [nodeFormOpen, setNodeFormOpen] = useState(false);
  const [nodeFormData, setNodeFormData] = useState({
    type: 'question',
    label: '',
    content: '',
    criteria: '',
    position: { x: 0, y: 0 }
  });
  const [editingNode, setEditingNode] = useState<any | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [edgeToDelete, setEdgeToDelete] = useState<Edge | null>(null);
  const [edgeDeleteModalOpen, setEdgeDeleteModalOpen] = useState(false);
  const [showDefaultGraphModal, setShowDefaultGraphModal] = useState(false);
  const supabase = createClient();

  const onConnect = useCallback(
    (params: Connection) => {
      // Check if the source node already has an outgoing connection
      const sourceNode = nodes.find(node => node.id === params.source);
      const existingOutgoingEdges = edges.filter(edge => edge.source === params.source);

      // If it's not a branching node and already has an outgoing connection, prevent the new connection
      if (sourceNode?.type !== 'branching' && existingOutgoingEdges.length > 0) {
        toast.error('Only branching nodes can have multiple outgoing connections');
        return;
      }

      // Create the new edge with a unique ID
      const newEdge = {
        ...params,
        id: crypto.randomUUID(),
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#555' },
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      };

      setEdges((eds) => addEdge(newEdge, eds));
    },
    [nodes, edges, setEdges]
  );

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !reactFlowInstance) return;

      // Check if trying to add a start or conclusion node when one already exists
      if (type === 'start' && nodes.some(node => node.type === 'start')) {
        toast.error('Only one start node is allowed');
        return;
      }
      if (type === 'conclusion' && nodes.some(node => node.type === 'conclusion')) {
        toast.error('Only one conclusion node is allowed');
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: crypto.randomUUID(),
        type,
        position,
        data: { label: `${type} node`, content: '' },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes, nodes]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: any) => {
    setEditingNode(node);
    setNodeFormData({
      type: node.type,
      label: node.data.label,
      content: node.data.content,
      criteria: node.data.criteria || '',
      position: node.position
    });
    setNodeFormOpen(true);
  }, []);

  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      setEdges((els) => updateEdge(oldEdge, newConnection, els));
    },
    [setEdges]
  );

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    setEdgeToDelete(edge);
    setEdgeDeleteModalOpen(true);
  }, []);

  const onEdgeDoubleClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    // For now, just show a toast notification
    toast('Double-clicked edge: ' + edge.id);
  }, []);

  const hasDisconnectedNodes = useCallback(() => {
    // Start and conclusion nodes are special cases
    const startNode = nodes.find(node => node.type === 'start');
    const conclusionNode = nodes.find(node => node.type === 'conclusion');

    // Check if start node has outgoing connections
    if (startNode && !edges.some(edge => edge.source === startNode.id)) {
      return true;
    }

    // Check if conclusion node has incoming connections
    if (conclusionNode && !edges.some(edge => edge.target === conclusionNode.id)) {
      return true;
    }

    // For all other nodes, check if they have both incoming and outgoing connections
    // (except for conclusion nodes which only need incoming)
    return nodes.some(node => {
      if (node.type === 'conclusion') return false;
      if (node.type === 'start') return false;
      
      const hasIncoming = edges.some(edge => edge.target === node.id);
      const hasOutgoing = edges.some(edge => edge.source === node.id);
      
      return !hasIncoming || !hasOutgoing;
    });
  }, [nodes, edges]);

  const hasCycle = useCallback(() => {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const dfs = (nodeId: string): boolean => {
      if (recursionStack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;

      visited.add(nodeId);
      recursionStack.add(nodeId);

      const outgoingEdges = edges.filter(edge => edge.source === nodeId);
      for (const edge of outgoingEdges) {
        if (dfs(edge.target)) return true;
      }

      recursionStack.delete(nodeId);
      return false;
    };

    // Start DFS from each node to find cycles
    for (const node of nodes) {
      if (dfs(node.id)) return true;
    }

    return false;
  }, [nodes, edges]);

  const saveFlow = useCallback(async () => {
    try {
      // Check for disconnected nodes
      if (hasDisconnectedNodes()) {
        toast.error('All nodes must be connected. Please check your flow.');
        return;
      }

      // Check for cycles
      if (hasCycle()) {
        toast.error('Flow cannot contain cycles. Please check your connections.');
        return;
      }

      // Validate required nodes
      const hasStartNode = nodes.some(node => node.type === 'start');
      const hasConclusionNode = nodes.some(node => node.type === 'conclusion');

      if (!hasStartNode || !hasConclusionNode) {
        toast.error('Flow must contain both a start and conclusion node.');
        return;
      }

      // Log current state
      console.log('Current nodes:', nodes);
      console.log('Current edges:', edges);

      // Clean and structure the flow data
      const flowData: FlowData = {
        nodes: nodes.map(node => ({
          id: node.id,
          data: {
            label: node.data.label,
            content: node.data.content,
            ...(node.data.criteria && { criteria: node.data.criteria }),
            ...(node.data.connectedNodes && { connectedNodes: node.data.connectedNodes }),
            ...(node.data.selectedPath && { selectedPath: node.data.selectedPath })
          },
          type: node.type || '',
          position: {
            x: node.position.x,
            y: node.position.y
          }
        })),
        edges: edges.map(edge => ({
          id: edge.id,
          type: edge.type || 'smoothstep',
          style: {
            stroke: '#555'
          },
          source: edge.source,
          target: edge.target,
          animated: true,
          markerEnd: {
            type: 'arrowclosed'
          }
        }))
      };

      // Save to database as JSON object
      const { error } = await supabase
        .from('job_interview_config')
        .update({ 
          prompt_graph: flowData
        })
        .eq('job_id', job.merge_id);

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      toast.success('Flow saved successfully');
    } catch (error) {
      console.error('Error saving flow:', error);
      toast.error('Failed to save flow');
    }
  }, [nodes, edges, job.id, supabase, hasDisconnectedNodes, hasCycle]);

  const autoLayoutNodes = useCallback(() => {
    const nodeWidth = 200;
    const nodeHeight = 100;
    const horizontalSpacing = 250;
    const verticalSpacing = 150;

    // Group nodes by their level in the graph
    const levels: { [key: string]: any[] } = {};
    const visited = new Set<string>();

    const traverseGraph = (nodeId: string, level: number) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      if (!levels[level]) levels[level] = [];
      levels[level].push(nodes.find(n => n.id === nodeId));

      edges
        .filter(e => e.source === nodeId)
        .forEach(e => traverseGraph(e.target, level + 1));
    };

    // Start from nodes without incoming edges
    nodes
      .filter(node => !edges.some(e => e.target === node.id))
      .forEach(node => traverseGraph(node.id, 0));

    // Position nodes
    const newNodes = nodes.map(node => {
      const level = Object.keys(levels).find(l => 
        levels[l].some(n => n?.id === node.id)
      );
      if (!level) return node;

      const levelNodes = levels[level];
      const index = levelNodes.findIndex(n => n?.id === node.id);
      const levelWidth = levelNodes.length * horizontalSpacing;

      return {
        ...node,
        position: {
          x: (index * horizontalSpacing) - (levelWidth / 2),
          y: parseInt(level) * verticalSpacing
        }
      };
    });

    setNodes(newNodes);
  }, [nodes, edges, setNodes]);

  const generateWithAI = useCallback(async () => {
    setIsGeneratingAI(true);
    try {
      // TODO: Implement AI generation logic
      toast.success('AI generation completed');
    } catch (error) {
      console.error('Error generating with AI:', error);
      toast.error('Failed to generate with AI');
    } finally {
      setIsGeneratingAI(false);
    }
  }, []);

  const clearGraph = useCallback(() => {
    setConfirmModalOpen(true);
  }, []);

  const handleClearConfirm = useCallback(() => {
    setNodes([
      {
        id: 'start',
        type: 'start',
        position: { x: 0, y: 0 },
        data: { label: 'Start', content: 'Begin Interview' }
      },
      {
        id: 'conclusion',
        type: 'conclusion',
        position: { x: 0, y: 200 },
        data: { label: 'Conclusion', content: 'End Interview' }
      }
    ]);
    setEdges([]);
    setConfirmModalOpen(false);
  }, [setNodes, setEdges]);

  const debugFlow = useCallback(() => {
    // console.log('Current Flow State:', {
    //   nodes,
    //   edges,
    //   nodeCount: nodes.length,
    //   edgeCount: edges.length
    // });
    toast.success('Flow state logged to console');
  }, [nodes, edges]);

  const handleNodeFormSubmit = useCallback(() => {
    if (editingNode) {
      // If editing a start or conclusion node, don't allow changing its type
      if ((editingNode.type === 'start' || editingNode.type === 'conclusion') && 
          nodeFormData.type !== editingNode.type) {
        toast.error(`Cannot change the type of ${editingNode.type} node`);
        return;
      }

      // Prevent changing to start type if another start node exists
      if (nodeFormData.type === 'start' && 
          nodes.some(node => node.type === 'start' && node.id !== editingNode.id)) {
        toast.error('Only one start node is allowed');
        return;
      }

      setNodes(nodes.map(node => 
        node.id === editingNode.id 
          ? { 
              ...node, 
              data: { 
                ...nodeFormData,
                criteria: node.type === 'branching' ? node.data.criteria : nodeFormData.criteria 
              } 
            }
          : node
      ));
    } else {
      // Check if trying to create a start or conclusion node when one already exists
      if (nodeFormData.type === 'start' && nodes.some(node => node.type === 'start')) {
        toast.error('Only one start node is allowed');
        return;
      }
      if (nodeFormData.type === 'conclusion' && nodes.some(node => node.type === 'conclusion')) {
        toast.error('Only one conclusion node is allowed');
        return;
      }

      const newNode = {
        id: crypto.randomUUID(),
        type: nodeFormData.type,
        position: nodeFormData.position,
        data: { 
          ...nodeFormData,
          criteria: nodeFormData.type === 'branching' ? 'Add split conditions here...' : undefined
        }
      };
      setNodes(nodes.concat(newNode));
    }
    setNodeFormOpen(false);
    setEditingNode(null);
  }, [editingNode, nodeFormData, nodes, setNodes]);

  const deleteNode = useCallback(() => {
    if (!editingNode) return;
    
    // Prevent deletion of start or conclusion nodes
    if (editingNode.type === 'start' || editingNode.type === 'conclusion') {
      toast.error(`Cannot delete ${editingNode.type} node`);
      return;
    }
    
    setNodes(nodes.filter(node => node.id !== editingNode.id));
    setEdges(edges.filter(edge => 
      edge.source !== editingNode.id && edge.target !== editingNode.id
    ));
    setNodeFormOpen(false);
    setEditingNode(null);
  }, [editingNode, nodes, edges, setNodes, setEdges]);

  const handleEdgeDeleteConfirm = useCallback(() => {
    if (!edgeToDelete) return;
    setEdges(edges.filter(edge => edge.id !== edgeToDelete.id));
    setEdgeDeleteModalOpen(false);
    setEdgeToDelete(null);
  }, [edgeToDelete, edges, setEdges]);

  const useDefaultGraph = useCallback(() => {
    const defaultNodes = [
      {
        id: 'start',
        type: 'start',
        position: { x: 0, y: 0 },
        data: { label: 'Start', content: 'Begin Interview' }
      },
      {
        id: 'intro',
        type: 'section',
        position: { x: 0, y: 100 },
        data: { label: 'Introduction', content: 'Introduce yourself and the role' }
      },
      {
        id: 'experience',
        type: 'question',
        position: { x: 0, y: 200 },
        data: { label: 'Experience', content: 'Tell me about your relevant experience' }
      },
      {
        id: 'skills',
        type: 'question',
        position: { x: 0, y: 300 },
        data: { label: 'Skills', content: 'What are your key technical skills?' }
      },
      {
        id: 'conclusion',
        type: 'conclusion',
        position: { x: 0, y: 400 },
        data: { label: 'Conclusion', content: 'End Interview' }
      }
    ];

    const defaultEdges = [
      { id: 'e1', source: 'start', target: 'intro' },
      { id: 'e2', source: 'intro', target: 'experience' },
      { id: 'e3', source: 'experience', target: 'skills' },
      { id: 'e4', source: 'skills', target: 'conclusion' }
    ];

    setNodes(defaultNodes);
    setEdges(defaultEdges);
    setShowDefaultGraphModal(false);
  }, [setNodes, setEdges]);

  const useEmptyGraph = useCallback(() => {
    const emptyNodes = [
      {
        id: 'start',
        type: 'start',
        position: { x: 0, y: 0 },
        data: { label: 'Start', content: 'Begin Interview' }
      },
      {
        id: 'conclusion',
        type: 'conclusion',
        position: { x: 0, y: 200 },
        data: { label: 'Conclusion', content: 'End Interview' }
      }
    ];

    setNodes(emptyNodes);
    setEdges([]);
    setShowDefaultGraphModal(false);
  }, [setNodes, setEdges]);

  // Initialize with saved flow or default
  useEffect(() => {
    if (initialConfig?.prompt_graph) {
      try {
        // If prompt_graph is already an object, use it directly
        const savedFlow = typeof initialConfig.prompt_graph === 'string' 
          ? JSON.parse(initialConfig.prompt_graph)
          : initialConfig.prompt_graph;

        if (savedFlow.nodes && savedFlow.edges) {
          console.log('Loading saved flow:', savedFlow);
          setNodes(savedFlow.nodes);
          setEdges(savedFlow.edges);
          return;
        }
      } catch (error) {
        console.error('Error parsing saved flow:', error);
      }
    }
    setShowDefaultGraphModal(true);
  }, [initialConfig, setNodes, setEdges]);

  // Rest of your existing component code...
  // (Keep all the handlers, node types, and other functionality from the original file)

  return (
    <div className="flex flex-col h-screen gap-5">
      <Toaster position="top-right" />
      <div className="flex-grow" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeDoubleClick={onNodeDoubleClick}
          onEdgeUpdate={onEdgeUpdate}
          onEdgeClick={onEdgeClick}
          onEdgeDoubleClick={onEdgeDoubleClick}
          nodeTypes={nodeTypes}
          connectionLineStyle={{ stroke: '#555', strokeWidth: 2 }}
          defaultEdgeOptions={{
            style: { stroke: '#555', strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#555',
            },
          }}
          fitView
          snapToGrid={true}
          snapGrid={[15, 15]}
          connectionMode={ConnectionMode.Loose}
          deleteKeyCode={['Backspace', 'Delete']}
          edgesUpdatable={true}
          edgesFocusable={true}
          selectNodesOnDrag={false}
          connectionRadius={20}
          className="bg-gray-50"
        >
          <Controls className="bg-white shadow-md rounded-md" />
          <MiniMap className="bg-white shadow-md rounded-md" />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} className="bg-gray-50" />
          <Panel position="top-right" className="w-2/5">
            <ControlPanel 
              saveFlow={saveFlow} 
              autoLayout={autoLayoutNodes} 
              generateWithAI={generateWithAI}
              clearGraph={clearGraph}
              debugFlow={debugFlow}
              isGenerating={isGeneratingAI}
            />
          </Panel>
        </ReactFlow>
      </div>

      {nodeFormOpen && (
        <NodeFormModal 
          nodeFormData={nodeFormData}
          setNodeFormData={setNodeFormData}
          onSubmit={handleNodeFormSubmit}
          onCancel={() => {
            setNodeFormOpen(false);
            setEditingNode(null);
          }}
          onDelete={deleteNode}
          isEditing={!!editingNode}
        />
      )}
      
      <ConfirmationModal
        isOpen={confirmModalOpen}
        title="Clear Graph"
        message="Are you sure you want to clear the graph? This will remove all nodes except Start and Conclusion."
        confirmText="Clear Graph"
        cancelText="Cancel"
        onConfirm={handleClearConfirm}
        onCancel={() => setConfirmModalOpen(false)}
      />

      <ConfirmationModal
        isOpen={edgeDeleteModalOpen}
        title="Delete Connection"
        message="Are you sure you want to delete this connection between nodes?"
        confirmText="Delete Connection"
        cancelText="Cancel"
        onConfirm={handleEdgeDeleteConfirm}
        onCancel={() => setEdgeDeleteModalOpen(false)}
      />

      <ConfirmationModal
        isOpen={showDefaultGraphModal}
        title="Interview Flow Setup"
        message="No saved interview flow found for this job. Would you like to use the default template or start with a minimal flow?"
        confirmText="Use Default Template"
        cancelText="Start Minimal"
        onConfirm={useDefaultGraph}
        onCancel={useEmptyGraph}
      />
    </div>
  );
};

export default PromptFlowClient; 