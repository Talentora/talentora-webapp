// 'use client';

// import { useEffect, useState, useCallback, useRef } from 'react';
// import ReactFlow, {
//   MiniMap,
//   Controls,
//   Background,
//   useNodesState,
//   useEdgesState,
//   addEdge,
//   Panel,
//   Connection,
//   Edge,
//   BackgroundVariant,
//   MarkerType,
//   Handle,
//   Position,
//   updateEdge
// } from 'reactflow';
// import 'reactflow/dist/style.css';
// import './styles.css';
// import { useParams } from 'next/navigation';
// import { Job } from '@/types/merge';
// import JobInfoPanel from './components/JobInfoPanel';
// import NodeFormModal from './components/NodeFormModal';
// import ControlPanel from './components/ControlPanel';
// import toast, { Toaster } from 'react-hot-toast';
// import ConfirmationModal from './components/ConfirmationModal';
// import { createClient } from '@/utils/supabase/client';

// const initialNodes = [
//   {
//     id: 'start',
//     type: 'input',
//     data: { 
//       label: 'Interview Start',
//       content: 'Welcome the candidate and introduce yourself. Explain the interview process and set expectations.'
//     },
//     position: { x: 50, y: 150 },
//   },
//   {
//     id: 'intro',
//     type: 'section',
//     data: { 
//       label: 'Background Section',
//       content: 'This section covers the candidate\'s background and experience.'
//     },
//     position: { x: 400, y: 150 },
//   },
//   {
//     id: 'question1',
//     type: 'question',
//     data: { 
//       label: 'Experience Question',
//       content: 'Tell me about your most recent role and your key responsibilities.',
//       criteria: 'Look for relevant experience and clear communication.'
//     },
//     position: { x: 750, y: 50 },
//   },
//   {
//     id: 'question2',
//     type: 'question',
//     data: { 
//       label: 'Challenge Question',
//       content: 'Describe a challenging situation you faced in your previous role and how you resolved it.',
//       criteria: 'Assess problem-solving skills and resilience.'
//     },
//     position: { x: 750, y: 250 },
//   },
//   {
//     id: 'technical',
//     type: 'section',
//     data: { 
//       label: 'Technical Skills',
//       content: 'This section evaluates the candidate\'s technical knowledge and skills.'
//     },
//     position: { x: 1100, y: 150 },
//   },
//   {
//     id: 'question3',
//     type: 'question',
//     data: { 
//       label: 'Technical Question 1',
//       content: 'Explain how you would design a scalable system for handling high traffic loads.',
//       criteria: 'Evaluate system design knowledge and scalability concepts.'
//     },
//     position: { x: 1450, y: 0 },
//   },
//   {
//     id: 'question4',
//     type: 'question',
//     data: { 
//       label: 'Technical Question 2',
//       content: "Describe your experience with CI/CD pipelines and how you've implemented them.",
//       criteria: 'Check for DevOps knowledge and automation experience.'
//     },
//     position: { x: 1450, y: 150 },
//   },
//   {
//     id: 'question5',
//     type: 'question',
//     data: { 
//       label: 'Technical Question 3',
//       content: 'How do you ensure code quality in your projects?',
//       criteria: 'Look for testing strategies, code reviews, and quality assurance practices.'
//     },
//     position: { x: 1450, y: 300 },
//   },
//   {
//     id: 'cultural',
//     type: 'section',
//     data: { 
//       label: 'Cultural Fit',
//       content: 'This section assesses how well the candidate aligns with company values and culture.'
//     },
//     position: { x: 1800, y: 150 },
//   },
//   {
//     id: 'question6',
//     type: 'question',
//     data: { 
//       label: 'Teamwork Question',
//       content: 'How do you approach collaborating with team members who have different working styles?',
//       criteria: 'Assess adaptability, empathy, and collaboration skills.'
//     },
//     position: { x: 2150, y: 50 },
//   },
//   {
//     id: 'question7',
//     type: 'question',
//     data: { 
//       label: 'Growth Question',
//       content: 'Where do you see yourself professionally in 3-5 years?',
//       criteria: 'Evaluate ambition, career planning, and alignment with company growth.'
//     },
//     position: { x: 2150, y: 250 },
//   },
//   {
//     id: 'conclusion',
//     type: 'conclusion',
//     data: { 
//       label: 'Interview Conclusion',
//       content: 'Thank the candidate for their time. Ask if they have any questions about the role or company. Explain next steps in the hiring process.'
//     },
//     position: { x: 2500, y: 150 },
//   }
// ];

// const initialEdges: Edge[] = [
//   {
//     id: 'e-start-intro',
//     source: 'start',
//     target: 'intro',
//     type: 'smoothstep'
//   },
//   {
//     id: 'e-intro-question1',
//     source: 'intro',
//     target: 'question1',
//     type: 'smoothstep'
//   },
//   {
//     id: 'e-question1-question2',
//     source: 'question1',
//     target: 'question2',
//     type: 'smoothstep'
//   },
//   {
//     id: 'e-question2-technical',
//     source: 'question2',
//     target: 'technical',
//     type: 'smoothstep'
//   },
//   {
//     id: 'e-technical-question3',
//     source: 'technical',
//     target: 'question3',
//     type: 'smoothstep'
//   },
//   {
//     id: 'e-question3-question4',
//     source: 'question3',
//     target: 'question4',
//     type: 'smoothstep'
//   },
//   {
//     id: 'e-question4-question5',
//     source: 'question4',
//     target: 'question5',
//     type: 'smoothstep'
//   },
//   {
//     id: 'e-question5-cultural',
//     source: 'question5',
//     target: 'cultural',
//     type: 'smoothstep'
//   },
//   {
//     id: 'e-cultural-question6',
//     source: 'cultural',
//     target: 'question6',
//     type: 'smoothstep'
//   },
//   {
//     id: 'e-question6-question7',
//     source: 'question6',
//     target: 'question7',
//     type: 'smoothstep'
//   },
//   {
//     id: 'e-question7-conclusion',
//     source: 'question7',
//     target: 'conclusion',
//     type: 'smoothstep'
//   }
// ];

