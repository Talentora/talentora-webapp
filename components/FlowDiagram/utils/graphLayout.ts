import { Node, Edge } from 'reactflow';

interface LayoutOptions {
  startX?: number;
  centerY?: number;
  sectionSpacingX?: number;
  questionSpacingY?: number;
}

interface LayoutResult {
  nodes: Node[];
  edges: Edge[];
}

// Helper function to detect which section a question belongs to
const getQuestionSection = (
  questionId: string, 
  edges: Edge[], 
  nodes: Node[]
): string | null => {
  // Find edges where this question is the target and source is a section
  const sectionEdge = edges.find(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    return edge.target === questionId && sourceNode && sourceNode.type === 'section';
  });
  
  return sectionEdge ? sectionEdge.source : null;
};

export const layoutGraph = (
  nodes: Node[],
  edges: Edge[],
  options: LayoutOptions = {}
): LayoutResult => {
  const {
    startX = 50,
    centerY = 300,
    sectionSpacingX = 400,
    questionSpacingY = 150
  } = options;

  // Create a map to store which questions belong to which section
  const sectionQuestions = new Map<string, string[]>();
  
  // Create node map for parent-child relationships
  const nodeMap = new Map<string, { parents: string[]; children: string[] }>();
  
  // Initialize the node map
  nodes.forEach(node => {
    nodeMap.set(node.id, { parents: [], children: [] });
  });
  
  // Fill the node map with connections
  edges.forEach(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    
    if (!sourceNode || !targetNode) return;
    
    // Add parent-child relationships
    const sourceNodeInfo = nodeMap.get(edge.source);
    const targetNodeInfo = nodeMap.get(edge.target);
    
    if (sourceNodeInfo && targetNodeInfo) {
      sourceNodeInfo.children.push(edge.target);
      targetNodeInfo.parents.push(edge.source);
    }
    
    // Group questions by their parent section
    if (sourceNode.type === 'section' && targetNode.type === 'question') {
      const questions = sectionQuestions.get(edge.source) || [];
      if (!questions.includes(edge.target)) {
        questions.push(edge.target);
        sectionQuestions.set(edge.source, questions);
      }
    }
  });
  
  // Add questions that are connected to other questions (in the same section)
  nodes.forEach(node => {
    if (node.type === 'question') {
      const nodeSection = getQuestionSection(node.id, edges, nodes);
      if (nodeSection) {
        // Find children questions
        const nodeInfo = nodeMap.get(node.id);
        if (nodeInfo) {
          nodeInfo.children.forEach(childId => {
            const childNode = nodes.find(n => n.id === childId);
            if (childNode && childNode.type === 'question') {
              // Add this child to the section's questions if not already there
              const questions = sectionQuestions.get(nodeSection) || [];
              if (!questions.includes(childId)) {
                questions.push(childId);
                sectionQuestions.set(nodeSection, questions);
              }
            }
          });
        }
      }
    }
  });
  
  // Determine the flow order by following connections from start
  const flowOrder: string[] = [];
  const visited = new Set<string>();
  
  // Find start node
  const startNode = nodes.find(node => node.type === 'input');
  if (!startNode) return { nodes: [...nodes], edges: [...edges] }; // Return original if no start node found
  
  // Helper function to traverse the graph
  const traverseGraph = (nodeId: string) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    flowOrder.push(nodeId);
    
    // Get children of this node
    const children = nodeMap.get(nodeId)?.children || [];
    children.forEach(childId => {
      traverseGraph(childId);
    });
  };
  
  // Start traversal from the start node
  traverseGraph(startNode.id);
  
  // Create a copy of nodes for positioning
  const newNodes = [...nodes];
  
  // Identify sections for horizontal placement
  const sections = nodes.filter(node => node.type === 'section').map(node => node.id);
  
  // Position nodes based on flow order
  let currentX = startX;
  
  // Keep track of which questions have been positioned
  const positionedQuestions = new Set<string>();
  
  // Position the start node
  const startNodeIndex = newNodes.findIndex(n => n.id === startNode.id);
  if (startNodeIndex !== -1) {
    newNodes[startNodeIndex] = {
      ...newNodes[startNodeIndex],
      position: { x: currentX, y: centerY }
    };
    currentX += 250;
  }
  
  // Position sections horizontally with their questions vertically stacked
  sections.forEach(sectionId => {
    const sectionIndex = newNodes.findIndex(n => n.id === sectionId);
    if (sectionIndex === -1) return;
    
    // Position the section
    newNodes[sectionIndex] = {
      ...newNodes[sectionIndex],
      position: { x: currentX, y: centerY }
    };
    
    // Get questions for this section
    const questionIds = sectionQuestions.get(sectionId) || [];
    
    // Start vertically stacking questions below the section
    let questionY = centerY + 150; // Start below the section
    
    questionIds.forEach(questionId => {
      const questionIndex = newNodes.findIndex(n => n.id === questionId);
      if (questionIndex !== -1) {
        // Position question vertically below the section
        newNodes[questionIndex] = {
          ...newNodes[questionIndex],
          position: { x: currentX, y: questionY }
        };
        questionY += questionSpacingY; // Move down for next question
        
        // Mark as positioned so we don't position it again
        positionedQuestions.add(questionId);
      }
    });
    
    // Move to the next section horizontally
    currentX += sectionSpacingX;
  });
  
  // Position any remaining nodes in the flow order
  flowOrder.forEach(nodeId => {
    // Skip nodes we've already positioned
    if (nodeId === startNode.id || sections.includes(nodeId) || positionedQuestions.has(nodeId)) {
      return;
    }
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    const nodeIndex = newNodes.findIndex(n => n.id === nodeId);
    if (nodeIndex === -1) return;
    
    // Position the node
    switch (node.type) {
      case 'question': // Standalone question
        newNodes[nodeIndex] = {
          ...newNodes[nodeIndex],
          position: { x: currentX, y: centerY }
        };
        currentX += 300;
        break;
        
      case 'conclusion': // End node
        newNodes[nodeIndex] = {
          ...newNodes[nodeIndex],
          position: { x: currentX, y: centerY }
        };
        break;
        
      default:
        newNodes[nodeIndex] = {
          ...newNodes[nodeIndex],
          position: { x: currentX, y: centerY }
        };
        currentX += 200;
    }
  });
  
  // Now optimize edge connections based on node positions
  const optimizedEdges = edges.map(edge => {
    const sourceNode = newNodes.find(node => node.id === edge.source);
    const targetNode = newNodes.find(node => node.id === edge.target);
    
    if (!sourceNode || !targetNode) return edge;
    
    // Calculate the centers of the nodes
    const sourceX = sourceNode.position.x + (sourceNode.width || 200) / 2;
    const sourceY = sourceNode.position.y + (sourceNode.height || 100) / 2;
    const targetX = targetNode.position.x + (targetNode.width || 200) / 2;
    const targetY = targetNode.position.y + (targetNode.height || 100) / 2;
    
    // Determine the best source and target handles
    let sourceHandle: string;
    let targetHandle: string;
    
    // For vertical connections (when vertical distance is greater than horizontal)
    if (Math.abs(sourceX - targetX) < Math.abs(sourceY - targetY)) {
      if (sourceY < targetY) {
        // Source is above target
        sourceHandle = 'bottom';
        targetHandle = 'top';
      } else {
        // Source is below target
        sourceHandle = 'top';
        targetHandle = 'bottom';
      }
    } 
    // For horizontal connections
    else {
      if (sourceX < targetX) {
        // Source is to the left of target
        sourceHandle = 'right';
        targetHandle = 'left';
      } else {
        // Source is to the right of target
        sourceHandle = 'left';
        targetHandle = 'right';
      }
    }
    
    return {
      ...edge,
      sourceHandle,
      targetHandle
    };
  });
  
  return { 
    nodes: newNodes,
    edges: optimizedEdges
  };
}; 