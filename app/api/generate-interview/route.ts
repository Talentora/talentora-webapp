// import { NextRequest, NextResponse } from 'next/server';
// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(req: NextRequest) {
//   try {
//     console.log('Generate interview API called');
//     const { jobTitle, jobDescription } = await req.json();
    
//     console.log('Job details received:', { jobTitle, jobDescription: jobDescription.substring(0, 100) + '...' });

//     if (!jobTitle || !jobDescription) {
//       console.error('Job title and description are required');
//       return NextResponse.json(
//         { error: 'Job title and description are required' },
//         { status: 400 }
//       );
//     }

//     // Prepare the prompt for the AI
//     const prompt = `
//       Create a structured interview flow for a "${jobTitle}" position.
      
//       Job Description:
//       ${jobDescription}
      
//       Generate a complete interview flow with the following components:
//       1. A start node to welcome the candidate
//       2. Section nodes to organize the interview by topics (2-3 sections)
//       3. Question nodes with specific questions and evaluation criteria (5-7 questions total)
//       4. A conclusion node to end the interview
      
//       Format the response as a JSON object with two arrays:
//       1. "nodes" - Each node should have: id, type (input, section, question, or conclusion), data (with label, content, and criteria for questions)
//       2. "edges" - Each edge should have: id, source (node id), target (node id)
      
//       The flow should follow a logical progression and cover all key aspects of the role.
//     `;

//     console.log('Calling OpenAI API...');
    
//     // Call the OpenAI API with a timeout
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
    
//     try {
//       // Call the OpenAI API
//       const response = await openai.chat.completions.create({
//         model: 'gpt-3.5-turbo', // Fallback to a faster model
//         messages: [
//           {
//             role: 'system',
//             content: 'You are an expert in creating structured interview flows for job positions. Your task is to generate a comprehensive interview structure based on the job description provided.',
//           },
//           {
//             role: 'user',
//             content: prompt,
//           },
//         ],
//         temperature: 0.7,
//         max_tokens: 2000,
//       }, { signal: controller.signal });
      
//       clearTimeout(timeoutId);
      
//       console.log('OpenAI API response received');
      
//       // Extract and parse the JSON response
//       const content = response.choices[0]?.message?.content || '';
//       console.log('Raw content from OpenAI:', content.substring(0, 200) + '...');
      
//       // Find JSON in the response
//       const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
//                         content.match(/{[\s\S]*}/);
                        
//       if (!jsonMatch) {
//         console.error('Failed to extract JSON from response:', content);
//         return NextResponse.json(
//           { error: 'Failed to generate interview flow' },
//           { status: 500 }
//         );
//       }
      
//       const jsonString = jsonMatch[1] || jsonMatch[0];
//       console.log('Extracted JSON string:', jsonString.substring(0, 200) + '...');
      
//       try {
//         const parsedData = JSON.parse(jsonString);
        
//         // Ensure the response has the expected structure
//         if (!parsedData.nodes || !parsedData.edges || 
//             !Array.isArray(parsedData.nodes) || !Array.isArray(parsedData.edges)) {
//           throw new Error('Invalid response structure');
//         }
        
//         // Process nodes to ensure they have the correct format
//         parsedData.nodes = parsedData.nodes.map((node: any, index: number) => {
//           // Ensure node has an id
//           const nodeId = node.id || `node_${index}`;
          
//           // Ensure node has a valid type
//           const nodeType = ['input', 'section', 'question', 'conclusion'].includes(node.type) 
//             ? node.type 
//             : node.type === 'start' ? 'input' : 'question';
          
//           // Ensure node has position data
//           const position = node.position || { x: 100 + (index * 200), y: 100 + (index % 2) * 100 };
          
//           // Ensure node data has the required properties
//           const nodeData = {
//             label: node.data?.label || 'Untitled Node',
//             content: node.data?.content || '',
//             ...(nodeType === 'question' ? { criteria: node.data?.criteria || 'No criteria specified' } : {})
//           };
          
//           return {
//             id: nodeId,
//             type: nodeType,
//             data: nodeData,
//             position: position
//           };
//         });
        
//         // Process edges to ensure they have the correct format
//         parsedData.edges = parsedData.edges.map((edge: any, index: number) => ({
//           id: edge.id || `edge_${index}`,
//           source: edge.source,
//           target: edge.target,
//           type: edge.type || 'smoothstep'
//         }));
        
