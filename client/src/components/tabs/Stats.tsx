import React from 'react';

export const Stats = () => {
  return (
    <div className="flex-1 p-6 bg-gray-800/50">
      <h2 className="text-2xl font-bold mb-4 pixel-font">Statistics</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Total Pixels</h3>
          <p className="text-2xl text-blue-400">640,000</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Used Pixels</h3>
          <p className="text-2xl text-green-400">123,456</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Active Users</h3>
          <p className="text-2xl text-purple-400">1,234</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Total Edits</h3>
          <p className="text-2xl text-amber-400">45,678</p>
        </div>
      </div>
    </div>
  );
};