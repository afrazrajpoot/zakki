'use client'
import { useAuth } from '@/providers/AuthProvider';
import { useUser } from '@auth0/nextjs-auth0/client';
import React from 'react';

const Page = () => {
const {logout,user2} = useAuth()
const { user, error, isLoading } = useUser();

console.log(user2,'user')
const handleLogout = () => {
  logout();
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Header with logout button */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
       {
        user ? (<>
          <a href="/api/auth/logout">
         <button
            onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
         </a>
        </>):(<>
          
         <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
      
        </>)
       }
          </div>

          {/* Profile content */}
          <div className="space-y-6">
            {/* Profile picture */}
            <div className="flex justify-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-4xl text-gray-600">👤</span>
              </div>
            </div>

            {/* Profile information */}
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h2 className="text-sm text-gray-600 mb-1">Full Name</h2>
                <p className="text-lg font-medium text-gray-800">{user2?.username}</p>
              </div>

              <div className="border-b pb-4">
                <h2 className="text-sm text-gray-600 mb-1">Email</h2>
                <p className="text-lg font-medium text-gray-800">{user2?.email||'email'}</p>
              </div>

              {/* <div className="border-b pb-4">
                <h2 className="text-sm text-gray-600 mb-1">Phone</h2>
                <p className="text-lg font-medium text-gray-800">+1 234 567 890</p>
              </div> */}
{/* 
              <div className="pb-4">
                <h2 className="text-sm text-gray-600 mb-1">Location</h2>
                <p className="text-lg font-medium text-gray-800">New York, USA</p>
              </div> */}
            </div>

            {/* Edit button */}
            <div className="flex justify-center">
              <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;