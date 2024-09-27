import { generateText } from 'ai';
import { createOpenAI as createGroq } from '@ai-sdk/openai';
import { z } from 'zod';

const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY
});

console.log('groq', groq);

export const generateQuestion = async (type: string) => {
  const role = 'Software Engineer';
  const company = 'Google';

  const { text } = await generateText({
    model: groq('llama-3.1-8b-instant'),
    system: `You are an interviewer at ${company}. Only generate question text.`,
    prompt: `Generate a ${type} question for a job interview for a ${role} position.`
    // responseSchema: z.object({
    //   text: z.string()
    // })
  });
  console.log('text', text);
  return text;
};
