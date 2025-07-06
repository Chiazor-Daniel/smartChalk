'use server';

/**
 * @fileOverview Flow to generate practice problems similar to a given problem.
 *
 * - generatePracticeProblems - A function that generates practice problems.
 * - GeneratePracticeProblemsInput - The input type for the generatePracticeProblems function.
 * - GeneratePracticeProblemsOutput - The return type for the generatePracticeProblems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePracticeProblemsInputSchema = z.object({
  problemText: z.string().describe('The text of the problem to generate similar practice problems for.'),
  subject: z.string().describe('The subject of the problem (e.g., math, physics, chemistry).'),
});
export type GeneratePracticeProblemsInput = z.infer<typeof GeneratePracticeProblemsInputSchema>;

const GeneratePracticeProblemsOutputSchema = z.object({
  practiceProblems: z.array(z.string()).describe('An array of practice problems similar to the input problem.'),
});
export type GeneratePracticeProblemsOutput = z.infer<typeof GeneratePracticeProblemsOutputSchema>;

export async function generatePracticeProblems(input: GeneratePracticeProblemsInput): Promise<GeneratePracticeProblemsOutput> {
  return generatePracticeProblemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePracticeProblemsPrompt',
  input: {schema: GeneratePracticeProblemsInputSchema},
  output: {schema: GeneratePracticeProblemsOutputSchema},
  prompt: `You are an expert problem generator for STEM subjects.  Given a problem and its subject, you will generate three similar practice problems.

Subject: {{{subject}}}

Original Problem: {{{problemText}}}

Practice Problems:
1.`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const generatePracticeProblemsFlow = ai.defineFlow(
  {
    name: 'generatePracticeProblemsFlow',
    inputSchema: GeneratePracticeProblemsInputSchema,
    outputSchema: GeneratePracticeProblemsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Split the output into individual problems
    const rawProblems = output!.practiceProblems;
    const problems = (output!.practiceProblems as any).split(/\n\d+\.\s*/).filter((problem: string) => problem.trim() !== '');
    return {
      practiceProblems: problems,
    };
  }
);
