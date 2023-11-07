import React, { createContext, useContext, useEffect, useState } from 'react';
import jwt_decode from "jwt-decode";
import * as userAPI from './user';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setLoading] = useState(true); // <-- New state variable
  const token = localStorage.getItem('jwt');

  const login = (user, token) => {
      localStorage.setItem('jwt', token);
      setCurrentUser(user);
  };

  const logout = () => {
      localStorage.removeItem('jwt');
      setCurrentUser(null);
  };

  const isAuthenticated = () => {
    if (isLoading) return false;
    if (currentUser !== null || (token && jwt_decode(token).exp > Date.now() / 1000)) {
      return true;
    }

    return false;
  };

  const value = {
      currentUser,
      isLoading,
      login,
      logout,
      isAuthenticated,
  };

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const user = await userAPI.getUserInfo();
        setCurrentUser(user);
        setLoading(false);
      } catch (err) {
        if (err.status && err.status === 401) {
          setCurrentUser(null);
          logout();
        }
      }
    }
    getUserInfo();
  }, [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};
