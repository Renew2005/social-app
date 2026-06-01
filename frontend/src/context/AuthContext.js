import React, { createContext, useState, useContext } from 'react';

// Create the context
const AuthContext = createContext();

// Provider — wraps the whole app
export const AuthProvider = ({ children }) => {
  // Check if user is already logged in (from localStorage)
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );
  const [token, setToken] = useState(
    localStorage.getItem('token') || null
  );

  // Called when user logs in or signs up
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    // Save to localStorage so user stays logged in after refresh
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
  };

  // Called when user logs out
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — easy way to use auth in any component
export const useAuth = () => useContext(AuthContext);