// const nodeTypes = {
//   question: ({ data, isConnectable }: { data: any, isConnectable: boolean }) => (
//     <div className="relative bg-white p-4 border-2 border-blue-500 rounded-md shadow-md w-64">
//       <Handle
//         type="target"
//         position={Position.Left}
//         isConnectable={isConnectable}
//         className="w-3 h-3 bg-blue-500"
//       />
//       <div className="font-bold text-blue-700">{data.label}</div>
//       <div className="text-sm mt-2">{data.content}</div>
//       {data.criteria && (
//         <div className="mt-2 text-xs bg-gray-100 p-2 rounded">
//           <span className="font-semibold">Criteria:</span> {data.criteria}
//         </div>
//       )}
//       <Handle
//         type="source"
//         position={Position.Right}
//         isConnectable={isConnectable}
//         className="w-3 h-3 bg-blue-500"
//       />
//     </div>
//   ),
//   section: ({ data, isConnectable }: { data: any, isConnectable: boolean }) => (
//     <div className="relative bg-yellow-50 p-4 border-2 border-yellow-500 rounded-md shadow-md w-64">
//       <Handle
//         type="target"
//         position={Position.Left}
//         isConnectable={isConnectable}
//         className="w-3 h-3 bg-yellow-500"
//       />
//       <div className="font-bold text-yellow-700">{data.label}</div>
//       <div className="text-sm mt-2">{data.content}</div>
//       <Handle
//         type="source"
//         position={Position.Right}
//         isConnectable={isConnectable}
//         className="w-3 h-3 bg-yellow-500"
//       />
//     </div>
//   ),
//   input: ({ data, isConnectable }: { data: any, isConnectable: boolean }) => (
//     <div className="relative bg-green-50 p-4 border-2 border-green-500 rounded-md shadow-md w-64">
//       <div className="font-bold text-green-700">{data.label}</div>
//       <div className="text-sm mt-2">{data.content}</div>
//       <Handle
//         type="source"
//         position={Position.Right}
//         isConnectable={isConnectable}
//         className="w-3 h-3 bg-green-500"
//       />
//     </div>
//   ),
//   conclusion: ({ data, isConnectable }: { data: any, isConnectable: boolean }) => (
//     <div className="relative bg-purple-50 p-4 border-2 border-purple-500 rounded-md shadow-md w-64">
//       <Handle
//         type="target"
//         position={Position.Left}
//         isConnectable={isConnectable}
//         className="w-3 h-3 bg-purple-500"
//       />
//       <div className="font-bold text-purple-700">{data.label}</div>
//       <div className="text-sm mt-2">{data.content}</div>
//     </div>
//   ),
// };

// // Add a function to validate the flow
// const validateFlow = (nodes: any[], edges: Edge[]): { valid: boolean; message: string } => {
//   // Check if there are any nodes
//   if (nodes.length === 0) {
//     return { valid: false, message: 'No nodes in the flow. Please add some nodes.' };
//   }

//   // Check if there's a start node
//   const startNode = nodes.find(node => node.type === 'input');
//   if (!startNode) {
//     return { valid: false, message: 'Missing start node. Please add a start node.' };
//   }

//   // Check if there's a conclusion node
//   const conclusionNode = nodes.find(node => node.type === 'conclusion');
//   if (!conclusionNode) {
//     return { valid: false, message: 'Missing conclusion node. Please add a conclusion node.' };
//   }

//   // Build a graph representation for traversal
//   const graph: Record<string, string[]> = {};
//   nodes.forEach(node => {
//     graph[node.id] = [];
//   });
  
//   edges.forEach(edge => {
//     if (graph[edge.source]) {
//       graph[edge.source].push(edge.target);
//     }
//   });

//   // Check if all nodes are reachable from start
//   const visited = new Set<string>();
//   const queue = [startNode.id];
  
//   while (queue.length > 0) {
//     const nodeId = queue.shift()!;
//     visited.add(nodeId);
    
//     const neighbors = graph[nodeId] || [];
//     for (const neighbor of neighbors) {
//       if (!visited.has(neighbor)) {
//         queue.push(neighbor);
//       }
//     }
//   }

//   // Check if all nodes are visited
//   if (visited.size !== nodes.length) {
//     return { 
//       valid: false, 
//       message: 'Some nodes are not connected to the flow. Please ensure all nodes are connected.' 
//     };
//   }

//   // Check if conclusion is reachable from start
//   if (!visited.has(conclusionNode.id)) {
//     return { 
//       valid: false, 
//       message: 'Conclusion node is not reachable from start. Please connect it to the flow.' 
//     };
//   }

//   // Check if there are any cycles in the graph
//   const checkCycle = (nodeId: string, path = new Set<string>()): boolean => {
//     if (path.has(nodeId)) return true;
    
//     path.add(nodeId);
//     const neighbors = graph[nodeId] || [];
    
//     for (const neighbor of neighbors) {
//       if (checkCycle(neighbor, new Set(path))) {
//         return true;
//       }
//     }
    
//     return false;
//   };

//   if (checkCycle(startNode.id)) {
//     return { 
//       valid: false, 
//       message: 'The flow contains cycles. Please ensure the flow is linear.' 
//     };
//   }

//   // Check if there's a direct connection from start to conclusion
//   const directStartToConclusionEdge = edges.find(edge => {
//     const sourceNode = nodes.find(node => node.id === edge.source);
//     const targetNode = nodes.find(node => node.id === edge.target);
//     return sourceNode?.type === 'input' && targetNode?.type === 'conclusion';
//   });

