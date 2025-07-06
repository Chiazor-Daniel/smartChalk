'use server';

import { solveProblemFromImage } from '@/ai/flows/solve-problem-from-image';
import { explainSolution } from '@/ai/flows/explain-solution-in-plain-language';
import { generatePracticeProblems } from '@/ai/flows/generate-practice-problems';
import type { SolveProblemFromImageOutput } from '@/ai/flows/solve-problem-from-image';
import type { ExplainSolutionOutput } from '@/ai/flows/explain-solution-in-plain-language';
import type { GeneratePracticeProblemsOutput } from '@/ai/flows/generate-practice-problems';

export async function solveProblem(imageDataUrl: string): Promise<SolveProblemFromImageOutput | { error: string }> {
  try {
    const result = await solveProblemFromImage({ photoDataUri: imageDataUrl });
    return result;
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

export async function getPracticeProblems(problemText: string, subject: string): Promise<GeneratePracticeProblemsOutput> {
  try {
    const problems = await generatePracticeProblems({ problemText, subject });
    return problems;
  } catch (error) {
    console.error('Error generating practice problems:', error);
    return { practiceProblems: ['Sorry, I was unable to generate practice problems at this time.'] };
  }
}
