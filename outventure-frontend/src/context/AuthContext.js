import React, { createContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Refs to store current token values for interceptors
  const accessTokenRef = useRef(null);
  const refreshTokenRef = useRef(null);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await axios.post(`/token/`, credentials);
      const { access, refresh } = response.data;
      saveTokens(access, refresh);
      // TODO: Fetch user info with the token (get)
      setUser(response.data);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const response = await axios.post('/register/', payload);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const saveTokens = (access, refresh) => {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    accessTokenRef.current = access;
    refreshTokenRef.current = refresh;
  };

  const loadTokens = () => {
    accessTokenRef.current = localStorage.getItem('accessToken');
    refreshTokenRef.current = localStorage.getItem('refreshToken');
  };

  // TODO: should this triggers something in backend ?
  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    accessTokenRef.current = null;
    refreshTokenRef.current = null;
  };

  useEffect(() => {
    loadTokens()

    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (accessTokenRef.current) {
          config.headers.Authorization = `Bearer ${accessTokenRef.current}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          if (refreshTokenRef.current) {
            try {
              const refreshResponse = await axios.post('/token/refresh/', {
                refresh: refreshTokenRef.current
              });
              
              const { access } = refreshResponse.data;
              accessTokenRef.current = access;
              
              originalRequest.headers.Authorization = `Bearer ${access}`;
              return axios(originalRequest);
            } catch (refreshError) {
              logout();
              return Promise.reject(refreshError);
            }
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};