//   if (directStartToConclusionEdge) {
//     return { 
//       valid: false, 
//       message: 'Start node cannot connect directly to Conclusion. Please add at least one question or section in between.' 
//     };
//   }

//   return { valid: true, message: 'Flow is valid!' };
// };

// // Update the custom node components to include handles on all sides
// const InputNode = ({ data }: any) => {
//   return (
//     <div className="input-node">
//       <div className="node-header bg-green-500 text-white p-2 rounded-t">
//         <div className="text-sm font-bold">{data.label}</div>
//       </div>
//       <div className="node-content p-2 text-sm">
//         {data.content}
//       </div>
//       <Handle type="source" position={Position.Right} id="right" className="handle-right" />
//       <Handle type="source" position={Position.Bottom} id="bottom" className="handle-bottom" />
//       <Handle type="source" position={Position.Top} id="top" className="handle-top" />
//       <Handle type="source" position={Position.Left} id="left" className="handle-left" />
//     </div>
//   );
// };

// const QuestionNode = ({ data }: any) => {
//   return (
//     <div className="question-node">
//       <div className="node-header bg-blue-500 text-white p-2 rounded-t">
//         <div className="text-sm font-bold">{data.label}</div>
//       </div>
//       <div className="node-content p-2 text-sm">
//         {data.content}
//         {data.criteria && (
//           <div className="criteria mt-2 text-xs bg-blue-50 p-1 rounded">
//             <span className="font-bold">Criteria:</span> {data.criteria}
//           </div>
//         )}
//       </div>
//       <Handle type="target" position={Position.Left} id="left" className="handle-left" />
//       <Handle type="source" position={Position.Right} id="right" className="handle-right" />
//       <Handle type="target" position={Position.Top} id="top" className="handle-top" />
//       <Handle type="source" position={Position.Bottom} id="bottom" className="handle-bottom" />
//     </div>
//   );
// };

// const SectionNode = ({ data }: any) => {
//   return (
//     <div className="section-node">
//       <div className="node-header bg-yellow-500 text-white p-2 rounded-t">
//         <div className="text-sm font-bold">{data.label}</div>
//       </div>
//       <div className="node-content p-2 text-sm">
//         {data.content}
//       </div>
//       <Handle type="target" position={Position.Left} id="left" className="handle-left" />
//       <Handle type="source" position={Position.Right} id="right" className="handle-right" />
//       <Handle type="target" position={Position.Top} id="top" className="handle-top" />
//       <Handle type="source" position={Position.Bottom} id="bottom" className="handle-bottom" />
//     </div>
//   );
// };

// const ConclusionNode = ({ data }: any) => {
//   return (
//     <div className="conclusion-node">
//       <div className="node-header bg-purple-500 text-white p-2 rounded-t">
//         <div className="text-sm font-bold">{data.label}</div>
//       </div>
//       <div className="node-content p-2 text-sm">
//         {data.content}
//       </div>
//       <Handle type="target" position={Position.Left} id="left" className="handle-left" />
//       <Handle type="target" position={Position.Top} id="top" className="handle-top" />
//       <Handle type="target" position={Position.Bottom} id="bottom" className="handle-bottom" />
//       <Handle type="target" position={Position.Right} id="right" className="handle-right" />
//     </div>
//   );
// };

// export default function JobPromptPage() {
//   const params = useParams();
//   const jobId = params.id as string;
//   const [job, setJob] = useState<Job | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const supabase = createClient()
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
//   const reactFlowWrapper = useRef<HTMLDivElement>(null);
//   const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
//   const [nodeFormOpen, setNodeFormOpen] = useState(false);
//   const [nodeFormData, setNodeFormData] = useState({
//     type: 'question',
//     label: '',
//     content: '',
//     criteria: '',
//     position: { x: 0, y: 0 }
//   });

//   // Add a state to track the node being edited
//   const [editingNode, setEditingNode] = useState<any | null>(null);

//   // Add a state for tracking AI generation
//   const [isGeneratingAI, setIsGeneratingAI] = useState(false);

//   // Add state for confirmation modal
//   const [confirmModalOpen, setConfirmModalOpen] = useState(false);

//   // Add state for edge deletion confirmation
//   const [edgeToDelete, setEdgeToDelete] = useState<Edge | null>(null);
//   const [edgeDeleteModalOpen, setEdgeDeleteModalOpen] = useState(false);

//   // Add state for default graph confirmation
//   const [showDefaultGraphModal, setShowDefaultGraphModal] = useState(false);

//   // Add state to track if we've already checked for a saved flow
//   const [checkedForSavedFlow, setCheckedForSavedFlow] = useState(false);

//   // Update the loadSavedFlow function to only run once
//   const loadSavedFlow = useCallback(async () => {
//     // If we've already checked for a saved flow or the modal is already showing, don't proceed
//     if (checkedForSavedFlow || showDefaultGraphModal) return;
    
//     try {
//       console.log('Checking for saved flow...');
//       const { data, error } = await supabase
//         .from('job_interview_config')
//         .select('prompt_graph')
//         .eq('job_id', jobId)
//         .single();
      
//       // Mark that we've checked for a saved flow
//       setCheckedForSavedFlow(true);
      
//       if (error) {
//         if (error.code === 'PGRST116') { // Not found
//           console.log('No saved flow found, asking user about default');
//           setShowDefaultGraphModal(true);
//           return;
//         }
//         console.error('Error loading saved flow:', error);
//         return;
//       }
      
//       // Check if data exists and has valid nodes and edges
//       if (data?.prompt_graph && 
//           data.prompt_graph.nodes && 
//           Array.isArray(data.prompt_graph.nodes) && 
//           data.prompt_graph.nodes.length > 0 &&
//           data.prompt_graph.edges && 
//           Array.isArray(data.prompt_graph.edges)) {
        
