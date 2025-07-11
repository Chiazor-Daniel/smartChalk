'use client';

import { useRef, useEffect, useState, useCallback, use } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Eraser, Trash2, Upload, RotateCcw, Loader2, CheckCircle, Info } from 'lucide-react';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    }
  }, []);

  const redrawCanvas = useCallback(() => {
    if (context && canvasRef.current) {
      context.fillStyle = '#f0f0f0'; // A light grey background
      context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      if (uploadedImage) {
        const image = new window.Image();
        image.src = uploadedImage;
        image.onload = () => {
          // center the image on the canvas
          const canvas = canvasRef.current;
          if (!canvas) return;
          const hRatio = canvas.width / image.width;
          const vRatio = canvas.height / image.height;
          const ratio = Math.min(hRatio, vRatio, 1);
          const centerShift_x = (canvas.width - image.width * ratio) / 2;
          const centerShift_y = (canvas.height - image.height * ratio) / 2;
          context.drawImage(image, 0, 0, image.width, image.height, centerShift_x, centerShift_y, image.width * ratio, image.height * ratio);
        };
      }
    }
  }, [context, uploadedImage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        setContext(ctx);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
      }
    }
    setCanvasSize();
    window.addEventListener('resize', () => {
      setCanvasSize();
      redrawCanvas();
    });
    return () => window.removeEventListener('resize', redrawCanvas);
  }, [setCanvasSize, redrawCanvas]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas, uploadedImage]);

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
        context.strokeStyle = '#f0f0f0';
        context.lineWidth = 20;
      }
    }
  };

  const clearCanvas = () => {
    if (context && canvasRef.current) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      context.fillStyle = '#f0f0f0';
      context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setUploadedImage(null);
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
    if (canvasRef.current) {
       imageDataUrl = canvasRef.current.toDataURL('image/png');
    }
    onSolve(imageDataUrl);
  };

  return (
    <div className="w-full h-full relative" onDrop={handleDrop} onDragOver={handleDragOver}>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="w-full h-full cursor-crosshair bg-stone-100"
      />
       <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-card rounded-lg shadow-md border z-10">
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
        <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} aria-label="Upload Image">
          <Upload className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={clearCanvas} aria-label="Clear Canvas">
          <Trash2 className="h-5 w-5" />
        </Button>
       </div>

       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 z-10">
        <Button onClick={handleSolveClick} className="w-40" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Solving...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4"/>
              Solve Problem
            </>
          )}
        </Button>
        <Button onClick={() => { onReset(); clearCanvas(); }} variant="outline" className="w-40" disabled={isLoading}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Start Over
        </Button>
      </div>
      
      <Input
        ref={fileInputRef}
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

       {!uploadedImage && (
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 text-center text-muted-foreground pointer-events-none">
           <Upload className="mx-auto h-12 w-12 mb-4" />
           <p className="font-semibold">Draw a problem, or drop an image here.</p>
           <p className="text-sm">You can also click the upload icon in the toolbar.</p>
         </div>
       )}
    </div>
  );
}
