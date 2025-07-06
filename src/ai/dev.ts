import { config } from 'dotenv';
config();

import '@/ai/flows/correct-recognized-text.ts';
import '@/ai/flows/explain-solution-in-plain-language.ts';
import '@/ai/flows/solve-problem-from-image.ts';
import '@/ai/flows/text-to-speech.ts';
