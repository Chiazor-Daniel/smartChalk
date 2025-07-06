'use client';

import { Atom } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Atom className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">
              StepWise AI
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
