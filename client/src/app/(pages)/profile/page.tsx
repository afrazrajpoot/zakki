'use client';
import { useAuth } from '@/providers/AuthProvider';
import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { logout, user2 } = useAuth();

  const handleLogout = async () => {
    if (session?.user) {
      await signOut({
        redirect: true,
        callbackUrl: '/Landingpage',
      });
      logout();
      return;
    }
    logout();
    router.push('/Landingpage');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-6 bg-gradient-to-r from-indigo-500 to-purple-600">
            <h1 className="text-4xl font-bold text-white">My Profile</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all"
            >
              Logout
            </button>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="space-y-10">
              {/* Profile Picture */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center shadow-lg border-4 border-indigo-500">
                    <span className="text-6xl text-gray-600">👤</span>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-indigo-500 p-3 rounded-full shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="white"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 3.487c1.022-.985 2.594-.03 2.435 1.292L18.1 13.444c-.159 1.322-1.692 1.907-2.669 1.053l-2.937-2.59c-.978-.855-.45-2.407.847-2.769l3.107-.964c.407-.126.671-.563.671-1.025V4.937c0-.462-.264-.899-.671-1.025l-3.107-.964c-.575-.179-1.063.345-.847.847l2.55 3.17z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Profile Information */}
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-sm text-gray-500 uppercase mb-1">Full Name</h2>
                  <p className="text-xl font-semibold text-gray-800">{user2?.username}</p>
                </div>
                <div className="border-b pb-4">
                  <h2 className="text-sm text-gray-500 uppercase mb-1">Email</h2>
                  <p className="text-xl font-semibold text-gray-800">{user2?.email || 'Not provided'}</p>
                </div>
              </div>

              {/* Edit Button */}
              <div className="flex justify-center">
                <button className="px-8 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition transform duration-300">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