//         console.log('Interview flow generated successfully:', 
//           { nodeCount: parsedData.nodes.length, edgeCount: parsedData.edges.length });
//         return NextResponse.json(parsedData);
//       } catch (parseError) {
//         console.error('Error parsing JSON:', parseError, 'JSON string:', jsonString);
//         return NextResponse.json(
//           { error: 'Failed to parse generated interview flow' },
//           { status: 500 }
//         );
//       }
//     } catch (openaiError) {
//       clearTimeout(timeoutId);
//       console.error('OpenAI API error:', openaiError);
      
//       // Try with a simpler fallback approach
//       return createFallbackInterviewFlow(jobTitle, jobDescription);
//     }
//   } catch (error) {
//     console.error('Error generating interview flow:', error);
//     return NextResponse.json(
//       { error: 'An error occurred while generating the interview flow' },
//       { status: 500 }
//     );
//   }
// }

// // Fallback function to create a basic interview flow if OpenAI fails
// function createFallbackInterviewFlow(jobTitle: string, jobDescription: string) {
//   console.log('Using fallback interview flow generator');
  
//   const fallbackFlow = {
//     nodes: [
//       {
//         id: 'start',
//         type: 'input',
//         data: { 
//           label: 'Interview Start',
//           content: `Welcome the candidate and introduce yourself. This interview is for the ${jobTitle} position.`
//         },
//         position: { x: 50, y: 150 },
//       },
//       {
//         id: 'section_background',
//         type: 'section',
//         data: { 
//           label: 'Background & Experience',
//           content: 'This section covers the candidate\'s background and relevant experience.'
//         },
//         position: { x: 300, y: 150 },
//       },
//       {
//         id: 'question_experience',
//         type: 'question',
//         data: { 
//           label: 'Experience Question',
//           content: `Tell me about your experience that's relevant to this ${jobTitle} role.`,
//           criteria: 'Look for relevant experience and clear communication.'
//         },
//         position: { x: 550, y: 100 },
//       },
//       {
//         id: 'question_challenge',
//         type: 'question',
//         data: { 
//           label: 'Challenge Question',
//           content: 'Describe a challenging situation in your previous role and how you resolved it.',
//           criteria: 'Assess problem-solving skills and resilience.'
//         },
//         position: { x: 550, y: 250 },
//       },
//       {
//         id: 'section_skills',
//         type: 'section',
//         data: { 
//           label: 'Skills Assessment',
//           content: 'This section evaluates the candidate\'s technical and soft skills.'
//         },
//         position: { x: 800, y: 150 },
//       },
//       {
//         id: 'question_skills',
//         type: 'question',
//         data: { 
//           label: 'Skills Question',
//           content: `What specific skills do you bring to this ${jobTitle} position?`,
//           criteria: 'Evaluate relevant technical and soft skills.'
//         },
//         position: { x: 1050, y: 150 },
//       },
//       {
//         id: 'conclusion',
//         type: 'conclusion',
//         data: { 
//           label: 'Interview Conclusion',
//           content: 'Thank the candidate for their time. Ask if they have any questions about the role or company. Explain next steps in the hiring process.'
//         },
//         position: { x: 1300, y: 150 },
//       }
//     ],
//     edges: [
//       {
//         id: 'e-start-section_background',
//         source: 'start',
//         target: 'section_background',
//         type: 'smoothstep'
//       },
//       {
//         id: 'e-section_background-question_experience',
//         source: 'section_background',
//         target: 'question_experience',
//         type: 'smoothstep'
//       },
//       {
//         id: 'e-question_experience-question_challenge',
//         source: 'question_experience',
//         target: 'question_challenge',
//         type: 'smoothstep'
//       },
//       {
//         id: 'e-question_challenge-section_skills',
//         source: 'question_challenge',
//         target: 'section_skills',
//         type: 'smoothstep'
//       },
//       {
//         id: 'e-section_skills-question_skills',
//         source: 'section_skills',
//         target: 'question_skills',
//         type: 'smoothstep'
//       },
//       {
//         id: 'e-question_skills-conclusion',
//         source: 'question_skills',
//         target: 'conclusion',
//         type: 'smoothstep'
//       }
//     ]
//   };
  
//   return NextResponse.json(fallbackFlow);
// } 