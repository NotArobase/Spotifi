import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  console.log("ProtectedRoute called, isAuthenticated:", isAuthenticated);
  console.log(isAuthenticated);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
