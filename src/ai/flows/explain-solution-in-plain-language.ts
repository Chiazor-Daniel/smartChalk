'use server';
/**
 * @fileOverview Explains the solution steps in plain language for better understanding.
 *
 * - explainSolution - A function that explains the solution steps.
 * - ExplainSolutionInput - The input type for the explainSolution function.
 * - ExplainSolutionOutput - The return type for the explainSolution function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainSolutionInputSchema = z.object({
  problem: z.string().describe('The problem that was solved.'),
  solutionSteps: z.string().describe('The step-by-step solution to the problem.'),
  subject: z.string().describe('The subject of the problem (e.g., math, physics, chemistry).'),
});
export type ExplainSolutionInput = z.infer<typeof ExplainSolutionInputSchema>;

const ExplainSolutionOutputSchema = z.object({
  plainLanguageExplanation: z.string().describe('The explanation of the solution steps in plain language.'),
});
export type ExplainSolutionOutput = z.infer<typeof ExplainSolutionOutputSchema>;

export async function explainSolution(input: ExplainSolutionInput): Promise<ExplainSolutionOutput> {
  return explainSolutionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainSolutionPrompt',
  input: {schema: ExplainSolutionInputSchema},
  output: {schema: ExplainSolutionOutputSchema},
  prompt: `You are an expert tutor skilled at explaining complex solutions in plain language.

  Subject: {{{subject}}}
  Problem: {{{problem}}}
  Solution Steps: {{{solutionSteps}}}

  Explain the solution steps in plain language, so that a student can better understand the underlying concepts.
  Focus on clarity and intuition, not just the mathematical or scientific procedures.
  `, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const explainSolutionFlow = ai.defineFlow(
  {
    name: 'explainSolutionFlow',
    inputSchema: ExplainSolutionInputSchema,
    outputSchema: ExplainSolutionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
