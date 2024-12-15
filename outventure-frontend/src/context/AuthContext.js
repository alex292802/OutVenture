import React, { createContext, useState } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseRoute = "/api";

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${baseRoute}/token/`, credentials);
      console.log(response);
      setUser(response.data); // Store user data or token as needed
      return response.data; // Return the response for further handling if needed
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login }}>
      {children}
    </AuthContext.Provider>
  );
};