//         console.log('Loaded saved flow:', data.prompt_graph);
//         setNodes(data.prompt_graph.nodes);
//         setEdges(data.prompt_graph.edges);
//         toast.success('Saved flow loaded');
//       } else {
//         // If prompt_graph is missing, empty, or invalid
//         console.log('Invalid or empty prompt_graph, showing default options');
//         setShowDefaultGraphModal(true);
//       }
//     } catch (error) {
//       console.error('Error loading saved flow:', error);
//       setShowDefaultGraphModal(true);
//     }
//   }, [jobId, setNodes, setEdges, showDefaultGraphModal, checkedForSavedFlow]);

//   // Update the useEffect to only fetch job data once
//   useEffect(() => {
//     if (!jobId || checkedForSavedFlow) return;
    
//     let isMounted = true;
    
//     const fetchJobData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`/api/jobs/${jobId}`);
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch job data');
//         }
        
//         const data = await response.json();
        
//         if (isMounted) {
//         setJob(data);
//           setLoading(false);
          
//           // Load saved flow after job data is loaded
//           loadSavedFlow();
//         }
//       } catch (err) {
//         if (isMounted) {
//         setError(err instanceof Error ? err.message : 'An error occurred');
//         setLoading(false);
//         }
//       }
//     };

//     fetchJobData();
    
//     // Cleanup function to prevent state updates if component unmounts
//     return () => {
//       isMounted = false;
//     };
//   }, [jobId, loadSavedFlow, checkedForSavedFlow]);

//   // Update the onConnect function to handle multi-directional connections
//   const onConnect = useCallback((params: Connection) => {
//     // Check if this is a direct connection from start to conclusion
//     const isStartNode = nodes.find(node => node.id === params.source)?.type === 'input';
//     const isConclusionNode = nodes.find(node => node.id === params.target)?.type === 'conclusion';
    
//     if (isStartNode && isConclusionNode) {
//       toast.error('Cannot connect Start directly to Conclusion. Please add at least one question or section in between.');
//       return;
//     }
    
//     // Check if the source node already has an outgoing connection from this handle
//     const sourceHasOutgoingFromHandle = edges.some(
//       edge => edge.source === params.source && edge.sourceHandle === params.sourceHandle
//     );
    
//     // Check if the target node already has an incoming connection to this handle
//     const targetHasIncomingToHandle = edges.some(
//       edge => edge.target === params.target && edge.targetHandle === params.targetHandle
//     );
    
//     // Allow the connection if neither condition is true
//     if (!sourceHasOutgoingFromHandle && !targetHasIncomingToHandle) {
//       // Create the edge with the specified handles
//       setEdges(eds => addEdge({
//         ...params,
//         type: 'smoothstep',
//         animated: false,
//         style: { stroke: '#555' }
//       }, eds));
//     } else {
//       // Show a notification that the connection was not allowed
//       toast.error('This connection point is already in use');
//     }
//   }, [nodes, edges, setEdges]);

//   const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault();
//     event.dataTransfer.dropEffect = 'move';
//   }, []);

//   const onDrop = useCallback(
//     (event: React.DragEvent<HTMLDivElement>) => {
//       event.preventDefault();

//       if (!reactFlowWrapper.current || !reactFlowInstance) return;

//       const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
//       const type = event.dataTransfer.getData('application/reactflow');

//       // Check if the dropped element is valid
//       if (typeof type === 'undefined' || !type) {
//         return;
//       }

//       const position = reactFlowInstance.project({
//         x: event.clientX - reactFlowBounds.left,
//         y: event.clientY - reactFlowBounds.top,
//       });
      
//       setNodeFormData({
//         ...nodeFormData,
//         type,
//         position
//       });
//       setNodeFormOpen(true);
//     },
//     [reactFlowInstance, nodeFormData]
//   );

//   // Handle node double-click
//   const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: any) => {
//     // Set the node data for editing
//     setEditingNode(node);
//     setNodeFormData({
//       type: node.type,
//       label: node.data.label,
//       content: node.data.content,
//       criteria: node.data.criteria || '',
//       position: node.position
//     });
//     setNodeFormOpen(true);
//   }, []);

//   // Update the handleNodeFormSubmit function to handle both new and edited nodes
//   const handleNodeFormSubmit = () => {
//     if (editingNode) {
//       // Update existing node
//       setNodes((nds) => 
//         nds.map((node) => {
//           if (node.id === editingNode.id) {
//             return {
//               ...node,
//               data: {
//                 ...node.data,
//                 label: nodeFormData.label,
//                 content: nodeFormData.content,
//                 ...(node.type === 'question' ? { criteria: nodeFormData.criteria } : {})
//               }
//             };
//           }
//           return node;
//         })
//       );
//       setEditingNode(null);
//     } else {
//       // Create new node (existing code)
//     const newNode = {
//       id: `node_${Date.now()}`,
//       type: nodeFormData.type,
//       position: nodeFormData.position,
//       data: { 
//         label: nodeFormData.label,
//         content: nodeFormData.content,
//           ...(nodeFormData.type === 'question' ? { criteria: nodeFormData.criteria } : {})
//         }
//     };

//     setNodes((nds) => nds.concat(newNode));
//     }
    
//     setNodeFormOpen(false);
//     setNodeFormData({
//       type: 'question',
//       label: '',
//       content: '',
//       criteria: '',
//       position: { x: 0, y: 0 }
//     });
//   };

//   // Add a function to delete the selected node
//   const deleteNode = () => {
//     if (editingNode) {
//       // Remove the node
//       setNodes((nds) => nds.filter((node) => node.id !== editingNode.id));
      
