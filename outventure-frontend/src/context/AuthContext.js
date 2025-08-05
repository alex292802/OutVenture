import React, { createContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
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
      // TODO: Fetch user info with the token
      setUser(response.data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const saveTokens = (access, refresh) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    // this allows to persist user informations even after a refresh
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    accessTokenRef.current = access;
    refreshTokenRef.current = refresh;
  };

  const loadTokens = () => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
    }
  };

  // TODO: should this triggers something in backend ?
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    accessTokenRef.current = null;
    refreshTokenRef.current = null;
  };

  useEffect(() => {
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
          
          // Use ref to get current refresh token value
          if (refreshTokenRef.current) {
            try {
              const refreshResponse = await axios.post('/token/refresh/', {
                refresh: refreshTokenRef.current
              });
              
              const { access } = refreshResponse.data;
              setAccessToken(access);
              accessTokenRef.current = access;
              
              // Retry the original request
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
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};