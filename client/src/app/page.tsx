'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Sun,
  Moon, 
  Pencil, 
  MousePointer, 
  Upload, 
  Eraser,
  UserCircle,
  Save,
  ShoppingCart,
  MessageCircle,
  Send,
  Twitter,
  Undo2,
  Redo2
} from 'lucide-react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useSocialLoginMutation } from '@/store/storeApi';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  color?: "blue" | "gray" | "green" | "orange" | "red" | "purple";
  disabled?: boolean;
  className?: string;
}

interface PixelData {
  [key: number]: string;
}
// Grid Constants
const GRID_WIDTH = 2500;
const GRID_HEIGHT = 120;
const MIN_PIXEL_SIZE = 10;
const MAX_PIXEL_SIZE = 10;
const TOTAL_PIXELS = 100000;
//const MAX_HISTORY_SIZE = 50;

// Sample Owners Data for Ticker
const owners = [
  { name: "Owner1", pixels: 1500 },
  { name: "Owner2", pixels: 1200 },
  { name: "Owner3", pixels: 1000 },
  { name: "Owner4", pixels: 800 },
  { name: "Owner5", pixels: 600 },
  { name: "Owner6", pixels: 500 },
  { name: "Owner7", pixels: 400 },
  { name: "Owner8", pixels: 300 },
  { name: "Owner9", pixels: 200 },
  { name: "Owner10", pixels: 100 },
];
const NavButton: React.FC<NavButtonProps> = ({ 
  icon, 
  label, 
  onClick, 
  active = false, 
  color = "blue",
  disabled = false,
  className = ""
}) => {
  const colorClasses = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    gray: 'bg-gray-700 hover:bg-gray-600',
    green: 'bg-emerald-600 hover:bg-emerald-700',
    orange: 'bg-amber-500 hover:bg-amber-600',
    red: 'bg-red-500 hover:bg-red-600',
    purple: 'bg-purple-500 hover:bg-purple-600'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`flex flex-col items-center justify-center p-2 w-full h-full border border-gray-700 font-['Press_Start_2P'] ${
        active ? 'bg-blue-600 text-white' : `${colorClasses[color]} text-gray-100 hover:text-white`
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};
const ScrollingTicker: React.FC = () => {
  return (
    <div className="bg-gray-800/50 border-y border-gray-700 overflow-hidden h-8">
      <div className="animate-ticker flex whitespace-nowrap py-1.5">
        {[...owners, ...owners].map((owner, index) => (
          <div 
            key={index} 
            className="inline-flex items-center px-4 text-sm"
          >
            <span className="text-gray-400">{owner.name}</span>
            <span className="ml-2 text-blue-400">{owner.pixels} pixels</span>
            <span className="mx-4 text-gray-600">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};
const Home: React.FC = () => {
  // UI States
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [currentColor, setCurrentColor] = useState<string>('#000000');
  const [currentTool, setCurrentTool] = useState<'draw' | 'erase' | 'select'>('select');
  const [mousePosition, setMousePosition] = useState<{x: number, y: number} | null>(null);

  const [socialLogin,{isLoading:socialLoading,isError,isSuccess,data:socialData}] = useSocialLoginMutation()
  const {login} = useAuth()
   // Canvas States
  const [pixels, setPixels] = useState<PixelData>({});
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [pixelSize] = useState<number>(10);
  
  // Selection States
  const [selectedPixels, setSelectedPixels] = useState<Set<number>>(new Set());
  const [selectionStart, setSelectionStart] = useState<{x: number, y: number} | null>(null);
  const [draggedPixels, setDraggedPixels] = useState<Set<number>>(new Set());
  const [selectionColors, setSelectionColors] = useState<{ [key: number]: string }>({});
  const { user, error, isLoading } = useUser();
  const navigate = useRouter()
  // History States
  const [history, setHistory] = useState<Array<{
    pixels: PixelData, 
    selectedPixels: Set<number>, 
    selectionColors: {[key: number]: string}
  }>>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(-1);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [eraserSize, setEraserSize] = useState<number>(1);
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isDarkMode = darkMode;
  // Initial load effect
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('pixelGrid');
      if (savedData) {
        const { pixels: savedPixels, selectedPixels: savedSelected, selectionColors: savedColors } = JSON.parse(savedData);
        setPixels(savedPixels);
        setSelectedPixels(new Set(savedSelected));
        setSelectionColors(savedColors);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, []);

  // Auto-save effect
  useEffect(() => {
    const autoSave = setTimeout(() => {
      try {
        localStorage.setItem('pixelGrid', JSON.stringify({
          pixels,
          selectedPixels: Array.from(selectedPixels),
          selectionColors
        }));
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }, 1000);
    
    return () => clearTimeout(autoSave);
  }, [pixels, selectedPixels, selectionColors]);
  // Dark mode effects and handlers
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);
  const saveToHistory = useCallback(() => {
    try {
      const newHistoryState = {
        pixels: { ...pixels },
        selectedPixels: new Set(Array.from(selectedPixels)),
        selectionColors: { ...selectionColors }
      };
  
      // Create new history array from 0 to current index + 1
      const newHistory = [
        ...history.slice(0, currentHistoryIndex + 1),
        newHistoryState
      ];
  
      setHistory(newHistory);
      setCurrentHistoryIndex(newHistory.length - 1);
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  }, [pixels, selectedPixels, selectionColors, history, currentHistoryIndex]);

  const handleUndo = useCallback(() => {
    if (currentHistoryIndex > 0) {
      const previousState = history[currentHistoryIndex - 1];
      setPixels(previousState.pixels);
      setSelectedPixels(previousState.selectedPixels);
      setSelectionColors(previousState.selectionColors);
      setCurrentHistoryIndex(currentHistoryIndex - 1);
    }
  }, [currentHistoryIndex, history]);

  const handleRedo = useCallback(() => {
    if (currentHistoryIndex < history.length - 1) {
      const nextState = history[currentHistoryIndex + 1];
      setPixels(nextState.pixels);
      setSelectedPixels(nextState.selectedPixels);
      setSelectionColors(nextState.selectionColors);
      setCurrentHistoryIndex(currentHistoryIndex + 1);
    }
  }, [currentHistoryIndex, history]);
  const clearSelection = useCallback(() => {
    setSelectedPixels(new Set());
    setSelectionColors({});
    setSelectionStart(null);
    setDraggedPixels(new Set());
  }, []);

  const commitSelection = useCallback(() => {
    const newPixels = { ...pixels };
    selectedPixels.forEach((index) => {
      if (selectionColors[index]) {
        newPixels[index] = selectionColors[index];
      }
    });
    setPixels(newPixels);
    saveToHistory();
    clearSelection();
  }, [pixels, selectedPixels, selectionColors, saveToHistory]);

  const isSelectionValid = useCallback(() => {
    return selectedPixels.size > 0 && (
      Array.from(selectedPixels).some(index => selectionColors[index])
    );
  }, [selectedPixels, selectionColors]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = GRID_WIDTH * pixelSize;
    canvas.height = GRID_HEIGHT * pixelSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background and pixels
      for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
          const index = y * GRID_WIDTH + x;
          const centerX = (x * pixelSize) + (pixelSize / 2);
          const centerY = (y * pixelSize) + (pixelSize / 2);
          const radius = (pixelSize / 2) * 0.9; // Slightly smaller for spacing
          
          // Draw the grid background circle
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          ctx.fillStyle = isDarkMode ? '#1f2937' : '#e5e7eb';
          ctx.fill();
          ctx.strokeStyle = isDarkMode ? '#374151' : '#d1d5db';
          ctx.lineWidth = 1;
          ctx.stroke();

          if (pixels[index]) {
            // Draw the colored pixel
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.fillStyle = pixels[index];
            ctx.fill();
          }

          if (selectedPixels.has(index)) {
            // Draw selection overlay
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.fillStyle = selectionColors[index] || currentColor;
            ctx.globalAlpha = 0.3;
            ctx.fill();
            ctx.globalAlpha = 1;
          }
        }
      }
    };

    requestAnimationFrame(drawCanvas);
  }, [currentTool, pixelSize, selectedPixels, selectionColors, currentColor, saveToHistory, zoomLevel]);
  // handleMouseDown
  const eraseArea = useCallback((centerX: number, centerY: number) => {
    const newSelectedPixels = new Set(selectedPixels);
    const newSelectionColors = { ...selectionColors };
    
    // Calculate the actual radius in pixels
    const radius = eraserSize;
    
    // Expand the search area to cover the full circle
    const searchRadius = radius + 1; // Add 1 to ensure we catch edge pixels
    
    for (let y = centerY - searchRadius; y <= centerY + searchRadius; y++) {
      for (let x = centerX - searchRadius; x <= centerX + searchRadius; x++) {
        // Check if the current position is within the grid bounds
        if (x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
          // Calculate distance from center of eraser to current pixel
          const distance = Math.sqrt(
            Math.pow(x - centerX, 2) + 
            Math.pow(y - centerY, 2)
          );
          
          // If the pixel is within the eraser circle, remove it
          if (distance <= radius) {
            const pixelIndex = y * GRID_WIDTH + x;
            newSelectedPixels.delete(pixelIndex);
            delete newSelectionColors[pixelIndex];
          }
        }
      }
    }
    
    setSelectedPixels(newSelectedPixels);
    setSelectionColors(newSelectionColors);
  }, [selectedPixels, selectionColors, eraserSize]);
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    saveToHistory();
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / (pixelSize * zoomLevel));
     const y = Math.floor((e.clientY - rect.top) / (pixelSize * zoomLevel));
     const pixelIndex = y * GRID_WIDTH + x;
    
    if (currentTool === 'select') {
      setSelectionStart({ x, y });
      const newSelectionColors = { ...selectionColors };
      newSelectionColors[pixelIndex] = currentColor;
      setSelectionColors(newSelectionColors);
      const newSelectedPixels = new Set(selectedPixels);
      newSelectedPixels.add(pixelIndex);
      setSelectedPixels(newSelectedPixels);
    } else if (currentTool === 'draw') {
      const newSelectedPixels = new Set(selectedPixels);
      newSelectedPixels.add(pixelIndex);
      const newSelectionColors = { ...selectionColors };
      newSelectionColors[pixelIndex] = currentColor;
      setSelectionColors(newSelectionColors);
      setSelectedPixels(newSelectedPixels);
    } else if (currentTool === 'erase') {
      eraseArea(x, y);
      const newSelectedPixels = new Set(selectedPixels);
      newSelectedPixels.delete(pixelIndex);
      const newSelectionColors = { ...selectionColors };
      delete newSelectionColors[pixelIndex];
      setSelectionColors(newSelectionColors);
      setSelectedPixels(newSelectedPixels);
    }
    setIsDrawing(true);
  }, [currentTool, pixelSize, selectedPixels, selectionColors, currentColor, saveToHistory, zoomLevel]);
    
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
  
      // Update mouse position
      const rect = canvas.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
  
      if (!isDrawing) return;
  
      const currentX = Math.floor((e.clientX - rect.left) / (pixelSize * zoomLevel));
      const currentY = Math.floor((e.clientY - rect.top) / (pixelSize * zoomLevel));
      
      if (currentTool === 'select' && selectionStart) {
        const startX = Math.min(selectionStart.x, currentX);
        const endX = Math.max(selectionStart.x, currentX);
        const startY = Math.min(selectionStart.y, currentY);
        const endY = Math.max(selectionStart.y, currentY);
        
        const newSelection = new Set(selectedPixels);
        const newSelectionColors = { ...selectionColors };
        
        for (let y = startY; y <= endY; y++) {
          for (let x = startX; x <= endX; x++) {
            const pixelIndex = y * GRID_WIDTH + x;
            newSelection.add(pixelIndex);
            newSelectionColors[pixelIndex] = currentColor;
          }
        }
        setSelectedPixels(newSelection);
        setSelectionColors(newSelectionColors);
      } else if (currentTool === 'draw' || currentTool === 'erase') {
        if (currentTool === 'erase') {
          eraseArea(currentX, currentY);
        } else {
          const pixelIndex = currentY * GRID_WIDTH + currentX;
          const newSelectedPixels = new Set(selectedPixels);
          const newSelectionColors = { ...selectionColors };
          newSelectedPixels.add(pixelIndex);
          newSelectionColors[pixelIndex] = currentColor;
          setSelectedPixels(newSelectedPixels);
          setSelectionColors(newSelectionColors);
        }
      }
  }, [isDrawing, currentTool, selectionStart, selectedPixels, selectionColors, currentColor, pixelSize, zoomLevel, eraserSize]);
  const handleMouseUp = useCallback(() => {
    if (isDrawing) {
      saveToHistory();
    }
    setIsDrawing(false);
    setSelectionStart(null);
  }, [isDrawing, saveToHistory]);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    handleMouseDown(mouseEvent as any);
  }, [handleMouseDown]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    handleMouseMove(mouseEvent as any);
  }, [handleMouseMove]);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    handleMouseUp();
  }, [handleMouseUp]);
  useEffect(() => {
    if (user) {
    socialLogin({username:user.given_name,email:user.email})
    }
  }, [user]);
  useEffect(()=>{
    if(isSuccess){
      login(socialData?.token,socialData?.user)
    }
    if(isError){
      navigate.push('/Landingpage')
    }

  },[isSuccess,isError])

  return (
    <div className={`h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} overflow-hidden flex flex-col`}>
      <div className="grid grid-cols-12 gap-0.5 bg-gray-500 h-13">
        {/* Logo Column */}
        <div className={`${isDarkMode? 'bg-gray-800' : 'bg-gray-200'} flex flex-col items-center justify-center text-center w-full h-full`}>
        <div className="flex flex-col -space-y-1">
           <span className="text-[10px] font-bold pixel-font whitespace-nowrap">Tokens</span>
         <span className="text-[8px] font-bold pixel-font whitespace-nowrap">ClubHouse</span>
         </div>
        </div>
  
           {/* Counter Column */}
      <div className={`${isDarkMode? 'bg-gray-800' : 'bg-gray-200'} flex flex-col items-center justify-center text-center px-1`}>
        <div className="font-['Press_Start_2P'] flex items-center space-x-0.5">
          {String(TOTAL_PIXELS - selectedPixels.size)
            .padStart(6, '0')
            .split('')
            .map((digit, i) => (
              <span key={i} className="text-xs text-blue-400 bg-gray-900 border border-gray-700 rounded-sm w-4 h-5 flex items-center justify-center animate-pulse">
                {digit}
              </span>
          ))}
        </div>
        <span className="text-[10px] font-['Press_Start_2P'] text-gray-400 mt-1">Spots Left</span>
        <div className="flex items-center space-x-1 mt-1">
  <button 
    onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))}
    className="text-[15px] bg-gray-700 text-white px-1 rounded"
  >
    -
  </button>
  <span className="text-[10px] font-['Press_Start_2P'] text-white">
    {(zoomLevel * 100).toFixed(0)}%
  </span>
  <button 
    onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.1))}
    className="text-[15px] bg-gray-700 text-white px-1 rounded"
  >
    +
  </button>
</div>
        </div>
  
        {/* Tool Buttons */}
        <div className="bg-blue-500">
          <NavButton
            icon={<MousePointer className="w-4 h-4" />}
            label="Select"
            onClick={() => setCurrentTool('select')}
            active={currentTool === 'select'}
            color="blue"
          />
        </div>
  
        <div className="bg-amber-500">
          <NavButton
            icon={<Pencil className="w-4 h-4" />}
            label="Draw"
            onClick={() => setCurrentTool('draw')}
            active={currentTool === 'draw'}
            color="orange"
          />
        </div>
  
        <div className="bg-gray-700">
          <NavButton
            icon={<Undo2 className="w-4 h-4" />}
            label="Undo"
            onClick={handleUndo}
            disabled={currentHistoryIndex <= 0}
            color="gray"
          />
        </div>
  
        <div className="bg-gray-700">
          <NavButton
            icon={<Redo2 className="w-4 h-4" />}
            label="Redo"
            onClick={handleRedo}
            disabled={currentHistoryIndex >= history.length - 1}
            color="gray"
          />
        </div>
  
        <div className="bg-red-500">
          <NavButton
            icon={<Eraser className="w-4 h-4" />}
            label="Erase"
            onClick={() => setCurrentTool('erase')}
            active={currentTool === 'erase'}
            color="red"
          />
        </div>
        <div className={`${isDarkMode? 'bg-gray-800' : 'bg-gray-200'} flex flex-col items-center justify-center p-1`}>
  {currentTool === 'erase' ? (
    <>
      <input 
        type="range"
        min="1"
        max="20"
        value={eraserSize}
        onChange={(e) => setEraserSize(parseInt(e.target.value))}
        className="w-12 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer mb-0.5"
      />
      <span className="text-[8px] text-white">{eraserSize}px</span>
    </>
  ) : (
    <>
      <input 
        type="color" 
        value={currentColor}
        onChange={(e) => setCurrentColor(e.target.value)}
        className="w-5 h-5 rounded cursor-pointer mb-0.5"
      />
      <span className="text-[8px] text-white">Color</span>
    </>
  )}
</div>

      <div className="bg-gray-600">
        <NavButton
          icon={isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          label={isDarkMode ? "Light" : "Dark"}
          onClick={() => setDarkMode(!darkMode)}
          color="gray"
        />
      </div>

    <Link href={'/profile'}>
    <div className="bg-emerald-600">
        <NavButton
          icon={<UserCircle className="w-4 h-4" />}
          label="Profile"
          onClick={() => {/* Login logic */}}
          color="green"
        />
      </div>
    </Link>

      <div className="bg-blue-500">
        <NavButton
          icon={<Send className="w-4 h-4" />}
          label="contact us"
          onClick={() => {/* Social share logic */}}
          color="blue"
        />
      </div>

      <div className="bg-purple-500">
        <NavButton
          icon={<ShoppingCart className="w-4 h-4" />}
          label={`Buy (${selectedPixels.size})`}
          onClick={() => {/* Purchase logic */}}
          disabled={selectedPixels.size === 0}
          color="purple"
        />
      </div>
    </div>
    <ScrollingTicker />
    
    <div className="flex-1 overflow-x-auto overflow-y-hidden" ref={containerRef}>
      <div className="inline-block relative" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}>
      {currentTool === 'erase' && mousePosition && (
  <div 
    className="absolute border-2 border-white rounded-full pointer-events-none"
    style={{
      width: `${eraserSize * pixelSize * 2}px`,
      height: `${eraserSize * pixelSize * 2}px`,
      position: 'absolute',
      left: `${(mousePosition.x / zoomLevel) - (eraserSize * pixelSize)}px`,
      top: `${(mousePosition.y / zoomLevel) - (eraserSize * pixelSize)}px`,
      transform: 'none'
    }}
  />
)}
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            handleMouseUp();
            setMousePosition(null);
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="cursor-pointer h-full"
          aria-label="Pixel drawing canvas"
        />
      </div>
    </div>
  </div>
);
}
export default Home;