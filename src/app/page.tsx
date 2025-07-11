'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Whiteboard from '@/components/Whiteboard';
import SolutionDisplay from '@/components/SolutionDisplay';
import { solveProblem } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

export interface SolutionState {
  recognizedText: string;
  solutionSteps: string[];
  subject: string;
  explanation: string;
}

export default function Home() {
  const [solution, setSolution] = useState<SolutionState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSolutionVisible, setIsSolutionVisible] = useState(false);
  const [key, setKey] = useState(Date.now()); // Key to reset child components
  const { toast } = useToast();

  const handleSolve = async (imageDataUrl: string) => {
    if (!imageDataUrl) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please draw or upload a problem first.',
      });
      return;
    }
    setIsLoading(true);
    setSolution(null);
    setIsSolutionVisible(false);

    const result = await solveProblem(imageDataUrl);

    setIsLoading(false);
    if ('error' in result) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else {
      setSolution({
        ...result,
        explanation: '',
      });
      setIsSolutionVisible(true);
    }
  };

  const handleReset = () => {
    setSolution(null);
    setIsLoading(false);
    setIsSolutionVisible(false);
    setKey(Date.now()); // Change key to force re-render of Whiteboard
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <Header />
      <main className="flex-grow relative">
        <Whiteboard
          key={key}
          onSolve={handleSolve}
          isLoading={isLoading}
          onReset={handleReset}
        />
        {isSolutionVisible && solution && (
          <SolutionDisplay
            solution={solution}
            isLoading={isLoading}
            onClose={() => setIsSolutionVisible(false)}
          />
        )}
      </main>
    </div>
  );
}
