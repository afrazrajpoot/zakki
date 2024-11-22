'use client'

import React, { useState, useEffect, useRef } from 'react';
import { 
  Home,
  ShoppingCart,
  UserCircle,
  LogIn,
  UserPlus,
  HelpCircle,
  MessageCircle,
  Menu,
  Square
} from 'lucide-react';
import Link from 'next/link';

// Constants
const GRID_WIDTH = 2500;
const GRID_HEIGHT = 120;
const PIXEL_SIZE = 10;
const TOTAL_PIXELS = 100000;

const DraggableHamburger = ({ onClick }) => {
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = (e) => {
    if (isDragging && dragRef.current) {
      const newX = Math.min(Math.max(0, e.clientX - dragRef.current.x), window.innerWidth - 60);
      const newY = Math.min(Math.max(0, e.clientY - dragRef.current.y), window.innerHeight - 60);
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragRef.current = null;
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <button
      onMouseDown={handleMouseDown}
      onClick={() => !isDragging && onClick()}
      className="fixed z-50 text-yellow-500 hover:text-yellow-400 transition-colors duration-300 
                 bg-gray-800/90 hover:bg-gray-700/90 rounded-full p-3 shadow-lg cursor-move"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: isDragging ? 'scale(1.1)' : 'scale(1)',
        transition: isDragging ? 'none' : 'transform 0.2s'
      }}
    >
      <Menu size={32} />
    </button>
  );
};

const NavButton = ({ 
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
    green: 'bg-emerald-500 hover:bg-emerald-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
    orange: 'bg-orange-500 hover:bg-orange-600',
    red: 'bg-red-500 hover:bg-red-600',
    indigo: 'bg-indigo-500 hover:bg-indigo-600',
    pink: 'bg-pink-500 hover:bg-pink-600'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`
        flex flex-col items-center justify-center p-2 w-full h-full 
        border border-gray-700 
        font-['Press_Start_2P'] 
        ${active ? 'bg-blue-600 text-white' : `${colorClasses[color]} text-gray-100 hover:text-white`}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
        transition-all duration-200 ease-in-out
        hover:scale-[0.98]
        active:scale-95
        shadow-lg
      `}
    >
      {icon}
      <span className="text-[8px] mt-1 font-['Press_Start_2P']">{label}</span>
    </button>
  );
};

const CounterDigit = ({ digit }) => (
  <span className="text-[8px] bg-gray-900 border border-gray-700 rounded-sm w-3 h-3 flex items-center justify-center font-['Press_Start_2P'] text-blue-400">
    {digit}
  </span>
);

const StyledCounter = ({ value }) => (
  <div className="flex space-x-0.5">
    {String(value)
      .padStart(5, '0')
      .split('')
      .map((digit, i) => (
        <CounterDigit key={i} digit={digit} />
      ))}
  </div>
);

