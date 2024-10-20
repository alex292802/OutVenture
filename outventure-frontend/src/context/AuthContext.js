import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseRoute = "/api"

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${baseRoute}/user`, { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (credentials) => {
    const response = await axios.post(`${baseRoute}/login`, credentials, { withCredentials: true });
    setUser(response.data);
  };

  const logout = async () => {
    await axios.get(`${baseRoute}/logout`, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};