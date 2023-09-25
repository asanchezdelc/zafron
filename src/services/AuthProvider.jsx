import React, { createContext, useContext, useState } from 'react';
import jwt_decode from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
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
      if (currentUser !== null || (token && jwt_decode(token).exp > Date.now() / 1000)) {
        setCurrentUser(jwt_decode(token));
        return true;
      }

      return false;
  };

  const value = {
      currentUser,
      login,
      logout,
      isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
