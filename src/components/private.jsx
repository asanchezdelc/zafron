import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AuthService from '../services/auth';

const PrivateRoutes = () => {
  const authService = new AuthService();
  const isAuthenticated = authService.isAuthenticated();
  
  return (
    isAuthenticated ? <Outlet/> : <Navigate to='/'/>
  );
};

export default PrivateRoutes;
