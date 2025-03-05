import InputNode from './InputNode';
import QuestionNode from './QuestionNode';
import SectionNode from './SectionNode';
import ConclusionNode from './ConclusionNode';

// Create a mapping for node types to components
export const nodeTypes = {
  input: InputNode,
  question: QuestionNode,
  section: SectionNode,
  conclusion: ConclusionNode,
};

export {
  InputNode,
  QuestionNode,
  SectionNode,
  ConclusionNode
}; 