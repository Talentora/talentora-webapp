import { Edge, Node } from 'reactflow';

// Function to validate the flow graph
export const validateFlow = (nodes: Node[], edges: Edge[]): { valid: boolean; message: string } => {
  // Check if there's at least one start node (input type)
  const startNodes = nodes.filter(node => node.type === 'input');
  if (startNodes.length === 0) {
    return { valid: false, message: 'Flow must have a start node!' };
  }
  
  if (startNodes.length > 1) {
    return { valid: false, message: 'Flow must have exactly one start node!' };
  }

  // Check if there's at least one conclusion node
  const conclusionNodes = nodes.filter(node => node.type === 'conclusion');
  if (conclusionNodes.length === 0) {
    return { valid: false, message: 'Flow must have at least one conclusion node!' };
  }

  // Check if every node is connected
  const connectedNodes = new Set<string>();
  edges.forEach(edge => {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  });
  
  const disconnectedNodes = nodes.filter(node => !connectedNodes.has(node.id));
  if (disconnectedNodes.length > 0) {
    return { 
      valid: false, 
      message: `There are disconnected nodes: ${disconnectedNodes.map(n => n.data.label).join(', ')}` 
    };
  }

  // Check that each node (except input and conclusion) has exactly two connections
  const connectionCounts = new Map<string, number>();
  
  // Initialize connection counts
  nodes.forEach(node => {
    connectionCounts.set(node.id, 0);
  });
  
  // Count connections for each node
  edges.forEach(edge => {
    connectionCounts.set(edge.source, (connectionCounts.get(edge.source) || 0) + 1);
    connectionCounts.set(edge.target, (connectionCounts.get(edge.target) || 0) + 1);
  });
  
  // Check each node has the correct number of connections
  const nodesWithWrongConnections = nodes.filter(node => {
    // Skip input and conclusion nodes
    if (node.type === 'input' || node.type === 'conclusion') {
      return false;
    }
    
    // Other nodes should have exactly 2 connections
    return connectionCounts.get(node.id) !== 2;
  });
  
  if (nodesWithWrongConnections.length > 0) {
    const nodesList = nodesWithWrongConnections.map(node => {
      const count = connectionCounts.get(node.id) || 0;
      return `${node.data.label} (${count} connections)`; 
    }).join(', ');
    
    return {
      valid: false,
      message: `Each node (except for start and conclusion) must have exactly 2 connections. Problem nodes: ${nodesList}`
    };
  }

  // Check for cycles in the graph
  const nodeIds = nodes.map(node => node.id);
  const adjacencyList = new Map<string, string[]>();
  
  // Initialize adjacency list
  nodeIds.forEach(id => {
    adjacencyList.set(id, []);
  });
  
  // Fill adjacency list with connections
  edges.forEach(edge => {
    const sourceConnections = adjacencyList.get(edge.source) || [];
    sourceConnections.push(edge.target);
    adjacencyList.set(edge.source, sourceConnections);
  });
  
  // Helper function to check for cycles using DFS
  const checkCycle = (nodeId: string, path = new Set<string>()): boolean => {
    if (path.has(nodeId)) {
      return true; // Cycle detected
    }
    
    path.add(nodeId);
    
    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (checkCycle(neighbor, new Set(path))) {
        return true;
      }
    }
    
    return false;
  };
  
  // Check for cycles starting from each node
  for (const nodeId of nodeIds) {
    if (checkCycle(nodeId)) {
      return { valid: false, message: 'Cycle detected in flow! Please remove any circular connections.' };
    }
  }

  // Check if start node connects directly to conclusion
  const startNodeId = startNodes[0].id;
  const startNodeConnections = adjacencyList.get(startNodeId) || [];
  
  if (startNodeConnections.some(targetId => 
    nodes.find(n => n.id === targetId && n.type === 'conclusion'))) {
    return { 
      valid: false, 
      message: 'Start node cannot connect directly to Conclusion. Please add at least one question or section in between.' 
    };
  }

  return { valid: true, message: 'Flow is valid!' };
}; 