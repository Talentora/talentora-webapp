import { Node, Edge, MarkerType } from 'reactflow';

export const initialNodes: Node[] = [
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
      content: 'How do you ensure code quality and what tools do you use for this purpose?',
      criteria: 'Check for quality assurance practices and familiarity with relevant tools.'
    },
    position: { x: 1450, y: 300 },
  },
  {
    id: 'conclusion',
    type: 'conclusion',
    data: { 
      label: 'Interview Conclusion',
      content: 'Thank the candidate for their time. Explain the next steps in the interview process and timeline.'
    },
    position: { x: 1800, y: 150 },
  }
];

export const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'start',
    target: 'intro',
    type: 'step',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e2-3',
    source: 'intro',
    target: 'question1',
    type: 'step',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e2-4',
    source: 'intro',
    target: 'question2',
    type: 'step',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e3-5',
    source: 'question1',
    target: 'technical',
    type: 'step',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e4-5',
    source: 'question2',
    target: 'technical',
    type: 'step',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e5-6',
    source: 'technical',
    target: 'question3',
    type: 'step',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e5-7',
    source: 'technical',
    target: 'question4',
    type: 'step',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e5-8',
    source: 'technical',
    target: 'question5',
    type: 'step',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e6-9',
    source: 'question3',
    target: 'conclusion',
    type: 'step',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e7-9',
    source: 'question4',
    target: 'conclusion',
    type: 'step',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e8-9',
    source: 'question5',
    target: 'conclusion',
    type: 'step',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  }
]; 