//       // Remove any connected edges
//       setEdges((eds) => 
//         eds.filter(
//           (edge) => edge.source !== editingNode.id && edge.target !== editingNode.id
//         )
//       );
      
//       setEditingNode(null);
//       setNodeFormOpen(false);
//     }
//   };

//   // Update the saveFlow function to properly save to the database
//   const saveFlow = useCallback(async () => {
//     // Validate the flow before saving
//     const validation = validateFlow(nodes, edges);
//     if (!validation.valid) {
//       toast.error(`Cannot save: ${validation.message}`);
//       return;
//     }
    
//     try {
//       // Prepare the data to save - stringify to ensure it's stored as JSON
//       const flowData = {
//         nodes,
//         edges
//       };
      
//       console.log('Saving flow data:', flowData);
      
//       // Check if the job_interview_config record exists first
//       const { data: existingConfig, error: checkError } = await supabase
//         .from('job_interview_config')
//         .select('*')
//         .eq('job_id', jobId)
//         .single();
      
//       if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
//         console.error('Error checking config:', checkError);
//         throw checkError;
//       }
      
//       let result;
      
//       if (existingConfig) {
//         // Update existing record
//         result = await supabase
//           .from('job_interview_config')
//           .update({
//             prompt_graph: flowData,
//             // modified_at: new Date().toISOString()
//           })
//           .eq('job_id', jobId);
//       } else {
//         // Insert new record
//         result = await supabase
//           .from('job_interview_config')
//           .insert({
//             job_id: jobId,
//             prompt_graph: flowData,
//             // created_at: new Date().toISOString(),
//             // modified_at: new Date().toISOString()
//           });
//       }
      
//       if (result.error) {
//         console.error('Supabase error:', result.error);
//         throw result.error;
//       }
      
//       console.log('Save result:', result);
//       toast.success('Flow saved successfully');
      
//     } catch (error) {
//       console.error('Error saving flow:', error);
//       toast.error('Failed to save flow. Please try again.');
//     }
//   }, [nodes, edges, jobId, validateFlow]);

//   // Fix the edge connection issue by specifying connection line style
//   const connectionLineStyle = { stroke: '#888', strokeWidth: 2 };
  
//   // Define default edge options with markers
//   const defaultEdgeOptions = {
//     type: 'smoothstep',
//     animated: true,
//     style: { stroke: '#555' },
//     markerEnd: {
//       type: MarkerType.ArrowClosed,
//       width: 20,
//       height: 20,
//       color: '#555',
//     },
//   };

//   const autoLayoutNodes = useCallback(() => {
//     if (!nodes.length) return;

//     // Create a map to track node types and their connections
//     const nodeMap = new Map();
//     const sectionMap = new Map(); // To track which section each question belongs to
//     const nodeTypes = new Map(); // To track node types
    
//     // First, identify all nodes and their types
//     nodes.forEach(node => {
//       nodeMap.set(node.id, { node, children: [], parents: [] });
//       nodeTypes.set(node.id, node.type);
//     });
    
//     // Build the connection graph
//     edges.forEach(edge => {
//       const sourceNode = nodeMap.get(edge.source);
//       const targetNode = nodeMap.get(edge.target);
      
//       if (sourceNode && targetNode) {
//         sourceNode.children.push(targetNode.node.id);
//         targetNode.parents.push(sourceNode.node.id);
        
//         // If source is a section and target is a question, associate the question with the section
//         if (nodeTypes.get(edge.source) === 'section' && nodeTypes.get(edge.target) === 'question') {
//           sectionMap.set(edge.target, edge.source);
//         }
//       }
//     });
    
//     // Find the start node (input type)
//     const startNode = nodes.find(node => node.type === 'input');
//     if (!startNode) return;
    
//     // Find the conclusion node
//     const conclusionNode = nodes.find(node => node.type === 'conclusion');
    
//     // Organize nodes into sections and questions
//     const sections = nodes.filter(node => node.type === 'section');
//     const questions = nodes.filter(node => node.type === 'question');
    
//     // Create a map of sections to their questions
//     const sectionQuestions = new Map();
//     sections.forEach(section => {
//       sectionQuestions.set(section.id, []);
//     });
    
//     // Assign questions to their sections
//     questions.forEach(question => {
//       const sectionId = sectionMap.get(question.id);
//       if (sectionId && sectionQuestions.has(sectionId)) {
//         sectionQuestions.get(sectionId).push(question.id);
//       }
//     });
    
//     // Determine the flow order by following connections from start
//     const flowOrder = [];
//     const visited = new Set();
    
//     // Helper function to traverse the graph
//     const traverseGraph = (nodeId) => {
//       if (visited.has(nodeId)) return;
//       visited.add(nodeId);
//       flowOrder.push(nodeId);
      
//       // Get children of this node
//       const children = nodeMap.get(nodeId)?.children || [];
//       children.forEach(childId => {
//         traverseGraph(childId);
//       });
//     };
    
//     // Start traversal from the start node
//     if (startNode) {
//       traverseGraph(startNode.id);
//     }
    
//     // Add any nodes that weren't visited
//     nodes.forEach(node => {
//       if (!visited.has(node.id)) {
//         flowOrder.push(node.id);
//       }
//     });
    
//     // Calculate positions
//     const newNodes = [...nodes];
//     const startX = 50;
//     const sectionSpacingX = 400; // Horizontal spacing between sections
//     const questionSpacingY = 150; // Vertical spacing between questions
//     const centerY = 300; // Center Y position
    
//     // Position nodes based on flow order
//     let currentX = startX;
//     let lastType = null;
    
//     flowOrder.forEach(nodeId => {
//       const node = nodes.find(n => n.id === nodeId);
//       if (!node) return;
      
//       const nodeIndex = newNodes.findIndex(n => n.id === nodeId);
//       if (nodeIndex === -1) return;
      
