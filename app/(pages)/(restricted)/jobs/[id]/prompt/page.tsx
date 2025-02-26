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
  updateEdge
} from 'reactflow';
import 'reactflow/dist/style.css';
import './styles.css';
import { useParams } from 'next/navigation';
import { Job } from '@/types/merge';
import JobInfoPanel from './components/JobInfoPanel';
import NodeFormModal from './components/NodeFormModal';
import ControlPanel from './components/ControlPanel';
import toast, { Toaster } from 'react-hot-toast';
import ConfirmationModal from './components/ConfirmationModal';

const initialNodes = [
  {
    id: 'start',
    type: 'input',
    data: { 
      label: 'Interview Start',
      content: 'Welcome the candidate and introduce yourself. Explain the interview process and set expectations.'
    },
    position: { x: 50, y: 150 },
  },
  {
    id: 'intro',
    type: 'section',
    data: { 
      label: 'Background Section',
      content: 'This section covers the candidate\'s background and experience.'
    },
    position: { x: 400, y: 150 },
  },
  {
    id: 'question1',
    type: 'question',
    data: { 
      label: 'Experience Question',
      content: 'Tell me about your most recent role and your key responsibilities.',
      criteria: 'Look for relevant experience and clear communication.'
    },
    position: { x: 750, y: 50 },
  },
  {
    id: 'question2',
    type: 'question',
    data: { 
      label: 'Challenge Question',
      content: 'Describe a challenging situation you faced in your previous role and how you resolved it.',
      criteria: 'Assess problem-solving skills and resilience.'
    },
    position: { x: 750, y: 250 },
  },
  {
    id: 'technical',
    type: 'section',
    data: { 
      label: 'Technical Skills',
      content: 'This section evaluates the candidate\'s technical knowledge and skills.'
    },
    position: { x: 1100, y: 150 },
  },
  {
    id: 'question3',
    type: 'question',
    data: { 
      label: 'Technical Question 1',
      content: 'Explain how you would design a scalable system for handling high traffic loads.',
      criteria: 'Evaluate system design knowledge and scalability concepts.'
    },
    position: { x: 1450, y: 0 },
  },
  {
    id: 'question4',
    type: 'question',
    data: { 
      label: 'Technical Question 2',
      content: "Describe your experience with CI/CD pipelines and how you've implemented them.",
      criteria: 'Check for DevOps knowledge and automation experience.'
    },
    position: { x: 1450, y: 150 },
  },
  {
    id: 'question5',
    type: 'question',
    data: { 
      label: 'Technical Question 3',
      content: 'How do you ensure code quality in your projects?',
      criteria: 'Look for testing strategies, code reviews, and quality assurance practices.'
    },
    position: { x: 1450, y: 300 },
  },
  {
    id: 'cultural',
    type: 'section',
    data: { 
      label: 'Cultural Fit',
      content: 'This section assesses how well the candidate aligns with company values and culture.'
    },
    position: { x: 1800, y: 150 },
  },
  {
    id: 'question6',
    type: 'question',
    data: { 
      label: 'Teamwork Question',
      content: 'How do you approach collaborating with team members who have different working styles?',
      criteria: 'Assess adaptability, empathy, and collaboration skills.'
    },
    position: { x: 2150, y: 50 },
  },
  {
    id: 'question7',
    type: 'question',
    data: { 
      label: 'Growth Question',
      content: 'Where do you see yourself professionally in 3-5 years?',
      criteria: 'Evaluate ambition, career planning, and alignment with company growth.'
    },
    position: { x: 2150, y: 250 },
  },
  {
    id: 'conclusion',
    type: 'conclusion',
    data: { 
      label: 'Interview Conclusion',
      content: 'Thank the candidate for their time. Ask if they have any questions about the role or company. Explain next steps in the hiring process.'
    },
    position: { x: 2500, y: 150 },
  }
];

