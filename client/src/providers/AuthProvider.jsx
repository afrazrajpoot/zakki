'use client'
import { useRouter } from 'next/navigation';
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context for authentication
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthContext provider component
export const AuthProvider = ({ children }) => {
  const navigate = useRouter()
  const [authState, setAuthState] = useState({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Check if token is stored in localStorage and set initial state
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
      setAuthState({
        user,
        token,
        isAuthenticated: true,
      });
    }
  }, []);

  // Action to login
  const login = (token, user) => {
    console.log(token,user,'token user')
    localStorage.setItem('token', JSON.stringify(token));
    localStorage.setItem('user', JSON.stringify(user));
    setAuthState({
      user,
      token,
      isAuthenticated: true,
    });
  };

  // Action to logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
    navigate.push('/Landingpage')
  };

  // Action to check the current user
  const getCurrentUser = () => {
    return authState.user;
  };

  return (
    <AuthContext.Provider value={{ ...authState, user2:authState.user, login, logout, getCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
