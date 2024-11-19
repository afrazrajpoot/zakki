import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Twitter, Share2, Download, Upload, Eraser, MousePointer, Pencil, Sun, Moon } from 'lucide-react' // Added Sun and Moon icons

// ... (keep other constants)

export default function PixelGrid() {
  // ... (keep other state variables)
  const [isDarkMode, setIsDarkMode] = useState(true)  // Add this new state

  // ... (keep other functions)

  // Add theme toggle function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className={`h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} overflow-hidden flex flex-col`}>
      {/* Add theme toggle button in the corner */}
      <Button
        onClick={toggleTheme}
        className="absolute top-4 right-4 z-50 rounded-full w-10 h-10 p-2"
        variant="outline"
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </Button>

      <div className={`grid grid-cols-8 gap-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
        <div className={`col-span-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} p-4 flex items-center justify-center`}>
          <h1 className="text-2xl font-bold">MemeGrid: 640,000 Pixels</h1>
        </div>
        {/* Update NavButton styles */}
        <NavButton
          icon={<MousePointer className="w-5 h-5" />}
          label="Select"
          onClick={() => setDrawMode('select')}
          active={drawMode === 'select'}
          isDarkMode={isDarkMode}
        />
        {/* ... (update other NavButtons similarly) */}
      </div>

      {/* Update other container styles */}
      <div className={`flex items-center justify-between px-4 py-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
        {/* ... (keep existing content) */}
      </div>

      {/* ... (keep canvas section) */}

      {/* Update hover info styles */}
      {hoveredPixel !== null && (
        <div className={`absolute bottom-4 left-4 ${isDarkMode ? 'bg-black bg-opacity-75 text-white' : 'bg-white bg-opacity-75 text-black'} p-2 rounded-md text-sm`}>
          {/* ... (keep existing content) */}
        </div>
      )}
    </div>
  )
}

// Update NavButton component
const NavButton = ({ icon, label, onClick, active, isDarkMode }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-2 w-full h-full border ${
      isDarkMode ? 'border-gray-700' : 'border-gray-300'
    } ${
      active 
        ? 'bg-blue-600 text-white' 
        : isDarkMode 
          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </button>
)