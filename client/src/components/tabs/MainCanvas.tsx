import React from 'react';

interface MainCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
}

export const MainCanvas = ({ 
  canvasRef, 
  onMouseDown, 
  onMouseMove, 
  onMouseUp, 
  onMouseLeave 
}: MainCanvasProps) => {
  return (
    <div className="flex-1 overflow-auto relative">
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        className="cursor-pointer"
      />
    </div>
  );
};