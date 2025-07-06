// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview Allows the user to correct the recognized text from handwriting or image upload before solving the problem.
 *
 * - correctRecognizedText - A function that handles the correction of recognized text.
 * - CorrectRecognizedTextInput - The input type for the correctRecognizedText function.
 * - CorrectRecognizedTextOutput - The return type for the correctRecognizedText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CorrectRecognizedTextInputSchema = z.object({
  originalText: z.string().describe('The original text recognized from the handwriting or image upload.'),
  correctedText: z.string().describe('The corrected text provided by the user.'),
});

export type CorrectRecognizedTextInput = z.infer<typeof CorrectRecognizedTextInputSchema>;

const CorrectRecognizedTextOutputSchema = z.object({
  correctedText: z.string().describe('The final corrected text to be used for solving the problem.'),
});

export type CorrectRecognizedTextOutput = z.infer<typeof CorrectRecognizedTextOutputSchema>;

export async function correctRecognizedText(input: CorrectRecognizedTextInput): Promise<CorrectRecognizedTextOutput> {
  return correctRecognizedTextFlow(input);
}

const correctRecognizedTextFlow = ai.defineFlow(
  {
    name: 'correctRecognizedTextFlow',
    inputSchema: CorrectRecognizedTextInputSchema,
    outputSchema: CorrectRecognizedTextOutputSchema,
  },
  async input => {
    // Simply return the corrected text provided by the user.
    return {correctedText: input.correctedText};
  }
);
