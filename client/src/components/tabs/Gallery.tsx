import React from 'react';

export const Gallery = () => {
  return (
    <div className="flex-1 p-6 bg-gray-800/50">
      <h2 className="text-2xl font-bold mb-4 pixel-font">Artwork Gallery</h2>
      <div className="grid grid-cols-3 gap-4">
        {/* Example gallery items */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-square bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
            {/* Gallery content */}
          </div>
        ))}
      </div>
    </div>
  );
};