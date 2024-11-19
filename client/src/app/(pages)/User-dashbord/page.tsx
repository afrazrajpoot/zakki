import React from 'react';
import { Bell, Upload, X, ImageIcon, Link2, Users, Mic, MicOff, Hand, ChevronDown } from 'lucide-react';

const ProjectDashboard = () => {
  const [isDark, setIsDark] = React.useState(false);
  const [uploadedFile, setUploadedFile] = React.useState(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [links, setLinks] = React.useState([
    { id: 1, url: '', color: 'bg-blue-400' },
    { id: 2, url: '', color: 'bg-purple-400' },
    { id: 3, url: '', color: 'bg-pink-400' }
  ]);
  const [isMuted, setIsMuted] = React.useState(true);
  const [isHandRaised, setIsHandRaised] = React.useState(false);
  const fileInputRef = React.useRef(null);

  const chatUsers = [
    { id: 1, name: 'Sarah C.', isSpeaking: true, isModerator: true, emoji: '👋' },
    { id: 2, name: 'Mike R.', isSpeaking: true, emoji: '💫' },
    { id: 3, name: 'John D.', isSpeaking: false, emoji: '🎨' }
  ];

  const todaysTasks = [
    { name: 'TCH Spots', description: '#2674899', color: 'border-l-orange-400', status: 'Pending Approval' },
    { name: 'Favorite Clubs', description: 'Comiing Soon', color: 'border-l-purple-600', status: 'Active' },
    { name: 'offers', description: 'Comming Soon', color: 'border-l-cyan-400', completed: true, status: 'Active' },
    { name: 'Spots Status', description: 'Current Active', color: 'border-l-green-400', status: 'Active' }
  ];

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    if (uploadedFile?.preview) {
      URL.revokeObjectURL(uploadedFile.preview);
    }
    const newFile = {
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB'
    };
    setUploadedFile(newFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = Array.from(e.dataTransfer.files).find(file => 
      file.type.startsWith('image/')
    );
    if (file) handleFile(file);
  };

  const removeFile = () => {
    if (uploadedFile?.preview) {
      URL.revokeObjectURL(uploadedFile.preview);
    }
    setUploadedFile(null);
  };

  const handleLinkUpdate = (id, newUrl) => {
    setLinks(prevLinks =>
      prevLinks.map(link =>
        link.id === id ? { ...link, url: newUrl } : link
      )
    );
  };

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleHand = () => setIsHandRaised(!isHandRaised);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200 p-8`}>
      <div className={`max-w-5xl mx-auto ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-sm p-8`}>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Hello, Sara</h1>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Today is Monday, 20 October 2021</p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100'}`}
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Bell size={20} className="text-gray-400" />
              </button>
              <button className="bg-gray-900 text-white px-4 py-2 rounded-lg">
                Add New Spots
              </button>
            </div>
          </div>

          {/* Project Cards */}
          <div className="grid grid-cols-3 gap-4">
            {/* Upload Image Card */}
            <div className="bg-purple-600 text-white p-4 rounded-xl">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Upload size={20} className="text-white" />
                  <button className="text-white/80">•••</button>
                </div>
                <h3 className="font-semibold">Upload Image</h3>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInput}
                  className="hidden"
                  accept="image/*"
                />
                <div
                  className={`border-2 border-dashed rounded-lg p-3 text-center transition-colors
                    ${isDragging ? 'border-white bg-white/10' : 'border-white/50'}
                    ${uploadedFile ? 'pt-2' : 'py-6'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {!uploadedFile ? (
                    <div className="space-y-2 cursor-pointer">
                      <ImageIcon size={20} className="mx-auto text-white/80" />
                      <p className="text-sm">Drop your image here or click to browse</p>
                    </div>
                  ) : (
                    <div className="relative group">
                      <img
                        src={uploadedFile.preview}
                        alt={uploadedFile.name}
                        className="w-full h-24 object-contain rounded-lg"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 
                          opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                      <div className="mt-2 space-y-1">
                        <p className="text-xs truncate">{uploadedFile.name}</p>
                        <p className="text-xs text-white/80">{uploadedFile.size}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Links Card */}
            <div className="bg-cyan-400 text-white p-4 rounded-xl">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Link2 size={20} className="text-white" />
                  <span className="text-sm font-medium">Share Links</span>
                </div>
                
                <div className="space-y-3">
                  {links.map((link) => (
                    <div key={link.id} className="relative group">
                      <input
                        type="url"
                        placeholder={`Add link #${link.id}`}
                        value={link.url}
                        onChange={(e) => handleLinkUpdate(link.id, e.target.value)}
                        className="w-full bg-white/20 rounded-lg pl-8 pr-10 py-2 text-sm placeholder-white/60 
                          focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
                        <div className={`w-2.5 h-2.5 rounded-full ${link.color} ring-2 ring-white/30`}></div>
                      </div>
                      {link.url && (
                        <a 
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Link2 size={14} className="text-white" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Club House Card */}
            <div className="bg-gray-900 text-white p-4 rounded-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="bg-green-500/20 text-green-500 p-1 rounded-lg">
                      <Users size={16} />
                    </div>
                    <span className="text-xs font-medium text-green-500">Live</span>
                  </div>
                  <button className="text-gray-400 hover:text-white">
                    <ChevronDown size={16} />
                  </button>
                </div>

                <div>
                  <h3 className="font-semibold text-sm">🎨 Web3 Talks</h3>
                  <p className="text-xs text-gray-400">Weekly discussions</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs text-gray-500 font-medium mb-2">Speakers</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {chatUsers.filter(user => user.isSpeaking).map((user) => (
                        <div key={user.id} className="text-center">
                          <div className="relative inline-block">
                            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                              {user.emoji}
                            </div>
                            {user.isModerator && (
                              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                                <Users size={8} />
                              </div>
                            )}
                          </div>
                          <p className="text-xs mt-1 font-medium truncate">{user.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-full text-xs">
                    ✌️ Leave
                  </button>
                  <div className="flex space-x-2">
                    <button 
                      onClick={toggleHand}
                      className={`p-1.5 rounded-full transition-colors ${
                        isHandRaised ? 'bg-yellow-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      <Hand size={16} />
                    </button>
                    <button 
                      onClick={toggleMute}
                      className={`p-1.5 rounded-full transition-colors ${
                        isMuted ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-green-500 text-white'
                      }`}
                    >
                      {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div>
            <h2 className={`font-bold text-xl mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Spots info
            </h2>
            <div className="space-y-4">
              {todaysTasks.map((task, index) => (
                <div
                  key={index}
                  className={`p-4 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg border-l-4 ${task.color}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {task.name}
                      </h3>
                      <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                        {task.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        task.status === 'Pending Approval' 
                          ? 'bg-yellow-500/20 text-yellow-500' 
                          : 'bg-green-500/20 text-green-500'
                      }`}>
                        {task.status}
                      </span>
                      {task.completed && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
