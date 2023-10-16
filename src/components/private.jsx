import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../services/AuthProvider';
import Spinner from './spinner';

const PrivateRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Loading state
  if (isLoading) {
    return (
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0'>
          <Spinner />
        </div>
      </main>
    )
  }

  // Authenticated state
  if (isAuthenticated()) {
    return <Outlet />
  }

  // Unauthenticated state
  return <Navigate to='/' />
};

export default PrivateRoutes;