const ScrollingTicker = () => {
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
    { name: "Owner10", pixels: 100 }
  ];

  return (
    <div className="bg-gray-800/50 border-y border-gray-700 overflow-hidden h-8">
      <div className="ticker flex items-center h-full">
        {[...owners, ...owners].map((owner, index) => (
          <div 
            key={index} 
            className="inline-flex items-center space-x-2 px-4"
          >
            <span className="text-gray-400 text-[10px] font-['Press_Start_2P']">{owner.name}</span>
            <span className="text-blue-400 text-[10px] font-['Press_Start_2P']">{owner.pixels}</span>
            <span className="text-gray-600 mx-2">•</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        .ticker {
          animation: ticker 30s linear infinite;
        }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

const AreaIndicators = ({ registeredSpots, editingCount }) => {
  const availableSpots = TOTAL_PIXELS - Object.keys(registeredSpots).length;
  const soldSpots = Object.keys(registeredSpots).length;
  
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 col-span-3 flex flex-col justify-center px-3 h-full border border-gray-700">
      <div className="flex items-center mb-0.5">
        <Square className="w-3 h-3 text-white" fill="currentColor" />
        <div className="ml-2 mr-1">
          <StyledCounter value={availableSpots} />
        </div>
        <span className="text-[8px] font-['Press_Start_2P'] text-gray-200">Available area</span>
      </div>
      <div className="flex items-center mb-0.5">
        <Square className="w-3 h-3 text-red-500" fill="currentColor" />
        <div className="ml-2 mr-1">
          <StyledCounter value={soldSpots} />
        </div>
        <span className="text-[8px] font-['Press_Start_2P'] text-gray-200">Sold area</span>
      </div>
      <div className="flex items-center">
        <Square className="w-3 h-3 text-yellow-500" fill="currentColor" />
        <div className="ml-2 mr-1">
          <StyledCounter value={editingCount} />
        </div>
        <span className="text-[8px] font-['Press_Start_2P'] text-gray-200">Other member is editing</span>
      </div>
    </div>
  );
};

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [editingCount, setEditingCount] = useState(0);
  const canvasRef = useRef(null);
  
  const [registeredSpots, setRegisteredSpots] = useState({
    1000: '#FF0000',
    1001: '#00FF00',
    1002: '#0000FF'
  });

  useEffect(() => {
    setRegisteredCount(Object.keys(registeredSpots).length);
  }, [registeredSpots]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = GRID_WIDTH * PIXEL_SIZE;
    canvas.height = GRID_HEIGHT * PIXEL_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
          const index = y * GRID_WIDTH + x;
          const centerX = (x * PIXEL_SIZE) + (PIXEL_SIZE / 2);
          const centerY = (y * PIXEL_SIZE) + (PIXEL_SIZE / 2);
          const radius = (PIXEL_SIZE / 2) * 0.9;
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          ctx.fillStyle = darkMode ? '#1f2937' : '#e5e7eb';
          ctx.fill();
          ctx.strokeStyle = darkMode ? '#374151' : '#d1d5db';
          ctx.lineWidth = 1;
          ctx.stroke();

          if (registeredSpots[index]) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.fillStyle = registeredSpots[index];
            ctx.fill();
          }
        }
      }
    };

    drawCanvas();
  }, [darkMode, registeredSpots]);

  return (
    <div className={`h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} overflow-hidden flex flex-col relative`}>
      <DraggableHamburger onClick={() => setIsHeaderVisible(!isHeaderVisible)} />

      <div className={`
        transform transition-all duration-300 ease-in-out absolute w-full z-40
        ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}
      `}>
        <div className="grid grid-cols-12 gap-0.5 bg-gray-800">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 flex flex-col items-center justify-center text-center w-full h-full">
            <div className="flex flex-col -space-y-1">
              <span className="text-[10px] font-['Press_Start_2P'] font-bold whitespace-nowrap">Tokens</span>
              <span className="text-[8px] font-['Press_Start_2P'] font-bold whitespace-nowrap">ClubHouse</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 flex flex-col items-center justify-center text-center px-1">
            <div className="font-['Press_Start_2P'] flex items-center space-x-0.5">
              {String(TOTAL_PIXELS - registeredCount)
                .padStart(6, '0')
                .split('')
                .map((digit, i) => (
                  <span 
                    key={i} 
                    className="text-[10px] text-blue-400 bg-gray-900 border border-gray-700 rounded-sm w-4 h-5 flex items-center justify-center animate-pulse font-['Press_Start_2P']"
                  >
                    {digit}
                  </span>
              ))}
            </div>
            <span className="text-[8px] font-['Press_Start_2P'] text-gray-200 mt-1">Spots Left</span>
          </div>

          <div className="bg-blue-500">
            <Link href={'/'}><NavButton icon={<Home className="w-4 h-4" />} label="Home" onClick={() => {}} /></Link>
          </div>
          <div className="bg-emerald-500">
            <NavButton icon={<ShoppingCart className="w-4 h-4" />} label="Buy Spots" onClick={() => {}} color="green" />
          </div>
          <div className="bg-purple-500">
            <Link href={'/login'}><NavButton icon={<LogIn className="w-4 h-4" />} label="Login" onClick={() => {}} color="purple" /></Link>
          </div>
          <div className="bg-orange-500">
            <Link href={'/register'}><NavButton icon={<UserPlus className="w-4 h-4" />} label="Register" onClick={() => {}} color="orange" /></Link>
          </div>
          <div className="bg-indigo-500">
            <NavButton icon={<HelpCircle className="w-4 h-4" />} label="About" onClick={() => {}} color="indigo" />
          </div>
          <div className="bg-pink-500">
            <NavButton icon={<MessageCircle className="w-4 h-4" />} label="Contact" onClick={() => {}} color="pink" />
          </div>
          <div className="bg-red-500">
            <NavButton icon={<UserCircle className="w-4 h-4" />} label="Profile" onClick={() => {}} color="red" />
          </div>

          <div className="col-span-3">
            <AreaIndicators registeredSpots={registeredSpots} editingCount={editingCount} />
          </div>
        </div>
      </div>

      <ScrollingTicker />
      
      <div className={`
        flex-1 overflow-x-auto overflow-y-hidden
        transition-all duration-300 ease-in-out
        ${isHeaderVisible ? 'mt-0' : 'mt-[-80px]'}
      `}>
        <div className="inline-block relative">
          <canvas
            ref={canvasRef}
            className="cursor-default"
            aria-label="Token grid display"
          />
        </div>
      </div>
    </div>
  );
}