//       // Position based on node type
//       switch (node.type) {
//         case 'input': // Start node
//           newNodes[nodeIndex] = {
//             ...newNodes[nodeIndex],
//             position: { x: currentX, y: centerY }
//           };
//           currentX += 250;
//           break;
          
//         case 'section': // Section node
//           // Add some extra space after the previous node if it wasn't a section
//           if (lastType !== 'section' && lastType !== 'input') {
//             currentX += 100;
//           }
          
//           newNodes[nodeIndex] = {
//             ...newNodes[nodeIndex],
//             position: { x: currentX, y: centerY }
//           };
          
//           // Position questions for this section vertically
//           const questionIds = sectionQuestions.get(nodeId) || [];
//           let questionY = centerY - ((questionIds.length - 1) * questionSpacingY / 2);
          
//           questionIds.forEach(questionId => {
//             const questionIndex = newNodes.findIndex(n => n.id === questionId);
//             if (questionIndex !== -1) {
//               newNodes[questionIndex] = {
//                 ...newNodes[questionIndex],
//                 position: { x: currentX + 200, y: questionY }
//               };
//               questionY += questionSpacingY;
              
//               // Remove this question from the flow order since we've positioned it
//               const qIndex = flowOrder.indexOf(questionId);
//               if (qIndex > -1) {
//                 flowOrder.splice(qIndex, 1);
//               }
//             }
//           });
          
//           currentX += 400; // Move to the next section position
//           break;
          
//         case 'question': // Question node (only those not associated with a section)
//           if (!sectionMap.has(nodeId)) {
//             newNodes[nodeIndex] = {
//               ...newNodes[nodeIndex],
//               position: { x: currentX, y: centerY }
//             };
//             currentX += 250;
//           }
//           break;
          
//         case 'conclusion': // Conclusion node
//           // Add some extra space before the conclusion
//           currentX += 100;
//           newNodes[nodeIndex] = {
//             ...newNodes[nodeIndex],
//             position: { x: currentX, y: centerY }
//           };
//           break;
          
//         default:
//           // Other node types
//           newNodes[nodeIndex] = {
//             ...newNodes[nodeIndex],
//             position: { x: currentX, y: centerY }
//           };
//           currentX += 250;
//       }
      
//       lastType = node.type;
//     });
    
//     // Update the nodes state
//     setNodes(newNodes);
    
//     // After positioning all nodes, update the edges to use the appropriate handles
//     const newEdges = [...edges].map(edge => {
//       const sourceNode = newNodes.find(n => n.id === edge.source);
//       const targetNode = newNodes.find(n => n.id === edge.target);
      
//       if (!sourceNode || !targetNode) return edge;
      
//       // Calculate the positions of the nodes
//       const sourceX = sourceNode.position.x + 125; // Assuming node width is 250
//       const sourceY = sourceNode.position.y + 75;  // Assuming node height is 150
//       const targetX = targetNode.position.x + 125;
//       const targetY = targetNode.position.y + 75;
      
//       // Determine the best handles to use based on relative positions
//       let sourceHandle = 'right';
//       let targetHandle = 'left';
      
//       // If target is above source
//       if (targetY < sourceY - 100) {
//         sourceHandle = 'top';
//         targetHandle = 'bottom';
//       } 
//       // If target is below source
//       else if (targetY > sourceY + 100) {
//         sourceHandle = 'bottom';
//         targetHandle = 'top';
//       }
//       // If target is to the left of source
//       else if (targetX < sourceX) {
//         sourceHandle = 'left';
//         targetHandle = 'right';
//       }
      
//       return {
//         ...edge,
//         sourceHandle,
//         targetHandle
//       };
//     });
    
//     // Update the edges state
//     setEdges(newEdges);
    
//     // After layout is applied, fit the view
//     setTimeout(() => {
//       if (reactFlowInstance) {
//         reactFlowInstance.fitView({ padding: 0.2 });
//       }
//     }, 50);
//   }, [nodes, edges, reactFlowInstance, setNodes, setEdges]);

//   // Add this function to handle edge removal
//   const onEdgeUpdate = useCallback(
//     (oldEdge: Edge, newConnection: Connection) => {
//       // If the connection is being removed (target or source is null), don't update
//       if (!newConnection.target || !newConnection.source) {
//         return;
//       }
      
//       setEdges((els) => updateEdge(oldEdge, newConnection, els));
//     },
//     [setEdges]
//   );

//   // Add this function to handle edge click
//   const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
//     // Confirm before deleting
//     if (window.confirm('Are you sure you want to delete this connection?')) {
//       setEdges((edges) => edges.filter((e) => e.id !== edge.id));
//     }
//   }, [setEdges]);

//   // Update the onEdgeDoubleClick handler to open the confirmation modal
//   const onEdgeDoubleClick = useCallback((event: React.MouseEvent, edge: Edge) => {
//     // Prevent the event from propagating to other handlers
//     event.stopPropagation();
    
//     // Set the edge to delete and open the confirmation modal
//     setEdgeToDelete(edge);
//     setEdgeDeleteModalOpen(true);
//   }, []);

//   // Add a function to handle the actual deletion after confirmation
//   const handleEdgeDeleteConfirm = useCallback(() => {
//     if (edgeToDelete) {
//       // Delete the edge
//       setEdges((eds) => eds.filter((e) => e.id !== edgeToDelete.id));
      
//       // Show a notification
//       toast.success('Connection deleted');
      
//       // Reset the state
//       setEdgeToDelete(null);
//     }
    
//     // Close the modal
//     setEdgeDeleteModalOpen(false);
//   }, [edgeToDelete, setEdges]);

