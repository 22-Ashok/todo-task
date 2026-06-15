import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from token
  useEffect(() => {
    const savedUser = localStorage.getItem('taskly_user');
    const savedToken = localStorage.getItem('taskly_token');
    
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {

        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.login(email, password);
      
      // Support nested fields in standard backends e.g. { token, user } or { status, data: { token, user } }
      const token = response.token || response.data?.token;
      let userData = response.user || response.data?.user;

      if (!userData && response.email) {
        // Fallback if the root payload itself is the user
        userData = response;
      }

      if (!token) {
        throw new Error('Authenticated successfully but no session token was received');
      }

      // Add standard fields for frontend UI styling if missing
      const finalizedUser = {
        id: userData?.id || userData?._id || 'user_active',
        name: userData?.name || 'Alex Rivera',
        email: userData?.email || email,
        isPro: true,
        avatar: userData?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
      };

      setUser(finalizedUser);
      localStorage.setItem('taskly_token', token);
      localStorage.setItem('taskly_user', JSON.stringify(finalizedUser));
      return finalizedUser;
    } catch (error) {

      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.register(name, email, password);
      
      // Support response patterns where system logs the user in immediately after registering
      const token = response.token || response.data?.token;
      const userData = response.user || response.data?.user;

      if (token && userData) {
        const finalizedUser = {
          id: userData.id || userData._id || 'user_active',
          name: userData.name || name,
          email: userData.email || email,
          isPro: true,
          avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
        };
        setUser(finalizedUser);
        localStorage.setItem('taskly_token', token);
        localStorage.setItem('taskly_user', JSON.stringify(finalizedUser));
        return finalizedUser;
      }

      // If login is required manually after registration, return true/response
      return response;
    } catch (error) {

      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taskly_user');
    localStorage.removeItem('taskly_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