const initialEdges: Edge[] = [
  {
    id: 'e-start-intro',
    source: 'start',
    target: 'intro',
    type: 'smoothstep'
  },
  {
    id: 'e-intro-question1',
    source: 'intro',
    target: 'question1',
    type: 'smoothstep'
  },
  {
    id: 'e-question1-question2',
    source: 'question1',
    target: 'question2',
    type: 'smoothstep'
  },
  {
    id: 'e-question2-technical',
    source: 'question2',
    target: 'technical',
    type: 'smoothstep'
  },
  {
    id: 'e-technical-question3',
    source: 'technical',
    target: 'question3',
    type: 'smoothstep'
  },
  {
    id: 'e-question3-question4',
    source: 'question3',
    target: 'question4',
    type: 'smoothstep'
  },
  {
    id: 'e-question4-question5',
    source: 'question4',
    target: 'question5',
    type: 'smoothstep'
  },
  {
    id: 'e-question5-cultural',
    source: 'question5',
    target: 'cultural',
    type: 'smoothstep'
  },
  {
    id: 'e-cultural-question6',
    source: 'cultural',
    target: 'question6',
    type: 'smoothstep'
  },
  {
    id: 'e-question6-question7',
    source: 'question6',
    target: 'question7',
    type: 'smoothstep'
  },
  {
    id: 'e-question7-conclusion',
    source: 'question7',
    target: 'conclusion',
    type: 'smoothstep'
  }
];

const nodeTypes = {
  question: ({ data, isConnectable }: { data: any, isConnectable: boolean }) => (
    <div className="relative bg-white p-4 border-2 border-blue-500 rounded-md shadow-md w-64">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
      />
      <div className="font-bold text-blue-700">{data.label}</div>
      <div className="text-sm mt-2">{data.content}</div>
      {data.criteria && (
        <div className="mt-2 text-xs bg-gray-100 p-2 rounded">
          <span className="font-semibold">Criteria:</span> {data.criteria}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
      />
    </div>
  ),
  section: ({ data, isConnectable }: { data: any, isConnectable: boolean }) => (
    <div className="relative bg-yellow-50 p-4 border-2 border-yellow-500 rounded-md shadow-md w-64">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-yellow-500"
      />
      <div className="font-bold text-yellow-700">{data.label}</div>
      <div className="text-sm mt-2">{data.content}</div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-yellow-500"
      />
    </div>
  ),
  input: ({ data, isConnectable }: { data: any, isConnectable: boolean }) => (
    <div className="relative bg-green-50 p-4 border-2 border-green-500 rounded-md shadow-md w-64">
      <div className="font-bold text-green-700">{data.label}</div>
      <div className="text-sm mt-2">{data.content}</div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-green-500"
      />
    </div>
  ),
  conclusion: ({ data, isConnectable }: { data: any, isConnectable: boolean }) => (
    <div className="relative bg-purple-50 p-4 border-2 border-purple-500 rounded-md shadow-md w-64">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-500"
      />
      <div className="font-bold text-purple-700">{data.label}</div>
      <div className="text-sm mt-2">{data.content}</div>
    </div>
  ),
};

// Add a function to validate the flow
const validateFlow = (nodes: any[], edges: Edge[]): { valid: boolean; message: string } => {
  // Check if there are any nodes
  if (nodes.length === 0) {
    return { valid: false, message: 'No nodes in the flow. Please add some nodes.' };
  }

  // Check if there's a start node
  const startNode = nodes.find(node => node.type === 'input');
  if (!startNode) {
    return { valid: false, message: 'Missing start node. Please add a start node.' };
  }

  // Check if there's a conclusion node
  const conclusionNode = nodes.find(node => node.type === 'conclusion');
  if (!conclusionNode) {
    return { valid: false, message: 'Missing conclusion node. Please add a conclusion node.' };
  }

  // Build a graph representation for traversal
  const graph: Record<string, string[]> = {};
  nodes.forEach(node => {
    graph[node.id] = [];
  });
  
  edges.forEach(edge => {
    if (graph[edge.source]) {
      graph[edge.source].push(edge.target);
    }
  });

  // Check if all nodes are reachable from start
  const visited = new Set<string>();
  const queue = [startNode.id];
  
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    visited.add(nodeId);
    
    const neighbors = graph[nodeId] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
      }
    }
  }

  // Check if all nodes are visited
  if (visited.size !== nodes.length) {
    return { 
      valid: false, 
      message: 'Some nodes are not connected to the flow. Please ensure all nodes are connected.' 
    };
  }

  // Check if conclusion is reachable from start
  if (!visited.has(conclusionNode.id)) {
    return { 
      valid: false, 
      message: 'Conclusion node is not reachable from start. Please connect it to the flow.' 
    };
  }

  // Check if there are any cycles in the graph
  const checkCycle = (nodeId: string, path = new Set<string>()): boolean => {
    if (path.has(nodeId)) return true;
    
    path.add(nodeId);
    const neighbors = graph[nodeId] || [];
    
    for (const neighbor of neighbors) {
      if (checkCycle(neighbor, new Set(path))) {
        return true;
      }
    }
    
    return false;
  };

  if (checkCycle(startNode.id)) {
    return { 
      valid: false, 
      message: 'The flow contains cycles. Please ensure the flow is linear.' 
    };
  }

  // Check if there's a direct connection from start to conclusion
  const directStartToConclusionEdge = edges.find(edge => {
    const sourceNode = nodes.find(node => node.id === edge.source);
    const targetNode = nodes.find(node => node.id === edge.target);
    return sourceNode?.type === 'input' && targetNode?.type === 'conclusion';
  });

  if (directStartToConclusionEdge) {
    return { 
      valid: false, 
      message: 'Start node cannot connect directly to Conclusion. Please add at least one question or section in between.' 
    };
  }

  return { valid: true, message: 'Flow is valid!' };
};

