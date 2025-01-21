import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Use named export here

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const checkAuth = () => {
    const token = localStorage.getItem('authToken');

    if (token) {
      setIsAuthenticated(true);

      try {
        const user = jwtDecode(token); // Decodes token to get user info
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to decode token:', error);
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    //const token = localStorage.getItem('authToken');
    checkAuth();

    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, currentUser, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
