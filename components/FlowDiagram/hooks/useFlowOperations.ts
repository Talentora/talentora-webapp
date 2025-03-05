import { useCallback, useState } from 'react';
import { Node, Edge, Connection, addEdge, useNodesState, useEdgesState, MarkerType } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/Toasts/use-toast';
import { validateFlow } from '../utils/flowValidation';
import { layoutGraph } from '../utils/graphLayout';
import { createClient } from '@/utils/supabase/client';
import { initialNodes, initialEdges } from '../constants/initialFlow';
import { Job } from '@/types/merge';

// Type for the prompt graph in the database
interface PromptGraph {
  nodes: Node[];
  edges: Edge[];
}

// Extended type for job_interview_config that includes prompt_graph
interface JobInterviewConfig {
  bot_id: number | null;
  company_context: string | null;
  created_at: string;
  duration: number | null;
  hiring_manager_notes: string | null;
  interview_name: string | null;
  interview_questions: any;
  job_id: string;
  min_qual: any[] | null;
  preferred_qual: any[] | null;
  type: string | null;
  prompt_graph?: PromptGraph;
}

interface UseFlowOperationsProps {
  jobId: string;
}

// Node dimensions for layout
const NODE_WIDTH = 200;
const NODE_HEIGHT = 80;

export function useFlowOperations({ jobId }: UseFlowOperationsProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Load flow data
  const fetchJobData = useCallback(async () => {
    if (!jobId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('job_interview_config')
        .select('*')
        .eq('job_id', jobId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching job data:', fetchError);
        setError('Error loading job data');
        return;
      }
      
      // Cast data to our extended type
      const jobConfig = data as JobInterviewConfig;
      
      // Check if data exists and has valid nodes and edges
      if (jobConfig?.prompt_graph && 
          jobConfig.prompt_graph.nodes && 
          Array.isArray(jobConfig.prompt_graph.nodes) && 
          jobConfig.prompt_graph.nodes.length > 0 &&
          jobConfig.prompt_graph.edges && 
          Array.isArray(jobConfig.prompt_graph.edges)) {
        
        console.log('Loaded saved flow:', jobConfig.prompt_graph);
        setNodes(jobConfig.prompt_graph.nodes);
        setEdges(jobConfig.prompt_graph.edges);
        toast({
          title: "Success",
          description: "Saved flow loaded successfully",
        });
      } else {
        // If prompt_graph is missing, empty, or invalid
        setNodes(initialNodes);
        setEdges(initialEdges);
        toast({
          title: "Information",
          description: "Using default interview flow (no saved flow found)",
        });
      }
    } catch (err) {
      console.error('Error in fetchJobData:', err);
      setError('Error loading job data');
    } finally {
      setLoading(false);
    }
  }, [jobId, supabase, setNodes, setEdges]);

  // Add a new node
  const addNode = useCallback((
    nodeType: string, 
    data: any = { 
      label: `New ${nodeType} Node`, 
      content: 'Enter your content here...',
      ...(nodeType === 'question' ? { criteria: 'Evaluation criteria...' } : {})
    }, 
    position: { x: number, y: number } = { 
      x: Math.random() * 300 + 50, 
      y: Math.random() * 300 + 50 
    }
  ) => {
    const id = uuidv4();
    const newNode = {
      id,
      type: nodeType,
      position,
      data
    };
    
    setNodes((nds) => nds.concat(newNode as Node));
    return id;
  }, [setNodes]);

  // Delete a node
  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    ));
  }, [setNodes, setEdges]);

  // Update a node
  const updateNode = useCallback((nodeId: string, data: any) => {
    setNodes((nds) => 
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...data
            }
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  // Add edge between nodes
  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge({
      ...connection,
      type: 'step',
      markerEnd: { type: MarkerType.ArrowClosed }
    }, eds));
  }, [setEdges]);

  // Apply automatic layout to the flow
  const layoutFlow = useCallback(() => {
    // Apply layout logic from the utility
    const result = layoutGraph(nodes, edges, {
      startX: 100,
      centerY: 150,
      sectionSpacingX: 400,
      questionSpacingY: 200,
    });

    setNodes(result.nodes);
    setEdges(result.edges);
    
    // No longer using fitView since it requires ReactFlow context
    // Instead, we'll just apply the layout and show a toast
    setTimeout(() => {
      toast({
        title: "Layout Applied",
        description: "Questions are now stacked vertically within each section with optimized connections.",
      });
    }, 100);
  }, [nodes, edges, setNodes, setEdges]);

  // Save the flow to the database
  const saveFlow = useCallback(async () => {
    if (!jobId) {
      toast({
        title: "Error",
        description: "No job ID available",
        variant: "destructive",
      });
      return;
    }
    
    // Validate the flow before saving
    const validationResult = validateFlow(nodes, edges);
    if (!validationResult.valid) {
      toast({
        title: "Validation Error",
        description: `Invalid flow: ${validationResult.message}`,
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const flowData: PromptGraph = {
        nodes,
        edges
      };
      
      const { error: updateError } = await supabase
        .from('job_interview_config')
        .update({
          prompt_graph: flowData,
        } as any) // Use type assertion for now
        .eq('job_id', jobId);
      
      if (updateError) {
        console.error('Error updating job flow:', updateError);
        toast({
          title: "Error",
          description: "Error saving flow",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Success",
        description: "Flow saved successfully",
      });
    } catch (err) {
      console.error('Error in saveFlow:', err);
      toast({
        title: "Error",
        description: "Error saving flow",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [jobId, supabase, nodes, edges]);

  // Reset to default flow
  const useDefaultFlow = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    toast({
      title: "Success",
      description: "Default interview flow loaded",
    });
  }, [setNodes, setEdges]);

  return {
    nodes,
    edges,
    loading,
    error,
    onNodesChange,
    onEdgesChange,
    onConnect,
    fetchJobData,
    addNode,
    deleteNode,
    updateNode,
    layoutFlow,
    saveFlow,
    useDefaultFlow
  };
}

export default useFlowOperations; 