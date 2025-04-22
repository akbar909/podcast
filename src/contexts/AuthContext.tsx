import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../utils/api';

interface User {
  id: string;
  name: string;
  email: string;
  userType: 'guest' | 'host';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, userType: 'guest' | 'host') => Promise<void>;
  register: (name: string, email: string, password: string, userType: 'guest' | 'host') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await api.get('http://localhost:5000/api/auth/verify');
        setUser(response.data.user);
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email: string, password: string, userType: 'guest' | 'host') => {
    try {
      const response = await api.post('http://localhost:5000/api/auth/login', { email, password, userType });
      
      if (!response.data.token) {
        throw new Error('No token received');
      }

      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(message);
    }
  };

  const register = async (name: string, email: string, password: string, userType: 'guest' | 'host') => {
    try {
      const response = await api.post('http://localhost:5000/api/auth/register', { name, email, password, userType });
      
      if (!response.data.token) {
        throw new Error('No token received');
      }

      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};