//   // Update the generateWithAI function to properly process node types
//   const generateWithAI = useCallback(async () => {
//     if (!job || !job.description) {
//       toast.error('Job description is required for AI generation');
//       return;
//     }

//     setIsGeneratingAI(true);
    
//     try {
//       // Set a timeout to show an error if the API takes too long
//       const timeoutId = setTimeout(() => {
//         toast.error('Generation is taking longer than expected. Please try again later.');
//         setIsGeneratingAI(false);
//       }, 30000); // 30 seconds timeout
      
//       // Call the API to generate the interview flow
//       const response = await fetch('/api/generate-interview', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           jobTitle: job.name,
//           jobDescription: job.description,
//         }),
//       });

//       clearTimeout(timeoutId);

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to generate interview flow');
//       }

//       const data = await response.json();
      
//       if (!data.nodes || !data.edges) {
//         throw new Error('Invalid response from AI generation');
//       }

//       console.log('Received data from API:', data);

//       // Process the nodes to ensure they have the correct format and types
//       const processedNodes = data.nodes.map((node: any) => {
//         // Ensure node has the correct type
//         const nodeType = ['input', 'section', 'question', 'conclusion'].includes(node.type) 
//           ? node.type 
//           : node.type === 'start' ? 'input' : 'question';
        
//         // Ensure node has position data
//         const position = node.position || { x: 0, y: 0 };
        
//         // Ensure node data has the required properties
//         const nodeData = {
//           label: node.data.label || 'Untitled Node',
//           content: node.data.content || '',
//           ...(nodeType === 'question' ? { criteria: node.data.criteria || 'No criteria specified' } : {})
//         };
        
//         return {
//           id: node.id,
//           type: nodeType,
//           data: nodeData,
//           position: position
//         };
//       });

//       console.log('Processed nodes:', processedNodes);

//       // Process the edges to ensure they have the correct format
//       const processedEdges = data.edges.map((edge: any) => ({
//           id: edge.id,
//           source: edge.source,
//         target: edge.target,
//         type: edge.type || 'smoothstep'
//       }));
//       console.log("processedEdges", processedEdges)

//       // Update the nodes and edges
//       setNodes(processedNodes);
//       setEdges(processedEdges);
      
//     //   // Apply auto-layout to position the nodes
//     //   setTimeout(() => {
//     //     autoLayoutNodes();
//     //     toast.success('Interview flow generated successfully!');
//     //   }, 1000);
      
//     } catch (error) {
//       console.error('Error generating interview flow:', error);
//       toast.error(`Failed to generate interview flow: ${error instanceof Error ? error.message : 'Please try again'}`);
//     } finally {
//       setIsGeneratingAI(false);
//     }
//   }, [job, autoLayoutNodes, setNodes, setEdges]);

//   // Update the clearGraph function to use the modal
//   const clearGraph = useCallback(() => {
//     // Open the confirmation modal instead of using window.confirm
//     setConfirmModalOpen(true);
//   }, []);
  
//   // Add a function to handle the actual clearing after confirmation
//   const handleClearConfirm = useCallback(() => {
//     // Find the start and conclusion nodes if they exist
//     const startNode = nodes.find(node => node.type === 'input');
//     const conclusionNode = nodes.find(node => node.type === 'conclusion');
    
//     // Create new nodes array with start, a placeholder question, and conclusion
//     const newNodes = [];
    
//     // Add start node if it exists, or create a new one
//     if (startNode) {
//       newNodes.push({
//         ...startNode,
//         position: { x: 50, y: 150 }
//       });
//     } else {
//       newNodes.push({
//         id: 'start',
//         type: 'input',
//         data: { 
//           label: 'Interview Start',
//           content: 'Welcome the candidate and introduce yourself. Explain the interview process and set expectations.'
//         },
//         position: { x: 50, y: 150 },
//       });
//     }
    
//     // Add a placeholder question node
//     const placeholderId = `question_${Date.now()}`;
//     newNodes.push({
//       id: placeholderId,
//       type: 'question',
//       data: { 
//         label: 'Interview Question',
//         content: 'Add your interview question here.',
//         criteria: 'Add evaluation criteria here.'
//       },
//       position: { x: 400, y: 150 },
//     });
    
//     // Add conclusion node if it exists, or create a new one
//     if (conclusionNode) {
//       newNodes.push({
//         ...conclusionNode,
//         position: { x: 750, y: 150 }
//       });
//     } else {
//       newNodes.push({
//         id: 'conclusion',
//         type: 'conclusion',
//         data: { 
//           label: 'Interview Conclusion',
//           content: 'Thank the candidate for their time. Ask if they have any questions about the role or company. Explain next steps in the hiring process.'
//         },
//         position: { x: 750, y: 150 },
//       });
//     }
    
//     // Update the nodes state
//     setNodes(newNodes);
    
//     // Create edges to connect the nodes
//     const newEdges = [
//       {
//         id: `e-start-${placeholderId}`,
//         source: 'start',
//         target: placeholderId,
//         type: 'smoothstep'
//       },
//       {
//         id: `e-${placeholderId}-conclusion`,
//         source: placeholderId,
//         target: 'conclusion',
//         type: 'smoothstep'
//       }
//     ];
    
//     // Update the edges state
//     setEdges(newEdges);
    
//     // Close the modal
//     setConfirmModalOpen(false);
    
//     toast.success('Graph cleared. A basic interview flow has been created.');
//   }, [nodes, setNodes, setEdges]);

//   // Add a debug function to help diagnose issues
//   const debugFlow = useCallback(() => {
//     console.log('Current nodes:', nodes);
//     console.log('Current edges:', edges);
    
//     // Check for common issues
//     const nodeTypes = nodes.map(node => node.type);
//     const missingTypes = nodes.filter(node => !node.type);
//     const invalidTypes = nodes.filter(node => !['input', 'section', 'question', 'conclusion'].includes(node.type || ''));
    
