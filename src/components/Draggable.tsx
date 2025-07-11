
'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface DraggableProps {
  children: React.ReactNode;
}

export const Draggable: React.FC<DraggableProps> = ({ children }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragRef.current && e.target instanceof HTMLElement) {
      // Start dragging only if the mousedown is on the header (or a non-interactive part)
      if (e.target.closest('[data-drag-handle]') || e.target.getAttribute('data-drag-handle') !== null) {
        setIsDragging(true);
        const rect = dragRef.current.getBoundingClientRect();
        offsetRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
        e.preventDefault();
      }
    }
  };

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && dragRef.current) {
        let newX = e.clientX - offsetRef.current.x;
        let newY = e.clientY - offsetRef.current.y;

        // Constrain movement within the viewport
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const { width, height } = dragRef.current.getBoundingClientRect();
        
        newX = Math.max(0, Math.min(newX, vw - width));
        newY = Math.max(0, Math.min(newY, vh - height));

        setPosition({ x: newX, y: newY });
    }
  }, [isDragging]);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, onMouseMove, onMouseUp]);

  useEffect(() => {
    // Center the component on initial render
    if (dragRef.current) {
      const { width, height } = dragRef.current.getBoundingClientRect();
      setPosition({
        x: (window.innerWidth - width) / 2,
        y: (window.innerHeight - height) / 3,
      });
    }
  }, []);


  return (
    <div
      ref={dragRef}
      style={{
        position: 'absolute',
        top: `${position.y}px`,
        left: `${position.x}px`,
        cursor: isDragging ? 'grabbing' : 'default',
        zIndex: 50,
      }}
      onMouseDown={onMouseDown}
    >
      {React.cloneElement(children as React.ReactElement)}
    </div>
  );
};
