'use server';

/**
 * @fileOverview Solves a STEM problem from an image.
 *
 * - solveProblemFromImage - A function that recognizes text from an image, identifies the subject, and solves the problem.
 * - SolveProblemFromImageInput - The input type for the solveProblemFromImage function.
 * - SolveProblemFromImageOutput - The return type for the solveProblemFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SolveProblemFromImageInputSchema = z.object({
  photoDataUri: z.string().describe("A photo of a handwritten problem, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type SolveProblemFromImageInput = z.infer<typeof SolveProblemFromImageInputSchema>;

const SolveProblemFromImageOutputSchema = z.object({
  recognizedText: z.string().describe('The recognized text from the image.'),
  subject: z.string().describe('The subject of the problem (e.g., math, physics, chemistry).'),
  solutionSteps: z.array(z.string()).describe('The step-by-step solution to the problem.'),
});
export type SolveProblemFromImageOutput = z.infer<typeof SolveProblemFromImageOutputSchema>;

export async function solveProblemFromImage(input: SolveProblemFromImageInput): Promise<SolveProblemFromImageOutput> {
  return solveProblemFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'solveProblemFromImagePrompt',
  input: {schema: SolveProblemFromImageInputSchema},
  output: {schema: SolveProblemFromImageOutputSchema},
  prompt: `You are an expert in solving STEM problems. Given an image of a handwritten problem, please perform the following tasks:
1.  **Recognize the text** of the problem from the image.
2.  **Identify the subject** of the problem (e.g., math, physics, chemistry).
3.  Provide a detailed, **step-by-step solution** to the problem.

Image of the problem: {{media url=photoDataUri}}
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const solveProblemFromImageFlow = ai.defineFlow(
  {
    name: 'solveProblemFromImageFlow',
    inputSchema: SolveProblemFromImageInputSchema,
    outputSchema: SolveProblemFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