//     console.log('Node types:', nodeTypes);
//     console.log('Nodes missing type:', missingTypes);
//     console.log('Nodes with invalid type:', invalidTypes);
    
//     // Check for nodes missing required data
//     const nodesWithMissingData = nodes.filter(node => !node.data || !node.data.label || !node.data.content);
//     console.log('Nodes missing required data:', nodesWithMissingData);
    
//     // Check for question nodes missing criteria
//     const questionNodesWithoutCriteria = nodes.filter(node => 
//       node.type === 'question' && (!node.data.criteria || node.data.criteria === '')
//     );
//     console.log('Question nodes without criteria:', questionNodesWithoutCriteria);
    
//     toast.success('Debug info logged to console');
//   }, [nodes, edges]);

//   // Add a function to handle using the default graph
//   const useDefaultGraph = useCallback(() => {
//     // Set the nodes and edges to the initial values
//     setNodes(initialNodes);
//     setEdges(initialEdges);
//     setShowDefaultGraphModal(false);
//     toast.success('Default interview flow loaded');
//   }, [setNodes, setEdges]);

//   // Add a function to handle starting with an empty graph
//   const useEmptyGraph = useCallback(() => {
//     // Create a minimal graph with just start and conclusion
//     const startNode = {
//       id: 'start',
//       type: 'input',
//       data: { 
//         label: 'Interview Start',
//         content: 'Welcome the candidate and introduce yourself. Explain the interview process and set expectations.'
//       },
//       position: { x: 50, y: 150 },
//     };
    
//     const conclusionNode = {
//       id: 'conclusion',
//       type: 'conclusion',
//       data: { 
//         label: 'Interview Conclusion',
//         content: 'Thank the candidate for their time. Ask if they have any questions about the role or company. Explain next steps in the hiring process.'
//       },
//       position: { x: 750, y: 150 },
//     };
    
//     setNodes([startNode, conclusionNode]);
//     setEdges([]);
//     setShowDefaultGraphModal(false);
//     toast.success('Empty interview flow created');
//   }, [setNodes, setEdges]);

//   if (loading) {
//     return <div className="p-8">Loading job information...</div>;
//   }

//   if (error) {
//     return <div className="p-8 text-red-500">Error: {error}</div>;
//   }

//   return (
//     <div className="flex flex-col h-screen gap-5">
//       {/* Toast container */}
//       <Toaster position="top-right" />
      
//       {/* Job Information Section */}
//       <JobInfoPanel job={job} />

//       {/* ReactFlow Section */}
//       <div className="flex-grow" ref={reactFlowWrapper}>
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onConnect={onConnect}
//           onInit={setReactFlowInstance}
//           onDrop={onDrop}
//           onDragOver={onDragOver}
//           onNodeDoubleClick={onNodeDoubleClick}
//           onEdgeUpdate={onEdgeUpdate}
//           onEdgeClick={onEdgeClick}
//           onEdgeDoubleClick={onEdgeDoubleClick}
//           nodeTypes={nodeTypes}
//           connectionLineStyle={connectionLineStyle}
//           defaultEdgeOptions={defaultEdgeOptions}
//           fitView
//           snapToGrid={true}
//           snapGrid={[15, 15]}
//           connectionMode="loose"
//           deleteKeyCode={['Backspace', 'Delete']}
//           edgesUpdatable={true}
//           edgesFocusable={true}
//           selectNodesOnDrag={false}
//           connectionRadius={20}
//         >
//           <Controls />
//           <MiniMap />
//           <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
//           <Panel position="top-right" className="w-2/5">
//             <ControlPanel 
//               saveFlow={saveFlow} 
//               autoLayout={autoLayoutNodes} 
//               generateWithAI={generateWithAI}
//               clearGraph={clearGraph}
//               debugFlow={debugFlow}
//               isGenerating={isGeneratingAI}
//             />
//           </Panel>
//         </ReactFlow>
//       </div>

//       {/* Node Form Modal */}
//       {nodeFormOpen && (
//         <NodeFormModal 
//           nodeFormData={nodeFormData}
//           setNodeFormData={setNodeFormData}
//           onSubmit={handleNodeFormSubmit}
//           onCancel={() => {
//             setNodeFormOpen(false);
//             setEditingNode(null);
//           }}
//           onDelete={editingNode ? deleteNode : undefined}
//           isEditing={!!editingNode}
//         />
//       )}
      
//       {/* Confirmation Modal for Clear Graph */}
//       <ConfirmationModal
//         isOpen={confirmModalOpen}
//         title="Clear Graph"
//         message="Are you sure you want to clear the graph? This will remove all nodes except Start and Conclusion."
//         confirmText="Clear Graph"
//         cancelText="Cancel"
//         onConfirm={handleClearConfirm}
//         onCancel={() => setConfirmModalOpen(false)}
//       />

//       {/* Confirmation Modal for Edge Deletion */}
//       <ConfirmationModal
//         isOpen={edgeDeleteModalOpen}
//         title="Delete Connection"
//         message="Are you sure you want to delete this connection between nodes?"
//         confirmText="Delete Connection"
//         cancelText="Cancel"
//         onConfirm={handleEdgeDeleteConfirm}
//         onCancel={() => setEdgeDeleteModalOpen(false)}
//       />

//       {/* Confirmation Modal for Default Graph */}
//       <ConfirmationModal
//         isOpen={showDefaultGraphModal}
//         title="Interview Flow Setup"
//         message="No saved interview flow found for this job. Would you like to use the default template or start with a minimal flow?"
//         confirmText="Use Default Template"
//         cancelText="Start Minimal"
//         onConfirm={useDefaultGraph}
//         onCancel={useEmptyGraph}
//       />
//     </div>
//   );
// }