export default function JobPromptPage() {
  const params = useParams();
  const jobId = params.id as string;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [nodeFormOpen, setNodeFormOpen] = useState(false);
  const [nodeFormData, setNodeFormData] = useState({
    type: 'question',
    label: '',
    content: '',
    criteria: '',
    position: { x: 0, y: 0 }
  });

  // Add a state to track the node being edited
  const [editingNode, setEditingNode] = useState<any | null>(null);

  // Add a state for tracking AI generation
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Add state for confirmation modal
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  // Fetch job data
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/jobs/${jobId}`, {
          next: { revalidate: 3600 } // Cache for 1 hour (3600 seconds)
        });
        if (!response.ok) {
          throw new Error('Failed to fetch job');
        }
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const onConnect = useCallback((params: Connection) => {
    // Check if this is a direct connection from start to conclusion
    const isStartNode = nodes.find(node => node.id === params.source)?.type === 'input';
    const isConclusionNode = nodes.find(node => node.id === params.target)?.type === 'conclusion';
    
    if (isStartNode && isConclusionNode) {
      toast.error('Cannot connect Start directly to Conclusion. Please add at least one question or section in between.');
      return;
    }
    
    // Check if the source node already has an outgoing connection
    const sourceHasOutgoing = edges.some(edge => edge.source === params.source);
    
    // Check if the target node already has an incoming connection
    const targetHasIncoming = edges.some(edge => edge.target === params.target);
    
    // Only allow the connection if neither condition is true
    if (!sourceHasOutgoing && !targetHasIncoming) {
      setEdges(eds => addEdge(params, eds));
    } else {
      // Optionally show a notification that the connection was not allowed
      toast.error('Nodes can only have one incoming and one outgoing connection');
    }
  }, [nodes, edges, setEdges]);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // Check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      
      setNodeFormData({
        ...nodeFormData,
        type,
        position
      });
      setNodeFormOpen(true);
    },
    [reactFlowInstance, nodeFormData]
  );

  // Handle node double-click
  const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: any) => {
    // Set the node data for editing
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

  // Update the handleNodeFormSubmit function to handle both new and edited nodes
  const handleNodeFormSubmit = () => {
    if (editingNode) {
      // Update existing node
      setNodes((nds) => 
        nds.map((node) => {
          if (node.id === editingNode.id) {
            return {
              ...node,
              data: {
                ...node.data,
                label: nodeFormData.label,
                content: nodeFormData.content,
                ...(node.type === 'question' ? { criteria: nodeFormData.criteria } : {})
              }
            };
          }
          return node;
        })
      );
      setEditingNode(null);
    } else {
      // Create new node (existing code)
    const newNode = {
      id: `node_${Date.now()}`,
      type: nodeFormData.type,
      position: nodeFormData.position,
      data: { 
        label: nodeFormData.label,
        content: nodeFormData.content,
          ...(nodeFormData.type === 'question' ? { criteria: nodeFormData.criteria } : {})
        }
    };

    setNodes((nds) => nds.concat(newNode));
    }
    
    setNodeFormOpen(false);
    setNodeFormData({
      type: 'question',
      label: '',
      content: '',
      criteria: '',
      position: { x: 0, y: 0 }
    });
  };

  // Add a function to delete the selected node
  const deleteNode = () => {
    if (editingNode) {
      // Remove the node
      setNodes((nds) => nds.filter((node) => node.id !== editingNode.id));
      
      // Remove any connected edges
      setEdges((eds) => 
        eds.filter(
          (edge) => edge.source !== editingNode.id && edge.target !== editingNode.id
        )
      );
      
      setEditingNode(null);
      setNodeFormOpen(false);
    }
  };

  const saveFlow = () => {
    if (!reactFlowInstance) return;
    
    const flow = reactFlowInstance.toObject();
    
    // Validate the flow before saving
    const validation = validateFlow(flow.nodes, flow.edges);
    
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }
    
    // Transform the flow into the desired JSON format
    const interviewConfig = {
      interview_flow: {
        nodes: flow.nodes.map((node: any) => ({
          id: node.id,
          type: node.type,
          data: node.data,
        })),
        edges: flow.edges.map((edge: any) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target
        }))
      }
    };
    
    // You can send this to your API or download it
    console.log(interviewConfig);
    
    // Optional: Download as JSON file
    const dataStr = JSON.stringify(interviewConfig, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `interview-config-${jobId}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Interview flow saved successfully!');
  };

  // Fix the edge connection issue by specifying connection line style
  const connectionLineStyle = { stroke: '#888', strokeWidth: 2 };
  
  // Define default edge options with markers
  const defaultEdgeOptions = {
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#555' },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: '#555',
    },
  };

  const autoLayoutNodes = useCallback(() => {
    if (!nodes.length) return;

    // Create a map to track node types and their connections
    const nodeMap = new Map();
    const sectionMap = new Map(); // To track which section each question belongs to
    const nodeTypes = new Map(); // To track node types
    
    // First, identify all nodes and their types
    nodes.forEach(node => {
      nodeMap.set(node.id, { node, children: [], parents: [] });
      nodeTypes.set(node.id, node.type);
    });
    
    // Build the connection graph
    edges.forEach(edge => {
      const sourceNode = nodeMap.get(edge.source);
      const targetNode = nodeMap.get(edge.target);
      
      if (sourceNode && targetNode) {
        sourceNode.children.push(targetNode.node.id);
        targetNode.parents.push(sourceNode.node.id);
        
        // If source is a section and target is a question, associate the question with the section
        if (nodeTypes.get(edge.source) === 'section' && nodeTypes.get(edge.target) === 'question') {
          sectionMap.set(edge.target, edge.source);
        }
      }
    });
    
    // Find the start node (input type)
    const startNode = nodes.find(node => node.type === 'input');
    if (!startNode) return;
    
    // Find the conclusion node
    const conclusionNode = nodes.find(node => node.type === 'conclusion');
    
    // Organize nodes into sections and questions
    const sections = nodes.filter(node => node.type === 'section');
    const questions = nodes.filter(node => node.type === 'question');
    
    // Create a map of sections to their questions
    const sectionQuestions = new Map();
    sections.forEach(section => {
      sectionQuestions.set(section.id, []);
    });
    
    // Assign questions to their sections
    questions.forEach(question => {
      const sectionId = sectionMap.get(question.id);
      if (sectionId && sectionQuestions.has(sectionId)) {
        sectionQuestions.get(sectionId).push(question.id);
      }
    });
    
    // Calculate positions
    const newNodes = [...nodes];
    const startX = 50;
    const sectionSpacingX = 400; // Horizontal spacing between sections
    const questionSpacingY = 150; // Vertical spacing between questions
    const centerY = 300; // Center Y position
    
    // Position the start node
    const startNodeIndex = newNodes.findIndex(node => node.id === startNode.id);
    if (startNodeIndex !== -1) {
      newNodes[startNodeIndex] = {
        ...newNodes[startNodeIndex],
        position: { x: startX, y: centerY }
      };
    }
    
    // Position sections horizontally
    let currentX = startX + sectionSpacingX;
    sections.forEach(section => {
      const sectionIndex = newNodes.findIndex(node => node.id === section.id);
      if (sectionIndex !== -1) {
        newNodes[sectionIndex] = {
          ...newNodes[sectionIndex],
          position: { x: currentX, y: centerY }
        };
        
        // Position questions for this section vertically
        const questionIds = sectionQuestions.get(section.id) || [];
        let questionY = centerY - ((questionIds.length - 1) * questionSpacingY / 2);
        
        questionIds.forEach(questionId => {
          const questionIndex = newNodes.findIndex(node => node.id === questionId);
          if (questionIndex !== -1) {
            newNodes[questionIndex] = {
              ...newNodes[questionIndex],
              position: { x: currentX + 200, y: questionY }
            };
            questionY += questionSpacingY;
          }
        });
        
        currentX += sectionSpacingX;
      }
    });
    
    // Position the conclusion node
    if (conclusionNode) {
      const conclusionIndex = newNodes.findIndex(node => node.id === conclusionNode.id);
      if (conclusionIndex !== -1) {
        newNodes[conclusionIndex] = {
          ...newNodes[conclusionIndex],
          position: { x: currentX, y: centerY }
        };
      }
    }
    
    // Handle any orphaned questions (not associated with a section)
    const orphanedQuestions = questions.filter(q => !sectionMap.has(q.id));
    let orphanY = centerY + 300;
    orphanedQuestions.forEach(question => {
      const questionIndex = newNodes.findIndex(node => node.id === question.id);
      if (questionIndex !== -1) {
        newNodes[questionIndex] = {
          ...newNodes[questionIndex],
          position: { x: startX + sectionSpacingX, y: orphanY }
        };
        orphanY += questionSpacingY;
      }
    });
    
    // Update the nodes state
    setNodes(newNodes);
    
    // After layout is applied, fit the view
    setTimeout(() => {
      if (reactFlowInstance) {
        reactFlowInstance.fitView({ padding: 0.2 });
      }
    }, 50);
  }, [nodes, edges, reactFlowInstance, setNodes]);

  // Add this function to handle edge removal
  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      // If the connection is being removed (target or source is null), don't update
      if (!newConnection.target || !newConnection.source) {
        return;
      }
      
      setEdges((els) => updateEdge(oldEdge, newConnection, els));
    },
    [setEdges]
  );

  // Add this function to handle edge click
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    // Confirm before deleting
    if (window.confirm('Are you sure you want to delete this connection?')) {
      setEdges((edges) => edges.filter((e) => e.id !== edge.id));
    }
  }, [setEdges]);

  // Update the generateWithAI function to properly process node types
  const generateWithAI = useCallback(async () => {
    if (!job || !job.description) {
      toast.error('Job description is required for AI generation');
      return;
    }

    setIsGeneratingAI(true);
    
    try {
      // Set a timeout to show an error if the API takes too long
      const timeoutId = setTimeout(() => {
        toast.error('Generation is taking longer than expected. Please try again later.');
        setIsGeneratingAI(false);
      }, 30000); // 30 seconds timeout
      
      // Call the API to generate the interview flow
      const response = await fetch('/api/generate-interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle: job.name,
          jobDescription: job.description,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate interview flow');
      }

      const data = await response.json();
      
      if (!data.nodes || !data.edges) {
        throw new Error('Invalid response from AI generation');
      }

      console.log('Received data from API:', data);

      // Process the nodes to ensure they have the correct format and types
      const processedNodes = data.nodes.map((node: any) => {
        // Ensure node has the correct type
        const nodeType = ['input', 'section', 'question', 'conclusion'].includes(node.type) 
          ? node.type 
          : node.type === 'start' ? 'input' : 'question';
        
        // Ensure node has position data
        const position = node.position || { x: 0, y: 0 };
        
        // Ensure node data has the required properties
        const nodeData = {
          label: node.data.label || 'Untitled Node',
          content: node.data.content || '',
          ...(nodeType === 'question' ? { criteria: node.data.criteria || 'No criteria specified' } : {})
        };
        
        return {
          id: node.id,
          type: nodeType,
          data: nodeData,
          position: position
        };
      });

      console.log('Processed nodes:', processedNodes);

      // Process the edges to ensure they have the correct format
      const processedEdges = data.edges.map((edge: any) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type || 'smoothstep'
      }));
      console.log("processedEdges", processedEdges)

      // Update the nodes and edges
      setNodes(processedNodes);
      setEdges(processedEdges);
      
    //   // Apply auto-layout to position the nodes
    //   setTimeout(() => {
    //     autoLayoutNodes();
    //     toast.success('Interview flow generated successfully!');
    //   }, 1000);
      
    } catch (error) {
      console.error('Error generating interview flow:', error);
      toast.error(`Failed to generate interview flow: ${error instanceof Error ? error.message : 'Please try again'}`);
    } finally {
      setIsGeneratingAI(false);
    }
  }, [job, autoLayoutNodes, setNodes, setEdges]);

  // Update the clearGraph function to use the modal
  const clearGraph = useCallback(() => {
    // Open the confirmation modal instead of using window.confirm
    setConfirmModalOpen(true);
  }, []);
  
  // Add a function to handle the actual clearing after confirmation
  const handleClearConfirm = useCallback(() => {
    // Find the start and conclusion nodes if they exist
    const startNode = nodes.find(node => node.type === 'input');
    const conclusionNode = nodes.find(node => node.type === 'conclusion');
    
    // Create new nodes array with start, a placeholder question, and conclusion
    const newNodes = [];
    
    // Add start node if it exists, or create a new one
    if (startNode) {
      newNodes.push({
        ...startNode,
        position: { x: 50, y: 150 }
      });
    } else {
      newNodes.push({
        id: 'start',
        type: 'input',
        data: { 
          label: 'Interview Start',
          content: 'Welcome the candidate and introduce yourself. Explain the interview process and set expectations.'
        },
        position: { x: 50, y: 150 },
      });
    }
    
    // Add a placeholder question node
    const placeholderId = `question_${Date.now()}`;
    newNodes.push({
      id: placeholderId,
      type: 'question',
      data: { 
        label: 'Interview Question',
        content: 'Add your interview question here.',
        criteria: 'Add evaluation criteria here.'
      },
      position: { x: 400, y: 150 },
    });
    
    // Add conclusion node if it exists, or create a new one
    if (conclusionNode) {
      newNodes.push({
        ...conclusionNode,
        position: { x: 750, y: 150 }
      });
    } else {
      newNodes.push({
        id: 'conclusion',
        type: 'conclusion',
        data: { 
          label: 'Interview Conclusion',
          content: 'Thank the candidate for their time. Ask if they have any questions about the role or company. Explain next steps in the hiring process.'
        },
        position: { x: 750, y: 150 },
      });
    }
    
    // Update the nodes state
    setNodes(newNodes);
    
    // Create edges to connect the nodes
    const newEdges = [
      {
        id: `e-start-${placeholderId}`,
        source: 'start',
        target: placeholderId,
        type: 'smoothstep'
      },
      {
        id: `e-${placeholderId}-conclusion`,
        source: placeholderId,
        target: 'conclusion',
        type: 'smoothstep'
      }
    ];
    
    // Update the edges state
    setEdges(newEdges);
    
    // Close the modal
    setConfirmModalOpen(false);
    
    toast.success('Graph cleared. A basic interview flow has been created.');
  }, [nodes, setNodes, setEdges]);

  // Add a debug function to help diagnose issues
  const debugFlow = useCallback(() => {
    console.log('Current nodes:', nodes);
    console.log('Current edges:', edges);
    
    // Check for common issues
    const nodeTypes = nodes.map(node => node.type);
    const missingTypes = nodes.filter(node => !node.type);
    const invalidTypes = nodes.filter(node => !['input', 'section', 'question', 'conclusion'].includes(node.type || ''));
    
    console.log('Node types:', nodeTypes);
    console.log('Nodes missing type:', missingTypes);
    console.log('Nodes with invalid type:', invalidTypes);
    
    // Check for nodes missing required data
    const nodesWithMissingData = nodes.filter(node => !node.data || !node.data.label || !node.data.content);
    console.log('Nodes missing required data:', nodesWithMissingData);
    
    // Check for question nodes missing criteria
    const questionNodesWithoutCriteria = nodes.filter(node => 
      node.type === 'question' && (!node.data.criteria || node.data.criteria === '')
    );
    console.log('Question nodes without criteria:', questionNodesWithoutCriteria);
    
    toast.success('Debug info logged to console');
  }, [nodes, edges]);

  if (loading) {
    return <div className="p-8">Loading job information...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col h-screen gap-5">
      {/* Toast container */}
      <Toaster position="top-right" />
      
      {/* Job Information Section */}
      <JobInfoPanel job={job} />

      {/* ReactFlow Section */}
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
          nodeTypes={nodeTypes}
          connectionLineStyle={connectionLineStyle}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          snapToGrid={true}
          snapGrid={[15, 15]}
          connectionMode="loose"
          deleteKeyCode={['Backspace', 'Delete']}
          edgesUpdatable={true}
          edgesFocusable={true}
          selectNodesOnDrag={false}
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
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

      {/* Node Form Modal */}
      {nodeFormOpen && (
        <NodeFormModal 
          nodeFormData={nodeFormData}
          setNodeFormData={setNodeFormData}
          onSubmit={handleNodeFormSubmit}
          onCancel={() => {
            setNodeFormOpen(false);
            setEditingNode(null);
          }}
          onDelete={editingNode ? deleteNode : undefined}
          isEditing={!!editingNode}
        />
      )}
      
      {/* Confirmation Modal for Clear Graph */}
      <ConfirmationModal
        isOpen={confirmModalOpen}
        title="Clear Graph"
        message="Are you sure you want to clear the graph? This will remove all nodes except Start and Conclusion."
        confirmText="Clear Graph"
        cancelText="Cancel"
        onConfirm={handleClearConfirm}
        onCancel={() => setConfirmModalOpen(false)}
      />
    </div>
  );
}
