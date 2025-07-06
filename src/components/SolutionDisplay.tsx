'use client';

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, Loader2, Volume2 } from 'lucide-react';
import type { SolutionState } from '@/app/page';
import { getExplanation, getSpeechForText } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';

interface SolutionDisplayProps {
  solution: SolutionState | null;
  isLoading: boolean;
}

export default function SolutionDisplay({ solution, isLoading }: SolutionDisplayProps) {
  const [explanation, setExplanation] = useState('');
  const [isExplanationLoading, setIsExplanationLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const { toast } = useToast();

  const handleExplain = async () => {
    if (!solution) return;
    setIsExplanationLoading(true);
    setAudioUrl(''); // Reset audio when new explanation is fetched
    const result = await getExplanation(solution.recognizedText, solution.solutionSteps.join('\n'), solution.subject);
    setExplanation(result.plainLanguageExplanation);
    setIsExplanationLoading(false);
  };

  const handleListen = async () => {
    if (!explanation) return;
    setIsAudioLoading(true);
    setAudioUrl('');
    const result = await getSpeechForText(explanation);
    if ('error' in result) {
      toast({
        variant: 'destructive',
        title: 'Audio Generation Failed',
        description: result.error,
      });
    } else {
      setAudioUrl(result.audioDataUri);
    }
    setIsAudioLoading(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center text-foreground">Solution</h2>
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!solution) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Lightbulb className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Your Solution Appears Here</h2>
        <p>Draw a problem on the whiteboard or upload an image, then click "Solve" to see the magic happen.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-center text-foreground">Solution</h2>
      
      <div className="flex-grow space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-2">Recognized Problem:</h3>
          <code className="block w-full p-3 rounded-md bg-muted text-muted-foreground font-mono">{solution.recognizedText}</code>
        </div>
        
        <div>
          <h3 className="font-semibold text-lg mb-2">Step-by-Step Solution:</h3>
          <div className="space-y-2">
            {solution.solutionSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mt-1">{index + 1}</div>
                <p className="flex-grow p-3 rounded-md bg-muted font-mono text-sm">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="explanation">
          <AccordionTrigger onClick={handleExplain} disabled={isExplanationLoading}>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              <span className="font-semibold">Plain Language Explanation</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {isExplanationLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Generating explanation...</span>
              </div>
            ) : explanation ? (
              <div className="space-y-2">
                <p className="p-2 text-sm text-foreground/80 whitespace-pre-wrap">{explanation}</p>
                <div className="flex items-center gap-2 p-2">
                   <Button onClick={handleListen} size="icon" variant="ghost" disabled={isAudioLoading || !explanation} aria-label="Listen to explanation">
                    {isAudioLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </Button>
                  {audioUrl && <audio src={audioUrl} autoPlay controls className="w-full h-8" />}
                </div>
              </div>
            ) : (
              <p className="p-2 text-sm text-muted-foreground">Click to generate an explanation of the solution.</p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
