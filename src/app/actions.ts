'use server';

import { solveProblemFromImage } from '@/ai/flows/solve-problem-from-image';
import { explainSolution } from '@/ai/flows/explain-solution-in-plain-language';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import type { SolveProblemFromImageOutput } from '@/ai/flows/solve-problem-from-image';
import type { ExplainSolutionOutput } from '@/ai/flows/explain-solution-in-plain-language';
import type { TextToSpeechOutput } from '@/ai/flows/text-to-speech';

interface SolveProblemResult extends SolveProblemFromImageOutput {
  audioDataUri?: string;
}

export async function solveProblem(imageDataUrl: string): Promise<SolveProblemResult | { error: string }> {
  try {
    // Kick off both requests in parallel
    const solvePromise = solveProblemFromImage({ photoDataUri: imageDataUrl });
    const result = await solvePromise;

    // After the problem is solved, immediately generate audio for the steps
    // Don't wait for this to return, but handle its result.
    const speechPromise = textToSpeech({ text: result.solutionSteps.join('. ') });

    const speechResult = await speechPromise;

    return {
      ...result,
      audioDataUri: speechResult.audioDataUri,
    };

  } catch (error) {
    console.error('Error solving problem:', error);
    return { error: 'Sorry, I was unable to process the image. Please try again with a clearer image.' };
  }
}

export async function getExplanation(problem: string, solutionSteps: string, subject: string): Promise<ExplainSolutionOutput> {
  try {
    const explanation = await explainSolution({ problem, solutionSteps, subject });
    return explanation;
  } catch (error) {
    console.error('Error getting explanation:', error);
    return { plainLanguageExplanation: 'Sorry, I was unable to generate an explanation at this time.' };
  }
}

export async function getSpeechForText(text: string): Promise<TextToSpeechOutput | { error: string }> {
  try {
    const result = await textToSpeech({ text });
    return result;
  } catch (error) {
    console.error('Error generating speech:', error);
    return { error: 'Sorry, I was unable to generate audio at this time.' };
  }
}
