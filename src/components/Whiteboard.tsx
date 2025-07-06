'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Eraser, Trash2, Upload, RotateCcw, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface WhiteboardProps {
  onSolve: (imageDataUrl: string) => void;
  isLoading: boolean;
  onReset: () => void;
}

export default function Whiteboard({ onSolve, isLoading, onReset }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('draw');

  const prepareCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set canvas size based on container size
        const container = canvas.parentElement;
        if (container) {
          const { width } = container.getBoundingClientRect();
          canvas.width = width;
          canvas.height = width * (3 / 4); // 4:3 aspect ratio
        }
        
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        setContext(ctx);
      }
    }
  }, []);

  useEffect(() => {
    prepareCanvas();
    window.addEventListener('resize', prepareCanvas);
    return () => window.removeEventListener('resize', prepareCanvas);
  }, [prepareCanvas]);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (context) {
      context.beginPath();
      context.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
      setIsDrawing(true);
    }
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;
    context.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    if (context) {
      context.closePath();
    }
    setIsDrawing(false);
  };

  const handleToolChange = (newTool: 'pencil' | 'eraser') => {
    setTool(newTool);
    if (context) {
      if (newTool === 'pencil') {
        context.strokeStyle = 'black';
        context.lineWidth = 3;
      } else {
        context.strokeStyle = 'white';
        context.lineWidth = 20;
      }
    }
  };

  const clearCanvas = () => {
    if (context && canvasRef.current) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target?.result as string);
      reader.readAsDataURL(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };


  const handleSolveClick = () => {
    let imageDataUrl = '';
    if (activeTab === 'draw' && canvasRef.current) {
      imageDataUrl = canvasRef.current.toDataURL('image/png');
    } else if (activeTab === 'upload' && uploadedImage) {
      imageDataUrl = uploadedImage;
    }
    onSolve(imageDataUrl);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-foreground">Problem Input</h2>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="draw">Draw</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>
        <TabsContent value="draw">
          <div className="flex justify-center items-center gap-2 my-2">
            <Button
              variant={tool === 'pencil' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => handleToolChange('pencil')}
              aria-label="Pencil"
            >
              <Pencil className="h-5 w-5" />
            </Button>
            <Button
              variant={tool === 'eraser' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => handleToolChange('eraser')}
              aria-label="Eraser"
            >
              <Eraser className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={clearCanvas} aria-label="Clear Canvas">
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="w-full h-auto border-2 border-dashed rounded-lg cursor-crosshair bg-white"
          />
        </TabsContent>
        <TabsContent value="upload">
          <div 
            className="mt-4 flex justify-center items-center w-full h-80 border-2 border-dashed rounded-lg"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {uploadedImage ? (
              <div className="relative w-full h-full">
                <Image src={uploadedImage} alt="Uploaded problem" layout="fill" objectFit="contain" />
              </div>
            ) : (
              <div className="text-center text-muted-foreground p-4">
                <Upload className="mx-auto h-12 w-12" />
                <p className="mt-2">Drag & drop an image here, or</p>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button variant="link" onClick={() => document.getElementById('image-upload')?.click()}>
                   click to upload
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      <div className="flex gap-4 pt-4">
        <Button onClick={handleSolveClick} className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Solving...
            </>
          ) : (
            'Solve Problem'
          )}
        </Button>
        <Button onClick={onReset} variant="outline" className="w-full" disabled={isLoading}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Start Over
        </Button>
      </div>
    </div>
  );
}
