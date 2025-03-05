'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { ReactFlowInstance, Edge, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import { Job } from '@/types/merge';
import { Toaster } from '@/components/Toasts/toaster';
import { toast } from '@/components/Toasts/use-toast';
import JobInfoPanel from '@/components/FlowDiagram/JobInfoPanel';
import NodeFormModal from '@/components/FlowDiagram/NodeFormModal';
import ControlPanel from '@/components/FlowDiagram/ControlPanel';
import ConfirmationModal from '@/components/FlowDiagram/ConfirmationModal';
import FlowDiagram from '@/components/FlowDiagram';
import { useFlowOperations } from '@/components/FlowDiagram/hooks/useFlowOperations';
import { Button } from '@/components/ui/button';

// Main component
const JobPromptPage = () => {
  const params = useParams();
  const jobId = params.id as string;
  
  // State for node form
  const [nodeFormOpen, setNodeFormOpen] = useState(false);
  const [nodeFormData, setNodeFormData] = useState({
    label: '',
    content: '',
    criteria: '',
    type: 'question'
  });
  
  // State for job data
  const [job, setJob] = useState<Job | null>(null);
  const [editingNode, setEditingNode] = useState<any>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState<string | null>(null);
  const [showDefaultGraphModal, setShowDefaultGraphModal] = useState(false);
  
  // Use our custom hook for flow operations
  const {
    nodes,
    edges,
    loading,
    error,
    onNodesChange,
    onEdgesChange,
    onConnect,
    fetchJobData,
    addNode,
    deleteNode: deleteNodeFromFlow,
    updateNode,
    layoutFlow,
    saveFlow,
    useDefaultFlow: resetToDefaultFlow // Renamed to avoid hook confusion
  } = useFlowOperations({ jobId });

  // Load job and flow data on mount
  useEffect(() => {
    fetchJobData();
    console.log('job', job);
  }, [fetchJobData]);

  // Handle node click
  const onNodeClick = useCallback((event: any, node: any) => {
    event.preventDefault();
    event.stopPropagation();
    
    setNodeFormData({
      label: node.data.label,
      content: node.data.content,
      criteria: node.data.criteria || '',
      type: node.type
    });
    
    setEditingNode(node);
    setNodeFormOpen(true);
  }, []);

  // Calculate the number of connections for a node
  const getNodeConnectionCount = useCallback((nodeId: string) => {
    return edges.filter(edge => edge.source === nodeId || edge.target === nodeId).length;
  }, [edges]);

  // Handle adding a new node
  const handleAddNode = useCallback((type: string) => {
    addNode(type);
  }, [addNode]);

  // Handle node form submission
  const handleNodeFormSubmit = () => {
    if (editingNode) {
      // Editing existing node
      updateNode(editingNode.id, {
        ...nodeFormData
      });
    }
    
    setNodeFormOpen(false);
    setEditingNode(null);
  };

  // Confirm node deletion
  const confirmDeleteNode = useCallback((nodeId: string) => {
    setNodeToDelete(nodeId);
    setNodeFormOpen(false);
    setShowDeleteModal(true);
  }, []);

  // Delete node after confirmation
  const deleteNode = () => {
    if (nodeToDelete) {
      deleteNodeFromFlow(nodeToDelete);
      setNodeToDelete(null);
      setShowDeleteModal(false);
    }
  };

  // Handle panel click (deselect node)
  const onPaneClick = useCallback(() => {
    setEditingNode(null);
  }, []);

  // Handle edge deletion
  const handleDeleteEdge = useCallback((edge: Edge) => {
    const updatedEdges = edges.filter(e => e.id !== edge.id);
    onEdgesChange([{ type: 'remove', id: edge.id }]);
    toast({
      title: "Connection removed",
      description: "The connection was successfully removed from the flow",
    });
  }, [edges, onEdgesChange]);
  
  // Handle reset flow confirmation
  const handleResetFlow = useCallback(() => {
    resetToDefaultFlow(); // Using the renamed function
    setShowDefaultGraphModal(false);
  }, [resetToDefaultFlow]);

  return (
    <ReactFlowProvider>
      <div className="flow-editor h-screen flex flex-col">
        {/* Toaster for notifications */}
        <Toaster />
        
        {/* Job Info Panel */}
        <JobInfoPanel job={job} />
        
        {/* Main Flow Editor */}
        <div className="flex-grow h-full">
          <FlowDiagram
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onInit={setReactFlowInstance}
            onDeleteEdge={handleDeleteEdge}
          >
            {/* Flow Actions */}
            <div className="flex gap-2 mb-2">
              <Button 
                className="btn btn-sm btn-outline"
                onClick={layoutFlow}
              >
                Auto Layout
              </Button>
              <Button 
                className="btn btn-sm btn-primary"
                onClick={saveFlow}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Flow'}
              </Button>
            </div>
          </FlowDiagram>
        </div>
        
        {/* Control Panel */}
        <ControlPanel 
          onAddNode={handleAddNode} 
          onAutoLayout={layoutFlow} 
          onSaveFlow={saveFlow} 
          onResetFlow={() => setShowDefaultGraphModal(true)}
          loading={loading}
        />
        
        {/* Node Form Modal */}
        <NodeFormModal
          isOpen={nodeFormOpen}
          onClose={() => setNodeFormOpen(false)}
          formData={nodeFormData}
          setFormData={setNodeFormData}
          onSubmit={handleNodeFormSubmit}
          onDelete={editingNode ? () => confirmDeleteNode(editingNode.id) : undefined}
          isEditing={!!editingNode}
          connectionCount={editingNode ? getNodeConnectionCount(editingNode.id) : 0}
        />
        
        {/* Confirmation Modal for Node Deletion */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          title="Delete Node"
          message="Are you sure you want to delete this node? This action cannot be undone."
          onConfirm={deleteNode}
          onClose={() => setShowDeleteModal(false)}
        />
        
        {/* Confirmation Modal for Reset to Default */}
        <ConfirmationModal
          isOpen={showDefaultGraphModal}
          title="Reset Flow"
          message="Are you sure you want to reset to the default flow? All your changes will be lost."
          onConfirm={handleResetFlow}
          onClose={() => setShowDefaultGraphModal(false)}
        />
        
        {/* Error Display */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        )}
      </div>
    </ReactFlowProvider>
  );
};

export default JobPromptPage;
