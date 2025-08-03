import React, { createContext, useState } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const baseRoute = "/api";

  const login = async (credentials) => {
    setLoading(true);
    const response = await axios.post(`${baseRoute}/token/`, credentials);
    setUser(response.data); // Store user data or token as needed
    setLoading(false);
    return response.data; // Return the response for further handling if needed
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};