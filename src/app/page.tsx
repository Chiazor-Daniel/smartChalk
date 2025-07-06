'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Whiteboard from '@/components/Whiteboard';
import SolutionDisplay from '@/components/SolutionDisplay';
import { Card, CardContent } from '@/components/ui/card';
import { solveProblem } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export interface SolutionState {
  recognizedText: string;
  solutionSteps: string[];
  subject: string;
  explanation: string;
}

export default function Home() {
  const [solution, setSolution] = useState<SolutionState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState(Date.now()); // Key to reset child components

  const handleSolve = async (imageDataUrl: string) => {
    if (!imageDataUrl) {
      setError('Please draw or upload a problem first.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setSolution(null);

    const result = await solveProblem(imageDataUrl);

    setIsLoading(false);
    if ('error' in result) {
      setError(result.error);
    } else {
      setSolution({
        ...result,
        explanation: '',
      });
    }
  };

  const handleReset = () => {
    setSolution(null);
    setIsLoading(false);
    setError(null);
    setKey(Date.now()); // Change key to force re-render of Whiteboard
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Whiteboard key={key} onSolve={handleSolve} isLoading={isLoading} onReset={handleReset} />
            </CardContent>
          </Card>
          <Card className="shadow-lg min-h-[500px] lg:min-h-[640px]">
            <CardContent className="p-6 h-full">
              <SolutionDisplay solution={solution} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Draw on the whiteboard or upload an image of a problem to get started.</p>
          <p>Supports basic Math, Physics, and Chemistry problems.</p>
        </div>
      </main>
    </div>
  );
}
