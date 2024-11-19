import React from 'react';

export const History = () => {
  return (
    <div className="flex-1 p-6 bg-gray-800/50">
      <h2 className="text-2xl font-bold mb-4 pixel-font">Edit History</h2>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-gray-700 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Edit #{i}</span>
              <span className="text-gray-400 text-sm">2 hours ago</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};